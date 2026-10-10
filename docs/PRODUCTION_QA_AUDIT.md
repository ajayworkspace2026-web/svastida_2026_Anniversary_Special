# Svastida Production QA Audit

Audit date: 2026-10-10
Target: Svastida fashion storefront
Scope: customer storefront, catalogue, cart, checkout, AI designer, admin, Supabase integration, security, SEO, responsive UX, deployment readiness.

## Test status

| Area | Test | Status | Notes |
|---|---|---|---|
| Home | Homepage renders and catalogue data loads | VERIFIED IN SOURCE + DB | Supabase catalogue queries return successfully. |
| Navigation | Desktop navigation exposes Home, Collections, Customise, About, Contact | FIXED | Contact added to desktop navigation. |
| Navigation | Mobile menu opens/closes and hides admin | VERIFIED IN SOURCE | Existing Playwright coverage. |
| Collections | Collections index loads active collections | VERIFIED IN DB | Active collection `demo` exists. |
| Collections | Collection detail route | FIXED | Removed fragile PostgREST relationship embedding and resolves collection ID first. |
| Collections | Search/min/max/size/sort | VERIFIED IN SOURCE | Query parameters are validated and forwarded. |
| Collections | Pagination preserves active filters | FIXED | Pagination now carries q/sort/size/min/max. |
| Products | Product detail route | VERIFIED IN SOURCE + DB | Active test product exists. |
| Products | Size selection and quantity 1-10 | VERIFIED IN SOURCE | Client and server validation both present. |
| Products | Custom measurements | VERIFIED IN SOURCE | Numeric bounds 0-300. |
| Cart | Add/update/remove/clear | VERIFIED IN SOURCE | localStorage + external-store synchronization. |
| Cart | Cart survives reload | AUTOMATED TEST | Existing Playwright coverage. |
| Checkout | Required fields and error handling | VERIFIED IN SOURCE | API validates customer and item input. |
| Checkout | Server-side product pricing | VERIFIED IN SOURCE | Prices are read from active products on the server. |
| Checkout | Successful order clears cart | FIXED | Cart is cleared after successful order creation. |
| Checkout | WhatsApp click-to-chat fallback | VERIFIED IN SOURCE | Uses configured admin number. |
| Orders | Order persistence | VERIFIED IN SOURCE | Customer, order and order items are created transaction-like with cleanup on failures. |
| Admin | Private route /sree | VERIFIED IN SOURCE | robots noindex + robots disallow. |
| Admin | Login errors do not leave spinner stuck | FIXED | Added try/catch/finally and visible Supabase errors. |
| Admin | Protected dashboard route | FIXED | Dedicated `/sree/dashboard` prevents route-group collision. |
| Admin | Product CRUD | VERIFIED IN SOURCE | RLS admin checks + UI management. |
| Admin | Collection CRUD | VERIFIED IN SOURCE | RLS admin checks + UI management. |
| Admin | Order status management | VERIFIED IN SOURCE | Admin-only policy. |
| Admin | Storage dashboard | VERIFIED IN SOURCE | Server-side service-role inspection with auth/role gate. |
| Storage | Product/collection upload size | FIXED | Client-side 5 MB guard added to match configured bucket limits. |
| AI | Missing fabric validation | AUTOMATED TEST | Existing Playwright coverage. |
| AI | Missing provider key | FIXED | UI now detects missing configuration before network request. |
| AI | AI response/provider errors | FIXED | Friendly 502 error path and output-storage validation. |
| AI | Session quota | VERIFIED IN SOURCE | 3 generations per session per 24 hours. |
| SEO | Site-wide title | FIXED | Default title `Svastida` with `%s | Svastida` template. |
| SEO | Sitemap | FIXED | Production URL env documented; active product and policy URLs included. |
| SEO | Robots | VERIFIED IN SOURCE | /sree excluded. |
| Loading | Branded loading state | ADDED | Placeholder is ready for final logo asset. |
| Errors | User-facing route error recovery | ADDED | Root error boundary provides Try again UI. |
| Security | Supabase RLS/advisor baseline | VERIFIED | RLS enabled; current security advisor has one Auth hardening warning. |
| Auth security | Leaked password protection | ACTION REQUIRED | Supabase advises enabling leaked-password protection. |
| Live browser QA | Full production click-through | BLOCKED | Current Vercel preview is protected by Vercel SSO, so external browser QA cannot access pages. |
| Final branding | Logo loading screen | PENDING ASSET | Awaiting final logo file. |
| Final branding | favicon (.ico) | PENDING ASSET | Awaiting final favicon/logo asset. |

## Production fixes committed during this audit

- Collection query reliability fix
- Admin login error/session handling
- Dedicated admin dashboard route
- Storefront API timeout/failure handling
- Filter-preserving pagination
- AI configuration guard
- AI provider/storage error handling
- Post-order cart clearing
- Production error recovery screen
- Product and collection upload size validation
- Contact link in desktop navigation
- Branded loading screen
- Site-wide metadata improvements
- Product/policy sitemap coverage

## Final live-audit requirement

Before client handoff, deploy the latest `main` commit to an externally accessible production URL. The production URL should not be protected by Vercel SSO while QA is running. Then execute the browser matrix again, including:

1. Home and all navigation links
2. Every active collection
3. Every active product
4. Search, price, size and sort combinations
5. Pagination
6. Add/update/remove cart
7. Invalid and valid checkout paths
8. Successful order persistence
9. WhatsApp fallback/API behavior
10. AI upload validation and successful generation
11. Admin login/logout
12. Admin CRUD for collection/product/order/settings
13. Mobile layout
14. Broken link/image checks
15. HTTP 4xx/5xx monitoring
16. Metadata, robots, sitemap, favicon and final logo

## Current data verification

- Active collections: 1
- Active products: 1
- Product images: 1
- Orders: 0
- AI generations: 0
- Site settings rows: 1
