import { Button } from "@/components/ui/button";
import { FolderPlus, Code2 } from "lucide-react";

interface EmptyStateProps {
  onCreateProject: () => void;
}

export function EmptyState({ onCreateProject }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <Code2 className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2" data-testid="text-empty-title">
        No projects yet
      </h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        Get started by creating your first project. Choose from multiple templates
        including Next.js, Vue, or static HTML/CSS/JS.
      </p>
      <Button onClick={onCreateProject} data-testid="button-create-first-project">
        <FolderPlus className="h-4 w-4 mr-2" />
        Create Your First Project
      </Button>
    </div>
  );
}
