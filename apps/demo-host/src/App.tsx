import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BlogWidget, SeoWidget, useBlogs, useSeo } from "@datumart/react-widgets";
import type { WidgetTheme } from "@datumart/react-widgets";

type Tab = "jsx-blog" | "jsx-seo" | "iframe-blog" | "iframe-seo" | "headless-blog" | "headless-seo";

const IFRAME_BASE =
  (window as unknown as { __IFRAME_BASE__?: string }).__IFRAME_BASE__ ??
  import.meta.env.VITE_IFRAME_BASE ??
  "http://localhost:5174";

// ---------------------------------------------------------------------------
// CodeBlock — styled code snippet with header bar + copy button
// ---------------------------------------------------------------------------
const CodeBlock: React.FC<{ code: string; lang?: string; isDark: boolean }> = ({
  code,
  lang = "tsx",
  isDark,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const wrapper: React.CSSProperties = {
    marginTop: "1.25rem",
    borderRadius: "10px",
    overflow: "hidden",
    border: `1px solid ${isDark ? "#1e3a5f" : "#cbd5e1"}`,
    boxShadow: isDark
      ? "0 4px 16px rgba(0,0,0,0.4)"
      : "0 2px 8px rgba(0,0,0,0.08)",
  };

  const headerBar: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.45rem 0.9rem",
    backgroundColor: isDark ? "#0d1f35" : "#1e293b",
    borderBottom: `1px solid ${isDark ? "#1e3a5f" : "#334155"}`,
  };

  const dots: React.CSSProperties = {
    display: "flex",
    gap: "6px",
    alignItems: "center",
  };

  const langBadge: React.CSSProperties = {
    fontSize: "0.7rem",
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "#94a3b8",
    fontFamily: "monospace",
  };

  const copyBtn: React.CSSProperties = {
    padding: "0.2rem 0.65rem",
    borderRadius: "5px",
    border: "1px solid #334155",
    backgroundColor: copied ? "#166534" : "#1e293b",
    color: copied ? "#86efac" : "#94a3b8",
    fontSize: "0.7rem",
    cursor: "pointer",
    transition: "all 0.15s",
    fontFamily: "monospace",
  };

  const pre: React.CSSProperties = {
    margin: 0,
    padding: "1rem 1.1rem",
    backgroundColor: isDark ? "#020c1b" : "#0f172a",
    color: "#86efac",
    fontSize: "0.8rem",
    fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace",
    overflowX: "auto",
    whiteSpace: "pre",
    lineHeight: 1.65,
  };

  const dotColors = ["#ff5f57", "#febc2e", "#28c840"];

  return (
    <div style={wrapper}>
      <div style={headerBar}>
        <div style={dots}>
          {dotColors.map((c) => (
            <span
              key={c}
              style={{ width: 11, height: 11, borderRadius: "50%", backgroundColor: c, display: "inline-block" }}
            />
          ))}
          <span style={{ ...langBadge, marginLeft: "0.5rem" }}>{lang}</span>
        </div>
        <button style={copyBtn} onClick={handleCopy}>
          {copied ? "✓ copied" : "copy"}
        </button>
      </div>
      <pre style={pre}>{code}</pre>
    </div>
  );
};

