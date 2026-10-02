# הקופה הלאומית — Architecture & Decisions

> National restitution / tzedakah platform. Mobile-first, Hebrew RTL, privacy-first.

## 1. Audit (Discovery)

- **Repo:** `nzm1000-sudo/national-charity-fund` — private, default branch `main`, only `README.md`.
- **Local:** empty working dir; no prior code, tests, or CI to preserve.
- **Environment:** Node 26, npm 11, macOS arm64, network available. No Docker/Postgres locally.
- **Conclusion:** greenfield build. No migration/regression risk from existing code.

## 2. Stack decisions

| Concern | Decision | Why |
|---|---|---|
| Framework | **Next.js (App Router) + React + TypeScript** | SSR/SEO (section 41), route handlers for API, image optimization, PWA-ready, one codebase for public site + admin. |
| Styling | **Tailwind CSS v4** (CSS-first `@theme`) | Design tokens in one place; small CSS; easy to enforce the anti-generic design rules. |
| Fonts | **Frank Ruhl Libre** (display) + **Assistant** (UI/body), self-hosted via `next/font` | Distinctive, dignified Hebrew pair; avoids the generic "Heebo everywhere" AI look. |
| DB (dev) | **SQLite via Prisma 6** | Zero infra, works instantly on any machine, real migrations. |
| DB (prod) | **Postgres** (Neon/Supabase/Railway free tiers) | Same Prisma schema — swap `datasource provider` + `DATABASE_URL`. Provider choice deferred to deploy. |
| ORM | **Prisma** | Typed client, versioned migrations, easy admin queries. |
| Validation | **Zod** | Server-side validation at every boundary (section 37). |
| Sessions | **jose** (JWT in HttpOnly, Secure, SameSite cookie) | Stateless, no extra infra, RBAC claims. |
| Password hashing | **node:crypto `scrypt`** | No native deps; strong KDF. |
| QR | **qrcode** (server-side SVG/PNG/PDF-ready) | Dynamic QR → our short URL → tracked redirect. |
| Tests | **Vitest** | Fast unit/integration for engines (allocation, halacha, money). |

### Money
All amounts stored as **integer agorot** (1 ILS = 100). No floats anywhere. Formatting via a single `formatILS` helper with real RTL-safe ₪ handling.

### Payments (section 21)
A `PaymentsProvider` interface with a **mock** implementation for dev. Real providers (card, Apple/Google Pay, Bit, standing orders) plug in behind adapters. **No full PAN/CVV is ever stored** — only provider tokens. Secrets only from env.

## 3. Data model
See `prisma/schema.prisma`. Core groups: config (`Setting`, `Role`), funds (`FundType`, `Cause`, `Campaign`, `FundTypeDestination`), allocation (`FundRule`, `Allocation`), payments (`Donation`, `Transaction`, `Receipt`, `PaymentToken`, `RecurringPlan`), halacha (`HalachicRule`, `HalachicSource`, `HalachicRuleVersion`), distribution (`QrCode`, `Redirect`), content (`Page`, `Article`, `Faq`), and privacy/audit (`AnalyticsEvent`, `AuditLog`).

Every shekel is bound to a `FundType` and produces an `Allocation` record carrying the `FundRule` + version that decided it — so any donation can be re-justified years later.

## 4. Security & privacy (section 37/19)
- HTTPS + HSTS, CSP (nonce-based, set in middleware), `X-Frame-Options: DENY`, nosniff, strict referrer policy.
- Server-side Zod validation on every write; parameterized Prisma queries (no raw SQL injection surface).
- Rate limiting on sensitive endpoints; RBAC on admin; append-only `AuditLog`.
- **Data minimization**: a donation can be completed with no name/email. Discreet mode disables analytics/marketing entirely.
- `AnalyticsEvent` stores a salted **session hash**, never an IP or identity.

## 5. Cost map (section 39)
| Item | Dev | Prod (low-cost target) |
|---|---|---|
| Hosting | local | Vercel Hobby / Fly.io |
| DB | SQLite file | Neon/Supabase free tier → paid only on scale |
| Storage | local `public/` | Vercel Blob / Cloudflare R2 |
| Email | console/log | Resend free tier |
| SMS | mocked | provider on demand |
| Payments | `mock` | Israeli PSP (fee per transaction only) |
| Domain | – | ~₪40–60/yr |
| Analytics | local table | self-hosted / privacy-first |
| Monitoring | logs | Sentry free tier |

## 6. Scaling path (section 55)
Route handlers are stateless → horizontal scale. Postgres swap is a one-line provider change. `FundType`/`FundRule`/halacha content is admin-configurable, so new funds, languages, and providers are config + adapters, not rewrites.

## 7. Phased plan (section 51)
A Discovery ✔ · B Design system · C Core product · D Admin · E Security/privacy · F QA · G Deploy readiness.
