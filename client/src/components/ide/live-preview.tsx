import { useState, useEffect, useRef } from "react";
import { RefreshCw, Smartphone, Tablet, Monitor, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface LivePreviewProps {
  html: string;
  css: string;
  js: string;
}

type DeviceSize = "mobile" | "tablet" | "desktop";

const deviceSizes: Record<DeviceSize, { width: string; icon: typeof Monitor }> = {
  mobile: { width: "375px", icon: Smartphone },
  tablet: { width: "768px", icon: Tablet },
  desktop: { width: "100%", icon: Monitor },
};

export function LivePreview({ html, css, js }: LivePreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [deviceSize, setDeviceSize] = useState<DeviceSize>("desktop");
  const [refreshKey, setRefreshKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const generatePreviewContent = () => {
    // If HTML content is a complete document (has <!DOCTYPE or <html), use it directly
    // but inject the CSS and JS inline
    if (html.includes("<!DOCTYPE") || html.includes("<html")) {
      let content = html;
      
      // Inject CSS before </head> or at start of body
      if (css) {
        const cssTag = `<style>${css}</style>`;
        if (content.includes("</head>")) {
          content = content.replace("</head>", `${cssTag}</head>`);
        } else if (content.includes("<body")) {
          content = content.replace("<body", `${cssTag}<body`);
        }
      }
      
      // Inject JS before </body> or at end
      if (js) {
        const jsTag = `<script>try{${js}}catch(e){console.error('Preview Error:',e);}</script>`;
        if (content.includes("</body>")) {
          content = content.replace("</body>", `${jsTag}</body>`);
        } else {
          content += jsTag;
        }
      }
      
      // Replace external CSS/JS links with inline versions for preview
      content = content.replace(/<link[^>]*href=["']styles\.css["'][^>]*>/gi, "");
      content = content.replace(/<link[^>]*href=["']style\.css["'][^>]*>/gi, "");
      content = content.replace(/<script[^>]*src=["']script\.js["'][^>]*><\/script>/gi, "");
      content = content.replace(/<script[^>]*src=["']main\.js["'][^>]*><\/script>/gi, "");
      content = content.replace(/<script[^>]*src=["']app\.js["'][^>]*><\/script>/gi, "");
      
      return content;
    }
    
    // Fallback: build a simple document from fragments
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; }
    ${css}
  </style>
</head>
<body>
  ${html}
  <script>
    try {
      ${js}
    } catch (e) {
      console.error('Preview Error:', e);
    }
  </script>
</body>
</html>
    `;
  };

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      if (iframeRef.current) {
        const doc = iframeRef.current.contentDocument;
        if (doc) {
          doc.open();
          doc.write(generatePreviewContent());
          doc.close();
        }
      }
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [html, css, js, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleOpenExternal = () => {
    const blob = new Blob([generatePreviewContent()], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <div className="h-full flex flex-col bg-background border-l">
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b">
        <div className="flex items-center gap-1 bg-muted rounded-md p-0.5">
          {(Object.keys(deviceSizes) as DeviceSize[]).map((size) => {
            const { icon: Icon } = deviceSizes[size];
            return (
              <Button
                key={size}
                variant="ghost"
                size="icon"
                className={cn(
                  "h-7 w-7",
                  deviceSize === size && "bg-background shadow-sm"
                )}
                onClick={() => setDeviceSize(size)}
                data-testid={`button-device-${size}`}
              >
                <Icon className="h-4 w-4" />
              </Button>
            );
          })}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            data-testid="button-refresh-preview"
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleOpenExternal}
            data-testid="button-open-external"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-muted/30 p-4 flex justify-center">
        <div
          className="bg-background border rounded-md overflow-hidden transition-all duration-200 h-full"
          style={{ width: deviceSizes[deviceSize].width }}
        >
          {isLoading && (
            <div className="absolute inset-0 p-4">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-32 w-full mb-4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          )}
          <iframe
            ref={iframeRef}
            className="w-full h-full border-0"
            title="Live Preview"
            sandbox="allow-scripts allow-same-origin"
            data-testid="preview-iframe"
          />
        </div>
      </div>
    </div>
  );
}
