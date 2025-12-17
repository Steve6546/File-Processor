import { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Header } from "@/components/layout/header";
import { FileExplorer } from "@/components/ide/file-explorer";
import { CodeEditor, getLanguageFromFileName } from "@/components/ide/code-editor";
import { EditorTabs } from "@/components/ide/editor-tabs";
import { LivePreview } from "@/components/ide/live-preview";
import { WelcomeScreen } from "@/components/ide/welcome-screen";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { PanelLeftClose, PanelLeft, Eye, EyeOff, Save } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Project, File, FileTreeNode } from "@shared/schema";

interface EditorTab {
  path: string;
  name: string;
  isModified: boolean;
}

function buildFileTree(files: File[]): FileTreeNode[] {
  const root: FileTreeNode[] = [];
  const nodeMap = new Map<string, FileTreeNode>();

  const sortedFiles = [...files].sort((a, b) => {
    if (a.isFolder === "true" && b.isFolder !== "true") return -1;
    if (a.isFolder !== "true" && b.isFolder === "true") return 1;
    return a.name.localeCompare(b.name);
  });

  for (const file of sortedFiles) {
    const node: FileTreeNode = {
      id: file.id,
      name: file.name,
      path: file.path,
      isFolder: file.isFolder === "true",
      content: file.content,
      children: file.isFolder === "true" ? [] : undefined,
    };
    nodeMap.set(file.path, node);

    if (!file.parentPath || file.parentPath === "") {
      root.push(node);
    } else {
      const parent = nodeMap.get(file.parentPath);
      if (parent && parent.children) {
        parent.children.push(node);
      }
    }
  }

  return root;
}

function findFileContent(files: File[], path: string): string {
  const file = files.find((f) => f.path === path);
  return file?.content || "";
}

