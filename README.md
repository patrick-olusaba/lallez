# ARRAD R — Director Portfolio

A pixel-faithful React + TypeScript replica of [arradr.com](https://arradr.com).

## Stack

- **React 18** + **TypeScript**
- **Vite** (dev server + build)
- **React Router v6** (client-side routing)
- Plain **CSS** per component (no Tailwind, no CSS-in-JS)

## Project Structure

```
arradr/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── package.json
└── src/
    ├── main.tsx              # Entry point
    ├── App.tsx               # Router + Navbar wrapper
    ├── index.css             # Global reset + CSS variables
    │
    ├── types/
    │   └── index.ts          # Project interface
    │
    ├── data/
    │   └── projects.ts       # All 25 projects with real Vimeo video URLs
    │
    ├── components/
    │   ├── Navbar.tsx/.css    # Fixed header: logo left, Work + Contact right
    │   ├── Slideshow.tsx/.css # Full-viewport auto-cycling video carousel
    │   └── WorkGrid.tsx/.css  # 2-column grid of project thumbnails
    │
    └── pages/
        ├── Home.tsx/.css         # / — slideshow + work grid
        ├── WorkDetail.tsx/.css   # /work/:slug — full-screen video player
        └── Contact.tsx/.css      # /contact — all agent/rep info
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages

| Route | Description |
|-------|-------------|
| `/` | Slideshow + work grid — all 25 projects |
| `/work/:slug` | Full-screen video, prev/next navigation, keyboard arrows |
| `/contact` | Direct, Commercial, Music Video & Production contacts |

## Customising

- **Add/remove projects** → edit `src/data/projects.ts`
- **Change colours** → edit CSS variables in `src/index.css`
- **Logo** → edit the inline SVG in `src/components/Navbar.tsx`
