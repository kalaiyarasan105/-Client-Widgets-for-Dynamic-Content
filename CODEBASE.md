# Datumart Widgets — Codebase Documentation

A full explanation of every file and folder in this project.

---

## Project Structure Overview

```
datumart-client-widgets/
├── apps/
│   ├── demo-host/          # React app that demonstrates the widgets
│   └── iframe-widget/      # Standalone React app that runs inside an <iframe>
├── packages/
│   └── react-widgets/      # The reusable widget library (@datumart/react-widgets)
├── mock/
│   └── widgets.json        # Mock data used by all widgets
├── render.yaml             # Render.com deployment config for both services
└── package.json            # Root npm workspaces config
```

This is an **npm workspaces monorepo**. All three packages share `node_modules` from the root, and the widget library is referenced locally by both apps using the `*` version alias.

---

## 1. `mock/widgets.json`

The single source of truth for all widget data during development and demo.

**Structure:**
```json
{
  "blogs": [ ...array of blog post objects ],
  "seoPages": { "home-page": {...}, "blog-page": {...} }
}
```

Each blog post has: `id`, `title`, `excerpt`, `image`, `publishDate`, `readMoreUrl`, `author`, `tags`.

Each SEO page has: `pageId`, `pageTitle`, `metaDescription`, `canonicalUrl`, `keywords`, `structuredData`.

This file is copied into `apps/demo-host/public/widgets.json` and `apps/iframe-widget/public/widgets.json` so both deployed services can serve it at `/widgets.json`.

---

## 2. `packages/react-widgets/` — The Widget Library

This is the core library published as `@datumart/react-widgets`. Both apps import from here.

### `src/types/index.ts`

Defines all TypeScript interfaces used across the project:

- `BlogPost` — shape of a single blog post (id, title, excerpt, image, publishDate, readMoreUrl, author, tags)
- `SeoPage` — shape of an SEO metadata object (pageId, pageTitle, metaDescription, canonicalUrl, keywords, structuredData)
- `BlogWidgetProps` — props accepted by `BlogWidget` (limit, theme, dataUrl, onReadMore)
- `SeoWidgetProps` — props accepted by `SeoWidget` (pageId, showPreview, theme, dataUrl)
- `WidgetTheme` — union type `"light" | "dark"`

### `src/hooks/useWidgetData.ts`

A generic React hook that fetches JSON data from any URL.

```ts
const { data, loading, error } = useWidgetData<WidgetsJson>("/widgets.json");
```

- Uses `fetch()` with a cleanup flag (`cancelled`) to prevent state updates on unmounted components
- Returns `{ data, loading, error }` — all widgets use this hook to load their data
- Re-fetches automatically if the `url` prop changes

### `src/components/blog/BlogWidget.tsx`

The main blog listing component.

**What it does:**
- Calls `useWidgetData` to fetch blog posts from `dataUrl`
- Shows `LoadingSpinner` while fetching, `ErrorMessage` on failure, `EmptyState` if no posts
- Renders the first post as a large **featured card** (full width)
- Renders remaining posts in a **responsive grid** (`auto-fill, minmax(220px, 1fr)`)
- Passes `onReadMore` callback down to each `BlogCard`

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `limit` | number | 5 | Max number of posts to show |
| `theme` | `"light"` \| `"dark"` | `"light"` | Color theme |
| `dataUrl` | string | `/mock/widgets.json` | URL to fetch data from |
| `onReadMore` | function | undefined | Called with the post object when Read More is clicked |

### `src/components/blog/BlogCard.tsx`

Renders a single blog post card.

**What it does:**
- Displays post image, date, author, title, excerpt, tags, and a Read More button
- If `featured` prop is true and screen width > 600px, renders in a horizontal row layout (image left, content right)
- On mobile (`window.innerWidth < 600`), always stacks vertically regardless of `featured`
- If `onReadMore` is provided, clicking Read More calls it (used for internal navigation)
- If no `onReadMore`, the button becomes an `<a>` tag linking to `post.readMoreUrl` in a new tab

### `src/components/seo/SeoWidget.tsx`

Displays SEO metadata for a given page.

