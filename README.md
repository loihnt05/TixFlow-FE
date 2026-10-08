# Zipevent UI Prototype

A responsive, frontend-only event discovery and ticketing prototype inspired by [Zipevent](https://www.zipeventapp.com/). The app uses fictional event content, in-memory mock datasets, and browser storage for prototype interactions. It does not connect to a backend or payment provider.

## Requirements

- Node.js 22.x (the package engine is `>=22 <23`)
- pnpm

## Run locally

```powershell
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Main routes

- `/` — discovery homepage
- `/events` and `/events/[slug]` — event search, filters, and details
- `/checkout` and `/checkout/success` — mock ticket order flow
- `/login`, `/register`, `/forgot-password` — mock account flows
- `/account` — profile, tickets, orders, favorites, and settings
- `/organizer` — dashboard, events, event setup, orders, attendees, and analytics

Mock datasets live in `lib/mock/`. UI-facing mock service functions live in `lib/mock-api/` so they can later be replaced with API calls without coupling pages to fixture data.

## Checks

```powershell
pnpm lint
pnpm build
```
