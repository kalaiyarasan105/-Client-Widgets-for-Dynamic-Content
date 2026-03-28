# Datumart Client Widgets

A monorepo containing reusable React widgets for dynamic blog and SEO content, embeddable via **IFrame** or **JSX library**.

---

## Project Structure

```
datumart-client-widgets/
├── apps/
│   ├── demo-host/        ← React demo page (port 5173)
│   └── iframe-widget/    ← IFrame entry app (port 5174)
├── packages/
│   └── react-widgets/    ← Shared JSX component library
├── mock/
│   └── widgets.json      ← Mock data (blogs + SEO pages)
└── README.md
```

---

## Setup & Running Locally

### Prerequisites
- Node.js 18+
- npm 8+ (workspaces support)

### Install all dependencies

```bash
npm install
```

### Run both apps simultaneously

```bash
npm run dev
```

Or run individually:

```bash
# IFrame widget app — http://localhost:5174
npm run dev:iframe

# Demo host app — http://localhost:5173
npm run dev:demo
```

### Run tests

```bash
npm run test
```

---

## IFrame Integration

The iframe widget reads URL query parameters to configure itself.

**Supported params:**

| Param     | Values                  | Default       |
|-----------|-------------------------|---------------|
| `type`    | `blog` \| `seo`         | `blog`        |
| `theme`   | `light` \| `dark`       | `light`       |
| `limit`   | number                  | `5`           |
| `pageId`  | string (SEO page key)   | `home-page`   |
| `preview` | `true` \| `false`       | `true`        |

**Embed snippet:**

```html
<!-- Blog Widget -->
<iframe
  src="http://localhost:5174?type=blog&limit=5&theme=light"
  width="100%"
  height="520"
  frameborder="0"
  title="Datumart Blog Widget"
></iframe>

<!-- SEO Widget -->
<iframe
  src="http://localhost:5174?type=seo&pageId=home-page&preview=true&theme=dark"
  width="100%"
  height="380"
  frameborder="0"
  title="Datumart SEO Widget"
></iframe>
```

### postMessage Events

The iframe sends a message to the parent window when it loads:

```js
window.addEventListener("message", (e) => {
  if (e.data?.source === "datumart-widget") {
    console.log(e.data); // { source, event: "loaded", type: "blog" }
  }
});
```

---

## JSX Library Usage

```tsx
import { BlogWidget, SeoWidget } from "@datumart/react-widgets";

// Blog widget
<BlogWidget
  clientId="demo-client"
  limit={5}
  theme="dark"
  dataUrl="/mock/widgets.json"
/>

// SEO widget
<SeoWidget
  pageId="home-page"
  showPreview={true}
  theme="light"
  dataUrl="/mock/widgets.json"
/>
```

### BlogWidget Props

| Prop       | Type              | Default               | Description                    |
|------------|-------------------|-----------------------|--------------------------------|
| `clientId` | `string`          | —                     | Optional client identifier     |
| `limit`    | `number`          | `5`                   | Max number of posts to show    |
| `theme`    | `"light"\|"dark"` | `"light"`             | Color theme                    |
| `dataUrl`  | `string`          | `/mock/widgets.json`  | URL to fetch widget data from  |

### SeoWidget Props

| Prop          | Type              | Default               | Description                        |
|---------------|-------------------|-----------------------|------------------------------------|
| `pageId`      | `string`          | `"home-page"`         | Key of the SEO page in data        |
| `showPreview` | `boolean`         | `true`                | Show structured data toggle        |
| `theme`       | `"light"\|"dark"` | `"light"`             | Color theme                        |
| `dataUrl`     | `string`          | `/mock/widgets.json`  | URL to fetch widget data from      |

---

## Architecture Overview

```
packages/react-widgets/
├── src/
│   ├── types/index.ts          ← TypeScript interfaces
│   ├── hooks/useWidgetData.ts  ← Generic fetch hook
│   ├── components/
│   │   ├── blog/
│   │   │   ├── BlogWidget.tsx  ← Main blog widget
│   │   │   └── BlogCard.tsx    ← Individual post card
│   │   ├── seo/
│   │   │   └── SeoWidget.tsx   ← SEO metadata widget
│   │   └── shared/
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorMessage.tsx
│   │       └── EmptyState.tsx
│   └── index.ts                ← Named exports
```

**Data flow:**
1. Widget mounts → `useWidgetData` fetches from `dataUrl`
2. Loading/error/empty states handled automatically
3. On success, data is sliced by `limit` and rendered

---

## Assumptions & Limitations

- Mock data is served as a static JSON file — no real backend
- IFrame style isolation is handled naturally by the browser's iframe boundary
- `postMessage` uses `"*"` as target origin — in production, restrict to your domain
- The JSX library uses path aliasing via Vite — for npm publishing, a proper build step (Rollup/tsup) would be needed
- No authentication or client-specific data filtering is implemented

---

## AI Tools Used

This project was scaffolded with AI assistance (Kiro). The following areas were AI-assisted:
- Initial project structure and boilerplate
- TypeScript type definitions
- Inline styles for theme support

The following were manually validated:
- postMessage event flow
- IFrame URL param parsing logic
- Test assertions and mock setup
- Data URL routing between apps
