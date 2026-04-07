import { useWidgetData } from "./useWidgetData";
import type { SeoPage } from "../types";

interface WidgetsJson {
  seoPages: Record<string, SeoPage>;
}

interface UseSeoOptions {
  pageId?: string;
  dataUrl?: string;
}

interface UseSeoResult {
  seo: SeoPage | null;
  loading: boolean;
  error: string | null;
}

/**
 * Headless hook — returns SEO page data with no UI or styling.
 * Use this to build your own fully custom SEO metadata UI.
 *
 * @example
 * const { seo, loading, error } = useSeo({ pageId: "home-page", dataUrl: "/widgets.json" });
 */
export function useSeo({
  pageId = "home-page",
  dataUrl = "/mock/widgets.json",
}: UseSeoOptions = {}): UseSeoResult {
  const { data, loading, error } = useWidgetData<WidgetsJson>(dataUrl);

  const seo = data?.seoPages?.[pageId] ?? null;

  return { seo, loading, error };
}
