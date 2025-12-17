import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Code2, LayoutDashboard, ArrowLeft } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { Link, useLocation } from "wouter";

interface HeaderProps {
  showBackButton?: boolean;
  projectName?: string;
}

export function Header({ showBackButton, projectName }: HeaderProps) {
  const [location] = useLocation();

  return (
    <header className="h-14 border-b flex items-center justify-between gap-4 px-4 bg-background sticky top-0 z-50">
      <div className="flex items-center gap-3">
        {showBackButton ? (
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <Code2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg hidden sm:inline">ProDev Studio</span>
          </div>
        )}
        {projectName && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">/</span>
            <span className="font-medium truncate max-w-[200px]" data-testid="text-header-project-name">
              {projectName}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        {!showBackButton && (
          <>
            <Link href="/">
              <Button
                variant={location === "/" ? "secondary" : "ghost"}
                size="sm"
                data-testid="nav-dashboard"
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link href="/github">
              <Button
                variant={location === "/github" ? "secondary" : "ghost"}
                size="sm"
                data-testid="nav-github"
              >
                <SiGithub className="h-4 w-4 mr-2" />
                GitHub
              </Button>
            </Link>
          </>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
