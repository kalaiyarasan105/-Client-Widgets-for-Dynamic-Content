import React from "react";
import type { BlogPost, WidgetTheme } from "../../types";

interface Props {
  post: BlogPost;
  theme: WidgetTheme;
  featured?: boolean;
  onReadMore?: (post: BlogPost) => void;
}

export const BlogCard: React.FC<Props> = ({ post, theme, featured = false, onReadMore }) => {
  const isDark = theme === "dark";
  const isMobile = typeof window !== "undefined" && window.innerWidth < 600;

  const formattedDate = new Date(post.publishDate).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });

  const accent = isDark ? "#a78bfa" : "#7c3aed";
  const cardBg  = isDark ? "#18181b" : "#ffffff";
  const border  = isDark ? "#27272a" : "#e4e4e7";
  const titleC  = isDark ? "#fafafa" : "#09090b";
  const metaC   = isDark ? "#71717a" : "#a1a1aa";
  const excerptC = isDark ? "#a1a1aa" : "#52525b";

  /* ── FEATURED card ── */
  if (featured) {
    return (
      <article style={{
        position: "relative",
        borderRadius: "16px",
        overflow: "hidden",
        minHeight: isMobile ? "320px" : "380px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.5)" : "0 8px 32px rgba(0,0,0,0.12)",
        cursor: "pointer",
      }}>
        {/* full-bleed background image */}
        {post.image && (
          <img src={post.image} alt={post.title} loading="lazy" style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", zIndex: 0,
          }} />
        )}
        {/* gradient overlay */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 55%, transparent 100%)",
        }} />
        {/* content */}
        <div style={{ position: "relative", zIndex: 2, padding: isMobile ? "1.25rem" : "2rem" }}>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
            {post.tags.map(t => (
              <span key={t} style={{
                padding: "0.2rem 0.65rem", borderRadius: "999px", fontSize: "0.68rem",
                fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase",
                background: accent, color: "#fff",
              }}>{t}</span>
            ))}
          </div>
          <h2 style={{
            fontSize: isMobile ? "1.35rem" : "1.75rem", fontWeight: 800,
            color: "#fff", margin: "0 0 0.5rem", lineHeight: 1.25,
          }}>{post.title}</h2>
          <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.75)", margin: "0 0 1rem", lineHeight: 1.6 }}>
            {post.excerpt}
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.55)" }}>
              {formattedDate} · {post.author}
            </span>
            <a
              href={onReadMore ? undefined : post.readMoreUrl}
              target={onReadMore ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={`Read more about ${post.title}`}
              onClick={onReadMore ? (e) => { e.preventDefault(); onReadMore(post); } : undefined}
              style={{
                padding: "0.45rem 1.2rem", borderRadius: "999px",
                background: "#fff", color: "#09090b",
                fontSize: "0.8rem", fontWeight: 700,
                textDecoration: "none", cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Read More →
            </a>
          </div>
        </div>
      </article>
    );
  }

  /* ── REGULAR card ── */
  return (
    <article style={{
      borderRadius: "12px",
      overflow: "hidden",
      background: cardBg,
      border: `1px solid ${border}`,
      display: "flex",
      flexDirection: "column",
      transition: "transform 0.18s, box-shadow 0.18s",
      boxShadow: isDark ? "0 2px 8px rgba(0,0,0,0.35)" : "0 2px 8px rgba(0,0,0,0.06)",
    }}>
      {post.image && (
        <div style={{ position: "relative", overflow: "hidden", height: "150px" }}>
          <img src={post.image} alt={post.title} loading="lazy" style={{
            width: "100%", height: "100%", objectFit: "cover", display: "block",
            transition: "transform 0.3s",
          }} />
          {/* top-left accent bar */}
          <div style={{
            position: "absolute", top: 0, left: 0, width: "4px", height: "100%",
            background: `linear-gradient(to bottom, ${accent}, transparent)`,
          }} />
        </div>
      )}
      <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.4rem", flex: 1 }}>
        <p style={{ fontSize: "0.7rem", color: metaC, margin: 0, letterSpacing: "0.03em" }}>
          {formattedDate} · {post.author}
        </p>
        <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: titleC, margin: 0, lineHeight: 1.4 }}>
          {post.title}
        </h3>
        <p style={{ fontSize: "0.8rem", color: excerptC, margin: 0, lineHeight: 1.6, flex: 1 }}>
          {post.excerpt}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem", marginTop: "0.25rem" }}>
          {post.tags.map(t => (
            <span key={t} style={{
              padding: "0.15rem 0.5rem", borderRadius: "4px", fontSize: "0.65rem",
              fontWeight: 600, background: isDark ? "#27272a" : "#f4f4f5",
              color: isDark ? "#a1a1aa" : "#52525b",
            }}>{t}</span>
          ))}
        </div>
        <a
          href={onReadMore ? undefined : post.readMoreUrl}
          target={onReadMore ? undefined : "_blank"}
          rel="noopener noreferrer"
          aria-label={`Read more about ${post.title}`}
          onClick={onReadMore ? (e) => { e.preventDefault(); onReadMore(post); } : undefined}
          style={{
            marginTop: "0.6rem", padding: "0.38rem 0", fontSize: "0.78rem",
            fontWeight: 700, color: accent, textDecoration: "none",
            borderTop: `1px solid ${border}`, cursor: "pointer",
            display: "flex", alignItems: "center", gap: "0.3rem",
          }}
        >
          Read article <span style={{ fontSize: "0.9rem" }}>→</span>
        </a>
      </div>
    </article>
  );
};
