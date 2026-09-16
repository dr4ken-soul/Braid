create extension if not exists pgcrypto;

create table if not exists cases (
  id uuid primary key default gen_random_uuid(),
  external_reference text not null,
  status text not null default 'intake' check (status in ('intake', 'review', 'handoff', 'closed')),
  language text not null default 'en' check (language in ('en', 'ar')),
  claimant_display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(id) on delete cascade,
  elevenlabs_conversation_id text unique,
  channel text not null default 'voice' check (channel in ('voice', 'web')),
  started_at timestamptz,
  ended_at timestamptz,
  transcript_status text not null default 'pending' check (transcript_status in ('pending', 'complete', 'failed')),
  created_at timestamptz not null default now()
);

create table if not exists transcript_segments (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  speaker text not null check (speaker in ('agent', 'claimant', 'system')),
  sequence_number integer not null,
  text_content text not null,
  start_ms integer,
  end_ms integer,
  created_at timestamptz not null default now(),
  unique (conversation_id, sequence_number)
);

create table if not exists evidence_items (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(id) on delete cascade,
  category text not null check (category in ('incident', 'policy', 'damage', 'identity', 'timeline', 'contact')),
  field_key text not null,
  value_text text not null,
  confidence numeric(4,3) check (confidence >= 0 and confidence <= 1),
  source_type text not null check (source_type in ('claimant', 'policy_record', 'repair_record', 'operator')),
  source_reference text,
  created_at timestamptz not null default now()
);

create table if not exists source_records (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(id) on delete cascade,
  record_type text not null check (record_type in ('claim', 'policy', 'repair')),
  provider_reference text not null,
  payload jsonb not null default '{}'::jsonb,
  retrieved_at timestamptz not null default now()
);

create table if not exists contradictions (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(id) on delete cascade,
  field_key text not null,
  severity text not null check (severity in ('low', 'medium', 'high')),
  left_value text not null,
  right_value text not null,
  rationale text not null,
  status text not null default 'open' check (status in ('open', 'acknowledged', 'resolved', 'escalated')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists handoffs (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(id) on delete cascade,
  destination text not null default 'adjuster_queue',
  reason text not null,
  packet jsonb not null default '{}'::jsonb,
  created_by text not null check (created_by in ('agent', 'operator')),
  created_at timestamptz not null default now()
);

create table if not exists tool_calls (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete set null,
  tool_name text not null,
  request_payload jsonb not null default '{}'::jsonb,
  response_payload jsonb,
  outcome text not null check (outcome in ('allowed', 'blocked', 'failed')),
  created_at timestamptz not null default now()
);

create index if not exists cases_status_idx on cases(status);
create index if not exists conversations_case_id_idx on conversations(case_id);
create index if not exists transcript_segments_conversation_id_idx on transcript_segments(conversation_id, sequence_number);
create index if not exists evidence_items_case_id_idx on evidence_items(case_id);
create index if not exists contradictions_case_id_idx on contradictions(case_id, status);
create index if not exists handoffs_case_id_idx on handoffs(case_id, created_at desc);
