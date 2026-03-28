import React, { useState } from "react";
import type { SeoWidgetProps, SeoPage } from "../../types";
import { useWidgetData } from "../../hooks/useWidgetData";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import { ErrorMessage } from "../shared/ErrorMessage";
import { EmptyState } from "../shared/EmptyState";

const DEFAULT_DATA_URL = "/mock/widgets.json";

interface WidgetsJson {
  seoPages: Record<string, SeoPage>;
}

/**
 * SeoWidget — renders SEO metadata preview for a given page.
 *
 * @example
 * <SeoWidget pageId="home-page" showPreview={true} theme="dark" />
 */
export const SeoWidget: React.FC<SeoWidgetProps> = ({
  pageId = "home-page",
  showPreview = true,
  theme = "light",
  dataUrl = DEFAULT_DATA_URL,
}) => {
  const { data, loading, error } = useWidgetData<WidgetsJson>(dataUrl);
  const [showStructured, setShowStructured] = useState(false);
  const isDark = theme === "dark";

  const containerStyle: React.CSSProperties = {
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    backgroundColor: isDark ? "#111827" : "#f9fafb",
    padding: "1.25rem",
    borderRadius: "12px",
    minHeight: "200px",
  };

  if (loading) return <div style={containerStyle}><LoadingSpinner theme={theme} /></div>;
  if (error) return <div style={containerStyle}><ErrorMessage message={error} theme={theme} /></div>;

  const page = data?.seoPages?.[pageId];

  if (!page) {
    return (
      <div style={containerStyle}>
        <EmptyState message={`No SEO data found for page: "${pageId}"`} theme={theme} />
      </div>
    );
  }

  const label: React.CSSProperties = {
    fontSize: "0.7rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: isDark ? "#6b7280" : "#9ca3af",
    marginBottom: "0.2rem",
  };

  const value: React.CSSProperties = {
    fontSize: "0.875rem",
    color: isDark ? "#f3f4f6" : "#1f2937",
    wordBreak: "break-all",
  };

  const row: React.CSSProperties = {
    padding: "0.75rem",
    borderRadius: "8px",
    backgroundColor: isDark ? "#1f2937" : "#ffffff",
    border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
    marginBottom: "0.6rem",
  };

  const headerStyle: React.CSSProperties = {
    fontSize: "1.1rem",
    fontWeight: 700,
    color: isDark ? "#f9fafb" : "#111827",
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  };

  const tagStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "0.2rem 0.6rem",
    borderRadius: "999px",
    fontSize: "0.72rem",
    backgroundColor: isDark ? "#374151" : "#ede9fe",
    color: isDark ? "#c4b5fd" : "#5b21b6",
    marginRight: "0.3rem",
    marginTop: "0.2rem",
  };

  const toggleBtn: React.CSSProperties = {
    marginTop: "0.75rem",
    padding: "0.4rem 0.9rem",
    borderRadius: "6px",
    border: `1px solid ${isDark ? "#4b5563" : "#d1d5db"}`,
    backgroundColor: "transparent",
    color: isDark ? "#d1d5db" : "#374151",
    fontSize: "0.8rem",
    cursor: "pointer",
  };

  const codeBlock: React.CSSProperties = {
    marginTop: "0.75rem",
    padding: "0.75rem",
    borderRadius: "8px",
    backgroundColor: isDark ? "#0f172a" : "#1e293b",
    color: "#86efac",
    fontSize: "0.75rem",
    overflowX: "auto",
    whiteSpace: "pre",
    fontFamily: "monospace",
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <span>🔍</span>
        <span>SEO Metadata</span>
      </div>

      <div style={row}>
        <p style={label}>Page Title</p>
        <p style={value}>{page.pageTitle}</p>
      </div>

      <div style={row}>
        <p style={label}>Meta Description</p>
        <p style={value}>{page.metaDescription}</p>
      </div>

      <div style={row}>
        <p style={label}>Canonical URL</p>
        <p style={{ ...value, color: isDark ? "#60a5fa" : "#2563eb" }}>
          {page.canonicalUrl}
        </p>
      </div>

      <div style={row}>
        <p style={label}>Keywords</p>
        <div>
          {page.keywords.map((kw) => (
            <span key={kw} style={tagStyle}>
              {kw}
            </span>
          ))}
        </div>
      </div>

      {showPreview && page.structuredData && (
        <div>
          <button style={toggleBtn} onClick={() => setShowStructured((s) => !s)}>
            {showStructured ? "Hide" : "Show"} Structured Data
          </button>
          {showStructured && (
            <pre style={codeBlock}>
              {JSON.stringify(page.structuredData, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};
