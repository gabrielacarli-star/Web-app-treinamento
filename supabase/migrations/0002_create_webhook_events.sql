-- Every webhook delivery is stored verbatim before it is interpreted. The
-- checkout platform's payload shape varies by version and event, so this is
-- what makes a mis-parsed delivery recoverable instead of lost.

create table public.webhook_events (
  id           uuid primary key default gen_random_uuid(),
  source       text not null default 'hotmart',
  event        text,
  transaction  text,
  email        text,
  handled      boolean not null default false,
  error        text,
  payload      jsonb not null,
  received_at  timestamptz not null default now()
);

create index webhook_events_received_idx on public.webhook_events (received_at desc);
create index webhook_events_event_idx on public.webhook_events (event);
create index webhook_events_handled_idx on public.webhook_events (handled) where not handled;

alter table public.webhook_events enable row level security;

comment on table public.webhook_events is
  'Raw checkout webhook deliveries. RLS is on with no policies on purpose: only the service role may read or write this table.';
