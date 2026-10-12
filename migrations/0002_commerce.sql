-- Nightshift commerce schema: products, orders, payments, fulfillment, ledger.
--
-- Conventions (match this repo):
--   * snake_case table/column names; TEXT ids like 'prod_…', 'ord_…', 'pay_…'
--   * money as INTEGER cents + explicit 3-letter currency (never floats)
--   * every file runs once inside a transaction, recorded in _migrations
--   * applied to Neon on Vercel build AND to the local PGLite fallback —
--     keep the SQL to standard Postgres both understand.
--
-- State machines:
--   orders.status:    pending → paid | canceled | failed ; paid → refunded | partially_refunded
--   payments.status:  created → approved → captured | failed | canceled ; captured → refunded | partially_refunded
--   fulfillments.status: pending → delivered | failed   (retries stay idempotent)
--
-- Idempotency guards (the money rules):
--   * orders.paypal_order_id UNIQUE  — one PayPal order becomes one Nightshift order
--   * payments.provider_capture_id UNIQUE — a capture can never be recorded twice
--   * payments.idempotency_key UNIQUE — safe client retries of capture
--   * fulfillments UNIQUE(order_id, product_id) — each item is delivered exactly once
--   * ledger_entries UNIQUE(payment_id, kind) — retries never double-count revenue

create table if not exists products (
  id text primary key,
  slug text not null unique,
  title text not null,
  tagline text not null default '',
  niche text not null default '',
  type text not null,
  price_cents integer not null check (price_cents >= 0),
  currency char(3) not null default 'USD',
  audience text not null default '',
  listed boolean not null default false,
  source text not null default 'operator',
  sales_page text not null default '',
  sections jsonb not null default '[]',
  tags jsonb not null default '[]',
  -- Deliverable descriptor resolved at fulfillment time, e.g.
  -- {"kind":"file","path":"vault/teddy-pack.pdf"} or {"kind":"url","url":"https://…"}.
  -- Never a public URL: fulfillment mints expiring tokens instead.
  deliverable jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists products_listed_idx on products (listed) where listed = true;

-- Immutable snapshots: an order pins the exact title/price the customer paid,
-- so later product edits never rewrite history.
create table if not exists product_versions (
  id text primary key,
  product_id text not null references products (id) on delete restrict,
  version integer not null,
  title text not null,
  price_cents integer not null check (price_cents >= 0),
  currency char(3) not null default 'USD',
  snapshot jsonb not null,
  created_at timestamptz not null default now(),
  unique (product_id, version)
);

create table if not exists orders (
  id text primary key,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'canceled', 'failed', 'refunded', 'partially_refunded')),
  currency char(3) not null default 'USD',
  subtotal_cents integer not null default 0 check (subtotal_cents >= 0),
  total_cents integer not null check (total_cents >= 0),
  -- Contact kept minimal: needed for delivery + receipts only.
  customer_email text,
  customer_name text,
  paypal_order_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists orders_status_idx on orders (status);
create index if not exists orders_created_idx on orders (created_at desc);

create table if not exists order_items (
  id text primary key,
  order_id text not null references orders (id) on delete cascade,
  product_id text not null references products (id) on delete restrict,
  product_version_id text references product_versions (id) on delete restrict,
  title text not null,
  unit_price_cents integer not null check (unit_price_cents >= 0),
  quantity integer not null default 1 check (quantity > 0),
  unique (order_id, product_id)
);

create table if not exists payments (
  id text primary key,
  order_id text not null references orders (id) on delete cascade,
  provider text not null default 'paypal',
  provider_order_id text not null,
  provider_capture_id text unique,
  amount_cents integer not null check (amount_cents >= 0),
  currency char(3) not null default 'USD',
  status text not null default 'created'
    check (status in ('created', 'approved', 'captured', 'failed', 'canceled', 'refunded', 'partially_refunded')),
  -- Provider response payload for diagnostics. Never secrets.
  raw jsonb not null default '{}',
  idempotency_key text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists payments_order_idx on payments (order_id);
create index if not exists payments_provider_order_idx on payments (provider_order_id);

create table if not exists fulfillments (
  id text primary key,
  order_id text not null references orders (id) on delete cascade,
  product_id text not null references products (id) on delete restrict,
  status text not null default 'pending'
    check (status in ('pending', 'delivered', 'failed')),
  attempts integer not null default 0 check (attempts >= 0),
  delivered_at timestamptz,
  -- Expiring, single-purpose download token. Null until issued.
  delivery_token text unique,
  token_expires_at timestamptz,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (order_id, product_id)
);
create index if not exists fulfillments_status_idx on fulfillments (status);

-- Append-only sales ledger. Rows are written by the payment-capture and
-- refund flows only — never hand-edited. Reports sum this table.
create table if not exists ledger_entries (
  id text primary key,
  order_id text not null references orders (id) on delete cascade,
  payment_id text references payments (id) on delete set null,
  kind text not null
    check (kind in ('sale', 'refund', 'partial_refund', 'fee', 'adjustment')),
  -- Signed: sales positive, refunds/fees negative.
  amount_cents integer not null,
  currency char(3) not null default 'USD',
  description text not null default '',
  occurred_at timestamptz not null default now(),
  unique (payment_id, kind)
);
create index if not exists ledger_occurred_idx on ledger_entries (occurred_at desc);
create index if not exists ledger_order_idx on ledger_entries (order_id);

-- Operator audit trail for financially significant actions.
create table if not exists audit_events (
  id text primary key,
  actor_user_id text,
  action text not null,
  entity text not null,
  detail jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index if not exists audit_created_idx on audit_events (created_at desc);
