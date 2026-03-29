import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { App } from "./App";
import { BlogDetail } from "./BlogDetail";

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: string | null }
> {
  state = { error: null };
  static getDerivedStateFromError(e: Error) {
    return { error: e.message };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: "2rem", fontFamily: "monospace", color: "red" }}>
          <strong>Runtime error:</strong> {this.state.error}
        </div>
      );
    }
    return this.props.children;
  }
}

// Reads theme persisted by App.tsx so BlogDetail matches the selected theme
const BlogDetailWrapper: React.FC = () => {
  const isDark = localStorage.getItem("theme") === "dark";
  return <BlogDetail isDark={isDark} />;
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/blog/:id" element={<BlogDetailWrapper />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
