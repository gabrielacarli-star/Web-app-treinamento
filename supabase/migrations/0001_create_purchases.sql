-- Purchases are keyed by the buyer's e-mail, because that is the only stable
-- identifier shared between the checkout platform and the person who later
-- logs in. Rows are written exclusively by the webhook (service role); the
-- signed-in user may only read their own.

create table public.purchases (
  id            uuid primary key default gen_random_uuid(),
  email         text not null,
  plan          text,
  status        text not null default 'active'
                check (status in ('active', 'refunded', 'chargeback', 'cancelled', 'expired')),
  transaction   text,
  product_id    text,
  purchased_at  timestamptz not null default now(),
  expires_at    timestamptz,
  raw           jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create or replace function public.normalize_purchase_email()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.email := lower(trim(new.email));
  new.updated_at := now();
  return new;
end;
$$;

create trigger purchases_normalize
  before insert or update on public.purchases
  for each row execute function public.normalize_purchase_email();

create unique index purchases_transaction_key
  on public.purchases (transaction)
  where transaction is not null;

create index purchases_email_idx on public.purchases (email);
create index purchases_email_status_idx on public.purchases (email, status);

alter table public.purchases enable row level security;

create policy purchases_select_own
  on public.purchases
  for select
  to authenticated
  using (email = lower(auth.jwt() ->> 'email'));
