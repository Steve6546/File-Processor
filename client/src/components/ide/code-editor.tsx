import Editor from "@monaco-editor/react";
import { useTheme } from "@/lib/theme-provider";
import { Skeleton } from "@/components/ui/skeleton";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  readOnly?: boolean;
}

function getLanguageFromFileName(fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase();
  const languageMap: Record<string, string> = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    html: "html",
    css: "css",
    scss: "scss",
    json: "json",
    md: "markdown",
    vue: "html",
    py: "python",
    go: "go",
    rs: "rust",
  };
  return languageMap[ext || ""] || "plaintext";
}

export function CodeEditor({ value, onChange, language, readOnly = false }: CodeEditorProps) {
  const { theme } = useTheme();

  return (
    <div className="h-full w-full" data-testid="code-editor">
      <Editor
        height="100%"
        language={language}
        value={value}
        onChange={(val) => onChange(val || "")}
        theme={theme === "dark" ? "vs-dark" : "light"}
        options={{
          minimap: { enabled: true },
          fontSize: 13,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontLigatures: true,
          lineNumbers: "on",
          renderWhitespace: "selection",
          tabSize: 2,
          insertSpaces: true,
          wordWrap: "on",
          automaticLayout: true,
          scrollBeyondLastLine: false,
          readOnly,
          padding: { top: 16 },
        }}
        loading={
          <div className="h-full w-full p-4">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-4 w-5/6 mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        }
      />
    </div>
  );
}

export { getLanguageFromFileName };
