-- Braid audit and workflow detail extensions.
-- Extends the approved initial schema with workflow node metadata,
-- contradiction source labelling, tool call case linkage, and the
-- evaluation, redaction, and system event tables required by the blueprint.

alter table transcript_segments
  add column if not exists node text,
  add column if not exists language text default 'en';

alter table contradictions
  add column if not exists left_source text,
  add column if not exists right_source text,
  add column if not exists left_reference text,
  add column if not exists right_reference text;

alter table tool_calls
  add column if not exists case_id uuid references cases(id) on delete cascade,
  add column if not exists offset_ms integer,
  add column if not exists latency_ms integer;

create table if not exists evaluations (
  id uuid primary key default gen_random_uuid(),
  scenario_id text not null unique,
  name text not null,
  language text not null check (language in ('en', 'ar')),
  category text not null check (category in ('intake', 'guardrail', 'tool-gate')),
  agent_version text not null,
  runs jsonb not null default '[]'::jsonb,
  pass_rate numeric(4,3) not null check (pass_rate >= 0 and pass_rate <= 1),
  transcript_ref text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists redaction_events (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references cases(id) on delete cascade,
  field text not null,
  action text not null default 'masked',
  view text not null,
  created_at timestamptz not null default now()
);

create table if not exists system_events (
  id uuid primary key default gen_random_uuid(),
  kind text not null,
  message text not null,
  case_id uuid references cases(id) on delete cascade,
  payload jsonb,
  created_at timestamptz not null default now()
);

create index if not exists evaluations_scenario_idx on evaluations(scenario_id);
create index if not exists tool_calls_case_idx on tool_calls(case_id);
create index if not exists redaction_events_case_idx on redaction_events(case_id);
create index if not exists system_events_case_idx on system_events(case_id);
