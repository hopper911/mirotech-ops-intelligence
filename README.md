# Mirotech Ops Intelligence

See what your operations are **really** telling you.

Self-initiated B2B SaaS product concept: one workspace for cloud spend, software subscriptions, AI API usage, automation health, recommendations, and savings forecasts.

All figures use the fictional **Northline Commerce** workspace and are labeled **sample data**.

## Stack

- Next.js App Router + TypeScript + Tailwind CSS v4
- Auth.js (NextAuth v5) demo credentials
- Mock `OpsSource` domain layer (swap for live connectors later)

## Local run

```bash
cp .env.example .env.local
# set AUTH_SECRET

npm install
npm run dev
```

Demo login: `demo@mirotech.io` / `ops-demo`  
Admin (Data Studio + Media Studio): `admin@mirotech.io` / `12345mirotech`

## Media Studio (admin)

At **`/app/media`** (admin only), upload:

- Homepage hero background video (URL or ≤4MB file)
- Sales deck slide images
- Three LinkedIn ad images
- Four-side carousel images

Public pages (`/`, `/sales/deck`, `/sales/ads`) only display media — no upload UI. Stored in browser localStorage (`mirotech.sales.media`).

## Product routes (sign-in required)

| Route | Screen |
| --- | --- |
| `/app` | Executive dashboard |
| `/app/expenses` | Cloud + software expenses |
| `/app/ai-usage` | AI API usage |
| `/app/subscriptions` | Subscription inventory |
| `/app/automation` | Automation health |
| `/app/recommendations/[id]` | Recommendation detail |
| `/app/forecast` | Savings forecast |
| `/app/assistant` | AI assistant |
| `/app/data` | Data Studio (**admin only**) |
| `/app/media` | Media Studio (**admin only**) |
| `/app/notifications` | Anomaly alerts |
| `/app/onboarding` | Guided onboarding |

## Roles

| Account | Access |
| --- | --- |
| `demo@mirotech.io` / `ops-demo` | Client-facing product — **read-only** sample data |
| `admin@mirotech.io` / `12345mirotech` | Admin — Data Studio edit/save/reset/import (override with `ADMIN_EMAIL` / `ADMIN_PASSWORD`) |

Clients never see Data Studio in the nav. Visiting `/app/data` redirects to `/app`. Approve/dismiss on recommendations is ephemeral for clients and does not persist.

## Data Studio

**Admin only.** Admins can edit every Northline sample dataset (company, KPIs, vendors, AI models, subscriptions, automation, recommendations, forecast, assistant presets, alerts).

- Edits persist in **browser localStorage** (`mirotech.ops.workspace`) on the admin’s device — no database required.
- **Save** writes the overlay; **Reset to Northline defaults** clears it.
- **Export / Import JSON** for portfolio handoff between browsers.
- Client sessions always see baked-in Northline defaults (no overlay).

## Marketing & sales

| Route | Purpose |
| --- | --- |
| `/` | Homepage |
| `/product` | Product landing |
| `/pricing` | Sample pricing |
| `/concept` | Credibility / case study |
| `/sales` | Sales kit hub |
| `/sales/one-pager` | Printable one-pager |
| `/sales/deck` | 10-slide deck |
| `/sales/brief` | Solution brief |
| `/sales/email` | Launch email preview |
| `/sales/ads` | LinkedIn ad mocks |
| `/brand` | Compact brand guidelines |

## Brand

Navy `#0A1628` · Blue `#2563EB` · Cyan `#22D3EE` · Green `#7DDC65` · Surface `#F5F7FA`

Assets in `public/brand/`.
