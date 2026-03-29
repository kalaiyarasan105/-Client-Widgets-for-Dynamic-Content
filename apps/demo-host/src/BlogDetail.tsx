import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { BlogPost } from "@datumart/react-widgets";

interface WidgetsJson {
  blogs: BlogPost[];
}

export const BlogDetail: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    fetch("/widgets.json")
      .then((r) => r.json())
      .then((data: WidgetsJson) => {
        const found = data.blogs.find((b) => b.id === id);
        setPost(found ?? null);
      });
  }, [id]);

  const page: React.CSSProperties = {
    minHeight: "100vh",
    backgroundColor: isDark ? "#0f172a" : "#f1f5f9",
    color: isDark ? "#f1f5f9" : "#0f172a",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  };

  const container: React.CSSProperties = {
    maxWidth: "780px",
    margin: "0 auto",
    padding: "2rem 1.5rem 4rem",
  };

  const backBtn: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    marginBottom: "1.5rem",
    padding: "0.4rem 0.9rem",
    borderRadius: "6px",
    border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
    backgroundColor: "transparent",
    color: isDark ? "#94a3b8" : "#64748b",
    cursor: "pointer",
    fontSize: "0.85rem",
  };

  const tagStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "0.2rem 0.6rem",
    borderRadius: "999px",
    fontSize: "0.72rem",
    backgroundColor: isDark ? "#374151" : "#ede9fe",
    color: isDark ? "#c4b5fd" : "#5b21b6",
    marginRight: "0.4rem",
  };

  if (!post) {
    return (
      <div style={page}>
        <div style={container}>
          <button style={backBtn} onClick={() => navigate(-1)}>← Back</button>
          <p style={{ color: isDark ? "#94a3b8" : "#64748b" }}>Post not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={page}>
      <div style={container}>
        <button style={backBtn} onClick={() => navigate(-1)}>← Back</button>

        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            style={{ width: "100%", borderRadius: "12px", marginBottom: "1.5rem", maxHeight: "380px", objectFit: "cover" }}
          />
        )}

        <div style={{ marginBottom: "0.75rem" }}>
          {post.tags.map((t) => <span key={t} style={tagStyle}>{t}</span>)}
        </div>

        <h1 style={{ fontSize: "2rem", fontWeight: 800, lineHeight: 1.3, marginBottom: "0.5rem" }}>
          {post.title}
        </h1>

        <p style={{ fontSize: "0.85rem", color: isDark ? "#64748b" : "#94a3b8", marginBottom: "1.5rem" }}>
          {new Date(post.publishDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          {" · "}{post.author}
        </p>

        <p style={{ fontSize: "1.05rem", lineHeight: 1.8, color: isDark ? "#cbd5e1" : "#334155" }}>
          {post.excerpt}
        </p>

        <p style={{ fontSize: "1.05rem", lineHeight: 1.8, color: isDark ? "#cbd5e1" : "#334155", marginTop: "1rem" }}>
          This is a demo post rendered inside the Datumart Widgets app. In a real integration,
          the full article content would be fetched from your CMS or API and displayed here.
        </p>
      </div>
    </div>
  );
};
