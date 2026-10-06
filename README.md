# TradeWise AI

A responsive React + TypeScript + Vite frontend with cyan branding and persistent dark/light themes.

## Run locally

Requires Node.js 22.12+ (tested with Node 24).

```sh
npm install
npm run dev -- --host 127.0.0.1
```

Open http://127.0.0.1:5173. Vite prints another port if 5173 is occupied.

```sh
npm run build
npm run lint
npm run preview
```

## Structure

- `src/layout` — app shell, navigation and header
- `src/ui` — reusable branding and section headings
- `src/features/dashboard` — hero, progress, prompt composer and recent drafts
- `src/hooks` — persistent theme state
- `src/types` — shared frontend types
- `src/styles` — theme tokens and focused stylesheets, including responsive rules

## Preview behavior

The theme defaults to the system preference and persists in localStorage. Suggested prompts populate the composer. Submit a prompt or attach a PNG, JPEG or WebP (up to 10 MB) to create a local draft in Recent analysis. Attachment metadata and drafts live only in memory and reset on refresh. Files are never sent anywhere. Streak, XP and level values are labeled demo data.

This foundation contains no backend, authentication, database, AI API integration, or screenshot analysis.
