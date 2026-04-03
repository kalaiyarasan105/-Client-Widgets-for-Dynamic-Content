# Datumart Client Widgets

A React-based widget system that allows third-party client websites to display dynamic Blog and SEO content provided by Datumart — through two integration methods: **JSX component library** and **IFrame embed**.

---

## One-Line Summary

> A monorepo containing a reusable React widget library, a standalone iframe app, and a demo host — all sharing the same components and mock data, deployable as two independent static sites.

---

## Project Overview

Datumart Client Widgets solves a common problem: how do you let external websites display your content without asking them to rebuild their entire frontend?

This project provides two answers:

- **JSX Library** — developers install `@datumart/react-widgets` as an npm package and drop components directly into their React app
- **IFrame Embed** — anyone pastes a single `<iframe>` tag into their HTML and the widget appears, no React knowledge needed

Both methods render the same two widget types:
- **Blog Widget** — displays recent blog posts with a featured card and a responsive grid
- **SEO Widget** — displays page metadata including title, description, canonical URL, keywords, and structured data

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI components |
| TypeScript | Type safety across all packages |
| Vite | Fast dev server and build tool |
| React Router | Client-side routing in demo-host |
| npm Workspaces | Monorepo — shared dependencies across apps |
| Inline Styles | Zero-dependency styling, no CSS conflicts |

---

## Project Structure

```
datumart-client-widgets/
├── apps/
│   ├── demo-host/          ← Sample host page showing both integration methods
│   └── iframe-widget/      ← Standalone app that runs inside an <iframe>
├── packages/
│   └── react-widgets/      ← The reusable JSX widget library
├── mock/
│   └── widgets.json        ← Mock API data (source of truth)
├── render.yaml             ← Render.com deployment config
└── README.md
```

### apps/demo-host
The demonstration website. Shows all four tabs: JSX Blog Widget, JSX SEO Widget, IFrame Blog, IFrame SEO. Uses React Router for the blog detail page at `/blog/:id`.

### apps/iframe-widget
A completely self-contained React app. Reads URL query parameters to decide what to render. Deployed as a separate static site — clients embed it with a plain `<iframe>` tag.

### packages/react-widgets
The widget library. Exports `BlogWidget`, `SeoWidget`, `BlogCard`, `useWidgetData`, and all TypeScript types. Both apps import from here.

### public/widgets.json
Each app has its own copy at `apps/demo-host/public/widgets.json` and `apps/iframe-widget/public/widgets.json`. Vite serves these as static files at `/widgets.json` in production. The original source is `mock/widgets.json`.

---

## How the Project Works (Step by Step)

```
1. User opens demo-host in browser
        ↓
2. App.tsx renders four tabs (JSX Blog, JSX SEO, IFrame Blog, IFrame SEO)
        ↓
3a. JSX tab selected
    → BlogWidget or SeoWidget renders directly in the page
    → useWidgetData hook fetches /widgets.json
    → Components render the data
        ↓
3b. IFrame tab selected
    → <iframe src="https://iframe-widget.onrender.com?type=blog&theme=light"> renders
    → iframe-widget app loads in the iframe
    → IFrameApp.tsx reads URL query params (type, theme, limit, pageId)
    → BlogWidget or SeoWidget renders inside the iframe
    → useWidgetData hook fetches /widgets.json from iframe-widget's own domain
    → Components render the data
        ↓
4. User clicks "Read More" inside iframe
    → IFrameApp sends postMessage({ event: "readmore", postId }) to parent
    → App.tsx receives message → navigates to /blog/:id
    → BlogDetail.tsx fetches the post and renders the full detail page
        ↓
5. iframe content height changes
    → ResizeObserver in IFrameApp sends postMessage({ event: "resize", height })
    → App.tsx updates the iframe element height → no scrollbars
```

---

## File-wise Explanation