// ---------------------------------------------------------------------------
// HeadlessBlogTab — layout toggle demo using useBlogs hook (no BlogWidget)
// ---------------------------------------------------------------------------
const HeadlessBlogTab: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const { blogs, loading, error } = useBlogs({ dataUrl: "/widgets.json", limit: 6 });
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const toggleLayout = () => setLayout(prev => prev === "grid" ? "list" : "grid");

  const bg   = isDark ? "#0f172a" : "#f8fafc";
  const bdr  = isDark ? "#1e293b" : "#e2e8f0";
  const txt  = isDark ? "#f1f5f9" : "#0f172a";
  const mute = isDark ? "#94a3b8" : "#64748b";
  const meta = isDark ? "#475569" : "#94a3b8";

  if (loading) return <div style={{ padding: "2rem", textAlign: "center", color: mute }}>Loading blogs...</div>;
  if (error)   return <div style={{ padding: "1rem", borderRadius: "8px", background: isDark ? "#1c0a0a" : "#fff1f1", color: "#b91c1c", border: "1px solid #fca5a5" }}>Error: {error}</div>;

  const toggleBtn: React.CSSProperties = {
    padding: "0.45rem 1.1rem",
    borderRadius: "6px",
    border: `1px solid ${bdr}`,
    background: isDark ? "#1e293b" : "#f1f5f9",
    color: txt,
    fontSize: "0.82rem",
    fontWeight: 600,
    cursor: "pointer",
    marginBottom: "1rem",
  };

  const gridContainer: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "1.25rem",
  };

  const listContainer: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  };

  const gridCard: React.CSSProperties = {
    borderRadius: "12px",
    overflow: "hidden",
    background: bg,
    border: `1px solid ${bdr}`,
    display: "flex",
    flexDirection: "column",
  };

  const listCard: React.CSSProperties = {
    borderRadius: "10px",
    overflow: "hidden",
    background: bg,
    border: `1px solid ${bdr}`,
    display: "flex",
    flexDirection: "row",
  };

  const gridImg: React.CSSProperties = { width: "100%", height: "160px", objectFit: "cover", display: "block" };
  const listImg: React.CSSProperties = { width: "180px", height: "130px", objectFit: "cover", flexShrink: 0, display: "block" };

  const cardBody: React.CSSProperties = { padding: "1rem", display: "flex", flexDirection: "column", gap: "0.35rem", flex: 1 };
  const tagStyle: React.CSSProperties = { display: "inline-block", padding: "0.15rem 0.5rem", borderRadius: "999px", fontSize: "0.68rem", background: isDark ? "#1e3a5f" : "#ede9fe", color: isDark ? "#93c5fd" : "#5b21b6", marginRight: "0.25rem" };

  return (
    <div>
      <p style={{ fontSize: "0.75rem", color: mute, marginBottom: "0.75rem" }}>
        🧩 Data from <code>useBlogs()</code> — same data, different UI. Toggle to see headless customization.
      </p>

      <button style={toggleBtn} onClick={toggleLayout}>
        {layout === "grid" ? "☰ Switch to List" : "⊞ Switch to Grid"}
      </button>

      {layout === "grid" ? (
        <div style={gridContainer}>
          {blogs.map((post) => (
            <div key={post.id} style={gridCard}>
              {post.image && <img src={post.image} alt={post.title} style={gridImg} loading="lazy" />}
              <div style={cardBody}>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: txt, margin: 0 }}>{post.title}</h3>
                <p style={{ fontSize: "0.82rem", color: mute, margin: 0, lineHeight: 1.6, flex: 1 }}>{post.excerpt}</p>
                <div>{post.tags.map(t => <span key={t} style={tagStyle}>{t}</span>)}</div>
                <p style={{ fontSize: "0.72rem", color: meta, margin: 0 }}>
                  {new Date(post.publishDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })} · {post.author}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={listContainer}>
          {blogs.map((post) => (
            <div key={post.id} style={listCard}>
              {post.image && <img src={post.image} alt={post.title} style={listImg} loading="lazy" />}
              <div style={cardBody}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: txt, margin: 0 }}>{post.title}</h3>
                <p style={{ fontSize: "0.83rem", color: mute, margin: 0, lineHeight: 1.6, flex: 1 }}>{post.excerpt}</p>
                <div>{post.tags.map(t => <span key={t} style={tagStyle}>{t}</span>)}</div>
                <p style={{ fontSize: "0.72rem", color: meta, margin: 0 }}>
                  {new Date(post.publishDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })} · {post.author}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// HeadlessSeoTab — custom UI built with useSeo hook (no SeoWidget used)
// ---------------------------------------------------------------------------
const HeadlessSeoTab: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const { seo, loading, error } = useSeo({ pageId: "home-page", dataUrl: "/widgets.json" });

  if (loading) return (
    <div style={{ padding: "2rem", textAlign: "center", color: isDark ? "#94a3b8" : "#64748b" }}>
      Loading SEO data...
    </div>
  );

  if (error) return (
    <div style={{ padding: "1rem", color: "#ef4444", background: isDark ? "#1c0a0a" : "#fff1f1", borderRadius: "8px" }}>
      Error: {error}
    </div>
  );

  if (!seo) return <p style={{ color: isDark ? "#94a3b8" : "#64748b" }}>No SEO data found.</p>;

  const field: React.CSSProperties = {
    marginBottom: "1rem",
    padding: "0.85rem 1rem",
    borderRadius: "10px",
    background: isDark ? "#0f172a" : "#f8fafc",
    border: `1px solid ${isDark ? "#1e293b" : "#e2e8f0"}`,
  };

  const label: React.CSSProperties = {
    fontSize: "0.68rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: isDark ? "#475569" : "#94a3b8",
    marginBottom: "0.3rem",
  };

  const value: React.CSSProperties = {
    fontSize: "0.9rem",
    color: isDark ? "#f1f5f9" : "#0f172a",
    wordBreak: "break-all",
  };

  const pill: React.CSSProperties = {
    display: "inline-block",
    padding: "0.2rem 0.6rem",
    borderRadius: "999px",
    fontSize: "0.72rem",
    background: isDark ? "#1e3a5f" : "#ede9fe",
    color: isDark ? "#93c5fd" : "#5b21b6",
    marginRight: "0.3rem",
    marginTop: "0.2rem",
  };

  return (
    <div>
      <p style={{ fontSize: "0.75rem", color: isDark ? "#64748b" : "#94a3b8", marginBottom: "1rem" }}>
        🧩 Custom UI built with <code>useSeo()</code> — no SeoWidget used
      </p>
      <div style={field}>
        <p style={label}>Page Title</p>
        <p style={value}>{seo.pageTitle}</p>
      </div>
      <div style={field}>
        <p style={label}>Meta Description</p>
        <p style={value}>{seo.metaDescription}</p>
      </div>
      <div style={field}>
        <p style={label}>Canonical URL</p>
        <p style={{ ...value, color: isDark ? "#60a5fa" : "#2563eb" }}>{seo.canonicalUrl}</p>
      </div>
      <div style={field}>
        <p style={label}>Keywords</p>
        <div>{seo.keywords.map((k) => <span key={k} style={pill}>{k}</span>)}</div>
      </div>
      {seo.structuredData && (
        <div style={field}>
          <p style={label}>Structured Data (JSON-LD)</p>
          <pre style={{ fontSize: "0.75rem", color: isDark ? "#86efac" : "#166534", overflowX: "auto", margin: 0 }}>
            {JSON.stringify(seo.structuredData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export const App: React.FC = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<WidgetTheme>(() => {
    return (localStorage.getItem("theme") as WidgetTheme) ?? "light";
  });
  const [activeTab, setActiveTab] = useState<Tab>("jsx-blog");
  const [iframeLog, setIframeLog] = useState<string[]>([]);
  const [iframeBlogHeight, setIframeBlogHeight] = useState(520);
  const [iframeSeoHeight, setIframeSeoHeight] = useState(380);

  // Detect mobile — iframes are unreliable on mobile browsers
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const isDark = theme === "dark";

  // Listen for postMessage events from the iframe
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.source === "datumart-widget") {
        if (e.data.event === "readmore" && e.data.postId) {
          navigate(`/blog/${e.data.postId}`);
          return;
        }
        if (e.data.event === "resize" && e.data.height) {
          if (activeTab === "iframe-blog") setIframeBlogHeight(e.data.height + 32);
          if (activeTab === "iframe-seo") setIframeSeoHeight(e.data.height + 32);
          return;
        }
        setIframeLog((prev) => [
          `[${new Date().toLocaleTimeString()}] event="${e.data.event}" type="${e.data.type}"`,
          ...prev.slice(0, 4),
        ]);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [navigate]);

  const page: React.CSSProperties = {
    minHeight: "100vh",
    backgroundColor: isDark ? "#0f172a" : "#f1f5f9",
    color: isDark ? "#f1f5f9" : "#0f172a",
    transition: "background 0.2s",
  };

  const header: React.CSSProperties = {
    backgroundColor: isDark ? "#1e293b" : "#ffffff",
    borderBottom: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
    padding: "0.75rem 1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "0.75rem",
  };

  const logo: React.CSSProperties = {
    fontSize: "1.25rem",
    fontWeight: 800,
    color: isDark ? "#a78bfa" : "#6d28d9",
    letterSpacing: "-0.02em",
  };

  const toggleBtn: React.CSSProperties = {
    padding: "0.4rem 1rem",
    borderRadius: "999px",
    border: `1px solid ${isDark ? "#4b5563" : "#d1d5db"}`,
    backgroundColor: isDark ? "#374151" : "#f9fafb",
    color: isDark ? "#f9fafb" : "#374151",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: 600,
  };

  const tabBar: React.CSSProperties = {
    display: "flex",
    gap: "0.25rem",
    padding: "1rem 1rem 0",
    flexWrap: "wrap",
    overflowX: "auto",
  };

  const tabBtn = (id: Tab): React.CSSProperties => ({
    padding: "0.5rem 1.1rem",
    borderRadius: "8px 8px 0 0",
    border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
    borderBottom: activeTab === id ? "none" : undefined,
    backgroundColor:
      activeTab === id
        ? isDark
          ? "#1e293b"
          : "#ffffff"
        : "transparent",
    color:
      activeTab === id
        ? isDark
          ? "#a78bfa"
          : "#6d28d9"
        : isDark
        ? "#94a3b8"
        : "#64748b",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: activeTab === id ? 700 : 400,
  });

  const content: React.CSSProperties = {
    margin: "0 1rem 2rem",
    padding: "1rem",
    borderRadius: "0 8px 8px 8px",
    border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
    backgroundColor: isDark ? "#1e293b" : "#ffffff",
    overflowX: "hidden",
  };

  const iframeStyle: React.CSSProperties = {
    width: "100%",
    height: `${iframeBlogHeight}px`,
    border: "none",
    borderRadius: "8px",
    display: "block",
    overflow: "hidden",
  };

  const logBox: React.CSSProperties = {
    marginTop: "1rem",
    padding: "0.75rem",
    borderRadius: "8px",
    backgroundColor: isDark ? "#0f172a" : "#f8fafc",
    border: `1px solid ${isDark ? "#1e293b" : "#e2e8f0"}`,
    fontSize: "0.75rem",
    fontFamily: "monospace",
    color: isDark ? "#94a3b8" : "#475569",
    minHeight: "60px",
  };

  const sectionTitle: React.CSSProperties = {
    fontSize: "0.8rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: isDark ? "#64748b" : "#94a3b8",
    marginBottom: "0.75rem",
  };

  return (
    <div style={page}>
      <header style={header}>
        <span style={logo}>⚡ Datumart Widgets</span>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontSize: "0.85rem", color: isDark ? "#94a3b8" : "#64748b" }}>
            Demo Host
          </span>
          <button style={toggleBtn} onClick={() => {
            const next = isDark ? "light" : "dark";
            localStorage.setItem("theme", next);
            setTheme(next);
          }}>
            {isDark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </header>

      <div style={tabBar}>
        {(
          [
            ["jsx-blog", "JSX Blog Widget"],
            ["jsx-seo", "JSX SEO Widget"],
            ["iframe-blog", "IFrame Blog"],
            ["iframe-seo", "IFrame SEO"],
            ["headless-blog", "Headless Blog"],
            ["headless-seo", "Headless SEO"],
          ] as [Tab, string][]
        ).map(([id, label]) => (
          <button key={id} style={tabBtn(id)} onClick={() => setActiveTab(id)}>
            {label}
          </button>
        ))}
      </div>

      <div style={content}>
        {activeTab === "jsx-blog" && (
          <>
            <p style={sectionTitle}>JSX Component — BlogWidget</p>
            <BlogWidget limit={6} theme={theme} dataUrl="/widgets.json" onReadMore={(post) => navigate(`/blog/${post.id}`)} />
            <CodeBlock isDark={isDark} lang="tsx" code={`import { BlogWidget } from "@datumart/react-widgets";

<BlogWidget
  clientId="demo-client"
  limit={5}
  theme="${theme}"
  dataUrl="/mock/widgets.json"
/>`} />
          </>
        )}

        {activeTab === "jsx-seo" && (
          <>
            <p style={sectionTitle}>JSX Component — SeoWidget</p>
            <SeoWidget pageId="home-page" showPreview theme={theme} dataUrl="/widgets.json" />
            <CodeBlock isDark={isDark} lang="tsx" code={`import { SeoWidget } from "@datumart/react-widgets";

<SeoWidget
  pageId="home-page"
  showPreview={true}
  theme="${theme}"
  dataUrl="/mock/widgets.json"
/>`} />
          </>
        )}

        {activeTab === "iframe-blog" && (
          <>
            <p style={sectionTitle}>IFrame Embed — Blog Widget</p>
            {isMobile ? (
              <>
                <p style={{ fontSize: "0.75rem", color: isDark ? "#64748b" : "#94a3b8", marginBottom: "0.75rem" }}>
                </p>
                <BlogWidget limit={6} theme={theme} dataUrl="/widgets.json" onReadMore={(post) => navigate(`/blog/${post.id}`)} />
              </>
            ) : (
              <iframe
                src={`${IFRAME_BASE}?type=blog&limit=6&theme=${theme}`}
                style={iframeStyle}
                title="Datumart Blog Widget"
              />
            )}
            <CodeBlock isDark={isDark} lang="html" code={`<iframe
  src="${IFRAME_BASE}?type=blog&limit=5&theme=${theme}"
  width="100%"
  height="520"
  frameborder="0"
  title="Datumart Blog Widget"
></iframe>`} />
            <div style={logBox}>
              <strong>postMessage log:</strong>
              {iframeLog.length === 0 ? (
                <p style={{ marginTop: "0.25rem", opacity: 0.6 }}>Waiting for iframe events...</p>
              ) : (
                iframeLog.map((msg, i) => <p key={i}>{msg}</p>)
              )}
            </div>
          </>
        )}

        {activeTab === "iframe-seo" && (
          <>
            <p style={sectionTitle}>IFrame Embed — SEO Widget</p>
            {isMobile ? (
              <>
                <p style={{ fontSize: "0.75rem", color: isDark ? "#64748b" : "#94a3b8", marginBottom: "0.75rem" }}>
                  ℹ️ Rendered as JSX on mobile (iframes are blocked by mobile browsers)
                </p>
                <SeoWidget pageId="home-page" showPreview theme={theme} dataUrl="/widgets.json" />
              </>
            ) : (
              <iframe
                src={`${IFRAME_BASE}?type=seo&pageId=home-page&preview=true&theme=${theme}`}
                style={{ ...iframeStyle, height: `${iframeSeoHeight}px` }}
                title="Datumart SEO Widget"
              />
            )}
            <CodeBlock isDark={isDark} lang="html" code={`<iframe
  src="${IFRAME_BASE}?type=seo&pageId=home-page&preview=true&theme=${theme}"
  width="100%"
  height="380"
  frameborder="0"
  title="Datumart SEO Widget"
></iframe>`} />
            <div style={logBox}>
              <strong>postMessage log:</strong>
              {iframeLog.length === 0 ? (
                <p style={{ marginTop: "0.25rem", opacity: 0.6 }}>Waiting for iframe events...</p>
              ) : (
                iframeLog.map((msg, i) => <p key={i}>{msg}</p>)
              )}
            </div>
          </>
        )}

        {activeTab === "headless-blog" && (
          <>
            <p style={sectionTitle}>Headless — useBlogs Hook</p>
            <HeadlessBlogTab isDark={isDark} />
            <CodeBlock isDark={isDark} lang="tsx" code={`import { useBlogs } from "@datumart/react-widgets";

const { blogs, loading, error } = useBlogs({
  dataUrl: "/widgets.json",
  limit: 6,
});

// Render your own UI — full control over layout and CSS`} />
          </>
        )}

        {activeTab === "headless-seo" && (
          <>
            <p style={sectionTitle}>Headless — useSeo Hook</p>
            <HeadlessSeoTab isDark={isDark} />
            <CodeBlock isDark={isDark} lang="tsx" code={`import { useSeo } from "@datumart/react-widgets";

const { seo, loading, error } = useSeo({
  pageId: "home-page",
  dataUrl: "/widgets.json",
});

// Render your own UI — full control over layout and CSS`} />
          </>
        )}
      </div>
    </div>
  );
};
