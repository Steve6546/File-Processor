import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileIcon } from "@/components/icons/file-icons";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface EditorTab {
  path: string;
  name: string;
  isModified: boolean;
}

interface EditorTabsProps {
  tabs: EditorTab[];
  activeTab: string | null;
  onSelectTab: (path: string) => void;
  onCloseTab: (path: string) => void;
}

export function EditorTabs({ tabs, activeTab, onSelectTab, onCloseTab }: EditorTabsProps) {
  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className="border-b bg-muted/30">
      <ScrollArea className="w-full">
        <div className="flex">
          {tabs.map((tab) => (
            <div
              key={tab.path}
              className={cn(
                "group flex items-center gap-2 px-3 py-1.5 border-r cursor-pointer min-w-0",
                activeTab === tab.path
                  ? "bg-background border-b-2 border-b-primary"
                  : "hover-elevate"
              )}
              onClick={() => onSelectTab(tab.path)}
              data-testid={`tab-${tab.path}`}
            >
              <FileIcon fileName={tab.name} className="h-4 w-4 shrink-0" />
              <span className="text-sm font-mono truncate max-w-[120px]">
                {tab.name}
                {tab.isModified && <span className="ml-1 text-muted-foreground">*</span>}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(tab.path);
                }}
                data-testid={`button-close-tab-${tab.path}`}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
