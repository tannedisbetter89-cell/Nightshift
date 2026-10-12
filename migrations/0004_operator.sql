-- Operator sessions for the private /desk dashboard.
--
-- Single-operator model: a session row is created at login (after the
-- OPERATOR_PASSWORD check) and the token is held in an httpOnly cookie.
-- All /desk server functions require a live session row — never just
-- the presence of a cookie, and never client-side checks alone.

create table if not exists operator_sessions (
  token text primary key,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);
create index if not exists operator_sessions_expires_idx on operator_sessions (expires_at);
