/*
 * 20261031000000_assistant.sql
 *
 * The routine assistant (supabase/functions/routine-assistant): a coach
 * chats with Claude to put a routine together. Two modes, to try both with
 * INCA: "coach" (Claude Sonnet 5.5 with a personal-trainer skill) and
 * "catalog" (Claude Haiku 5.5 grounded on our exercise catalog).
 *
 * assistant_usage counts each coach's messages and tokens per day and mode:
 * the function uses it for a daily limit, and it tells what each mode really
 * costs. Only the function writes it (with the service role, which skips
 * these permissions); a coach reads their own rows, the superadmin all.
 */
create table public.assistant_usage (
  coach_id          uuid not null references public.profiles (id) on delete cascade,
  day               date not null default current_date,
  mode              text not null check (mode in ('coach', 'catalog')),
  messages          int not null default 0,
  input_tokens      bigint not null default 0,
  output_tokens     bigint not null default 0,
  cache_read_tokens bigint not null default 0,
  cache_write_tokens bigint not null default 0,
  primary key (coach_id, day, mode)
);

revoke all on public.assistant_usage from anon;
revoke insert, update, delete on public.assistant_usage from authenticated;

alter table public.assistant_usage enable row level security;

create policy "assistant_usage: read own, or all as superadmin"
  on public.assistant_usage for select to authenticated
  using (coach_id = auth.uid() or private.is_superadmin());
