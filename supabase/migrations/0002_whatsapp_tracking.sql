alter table public.orders
  add column if not exists whatsapp_api_sent_at timestamptz,
  add column if not exists whatsapp_api_message_id text,
  add column if not exists whatsapp_api_error text;

create index if not exists orders_whatsapp_api_sent_idx
  on public.orders(whatsapp_api_sent_at desc);
