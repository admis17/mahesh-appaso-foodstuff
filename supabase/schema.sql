-- Mahesh Rice Trading — database for the site content and the enquiry inbox.
-- Run once in the Supabase SQL editor (then seed.sql). Safe to re-run: it drops nothing,
-- and uses "if not exists" / "or replace" throughout.
--
-- Access model (row-level security):
--   • Visitors (anon key)  → read published content; submit enquiries (cannot read them back).
--   • Admins               → read and write everything. An admin is a Supabase Auth user whose
--                            id is listed in public.admins — signing up alone grants nothing.

-- ── Admins ──────────────────────────────────────────────────────────────────────────────────
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);

-- security definer so policies can consult admins without exposing the table to everyone.
create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.admins where user_id = auth.uid()) $$;

-- Keep updated_at current on every edit.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$ begin new.updated_at := now(); return new; end $$;

-- ── Products ────────────────────────────────────────────────────────────────────────────────
create table if not exists public.products (
  id           text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  entry        text not null,
  name         text not null check (char_length(name) between 1 and 120),
  short_name   text not null check (char_length(short_name) between 1 and 40),
  category     text not null check (category in ('rice', 'pulses')),
  subcategory  text not null,
  origin       text not null default 'India',
  processing   text not null default '',
  specs        text[] not null default '{}',
  packaging    text[] not null default '{}',
  markets      text[] not null default '{}',
  status       text not null default 'active' check (status in ('active', 'hidden')),
  verification text not null default 'SOURCE VERIFIED',
  sort         integer not null default 0,
  updated_at   timestamptz not null default now()
);

-- ── Testimonials ────────────────────────────────────────────────────────────────────────────
create table if not exists public.testimonials (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(name) between 1 and 80),
  location   text not null default '',
  quote      text not null check (char_length(quote) between 1 and 600),
  published  boolean not null default true,
  sort       integer not null default 0,
  updated_at timestamptz not null default now()
);

-- ── Regions (Global Reach cards + route map) ────────────────────────────────────────────────
create table if not exists public.regions (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(name) between 1 and 40),
  countries  text not null default '',
  lon        double precision not null check (lon between -180 and 180),
  lat        double precision not null check (lat between -90 and 90),
  map_label  text not null default 'above' check (map_label in ('above', 'below')),
  sort       integer not null default 0,
  updated_at timestamptz not null default now()
);

-- ── Company settings (single row) ───────────────────────────────────────────────────────────
create table if not exists public.settings (
  id         integer primary key default 1 check (id = 1),
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ── Enquiries (the inbox) ───────────────────────────────────────────────────────────────────
create table if not exists public.enquiries (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name       text not null check (char_length(name) between 1 and 120),
  company    text check (char_length(company) <= 160),
  email      text not null check (char_length(email) <= 200 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone      text check (char_length(phone) <= 40),
  product    text check (char_length(product) <= 200),
  message    text not null check (char_length(message) between 1 and 4000),
  channel    text check (channel in ('whatsapp', 'email')),
  page       text check (char_length(page) <= 200),
  status     text not null default 'new' check (status in ('new', 'contacted', 'quoted', 'won', 'lost', 'spam')),
  notes      text check (char_length(notes) <= 4000),
  updated_at timestamptz not null default now()
);
create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);
create index if not exists enquiries_status_idx on public.enquiries (status);

-- updated_at triggers
do $$
declare t text;
begin
  foreach t in array array['products', 'testimonials', 'regions', 'settings', 'enquiries'] loop
    execute format('drop trigger if exists touch_%1$s on public.%1$s', t);
    execute format('create trigger touch_%1$s before update on public.%1$s for each row execute function public.touch_updated_at()', t);
  end loop;
end $$;

-- ── Row-level security ──────────────────────────────────────────────────────────────────────
alter table public.admins       enable row level security;
alter table public.products     enable row level security;
alter table public.testimonials enable row level security;
alter table public.regions      enable row level security;
alter table public.settings     enable row level security;
alter table public.enquiries    enable row level security;

-- Policies are dropped and recreated so this file can be re-run after edits.
drop policy if exists "admins: see own row"        on public.admins;
drop policy if exists "products: public read"      on public.products;
drop policy if exists "products: admin write"      on public.products;
drop policy if exists "testimonials: public read"  on public.testimonials;
drop policy if exists "testimonials: admin write"  on public.testimonials;
drop policy if exists "regions: public read"       on public.regions;
drop policy if exists "regions: admin write"       on public.regions;
drop policy if exists "settings: public read"      on public.settings;
drop policy if exists "settings: admin write"      on public.settings;
drop policy if exists "enquiries: anyone submits"  on public.enquiries;
drop policy if exists "enquiries: admin read"      on public.enquiries;
drop policy if exists "enquiries: admin update"    on public.enquiries;
drop policy if exists "enquiries: admin delete"    on public.enquiries;

-- The admin app checks membership by reading its own row.
create policy "admins: see own row" on public.admins
  for select to authenticated using (user_id = auth.uid());

-- Content: everyone reads what's published; admins also see hidden items and can write.
create policy "products: public read" on public.products
  for select to anon, authenticated using (status = 'active' or public.is_admin());
create policy "products: admin write" on public.products
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "testimonials: public read" on public.testimonials
  for select to anon, authenticated using (published or public.is_admin());
create policy "testimonials: admin write" on public.testimonials
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "regions: public read" on public.regions
  for select to anon, authenticated using (true);
create policy "regions: admin write" on public.regions
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "settings: public read" on public.settings
  for select to anon, authenticated using (true);
create policy "settings: admin write" on public.settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Enquiries: anyone may submit a fresh one; only admins can read, triage or delete.
create policy "enquiries: anyone submits" on public.enquiries
  for insert to anon, authenticated with check (status = 'new' and notes is null);
create policy "enquiries: admin read" on public.enquiries
  for select to authenticated using (public.is_admin());
create policy "enquiries: admin update" on public.enquiries
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "enquiries: admin delete" on public.enquiries
  for delete to authenticated using (public.is_admin());