**What it does:**
- Fetches data from `dataUrl` and looks up the page by `pageId`
- Renders: Page Title, Meta Description, Canonical URL, Keywords (as pill tags)
- If `showPreview` is true, shows a toggle button to reveal/hide the raw JSON structured data

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `pageId` | string | `"home-page"` | Which page's SEO data to display |
| `showPreview` | boolean | true | Whether to show the structured data toggle |
| `theme` | `"light"` \| `"dark"` | `"light"` | Color theme |
| `dataUrl` | string | `/mock/widgets.json` | URL to fetch data from |

### `src/components/shared/LoadingSpinner.tsx`

An animated SVG spinner shown while data is loading. Uses a CSS `@keyframes spin` animation injected inline. Includes `role="status"` and `aria-label="Loading"` for accessibility.

### `src/components/shared/ErrorMessage.tsx`

Displays a styled error box when data fetching fails. Includes `role="alert"` for accessibility. Adapts colors for light/dark theme.

### `src/components/shared/EmptyState.tsx`

Displays a centered message with a 📭 icon when there are no results to show.

### `src/index.ts`

The public API of the library. Exports all components, the hook, and all TypeScript types so consumers can import everything from `@datumart/react-widgets`.

---

## 3. `apps/iframe-widget/` — The IFrame App

A standalone Vite + React app that runs inside an `<iframe>`. It reads URL query parameters to decide what to render.

### `src/main.tsx`

Entry point. Mounts `IFrameApp` into the `#root` div.

### `src/IFrameApp.tsx`

The entire logic of the iframe app lives here.

**How it works:**

1. Reads URL query params using `new URLSearchParams(window.location.search)`:
   - `type` — `"blog"` or `"seo"` (default: `"blog"`)
   - `theme` — `"light"` or `"dark"` (default: `"light"`)
   - `limit` — number of blog posts (default: 5)
   - `pageId` — which SEO page to show (default: `"home-page"`)
   - `preview` — show structured data toggle (default: true)

2. Sends a `postMessage` to the parent window when loaded:
   ```js
   window.parent.postMessage({ source: "datumart-widget", event: "loaded", type }, "*")
   ```

3. Uses a `ResizeObserver` to watch `document.body` and send height updates to the parent:
   ```js
   window.parent.postMessage({ source: "datumart-widget", event: "resize", height }, "*")
   ```
   This allows the parent to resize the `<iframe>` element dynamically so there's no scrollbar or clipped content.

4. For blog type, `handleReadMore` sends a postMessage instead of navigating:
   ```js
   window.parent.postMessage({ source: "datumart-widget", event: "readmore", postId: post.id }, "*")
   ```
   The parent (demo-host) receives this and navigates to `/blog/:id`.

5. Renders either `BlogWidget` or `SeoWidget` based on the `type` param, passing `dataUrl="/widgets.json"`.

### `index.html`

Minimal HTML shell. Sets `body { background: transparent }` so the iframe blends into the parent page background.

### `public/widgets.json`

Copy of `mock/widgets.json`. Served at `/widgets.json` by Vite's static file server in production.

### `public/_redirects`

Tells Render to rewrite all routes to `index.html`:
```
/* /index.html 200
```
Required for SPA routing — without this, Render returns 404 for any URL that isn't a real file.

### `vite.config.ts`

Standard Vite config with the `@datumart/react-widgets` alias pointing to the local package source. Dev server runs on port 5174.

---

## 4. `apps/demo-host/` — The Demo Host App

A Vite + React app that demonstrates both usage patterns: direct JSX import and iframe embed.

### `src/main.tsx`

Entry point. Sets up React Router with two routes:
- `/` — renders `App` (the main demo page)
- `/blog/:id` — renders `BlogDetailWrapper` which reads the theme from `localStorage` and passes it to `BlogDetail`

Also wraps everything in an `ErrorBoundary` to catch and display runtime errors gracefully.

### `src/App.tsx`

The main demo page. Contains all four tabs:

**JSX Blog Widget tab** — renders `<BlogWidget>` directly as a React component. Clicking Read More calls `navigate("/blog/:id")` via React Router.

**JSX SEO Widget tab** — renders `<SeoWidget>` directly as a React component.

**IFrame Blog tab:**
- On desktop: renders `<iframe src={IFRAME_BASE}?type=blog&limit=5&theme=...>`
- On mobile (`window.innerWidth < 768`): renders `BlogWidget` as JSX directly, because mobile browsers block cross-origin iframes

