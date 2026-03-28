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

/**
 * BlogWidget — renders a list of blog posts.
 *
 * @example
 * <BlogWidget clientId="demo-client" limit={3} theme="dark" />
 */
export const BlogWidget: React.FC<BlogWidgetProps> = ({
  limit = 5,
  theme = "light",
  dataUrl = DEFAULT_DATA_URL,
}) => {
  const { data, loading, error } = useWidgetData<WidgetsJson>(dataUrl);
  const isDark = theme === "dark";

  const containerStyle: React.CSSProperties = {
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    backgroundColor: isDark ? "#111827" : "#f9fafb",
    padding: "1.25rem",
    borderRadius: "12px",
    minHeight: "200px",
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

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "1rem",
  };

  if (loading) return <div style={containerStyle}><LoadingSpinner theme={theme} /></div>;
  if (error) return <div style={containerStyle}><ErrorMessage message={error} theme={theme} /></div>;

  const posts = (data?.blogs ?? []).slice(0, limit);

  if (posts.length === 0) {
    return (
      <div style={containerStyle}>
        <EmptyState message="No blog posts found." theme={theme} />
      </div>
    );
  }

  const [featured, ...rest] = posts;

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <span>📝</span>
        <span>Latest Posts</span>
      </div>

      {/* Featured post — full width */}
      <div style={{ marginBottom: "1rem" }}>
        <BlogCard post={featured} theme={theme} featured />
      </div>

      {/* Remaining posts — grid */}
      {rest.length > 0 && (
        <div style={gridStyle}>
          {rest.map((post) => (
            <BlogCard key={post.id} post={post} theme={theme} />
          ))}
        </div>
      )}
    </div>
  );
};
