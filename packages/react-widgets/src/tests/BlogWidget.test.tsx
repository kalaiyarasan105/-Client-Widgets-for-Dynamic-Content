import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BlogWidget } from "../components/blog/BlogWidget";

const mockData = {
  blogs: [
    {
      id: "1",
      title: "Test Blog Post",
      excerpt: "This is a test excerpt.",
      publishDate: "2026-03-01",
      readMoreUrl: "https://example.com",
      author: "Test Author",
      tags: ["React"],
    },
  ],
  seoPages: {},
};

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      })
    )
  );
});

describe("BlogWidget", () => {
  it("shows loading state initially", () => {
    render(<BlogWidget />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders blog post after fetch", async () => {
    render(<BlogWidget />);
    await waitFor(() => {
      expect(screen.getByText("Test Blog Post")).toBeInTheDocument();
    });
  });

  it("respects the limit prop", async () => {
    const manyBlogs = Array.from({ length: 10 }, (_, i) => ({
      id: String(i),
      title: `Post ${i}`,
      excerpt: "Excerpt",
      publishDate: "2026-01-01",
      readMoreUrl: "https://example.com",
      author: "Author",
      tags: [],
    }));

    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ blogs: manyBlogs, seoPages: {} }),
        })
      )
    );

    render(<BlogWidget limit={3} />);
    await waitFor(() => {
      expect(screen.getAllByRole("article")).toHaveLength(3);
    });
  });

  it("shows error state on fetch failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new Error("Network error")))
    );

    render(<BlogWidget />);
    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  it("shows empty state when no blogs", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ blogs: [], seoPages: {} }),
        })
      )
    );

    render(<BlogWidget />);
    await waitFor(() => {
      expect(screen.getByText("No blog posts found.")).toBeInTheDocument();
    });
  });
});
