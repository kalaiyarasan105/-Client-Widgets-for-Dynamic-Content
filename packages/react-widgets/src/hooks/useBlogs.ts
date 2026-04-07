import { useWidgetData } from "./useWidgetData";
import type { BlogPost } from "../types";

interface WidgetsJson {
  blogs: BlogPost[];
}

interface UseBlogsOptions {
  dataUrl?: string;
  limit?: number;
}

interface UseBlogsResult {
  blogs: BlogPost[];
  loading: boolean;
  error: string | null;
}

/**
 * Headless hook — returns blog data with no UI or styling.
 * Use this to build your own fully custom blog UI.
 *
 * @example
 * const { blogs, loading, error } = useBlogs({ dataUrl: "/widgets.json", limit: 5 });
 */
export function useBlogs({
  dataUrl = "/mock/widgets.json",
  limit,
}: UseBlogsOptions = {}): UseBlogsResult {
  const { data, loading, error } = useWidgetData<WidgetsJson>(dataUrl);

  const blogs = data?.blogs
    ? limit
      ? data.blogs.slice(0, limit)
      : data.blogs
    : [];

  return { blogs, loading, error };
}
