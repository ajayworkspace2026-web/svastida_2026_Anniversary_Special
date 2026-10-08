# Svastida setup

## 1. Local project

Install Node.js 22+ and run:

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and provide the Supabase values.

## 2. Supabase

Create a Supabase project.

Run migrations from `supabase/migrations/` in order using the Supabase SQL editor or Supabase CLI.

Create one Auth user for the store administrator. Then create its profile row:

```sql
insert into public.profiles (id, full_name, role)
values ('AUTH_USER_UUID', 'Store Admin', 'admin')
on conflict (id) do update set role = 'admin';
```

Do not put the service-role key in browser code or GitHub.

Private admin login uses the custom `/sree` route. Configure `SVASTIDA_ADMIN_ID` as `Svastida@2026` and set `SVASTIDA_ADMIN_EMAIL` to the email of the Supabase Auth account whose profile role is `admin`. Set the Supabase Auth password separately; do not commit passwords to GitHub.

## 3. Storage

The migration creates:
- `product-images`
- `collection-images`
- `ai-uploads` (private customer fabric uploads)
- `ai-designs` (generated design concepts)

The admin storage screen reports measured object sizes. The configured 16 GB value is only a dashboard limit. It does not change the storage quota supplied by the underlying provider.

## 4. Admin settings

After signing in:
- Set the business/brand name
- Set the admin WhatsApp number
- Set email/phone and social links
- Add the real About / Journey story
- Set the storage meter limit

## 5. WhatsApp

### Free launch mode
Set the admin WhatsApp number in Settings. Checkout creates a click-to-chat URL with the complete order message prefilled.

The customer still has to press Send inside WhatsApp. A website cannot silently send a WhatsApp message from the customer's account.

### Optional Cloud API mode
For server-side automatic delivery, configure:

```env
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_GRAPH_API_VERSION=v23.0
```

The server uses the WhatsApp Business Platform messages endpoint. Current Meta examples use the `/{Phone-Number-ID}/messages` endpoint with a bearer token. Template-based messaging may be required depending on the conversation state and WhatsApp policy.

The free click-to-chat fallback remains available if the API is not configured or rejects a message.

## 6. AI fashion designer

Configure:

```env
AI_PROVIDER_API_KEY=
AI_IMAGE_MODEL=gpt-image-2.5-flare
```

The AI key is server-only.

Customer flow:
1. Upload fabric image
2. Choose dress type, sleeves and neckline
3. Generate up to four concepts
4. Select one concept
5. Add it to the enquiry cart
6. Submit the enquiry/order

Uploaded fabric is stored privately. Generated concepts are stored separately.

AI output is a visual concept, not an exact sewing pattern or fit guarantee.

## 7. Validation

```bash
npm run lint
npx tsc --noEmit
npm run build
npm run test:e2e
```

The GitHub Actions workflow runs these checks automatically on pushes and pull requests to `main`.
