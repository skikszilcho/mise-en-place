-- Migration 003: Row Level Security policies
-- RLS is the database-level authorisation layer. It is independent
-- of application logic — policies are enforced even if application
-- code is bypassed (e.g., via the Supabase dashboard or direct API).

-- ============================================================
-- profiles table
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read only their own profile
CREATE POLICY "profiles: select own"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update only their own profile
CREATE POLICY "profiles: update own"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- recipes table
-- ============================================================
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

-- Users can read only their own recipes
CREATE POLICY "recipes: select own"
  ON public.recipes
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert recipes for themselves only
-- WITH CHECK prevents inserting a row with someone else's user_id
CREATE POLICY "recipes: insert own"
  ON public.recipes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update only their own recipes
CREATE POLICY "recipes: update own"
  ON public.recipes
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete only their own recipes
CREATE POLICY "recipes: delete own"
  ON public.recipes
  FOR DELETE
  USING (auth.uid() = user_id);
