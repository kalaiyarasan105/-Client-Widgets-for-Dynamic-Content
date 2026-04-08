import React, { useState } from "react";
import { useBlogs } from "../../hooks/useBlogs";
import type { BlogPost } from "../../types";

interface HeadlessBlogProps {
  dataUrl?: string;
  limit?: number;
  renderItem?: (post: BlogPost) => React.ReactNode;
}

/**
 * HeadlessBlog — data-only component with no built-in UI.
 * Clients provide their own renderItem to fully control the layout.
 *
 * @example
 * <HeadlessBlog
 *   dataUrl="/widgets.json"
 *   limit={6}
 *   renderItem={(post) => <div className="my-card">{post.title}</div>}
 * />
 */
export const HeadlessBlog: React.FC<HeadlessBlogProps> = ({
  dataUrl = "/mock/widgets.json",
  limit = 6,
  renderItem,
}) => {
  const { blogs, loading, error } = useBlogs({ dataUrl, limit });

  if (loading) return <p>Loading...</p>;
  if (error)   return <p>Error: {error}</p>;
  if (blogs.length === 0) return <p>No posts found.</p>;

  return (
    <>
      {blogs.map((post) =>
        renderItem ? renderItem(post) : (
          <div key={post.id} style={{ marginBottom: "1rem" }}>
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
          </div>
        )
      )}
    </>
  );
};
