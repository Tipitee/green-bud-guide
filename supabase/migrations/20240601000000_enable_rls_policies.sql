-- RLS Policies for social-club-map
-- Run this in the Supabase SQL Editor: https://app.supabase.com → SQL Editor
-- These policies are idempotent (safe to run multiple times)

-- ============================================================
-- Enable Row Level Security on all tables
-- ============================================================
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strains ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- CLUBS — public read, no write for regular users
-- ============================================================
DROP POLICY IF EXISTS "clubs_public_read" ON public.clubs;
CREATE POLICY "clubs_public_read"
  ON public.clubs
  FOR SELECT
  USING (true);

-- ============================================================
-- STRAINS — public read, admin write only
-- ============================================================
DROP POLICY IF EXISTS "strains_public_read" ON public.strains;
CREATE POLICY "strains_public_read"
  ON public.strains
  FOR SELECT
  USING (true);

-- ============================================================
-- JOURNAL ENTRIES — users can only access their own entries
-- ============================================================
DROP POLICY IF EXISTS "journal_entries_owner_select" ON public.journal_entries;
CREATE POLICY "journal_entries_owner_select"
  ON public.journal_entries
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "journal_entries_owner_insert" ON public.journal_entries;
CREATE POLICY "journal_entries_owner_insert"
  ON public.journal_entries
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "journal_entries_owner_update" ON public.journal_entries;
CREATE POLICY "journal_entries_owner_update"
  ON public.journal_entries
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "journal_entries_owner_delete" ON public.journal_entries;
CREATE POLICY "journal_entries_owner_delete"
  ON public.journal_entries
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- PROFILES — users can only read/update their own profile
-- ============================================================
DROP POLICY IF EXISTS "profiles_owner_select" ON public.profiles;
CREATE POLICY "profiles_owner_select"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_owner_insert" ON public.profiles;
CREATE POLICY "profiles_owner_insert"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_owner_update" ON public.profiles;
CREATE POLICY "profiles_owner_update"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- Verify RLS is active (run after applying policies)
-- ============================================================
-- SELECT schemaname, tablename, rowsecurity
-- FROM pg_tables
-- WHERE schemaname = 'public'
-- ORDER BY tablename;
