# Mirotech Ops Intelligence

See what your operations are **really** telling you.

Greenfield operator product shell for [Mirotech Ops Intelligence](https://github.com/hopper911/mirotech-ops-intelligence).

## Stack

- Next.js App Router + TypeScript + Tailwind CSS v4
- Auth.js (NextAuth v5) credentials demo login
- Mock `OpsSource` data layer ready for real connectors
- Vercel-ready single deploy surface

## Local run

```bash
cp .env.example .env.local
# set AUTH_SECRET (openssl rand -base64 32)

npm install
npm run dev
```

- Landing: http://localhost:3000  
- Login: http://localhost:3000/login  
- App: http://localhost:3000/app  

### Demo credentials

- Email: `demo@mirotech.io`
- Password: `ops-demo`

## Brand tokens

| Token | Hex |
| --- | --- |
| Navy | `#0A1628` |
| Blue | `#2563EB` |
| Cyan | `#22D3EE` |
| Green | `#7DDC65` |
| Surface | `#F5F7FA` |

Assets live in `public/brand/` (logo mark, app icon, full brand kit PNG).

## App routes

| Route | Purpose |
| --- | --- |
| `/` | Marketing landing |
| `/login` | Demo sign-in |
| `/app` | Operator overview (KPIs + insights) |
| `/app/performance` | Performance module |
| `/app/optimization` | Optimization module |
| `/app/connectivity` | Connectivity module |
| `/app/systems` | Systems module |
| `/app/insights` | Insights module |

## Data layer

```ts
import { opsSource } from "@/lib/ops";
```

`opsSource` currently points at `MockOpsSource`. Implement `OpsSource` for live BI / ERP / calendar feeds and swap the export in `src/lib/ops/index.ts`.

## License

Private / proprietary unless otherwise stated.