export default function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const [openTabs, setOpenTabs] = useState<EditorTab[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [modifiedFiles, setModifiedFiles] = useState<Map<string, string>>(new Map());
  const [showExplorer, setShowExplorer] = useState(true);
  const [showPreview, setShowPreview] = useState(true);

  const { data: project, isLoading: projectLoading } = useQuery<Project>({
    queryKey: ["/api/projects", id],
    queryFn: async () => {
      const res = await fetch(`/api/projects/${id}`);
      if (!res.ok) throw new Error("Failed to fetch project");
      return res.json();
    },
    enabled: !!id,
  });

  const { data: files = [], isLoading: filesLoading } = useQuery<File[]>({
    queryKey: ["/api/projects", id, "files"],
    queryFn: async () => {
      const res = await fetch(`/api/projects/${id}/files`);
      if (!res.ok) throw new Error("Failed to fetch files");
      return res.json();
    },
    enabled: !!id,
  });

  const fileTree = useMemo(() => buildFileTree(files), [files]);

  const updateFileMutation = useMutation({
    mutationFn: async ({ fileId, content }: { fileId: string; content: string }) => {
      await apiRequest("PATCH", `/api/files/${fileId}`, { content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", id, "files"] });
    },
  });

  const createFileMutation = useMutation({
    mutationFn: async (data: { projectId: string; name: string; path: string; isFolder: boolean; parentPath: string }) => {
      const res = await apiRequest("POST", "/api/files", {
        projectId: data.projectId,
        name: data.name,
        path: data.path,
        isFolder: data.isFolder ? "true" : "false",
        parentPath: data.parentPath || null,
        content: "",
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", id, "files"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create file",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteFileMutation = useMutation({
    mutationFn: async (fileId: string) => {
      await apiRequest("DELETE", `/api/files/${fileId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", id, "files"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete file",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSelectFile = (path: string) => {
    const file = files.find((f) => f.path === path);
    if (!file || file.isFolder === "true") return;

    const existingTab = openTabs.find((tab) => tab.path === path);
    if (!existingTab) {
      setOpenTabs((prev) => [
        ...prev,
        { path, name: file.name, isModified: false },
      ]);
    }
    setActiveTab(path);
  };

  const handleCloseTab = (path: string) => {
    setOpenTabs((prev) => prev.filter((tab) => tab.path !== path));
    if (activeTab === path) {
      const remaining = openTabs.filter((tab) => tab.path !== path);
      setActiveTab(remaining.length > 0 ? remaining[remaining.length - 1].path : null);
    }
    setModifiedFiles((prev) => {
      const next = new Map(prev);
      next.delete(path);
      return next;
    });
  };

  const handleEditorChange = (value: string) => {
    if (!activeTab) return;
    setModifiedFiles((prev) => new Map(prev).set(activeTab, value));
    setOpenTabs((prev) =>
      prev.map((tab) =>
        tab.path === activeTab ? { ...tab, isModified: true } : tab
      )
    );
  };

  const handleSave = useCallback(() => {
    if (!activeTab) return;
    const file = files.find((f) => f.path === activeTab);
    const content = modifiedFiles.get(activeTab);
    if (file && content !== undefined) {
      updateFileMutation.mutate(
        { fileId: file.id, content },
        {
          onSuccess: () => {
            setOpenTabs((prev) =>
              prev.map((tab) =>
                tab.path === activeTab ? { ...tab, isModified: false } : tab
              )
            );
            setModifiedFiles((prev) => {
              const next = new Map(prev);
              next.delete(activeTab);
              return next;
            });
            toast({ title: "File saved" });
          },
        }
      );
    }
  }, [activeTab, files, modifiedFiles, updateFileMutation, toast]);

  const handleCreateFile = (parentPath: string, name: string, isFolder: boolean) => {
    if (!id) return;
    const fullPath = parentPath ? `${parentPath}/${name}` : name;
    createFileMutation.mutate({
      projectId: id,
      name,
      path: fullPath,
      isFolder,
      parentPath,
    });
  };

  const handleDeleteFile = (path: string) => {
    const file = files.find((f) => f.path === path);
    if (file && confirm(`Delete "${file.name}"?`)) {
      deleteFileMutation.mutate(file.id);
      handleCloseTab(path);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave]);

  const currentFileContent = useMemo(() => {
    if (!activeTab) return "";
    return modifiedFiles.get(activeTab) ?? findFileContent(files, activeTab);
  }, [activeTab, modifiedFiles, files]);

  const currentLanguage = useMemo(() => {
    if (!activeTab) return "plaintext";
    const tab = openTabs.find((t) => t.path === activeTab);
    return tab ? getLanguageFromFileName(tab.name) : "plaintext";
  }, [activeTab, openTabs]);

  const previewContent = useMemo(() => {
    const getContent = (fileName: string) => {
      const file = files.find((f) => f.name === fileName);
      if (!file) return "";
      return modifiedFiles.get(file.path) ?? file.content;
    };
    return {
      html: getContent("index.html"),
      css: getContent("styles.css") || getContent("style.css"),
      js: getContent("script.js") || getContent("main.js") || getContent("app.js"),
    };
  }, [files, modifiedFiles]);

  if (projectLoading || filesLoading) {
    return (
      <div className="h-screen flex flex-col bg-background">
        <Header showBackButton projectName="Loading..." />
        <div className="flex-1 flex">
          <div className="w-64 border-r p-3 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="flex-1 p-4">
            <Skeleton className="h-full w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="h-screen flex flex-col bg-background">
        <Header showBackButton />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Project not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header showBackButton projectName={project.name} />

      <div className="flex items-center gap-1 px-2 py-1 border-b bg-muted/30">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowExplorer(!showExplorer)}
          data-testid="button-toggle-explorer"
        >
          {showExplorer ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeft className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowPreview(!showPreview)}
          data-testid="button-toggle-preview"
        >
          {showPreview ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSave}
          disabled={!activeTab || !modifiedFiles.has(activeTab)}
          data-testid="button-save-file"
        >
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
      </div>

      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {showExplorer && (
            <>
              <ResizablePanel defaultSize={20} minSize={15} maxSize={35}>
                <FileExplorer
                  files={fileTree}
                  selectedFile={activeTab}
                  onSelectFile={handleSelectFile}
                  onCreateFile={handleCreateFile}
                  onDeleteFile={handleDeleteFile}
                  projectName={project.name}
                />
              </ResizablePanel>
              <ResizableHandle />
            </>
          )}

          <ResizablePanel defaultSize={showPreview ? 45 : 80}>
            <div className="h-full flex flex-col">
              <EditorTabs
                tabs={openTabs}
                activeTab={activeTab}
                onSelectTab={setActiveTab}
                onCloseTab={handleCloseTab}
              />
              <div className="flex-1 overflow-hidden">
                {activeTab ? (
                  <CodeEditor
                    value={currentFileContent}
                    onChange={handleEditorChange}
                    language={currentLanguage}
                  />
                ) : (
                  <WelcomeScreen />
                )}
              </div>
            </div>
          </ResizablePanel>

          {showPreview && (
            <>
              <ResizableHandle />
              <ResizablePanel defaultSize={35} minSize={20} maxSize={50}>
                <LivePreview
                  html={previewContent.html}
                  css={previewContent.css}
                  js={previewContent.js}
                />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
