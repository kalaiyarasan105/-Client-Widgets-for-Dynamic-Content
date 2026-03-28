import React from "react";

interface Props {
  theme?: "light" | "dark";
}

export const LoadingSpinner: React.FC<Props> = ({ theme = "light" }) => {
  const color = theme === "dark" ? "#a78bfa" : "#6d28d9";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
      role="status"
      aria-label="Loading"
    >
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        style={{ animation: "spin 0.8s linear infinite" }}
      >
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <circle
          cx="18"
          cy="18"
          r="15"
          stroke={color}
          strokeWidth="3"
          strokeDasharray="60"
          strokeDashoffset="20"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
