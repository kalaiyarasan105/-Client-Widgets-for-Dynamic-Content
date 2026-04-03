import React from "react";
import type { BlogPost, WidgetTheme } from "../../types";//11,93

interface Props {
  post: BlogPost;
  theme: WidgetTheme;
  featured?: boolean;
  onReadMore?: (post: BlogPost) => void;
}

export const BlogCard: React.FC<Props> = ({ post, theme, featured = false, onReadMore }) => {
  const isDark = theme === "dark";

  const isMobile = typeof window !== "undefined" && window.innerWidth < 600;

  const card: React.CSSProperties = {
    borderRadius: "10px",
    overflow: "hidden",
    border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
    backgroundColor: isDark ? "#1f2937" : "#ffffff",
    display: "flex",
    flexDirection: featured && !isMobile ? "row" : "column",
    transition: "box-shadow 0.2s",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  };

  const imgStyle: React.CSSProperties = {
    width: featured && !isMobile ? "45%" : "100%",
    height: featured && !isMobile ? "100%" : "180px",
    objectFit: "cover",
    flexShrink: 0,
  };

  const body: React.CSSProperties = {
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
    flex: 1,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: featured ? "1.15rem" : "1rem",
    fontWeight: 700,
    color: isDark ? "#f9fafb" : "#111827",
    margin: 0,
    lineHeight: 1.4,
  };

  const excerptStyle: React.CSSProperties = {
    fontSize: "0.85rem",
    color: isDark ? "#9ca3af" : "#6b7280",
    margin: 0,
    lineHeight: 1.6,
    flex: 1,
  };

  const metaStyle: React.CSSProperties = {
    fontSize: "0.75rem",
    color: isDark ? "#6b7280" : "#9ca3af",
  };

  const btnStyle: React.CSSProperties = {
    display: "inline-block",
    marginTop: "0.5rem",
    padding: "0.4rem 1rem",
    borderRadius: "6px",
    backgroundColor: isDark ? "#7c3aed" : "#6d28d9",
    color: "#fff",
    fontSize: "0.8rem",
    fontWeight: 600,
    textDecoration: "none",
    alignSelf: "flex-start",
    cursor: "pointer",
  };

  const tagStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "0.15rem 0.5rem",
    borderRadius: "999px",
    fontSize: "0.7rem",
    backgroundColor: isDark ? "#374151" : "#f3f4f6",
    color: isDark ? "#d1d5db" : "#374151",
    marginRight: "0.25rem",
  };

  const formattedDate = new Date(post.publishDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <article style={card}>
      {post.image && (
        <img src={post.image} alt={post.title} style={imgStyle} loading="lazy" />
      )}
      <div style={body}>
        <p style={metaStyle}>
          {formattedDate} · {post.author}
        </p>
        <h3 style={titleStyle}>{post.title}</h3>
        <p style={excerptStyle}>{post.excerpt}</p>
        <div>
          {post.tags.map((tag) => (
            <span key={tag} style={tagStyle}>
              {tag}
            </span>
          ))}
        </div>
        <a
          href={onReadMore ? undefined : post.readMoreUrl}
          target={onReadMore ? undefined : "_blank"}
          rel="noopener noreferrer"
          style={btnStyle}
          aria-label={`Read more about ${post.title}`}
          onClick={onReadMore ? (e) => { e.preventDefault(); onReadMore(post); } : undefined}
        >
          Read More →
        </a>
      </div>
    </article>
  );
};
