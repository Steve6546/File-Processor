import { Code2, FileText, Palette, Zap } from "lucide-react";

export function WelcomeScreen() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center">
      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Code2 className="h-8 w-8 text-primary" />
      </div>
      <h2 className="text-2xl font-semibold mb-2" data-testid="text-welcome-title">
        Welcome to ProDev Studio
      </h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        Select a file from the explorer to start editing, or create a new file to begin
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl">
        <div className="flex flex-col items-center gap-2 p-4">
          <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
            <FileText className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium">Code Editor</p>
          <p className="text-xs text-muted-foreground">
            Powered by Monaco Editor with syntax highlighting
          </p>
        </div>
        <div className="flex flex-col items-center gap-2 p-4">
          <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
            <Zap className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium">Live Preview</p>
          <p className="text-xs text-muted-foreground">
            See your changes instantly as you type
          </p>
        </div>
        <div className="flex flex-col items-center gap-2 p-4">
          <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
            <Palette className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium">Multiple Templates</p>
          <p className="text-xs text-muted-foreground">
            Start with Next.js, Vue, or static HTML
          </p>
        </div>
      </div>
    </div>
  );
}
