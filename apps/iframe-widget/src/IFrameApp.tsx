import React, { useEffect } from "react";
import { BlogWidget, SeoWidget } from "@datumart/react-widgets";
import type { WidgetTheme } from "@datumart/react-widgets";

/**
 * Reads URL query params and renders the appropriate widget.
 *
 * Supported params:
 *   type    — "blog" | "seo"          (default: "blog")
 *   theme   — "light" | "dark"        (default: "light")
 *   limit   — number                  (default: 5)
 *   pageId  — string                  (default: "home-page")
 *   preview — "true" | "false"        (default: "true")
 */
export const IFrameApp: React.FC = () => {
  const params = new URLSearchParams(window.location.search);

  const type = params.get("type") ?? "blog";
  const theme = (params.get("theme") ?? "light") as WidgetTheme;
  const limit = parseInt(params.get("limit") ?? "5", 10);
  const pageId = params.get("pageId") ?? "home-page";
  const showPreview = params.get("preview") !== "false";

  // Notify parent window that the widget has loaded (postMessage bonus)
  useEffect(() => {
    window.parent.postMessage(
      { source: "datumart-widget", event: "loaded", type },
      "*"
    );
  }, [type]);

  const wrapperStyle: React.CSSProperties = {
    minHeight: "100vh",
    backgroundColor: theme === "dark" ? "#0f172a" : "#f8fafc",
    padding: "0.75rem",
  };

  return (
    <div style={wrapperStyle}>
      {type === "seo" ? (
        <SeoWidget
          pageId={pageId}
          showPreview={showPreview}
          theme={theme}
          dataUrl="/widgets.json"
        />
      ) : (
        <BlogWidget
          limit={limit}
          theme={theme}
          dataUrl="/widgets.json"
        />
      )}
    </div>
  );
};
