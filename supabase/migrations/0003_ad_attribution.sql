-- Adds what's needed to compute ROAS: the UTM/click-id a lead arrived with,
-- the amount actually paid, and a place to store synced Meta Ads spend.
-- Purely additive -- nothing here changes existing columns or behavior.

-- quiz_leads is created outside version control (see README), so this only
-- adds columns and is a no-op if the table is somehow missing.
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'quiz_leads') then
    alter table public.quiz_leads
      add column if not exists utm_source   text,
      add column if not exists utm_medium   text,
      add column if not exists utm_campaign text,
      add column if not exists utm_content  text,
      add column if not exists utm_term     text,
      add column if not exists fbclid       text,
      add column if not exists gclid        text;
  end if;
end $$;

alter table public.purchases
  add column if not exists amount_cents integer,
  add column if not exists currency     text,
  add column if not exists utm_source   text,
  add column if not exists utm_campaign text,
  add column if not exists utm_content  text,
  add column if not exists fbclid       text,
  add column if not exists campaign_id  text,
  add column if not exists ad_id        text;

create index if not exists purchases_campaign_idx on public.purchases (campaign_id);

-- Daily ad spend synced from the Meta Marketing API. Service-role only,
-- same reasoning as webhook_events: this is cost/revenue data, not
-- something a signed-in buyer has any business reading.
create table public.ad_insights (
  platform      text not null default 'meta',
  date          text not null,             -- YYYY-MM-DD
  account_id    text not null,
  campaign_id   text,
  campaign_name text,
  adset_id      text,
  ad_id         text not null,
  ad_name       text,
  spend_cents   integer not null default 0,
  impressions   integer not null default 0,
  clicks        integer not null default 0,
  currency      text,
  updated_at    timestamptz not null default now(),
  primary key (platform, ad_id, date)
);

create index ad_insights_date_idx on public.ad_insights (date);
create index ad_insights_campaign_idx on public.ad_insights (campaign_id, date);

alter table public.ad_insights enable row level security;

comment on table public.ad_insights is
  'Daily Meta Ads spend, synced by /api/cron/sync-meta. RLS on with no policies: service-role only.';
