import React from "react";

interface Props {
  message: string;
  theme?: "light" | "dark";
}

export const ErrorMessage: React.FC<Props> = ({
  message,
  theme = "light",
}) => {
  const isDark = theme === "dark";

  return (
    <div
      role="alert"
      style={{
        padding: "1rem 1.25rem",
        borderRadius: "8px",
        border: `1px solid ${isDark ? "#7f1d1d" : "#fca5a5"}`,
        backgroundColor: isDark ? "#1c0a0a" : "#fff1f1",
        color: isDark ? "#fca5a5" : "#b91c1c",
        fontSize: "0.875rem",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      <span aria-hidden="true">⚠️</span>
      <span>{message}</span>
    </div>
  );
};
