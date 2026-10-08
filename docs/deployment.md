# Svastida deployment runbook

## 1. Supabase

Create a Supabase project and run every SQL file in `supabase/migrations/` in filename order.

Create one Supabase Auth account for the administrator. After the account exists, run:

```sql
insert into public.profiles (id, full_name, role)
values ('AUTH_USER_UUID', 'Store Admin', 'admin')
on conflict (id) do update
set role = 'admin';
```

Do not expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.

## 2. Vercel

Import the GitHub repository into Vercel as a Next.js project.

No custom build command is required. Use:
- Build: `npm run build`
- Install: `npm install`
- Node.js: 22.x or later

Add these environment variables in Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=

WHATSAPP_ADMIN_NUMBER=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_GRAPH_API_VERSION=v23.0

AI_PROVIDER_API_KEY=
AI_IMAGE_MODEL=
AI_PROVIDER_BASE_URL=
```

Only `NEXT_PUBLIC_*` variables are intended for the browser.

## 3. First production setup

1. Open the deployed site.
2. Sign in at `/admin/login`.
3. Confirm the administrator can open the protected dashboard.
4. Configure the brand/contact/about settings.
5. Create at least one collection.
6. Create at least one active product with an image.
7. Open that product from the customer storefront.
8. Add the product to cart.
9. Submit a test enquiry.
10. Confirm the order appears in `/admin/orders`.
11. Confirm the WhatsApp click-to-chat message contains the order number and item details.
12. Test the AI designer only after the AI provider key is configured.

## 4. WhatsApp launch modes

The website always supports click-to-chat when an admin WhatsApp number exists.

For automatic server-side delivery, configure the Cloud API values. Keep the click-to-chat fallback enabled so checkout still works when the API is unavailable.

## 5. AI launch checks

Verify:
- JPG/PNG/WebP uploads work
- files above the configured limit are rejected
- no AI key is exposed to client code
- generation quota is enforced
- generated designs are saved separately from private customer fabric uploads
- the selected concept can be added to the enquiry cart

## 6. Production QA

Run:

```bash
npm run lint
npx tsc --noEmit
npm run build
npm run test:e2e
```

GitHub Actions runs the same validation on pushes and pull requests to `main`.

## 7. Provider-dependent limits

The admin storage meter is an application-level reporting limit. It does not increase the storage capacity supplied by the provider.

AI model availability and WhatsApp API permissions depend on the external provider accounts and credentials configured at deployment time.
