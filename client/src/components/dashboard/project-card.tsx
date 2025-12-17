import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, ExternalLink, Trash2, Clock } from "lucide-react";
import { TemplateIcon, getTemplateName } from "@/components/icons/template-icons";
import type { Project } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface ProjectCardProps {
  project: Project;
  onOpen: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export function ProjectCard({ project, onOpen, onDelete }: ProjectCardProps) {
  return (
    <Card
      className="group hover-elevate cursor-pointer transition-all"
      data-testid={`card-project-${project.id}`}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
            <TemplateIcon template={project.template} className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-lg truncate" data-testid={`text-project-name-${project.id}`}>
              {project.name}
            </h3>
            <Badge variant="secondary" className="text-xs">
              {getTemplateName(project.template)}
            </Badge>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              data-testid={`button-project-menu-${project.id}`}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onOpen(project);
              }}
              data-testid={`menu-open-${project.id}`}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in Editor
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete(project);
              }}
              className="text-destructive focus:text-destructive"
              data-testid={`menu-delete-${project.id}`}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="pb-3">
        {project.description ? (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic">No description</p>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-4 pt-0">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>
            {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
          </span>
        </div>
        <Button
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onOpen(project);
          }}
          data-testid={`button-open-project-${project.id}`}
        >
          Open
        </Button>
      </CardFooter>
    </Card>
  );
}
