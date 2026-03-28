import React from "react";

interface Props {
  message?: string;
  theme?: "light" | "dark";
}

export const EmptyState: React.FC<Props> = ({
  message = "No content available.",
  theme = "light",
}) => {
  const isDark = theme === "dark";

  return (
    <div
      style={{
        padding: "2rem",
        textAlign: "center",
        color: isDark ? "#9ca3af" : "#6b7280",
        fontSize: "0.9rem",
      }}
    >
      <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📭</div>
      <p>{message}</p>
    </div>
  );
};
