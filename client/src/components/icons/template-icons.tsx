import { SiNextdotjs, SiVuedotjs } from "react-icons/si";
import { Code2 } from "lucide-react";
import type { TemplateType } from "@shared/schema";

interface TemplateIconProps {
  template: TemplateType;
  className?: string;
}

export function TemplateIcon({ template, className = "h-8 w-8" }: TemplateIconProps) {
  switch (template) {
    case "nextjs":
      return <SiNextdotjs className={className} />;
    case "vite-vue":
      return <SiVuedotjs className={`${className} text-green-500`} />;
    case "static":
      return <Code2 className={`${className} text-orange-500`} />;
    default:
      return <Code2 className={className} />;
  }
}

export function getTemplateName(template: TemplateType): string {
  switch (template) {
    case "nextjs":
      return "Next.js";
    case "vite-vue":
      return "Vite + Vue";
    case "static":
      return "Static HTML/CSS/JS";
    default:
      return "Unknown";
  }
}

export function getTemplateDescription(template: TemplateType): string {
  switch (template) {
    case "nextjs":
      return "React framework with SSR, routing, and optimized performance";
    case "vite-vue":
      return "Fast Vue.js development with Vite build tool";
    case "static":
      return "Simple HTML, CSS, and JavaScript project";
    default:
      return "";
  }
}