### `apps/iframe-widget/src/IFrameApp.tsx`
The brain of the iframe app. Reads URL query params (`type`, `theme`, `limit`, `pageId`, `preview`) and renders either `BlogWidget` or `SeoWidget`. Also handles all `postMessage` communication — sends `loaded`, `resize`, and `readmore` events to the parent window.

### `packages/react-widgets/src/components/blog/BlogWidget.tsx`
Renders a full blog listing. Shows the first post as a large featured card (horizontal on desktop, stacked on mobile) and the rest in a responsive grid. Uses `useWidgetData` to fetch posts. Shows `LoadingSpinner`, `ErrorMessage`, or `EmptyState` as needed.

### `packages/react-widgets/src/components/seo/SeoWidget.tsx`
Renders SEO metadata for a given page. Displays page title, meta description, canonical URL, and keywords. Has a toggle button to show/hide the raw JSON-LD structured data.

### `packages/react-widgets/src/components/blog/BlogCard.tsx`
Renders a single blog post card with image, date, author, title, excerpt, tags, and a Read More button. If `onReadMore` prop is provided, clicking the button calls it. Otherwise it opens `post.readMoreUrl` in a new tab. On mobile screens (< 600px), always stacks vertically.

### `packages/react-widgets/src/hooks/useWidgetData.ts`
A generic React hook that fetches JSON from any URL. Returns `{ data, loading, error }`. Includes a cleanup flag to prevent state updates on unmounted components. Re-fetches automatically if the URL changes.

```ts
const { data, loading, error } = useWidgetData<WidgetsJson>("/widgets.json");
```

### `mock/widgets.json`
The single source of truth for all widget content. Contains a `blogs` array and a `seoPages` object. Must be manually copied to both `apps/demo-host/public/` and `apps/iframe-widget/public/` after any changes.

### `apps/demo-host/src/App.tsx`
The main demo page. Manages tab state, theme (light/dark), and listens for `postMessage` events from the iframe. On mobile, renders widgets as JSX directly instead of using an iframe (mobile browsers block cross-origin iframes). Persists theme to `localStorage` so `BlogDetail` matches the selected theme.

### `apps/iframe-widget/vite.config.ts` and `apps/demo-host/vite.config.ts`
Standard Vite configs. Both alias `@datumart/react-widgets` to the local package source so no npm publish is needed during development. Each app runs on its own port (5173 for demo-host, 5174 for iframe-widget).

### `package.json` (root)
Configures npm workspaces so all three packages share a single `node_modules`. Key scripts:
- `npm run dev` — starts both apps at the same time
- `npm test` — runs vitest tests in the widget library

---

## Integration Methods

### Method 1 — JSX Component (for React developers)

Install the package:
```bash
npm install @datumart/react-widgets
```

Use in your React app:
```tsx
import { BlogWidget, SeoWidget } from "@datumart/react-widgets";

// Blog Widget
<BlogWidget
  limit={5}
  theme="light"
  dataUrl="https://your-api.com/widgets.json"
  onReadMore={(post) => navigate(`/blog/${post.id}`)}
/>

// SEO Widget
<SeoWidget
  pageId="home-page"
  showPreview={true}
  theme="dark"
  dataUrl="https://your-api.com/widgets.json"
/>
```

### Method 2 — IFrame Embed (for any website)

No React needed. Just paste this into your HTML:

```html
<!-- Blog Widget -->
<iframe
  src="https://iframe-widget.onrender.com?type=blog&limit=5&theme=light"
  width="100%"
  height="520"
  frameborder="0"
  title="Datumart Blog Widget"
></iframe>

<!-- SEO Widget -->
<iframe
  src="https://iframe-widget.onrender.com?type=seo&pageId=home-page&preview=true&theme=light"
  width="100%"
  height="380"
  frameborder="0"
  title="Datumart SEO Widget"
></iframe>
```

**IFrame URL Parameters:**

