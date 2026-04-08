import React from "react";
import type { BlogWidgetProps, BlogPost } from "../../types";
import { useWidgetData } from "../../hooks/useWidgetData";
import { BlogCard } from "./BlogCard";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import { ErrorMessage } from "../shared/ErrorMessage";
import { EmptyState } from "../shared/EmptyState";

const DEFAULT_DATA_URL = "/mock/widgets.json";

interface WidgetsJson {
  blogs: BlogPost[];
}

export const BlogWidget: React.FC<BlogWidgetProps> = ({
  limit = 6,
  theme = "light",
  dataUrl = DEFAULT_DATA_URL,
  onReadMore,
}) => {
  const { data, loading, error } = useWidgetData<WidgetsJson>(dataUrl);
  const isDark = theme === "dark";

  const bg     = isDark ? "#09090b" : "#fafafa";
  const border = isDark ? "#27272a" : "#e4e4e7";
  const titleC = isDark ? "#fafafa" : "#09090b";
  const accent = isDark ? "#a78bfa" : "#7c3aed";

  const container: React.CSSProperties = {
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    backgroundColor: bg,
    borderRadius: "16px",
    padding: "1.5rem",
    minHeight: "200px",
    border: `1px solid ${border}`,
  };

  if (loading) return <div style={container}><LoadingSpinner theme={theme} /></div>;
  if (error)   return <div style={container}><ErrorMessage message={error} theme={theme} /></div>;

  const posts = (data?.blogs ?? []).slice(0, limit);

  if (posts.length === 0) {
    return <div style={container}><EmptyState message="No blog posts found." theme={theme} /></div>;
  }

  const [featured, ...rest] = posts;

  return (
    <div style={container}>

      {/* ── Header ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: "1.25rem", paddingBottom: "1rem",
        borderBottom: `1px solid ${border}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span style={{
            display: "inline-block", width: "10px", height: "10px",
            borderRadius: "50%", background: accent,
            boxShadow: `0 0 8px ${accent}`,
          }} />
          <span style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.1em",
            textTransform: "uppercase", color: accent }}>
            Latest Posts
          </span>
        </div>
        <span style={{ fontSize: "0.7rem", color: isDark ? "#52525b" : "#a1a1aa" }}>
          {posts.length} articles
        </span>
      </div>

      {/* ── Featured hero ── */}
      <div style={{ marginBottom: "1.5rem" }}>
        <BlogCard post={featured} theme={theme} featured onReadMore={onReadMore} />
      </div>

      {/* ── Section divider ── */}
      {rest.length > 0 && (
        <>
          <div style={{
            display: "flex", alignItems: "center", gap: "0.75rem",
            marginBottom: "1rem",
          }}>
            <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em",
              textTransform: "uppercase", color: isDark ? "#52525b" : "#a1a1aa" }}>
              More Stories
            </span>
            <div style={{ flex: 1, height: "1px", background: border }} />
          </div>

          {/* ── Responsive grid ── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
            gap: "1rem",
          }}>
            {rest.map((post) => (
              <BlogCard key={post.id} post={post} theme={theme} onReadMore={onReadMore} />
            ))}
          </div>
        </>
      )}

      {/* ── Footer ── */}
      <div style={{
        marginTop: "1.5rem", paddingTop: "1rem",
        borderTop: `1px solid ${border}`,
        display: "flex", justifyContent: "center",
      }}>
        <span style={{ fontSize: "0.68rem", color: isDark ? "#3f3f46" : "#d4d4d8",
          letterSpacing: "0.05em" }}>
          Powered by Datumart Widgets
        </span>
      </div>

    </div>
  );
};
