import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TemplateIcon, getTemplateName, getTemplateDescription } from "@/components/icons/template-icons";
import type { TemplateType } from "@shared/schema";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProject: (data: {
    name: string;
    description: string;
    template: TemplateType;
  }) => void;
  isPending?: boolean;
}

const templates: TemplateType[] = ["nextjs", "vite-vue", "static"];

export function CreateProjectModal({
  open,
  onOpenChange,
  onCreateProject,
  isPending,
}: CreateProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>("nextjs");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreateProject({
      name: name.trim(),
      description: description.trim(),
      template: selectedTemplate,
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setName("");
      setDescription("");
      setSelectedTemplate("nextjs");
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Choose a template and configure your new project
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                placeholder="my-awesome-project"
                value={name}
                onChange={(e) => setName(e.target.value)}
                data-testid="input-project-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-description">Description (optional)</Label>
              <Textarea
                id="project-description"
                placeholder="A brief description of your project..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                data-testid="input-project-description"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Select Template</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {templates.map((template) => (
                <button
                  key={template}
                  type="button"
                  onClick={() => setSelectedTemplate(template)}
                  className={cn(
                    "relative flex flex-col items-center gap-3 p-6 rounded-lg border-2 transition-all text-left hover-elevate",
                    selectedTemplate === template
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  )}
                  data-testid={`button-template-${template}`}
                >
                  {selectedTemplate === template && (
                    <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                  <TemplateIcon template={template} className="h-10 w-10" />
                  <div className="text-center">
                    <p className="font-medium">{getTemplateName(template)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {getTemplateDescription(template)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || isPending}
              data-testid="button-create-project"
            >
              {isPending ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
