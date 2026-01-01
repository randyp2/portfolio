# Randy Pahang II — Portfolio

Live site: https://randypahangii.vercel.app

## Overview
Interactive portfolio built with React and Vite. On desktop it renders a physics-driven “world” you can navigate by dragging and launching a glowing ball; on mobile it switches to a scrollable, card-based layout. Smooth navigation, animated sections, and downloadable assets are included.

## Features
- **Desktop experience**: Matter.js physics world with ball navigation, animated folders and sections, and framer-motion transitions.
- **Mobile experience**: Responsive, touch-friendly sections (Intro, About, Projects, Skills tabs, Contact) with smooth in-page scrolling.
- **Projects & media**: Expandable project cards with video/image previews and status tags.
- **Skills browser**: Tabbed skills grid and carousel preview for languages/tools/frameworks.
- **Contact & resume**: Downloadable PDF, email copy-to-clipboard fallback, and social links.

## Tech Stack
- React 19 + TypeScript, Vite
- Tailwind CSS v4
- framer-motion animations
- matter-js physics
- Zustand for shared state
- lucide-react / react-icons for icons

## Getting Started
1) Install Node.js (v18+ recommended).
2) Install dependencies (pnpm preferred since `pnpm-lock.yaml` is present):
   ```bash
   pnpm install
   # or npm install
   ```
3) Run the dev server:
   ```bash
   pnpm dev
   # or npm run dev
   ```
4) Open http://localhost:5173.

## Scripts
- `pnpm dev` — start the dev server.
- `pnpm build` — type-check (`tsc -b`) and build for production.
- `pnpm preview` — preview the production build locally.
- `pnpm lint` — run ESLint.

## Project Structure (high level)
- `src/App.tsx` — desktop/mobile entry point switch.
- `src/components/Navbar.tsx` — shared navbar with mobile/desktop handling.
- `src/components/MobilePage.tsx` & `src/components/mobile/` — mobile layout sections.
- `src/components/WorldCanvas.tsx` & `src/sections/` — desktop physics world.
- `public/` — static assets (media, resume files, images).

## Notes
- Resume and preview assets are served from `public/files` and `public/images` with `import.meta.env.BASE_URL` for correct paths in production.
- Build outputs are not committed; generate with `pnpm build` when needed.
