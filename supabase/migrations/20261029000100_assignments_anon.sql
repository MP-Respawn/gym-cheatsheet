/*
 * 20261029000100_assignments_anon.sql
 *
 * Logged-out visitors (anon) get nothing, as for every other table
 * (20261026000100_security.sql). The assignment tables were created after
 * that revoke, so Supabase's default grants had given anon access to them
 * (RLS still returned no rows, but the tables should refuse outright).
 */
revoke all on public.program_assignments, public.assignment_steps from anon;
