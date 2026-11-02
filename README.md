# TixFlow frontend

A Next.js frontend for event discovery and ticketing. Authentication uses Keycloak through `keycloak-js`; `/account` calls the TixFlow API and displays the local profile synchronized from the access-token `sub`. Catalog, event setup, inventory, hold/checkout, orders and tickets use the TixFlow API. Payment uses the backend mock provider; it does not collect real money. Prototype screens may still use fixture data; the presence of a page is not evidence of a production integration.

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
- `/checkout` and `/checkout/success` — API hold/order flow with mock payment provider
- `/assistant` — proposals through typed tools; explicit confirmation creates a hold, with catalog fallback when the provider is unavailable
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
# Production VPS (phase 12)

Workflow `.github/workflows/production.yml` kiểm tra lint/build/audit, rồi publish image theo commit SHA trên `main`. Đặt repository variables `APP_DOMAIN`, `API_DOMAIN`, `AUTH_DOMAIN` trước khi build production; các URL `NEXT_PUBLIC_*` được nhúng lúc build. Copy digest trong job summary vào `FRONTEND_IMAGE` của backend `.env.production`. Next.js đã được vá lên 16.4.2; chạy `npm ci` hoặc `pnpm install --frozen-lockfile` để cập nhật dependencies local.

Dockerfile chạy standalone server bằng user `node`, bind `0.0.0.0:3000`; chỉ Nginx của production stack public cổng 80/443. Runbook đầy đủ nằm ở `tixflow-backend/docs/phase-12-deployment.md` trong workspace. Chưa deploy VPS hoặc cấu hình SSH tại bước chuẩn bị này.

Dependency gate chặn mọi high/critical chưa review. Ngoại lệ duy nhất là advisory `GHSA-vfj7-8cjw-p6xm` của `braces`, chỉ khi toàn bộ dependency chain nằm trong tooling build Tailwind 3 (`devDependencies`); không được xuất hiện trong runtime. Audit artifact vẫn giữ các findings để theo dõi; không tuyên bố toàn bộ dependency tree sạch.

## Phase 13 handover

Bộ báo cáo, OpenAPI, kịch bản demo và checklist release nằm tại `../tixflow-backend/docs/release/README.md` trong workspace. Snapshot review chứa cả hai repo và hash từng file; chưa thay cho clean release commit, nghiệm thu browser/VPS hoặc đánh giá provider AI thật.
