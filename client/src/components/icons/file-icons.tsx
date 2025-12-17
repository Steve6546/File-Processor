import { File, Folder, FolderOpen } from "lucide-react";
import { SiJavascript, SiTypescript, SiHtml5, SiCss3, SiJson, SiReact, SiVuedotjs, SiMarkdown } from "react-icons/si";

interface FileIconProps {
  fileName: string;
  isFolder?: boolean;
  isOpen?: boolean;
  className?: string;
}

export function FileIcon({ fileName, isFolder, isOpen, className = "h-4 w-4" }: FileIconProps) {
  if (isFolder) {
    return isOpen ? (
      <FolderOpen className={`${className} text-yellow-500`} />
    ) : (
      <Folder className={`${className} text-yellow-500`} />
    );
  }

  const ext = fileName.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "js":
      return <SiJavascript className={`${className} text-yellow-400`} />;
    case "jsx":
      return <SiReact className={`${className} text-cyan-400`} />;
    case "ts":
      return <SiTypescript className={`${className} text-blue-500`} />;
    case "tsx":
      return <SiReact className={`${className} text-cyan-400`} />;
    case "html":
      return <SiHtml5 className={`${className} text-orange-500`} />;
    case "css":
      return <SiCss3 className={`${className} text-blue-400`} />;
    case "json":
      return <SiJson className={`${className} text-yellow-300`} />;
    case "vue":
      return <SiVuedotjs className={`${className} text-green-500`} />;
    case "md":
      return <SiMarkdown className={`${className} text-muted-foreground`} />;
    default:
      return <File className={`${className} text-muted-foreground`} />;
  }
}
