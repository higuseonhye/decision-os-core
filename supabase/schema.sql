-- Decision OS Core - Deal Gate MVP schema
create extension if not exists "pgcrypto";

create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists deals (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  company_name text not null,
  contact_name text not null,
  deal_type text not null check (deal_type in ('customer', 'partner', 'vendor', 'pilot')),
  expected_revenue numeric not null default 0,
  strategic_value int not null check (strategic_value between 1 and 10),
  complexity int not null check (complexity between 1 and 10),
  logo_value int not null check (logo_value between 1 and 10),
  payment_risk int not null check (payment_risk between 1 and 10),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists decisions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  deal_id uuid not null unique references deals(id) on delete cascade,
  deal_score int not null,
  risk_score int not null,
  recommendation text not null check (recommendation in ('APPROVE', 'REJECT', 'RENEGOTIATE', 'REVIEW_MANUALLY')),
  reasoning_json jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists outcomes (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null unique references deals(id) on delete cascade,
  status text not null check (status in ('won', 'lost', 'bad_fit', 'delayed', 'pending')),
  notes text,
  updated_at timestamptz not null default now()
);

create index if not exists idx_deals_org_created_at on deals(org_id, created_at desc);
create index if not exists idx_decisions_org_created_at on decisions(org_id, created_at desc);
create index if not exists idx_outcomes_deal_id on outcomes(deal_id);

alter table organizations enable row level security;
alter table deals enable row level security;
alter table decisions enable row level security;
alter table outcomes enable row level security;

create policy "org owner can manage org"
on organizations
for all
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

create policy "org members can manage deals"
on deals
for all
using (
  exists (
    select 1 from organizations o
    where o.id = deals.org_id and o.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from organizations o
    where o.id = deals.org_id and o.owner_id = auth.uid()
  )
);

create policy "org members can manage decisions"
on decisions
for all
using (
  exists (
    select 1 from organizations o
    where o.id = decisions.org_id and o.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from organizations o
    where o.id = decisions.org_id and o.owner_id = auth.uid()
  )
);

create policy "org members can manage outcomes"
on outcomes
for all
using (
  exists (
    select 1
    from deals d
    join organizations o on o.id = d.org_id
    where d.id = outcomes.deal_id and o.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from deals d
    join organizations o on o.id = d.org_id
    where d.id = outcomes.deal_id and o.owner_id = auth.uid()
  )
);