| Parameter | Options | Default | Description |
|-----------|---------|---------|-------------|
| `type` | `blog`, `seo` | `blog` | Which widget to show |
| `theme` | `light`, `dark` | `light` | Color theme |
| `limit` | any number | `6` | Max blog posts (blog only) |
| `pageId` | string | `home-page` | SEO page key (seo only) |
| `preview` | `true`, `false` | `true` | Show structured data toggle |

---

## Data Format

The widgets read from a JSON file with this structure:

```json
{
  "blogs": [
    {
      "id": "1",
      "title": "Blog Post Title",
      "excerpt": "Short summary shown on the card.",
      "image": "https://images.unsplash.com/photo-xxx?w=600&q=80",
      "publishDate": "2026-04-01",
      "readMoreUrl": "https://yoursite.com/blog/slug",
      "author": "Author Name",
      "tags": ["Tag1", "Tag2"]
    }
  ],
  "seoPages": {
    "home-page": {
      "pageId": "home-page",
      "pageTitle": "Your Page Title",
      "metaDescription": "Description shown in search results.",
      "canonicalUrl": "https://yoursite.com/",
      "keywords": ["keyword1", "keyword2"],
      "structuredData": {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Your Company"
      }
    }
  }
}
```

---

## postMessage Communication

When using the IFrame embed, the widget sends events to the parent page using `window.postMessage`. All messages include `source: "datumart-widget"`.

| Event | When it fires | Payload |
|-------|--------------|---------|
| `loaded` | Widget finishes mounting | `{ source, event: "loaded", type }` |
| `resize` | Content height changes | `{ source, event: "resize", height }` |
| `readmore` | User clicks Read More | `{ source, event: "readmore", postId }` |

**Listening for events in your page:**

```js
window.addEventListener("message", (e) => {
  if (e.data?.source !== "datumart-widget") return;

  if (e.data.event === "loaded") {
    console.log("Widget ready");
  }

  if (e.data.event === "resize") {
    document.getElementById("my-iframe").style.height = e.data.height + "px";
  }

  if (e.data.event === "readmore") {
    window.location.href = `/blog/${e.data.postId}`;
  }
});
```

---

## How to Run the Project

**1. Install dependencies**
```bash
npm install
```

**2. Start both apps**
```bash
npm run dev
```

This starts:
- demo-host at `http://localhost:5173`
- iframe-widget at `http://localhost:5174`

**3. Run tests**
```bash
npm test
```

---

## How to Add a New Blog Post

Edit these three files (all must stay in sync):

1. `mock/widgets.json`
2. `apps/demo-host/public/widgets.json`
3. `apps/iframe-widget/public/widgets.json`

Add a new object to the `blogs` array:

```json
{
  "id": "7",
  "title": "Your New Blog Title",
  "excerpt": "A short summary of the post.",
  "image": "https://images.unsplash.com/photo-REAL-ID?w=600&q=80",
  "publishDate": "2026-05-01",
  "readMoreUrl": "https://datumart.com/blog/your-slug",
  "author": "Your Name",
  "tags": ["Tag1", "Tag2"]
}
```

Make sure the `id` is unique and increment the `limit` prop in `App.tsx` if needed.

---

## Libraries Used

| Library | Version | Purpose |
|---------|---------|---------|
| `react` | ^18.3.1 | UI rendering |
| `react-dom` | ^18.3.1 | DOM mounting |
| `react-router-dom` | ^7.13.2 | Client-side routing (demo-host) |
| `typescript` | ^5.4.5 | Static type checking |
| `vite` | ^5.3.1 | Dev server and bundler |
| `@vitejs/plugin-react` | ^4.3.1 | React support in Vite |
| `vitest` | latest | Unit testing |
| `concurrently` | ^8.2.2 | Run multiple dev servers at once |

---

## Summary

demo-host (React + Router) demonstrates two ways to embed widgets → JSX components render directly in the page, iframes load the standalone iframe-widget app → both use the same `@datumart/react-widgets` library → widgets fetch data from `widgets.json` → iframe communicates back to the parent via postMessage for resize and navigation events.
