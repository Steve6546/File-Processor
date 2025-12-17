import { useState } from "react";
import { ChevronRight, ChevronDown, Plus, FolderPlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileIcon } from "@/components/icons/file-icons";
import type { FileTreeNode } from "@shared/schema";
import { cn } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface FileExplorerProps {
  files: FileTreeNode[];
  selectedFile: string | null;
  onSelectFile: (path: string) => void;
  onCreateFile: (parentPath: string, name: string, isFolder: boolean) => void;
  onDeleteFile: (path: string) => void;
  projectName: string;
}

interface FileTreeItemProps {
  node: FileTreeNode;
  depth: number;
  selectedFile: string | null;
  expandedFolders: Set<string>;
  onToggleFolder: (path: string) => void;
  onSelectFile: (path: string) => void;
  onCreateFile: (parentPath: string, name: string, isFolder: boolean) => void;
  onDeleteFile: (path: string) => void;
}

function FileTreeItem({
  node,
  depth,
  selectedFile,
  expandedFolders,
  onToggleFolder,
  onSelectFile,
  onCreateFile,
  onDeleteFile,
}: FileTreeItemProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newName, setNewName] = useState("");
  const isExpanded = expandedFolders.has(node.path);
  const isSelected = selectedFile === node.path;

  const handleCreate = () => {
    if (newName.trim()) {
      onCreateFile(node.path, newName.trim(), isCreatingFolder);
      setNewName("");
      setIsCreating(false);
      setIsCreatingFolder(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCreate();
    } else if (e.key === "Escape") {
      setIsCreating(false);
      setNewName("");
    }
  };

  return (
    <div>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <button
            className={cn(
              "w-full flex items-center gap-1.5 py-1 px-2 text-sm hover-elevate rounded-sm text-left",
              isSelected && "bg-sidebar-accent"
            )}
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
            onClick={() => {
              if (node.isFolder) {
                onToggleFolder(node.path);
              } else {
                onSelectFile(node.path);
              }
            }}
            data-testid={`file-tree-item-${node.path}`}
          >
            {node.isFolder && (
              <span className="shrink-0">
                {isExpanded ? (
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </span>
            )}
            <FileIcon
              fileName={node.name}
              isFolder={node.isFolder}
              isOpen={isExpanded}
              className="h-4 w-4 shrink-0"
            />
            <span className="truncate font-mono text-xs">{node.name}</span>
          </button>
        </ContextMenuTrigger>
        <ContextMenuContent>
          {node.isFolder && (
            <>
              <ContextMenuItem
                onClick={() => {
                  setIsCreating(true);
                  setIsCreatingFolder(false);
                  onToggleFolder(node.path);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                New File
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => {
                  setIsCreating(true);
                  setIsCreatingFolder(true);
                  onToggleFolder(node.path);
                }}
              >
                <FolderPlus className="h-4 w-4 mr-2" />
                New Folder
              </ContextMenuItem>
            </>
          )}
          <ContextMenuItem
            onClick={() => onDeleteFile(node.path)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {node.isFolder && isExpanded && (
        <div>
          {isCreating && (
            <div
              className="flex items-center gap-1.5 py-1 px-2"
              style={{ paddingLeft: `${(depth + 1) * 12 + 8}px` }}
            >
              <FileIcon
                fileName={isCreatingFolder ? "" : "file.txt"}
                isFolder={isCreatingFolder}
                className="h-4 w-4 shrink-0"
              />
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => {
                  if (!newName.trim()) {
                    setIsCreating(false);
                  }
                }}
                autoFocus
                className="h-6 text-xs font-mono py-0"
                placeholder={isCreatingFolder ? "folder-name" : "filename.ext"}
              />
            </div>
          )}
          {node.children?.map((child) => (
            <FileTreeItem
              key={child.path}
              node={child}
              depth={depth + 1}
              selectedFile={selectedFile}
              expandedFolders={expandedFolders}
              onToggleFolder={onToggleFolder}
              onSelectFile={onSelectFile}
              onCreateFile={onCreateFile}
              onDeleteFile={onDeleteFile}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileExplorer({
  files,
  selectedFile,
  onSelectFile,
  onCreateFile,
  onDeleteFile,
  projectName,
}: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set([""]));
  const [isCreatingRoot, setIsCreatingRoot] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newName, setNewName] = useState("");

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const handleCreateRoot = () => {
    if (newName.trim()) {
      onCreateFile("", newName.trim(), isCreatingFolder);
      setNewName("");
      setIsCreatingRoot(false);
      setIsCreatingFolder(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCreateRoot();
    } else if (e.key === "Escape") {
      setIsCreatingRoot(false);
      setNewName("");
    }
  };

  return (
    <div className="h-full flex flex-col bg-sidebar">
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-sidebar-border">
        <span className="font-semibold text-sm truncate" data-testid="text-project-name">
          {projectName}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => {
              setIsCreatingRoot(true);
              setIsCreatingFolder(false);
            }}
            data-testid="button-new-file"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => {
              setIsCreatingRoot(true);
              setIsCreatingFolder(true);
            }}
            data-testid="button-new-folder"
          >
            <FolderPlus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="py-1">
          {isCreatingRoot && (
            <div className="flex items-center gap-1.5 py-1 px-2 pl-[20px]">
              <FileIcon
                fileName={isCreatingFolder ? "" : "file.txt"}
                isFolder={isCreatingFolder}
                className="h-4 w-4 shrink-0"
              />
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => {
                  if (!newName.trim()) {
                    setIsCreatingRoot(false);
                  }
                }}
                autoFocus
                className="h-6 text-xs font-mono py-0"
                placeholder={isCreatingFolder ? "folder-name" : "filename.ext"}
              />
            </div>
          )}
          {files.map((node) => (
            <FileTreeItem
              key={node.path}
              node={node}
              depth={0}
              selectedFile={selectedFile}
              expandedFolders={expandedFolders}
              onToggleFolder={toggleFolder}
              onSelectFile={onSelectFile}
              onCreateFile={onCreateFile}
              onDeleteFile={onDeleteFile}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