**IFrame SEO tab:**
- Same mobile/desktop split as above, using `SeoWidget` as the fallback

**Key logic:**
- `IFRAME_BASE` is read from `window.__IFRAME_BASE__` (injected at build time by `build.sh`) with a fallback to `import.meta.env.VITE_IFRAME_BASE` and finally `http://localhost:5174`
- Listens for `postMessage` events from the iframe:
  - `readmore` → navigates to `/blog/:id`
  - `resize` → updates the iframe element's height state
  - other events → logged in the postMessage log box
- Theme is persisted to `localStorage` so `BlogDetail` can read it after navigation

**CodeBlock component** (defined inside App.tsx) — renders a styled code snippet with a macOS-style header bar, language badge, and copy button.

### `src/BlogDetail.tsx`

Renders a full blog post detail page at `/blog/:id`.

**What it does:**
- Reads the `id` param from the URL using `useParams`
- Fetches `/widgets.json` and finds the matching post by id
- Displays: back button, cover image, tags, title, date/author, excerpt, and a placeholder body paragraph
- If no post is found, shows a "Post not found" message with a back button

### `index.html`

HTML shell for the demo host. Contains a `<script>` block that sets `window.__IFRAME_BASE__`:
```html
<script>
  window.__IFRAME_BASE__ = window.__IFRAME_BASE__ || "http://localhost:5174";
</script>
```
The `build.sh` script replaces this default with the real deployed URL using `sed` before deploying.

### `public/widgets.json`

Copy of `mock/widgets.json`. Served at `/widgets.json` so `BlogWidget`, `SeoWidget`, and `BlogDetail` can all fetch it.

### `public/_redirects`

Same SPA rewrite rule as the iframe-widget app. Required for React Router to work on Render.

### `build.sh`

Shell script used as the Render build command for demo-host:
1. Runs `npm run build`
2. Uses `sed` to inject the real `VITE_IFRAME_BASE` env variable value into the built `index.html` at deploy time

This solves the problem where Vite bakes env variables at build time — by injecting into the HTML after the build, the URL is always correct regardless of when the env var was set.

### `vite.config.ts`

Standard Vite config with the `@datumart/react-widgets` alias. Dev server on port 5173.

---

## 5. `render.yaml`

Infrastructure-as-code for Render.com. Defines both static site services so settings are version-controlled and never need to be configured manually in the dashboard again.

```yaml
services:
  - name: iframe-widget
    buildCommand: npm install && npm run build --workspace=apps/iframe-widget
    staticPublishPath: apps/iframe-widget/dist
    routes:
      - type: rewrite, source: /*, destination: /index.html

  - name: demo-host
    buildCommand: npm install && sh apps/demo-host/build.sh
    staticPublishPath: apps/demo-host/dist
    envVars:
      - key: VITE_IFRAME_BASE  # Set this to the iframe-widget service URL
    routes:
      - type: rewrite, source: /*, destination: /index.html
```

**Deployment order:** Always deploy `iframe-widget` first, copy its URL, set it as `VITE_IFRAME_BASE` on the `demo-host` service, then deploy `demo-host`.

---

## 6. `package.json` (root)

Configures npm workspaces:
```json
"workspaces": ["apps/*", "packages/*"]
```

Key scripts:
- `npm run dev` — starts both apps concurrently (iframe on :5174, demo-host on :5173)
- `npm run dev:iframe` — starts only the iframe-widget app
- `npm run dev:demo` — starts only the demo-host app
- `npm test` — runs vitest tests in the react-widgets package

---

## Data Flow Summary

```
mock/widgets.json
       │
       ▼
copied into both apps' public/ folders
       │
       ▼
served at /widgets.json by each deployed service
       │
       ├──► BlogWidget / SeoWidget fetch it via useWidgetData hook
       │
       └──► BlogDetail fetches it directly via fetch()


User clicks "Read More" in iframe
       │
       ▼
IFrameApp sends postMessage({ event: "readmore", postId })
       │
       ▼
App.tsx receives message → navigate("/blog/:id")
       │
       ▼
BlogDetail renders the full post


IFrame content changes height
       │
       ▼
IFrameApp ResizeObserver sends postMessage({ event: "resize", height })
       │
       ▼
App.tsx updates iframe element height state → iframe resizes
```
