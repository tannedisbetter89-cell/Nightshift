-- Product deliverable files, stored in the database so downloads work
-- identically on Neon, PGLite, and Vercel serverless (no filesystem or
-- external storage assumptions).
--
-- Files are NEVER served statically. The only way out is the authorized
-- download route, which checks an expiring per-fulfillment token and the
-- order's paid status before streaming bytes.

create table if not exists deliverable_files (
  product_id text primary key references products (id) on delete cascade,
  filename text not null,
  mime_type text not null default 'application/octet-stream',
  size_bytes integer not null check (size_bytes >= 0),
  data bytea not null,
  uploaded_at timestamptz not null default now()
);
