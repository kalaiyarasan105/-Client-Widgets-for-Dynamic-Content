import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BlogWidget, SeoWidget } from "@datumart/react-widgets";
import type { WidgetTheme } from "@datumart/react-widgets";

type Tab = "jsx-blog" | "jsx-seo" | "iframe-blog" | "iframe-seo";

const IFRAME_BASE = import.meta.env.VITE_IFRAME_BASE ?? "http://localhost:5174";

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

export const App: React.FC = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<WidgetTheme>("light");
  const [activeTab, setActiveTab] = useState<Tab>("jsx-blog");
  const [iframeLog, setIframeLog] = useState<string[]>([]);

  const isDark = theme === "dark";

  // Listen for postMessage events from the iframe
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.source === "datumart-widget") {
        setIframeLog((prev) => [
          `[${new Date().toLocaleTimeString()}] event="${e.data.event}" type="${e.data.type}"`,
          ...prev.slice(0, 4),
        ]);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const page: React.CSSProperties = {
    minHeight: "100vh",
    backgroundColor: isDark ? "#0f172a" : "#f1f5f9",
    color: isDark ? "#f1f5f9" : "#0f172a",
    transition: "background 0.2s",
  };

  const header: React.CSSProperties = {
    backgroundColor: isDark ? "#1e293b" : "#ffffff",
    borderBottom: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
    padding: "1rem 2rem",
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
    padding: "1.25rem 2rem 0",
    flexWrap: "wrap",
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
    margin: "0 2rem 2rem",
    padding: "1.5rem",
    borderRadius: "0 8px 8px 8px",
    border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
    backgroundColor: isDark ? "#1e293b" : "#ffffff",
  };

  const iframeStyle: React.CSSProperties = {
    width: "100%",
    minHeight: "520px",
    border: "none",
    borderRadius: "8px",
    display: "block",
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
          <button style={toggleBtn} onClick={() => setTheme(isDark ? "light" : "dark")}>
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
            <BlogWidget limit={5} theme={theme} dataUrl="/widgets.json" onReadMore={(post) => navigate(`/blog/${post.id}`)} />
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
            <iframe
              src={`${IFRAME_BASE}?type=blog&limit=5&theme=${theme}`}
              style={iframeStyle}
              title="Datumart Blog Widget"
            />
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
            <iframe
              src={`${IFRAME_BASE}?type=seo&pageId=home-page&preview=true&theme=${theme}`}
              style={{ ...iframeStyle, minHeight: "380px" }}
              title="Datumart SEO Widget"
            />
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
      </div>
    </div>
  );
};
