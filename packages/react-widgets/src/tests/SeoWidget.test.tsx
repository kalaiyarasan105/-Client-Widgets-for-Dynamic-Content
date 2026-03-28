import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { SeoWidget } from "../components/seo/SeoWidget";

const mockData = {
  blogs: [],
  seoPages: {
    "home-page": {
      pageId: "home-page",
      pageTitle: "Test Page Title",
      metaDescription: "Test meta description.",
      canonicalUrl: "https://example.com/",
      keywords: ["test", "seo"],
      structuredData: { "@context": "https://schema.org", "@type": "WebPage" },
    },
  },
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

describe("SeoWidget", () => {
  it("shows loading state initially", () => {
    render(<SeoWidget />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders SEO fields after fetch", async () => {
    render(<SeoWidget pageId="home-page" />);
    await waitFor(() => {
      expect(screen.getByText("Test Page Title")).toBeInTheDocument();
      expect(screen.getByText("Test meta description.")).toBeInTheDocument();
      expect(screen.getByText("https://example.com/")).toBeInTheDocument();
    });
  });

  it("renders keywords as tags", async () => {
    render(<SeoWidget pageId="home-page" />);
    await waitFor(() => {
      expect(screen.getByText("test")).toBeInTheDocument();
      expect(screen.getByText("seo")).toBeInTheDocument();
    });
  });

  it("toggles structured data visibility", async () => {
    render(<SeoWidget pageId="home-page" showPreview />);
    await waitFor(() => screen.getByText("Show Structured Data"));

    fireEvent.click(screen.getByText("Show Structured Data"));
    expect(screen.getByText("Hide Structured Data")).toBeInTheDocument();
  });

  it("shows empty state for unknown pageId", async () => {
    render(<SeoWidget pageId="unknown-page" />);
    await waitFor(() => {
      expect(screen.getByText(/No SEO data found/)).toBeInTheDocument();
    });
  });
});
