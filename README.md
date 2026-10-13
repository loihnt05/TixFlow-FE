# TixFlow frontend

A Next.js frontend for event discovery and ticketing. Authentication uses Keycloak through `keycloak-js`; `/account` calls the TixFlow API and displays the local profile synchronized from the access-token `sub`. Public catalog, Organizer event setup and ticket inventory use the TixFlow API; checkout and downstream order/payment screens remain mock flows for later phases.

## Requirements

- Node.js 22.x (the package engine is `>=22 <23`)
- pnpm

## Run locally

```powershell
pnpm install
Copy-Item .env.example .env.local
pnpm dev
```

Open `http://localhost:3000`. Start Keycloak and the API from `tixflow-backend` first.

The browser client uses Authorization Code with PKCE S256. `keycloak-js` keeps access, ID and refresh tokens in memory; only the post-login return path is kept temporarily in `sessionStorage`. Never put a Keycloak client secret in `NEXT_PUBLIC_*` variables.

## Main routes

- `/` — discovery homepage
- `/events` and `/events/[slug]` — event search, filters, and details
- `/checkout` and `/checkout/success` — mock ticket order flow
- `/login`, `/register`, `/auth/callback` — Keycloak login and registration flow
- `/account` — authenticated profile from `GET /api/v1/users/me`; transaction sections require Customer
- `/admin` — Admin-only access probe and dashboard entry
- `/forgot-password` — prototype screen; Keycloak reset-password integration remains pending
- `/organizer` — Organizer-only dashboard, events, event setup, orders, attendees, and analytics

The header and footer show links for the single business role in the token. Customer-only purchase routes, Organizer routes and the Admin route are also guarded by `ProtectedRoute`; navigation visibility is not used as the authorization boundary.

Mock datasets live in `lib/mock/`. UI-facing mock service functions live in `lib/mock-api/` so they can later be replaced with API calls without coupling pages to fixture data.

## Checks

```powershell
pnpm lint
pnpm build
```
