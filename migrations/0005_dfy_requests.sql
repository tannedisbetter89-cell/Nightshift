-- Done-for-you intake requests: one per paid order that contains the
-- $59 Done-For-You service product. The buyer fills the form on the
-- success page; the operator fills the template and marks it delivered
-- in /desk. Follows the repo conventions: snake_case, TEXT ids, JSONB
-- details, one transaction, recorded in _migrations.

create table if not exists dfy_requests (
  id text primary key,
  order_id text not null unique references orders(id),
  product_id text not null references products(id),
  customer_email text,
  details jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'delivered')),
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists dfy_requests_created_idx on dfy_requests (created_at desc);
