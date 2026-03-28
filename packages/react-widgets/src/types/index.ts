export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image?: string;
  publishDate: string;
  readMoreUrl: string;
  author: string;
  tags: string[];
}

export interface SeoPage {
  pageId: string;
  pageTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  keywords: string[];
  structuredData?: Record<string, unknown>;
}

export interface BlogWidgetProps {
  clientId?: string;
  limit?: number;
  theme?: "light" | "dark";
  /** Override data source URL — defaults to mock JSON */
  dataUrl?: string;
}

export interface SeoWidgetProps {
  pageId?: string;
  showPreview?: boolean;
  theme?: "light" | "dark";
  /** Override data source URL — defaults to mock JSON */
  dataUrl?: string;
}

export type WidgetTheme = "light" | "dark";
