-- Migration 001: profiles table
-- Extends auth.users with application-level profile data.
-- A trigger auto-creates a profiles row whenever a new user registers.

-- ============================================================
-- 1. profiles table
-- ============================================================
CREATE TABLE public.profiles (
  id           uuid         PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username     text,
  avatar_url   text,
  created_at   timestamptz  DEFAULT now() NOT NULL
);

-- ============================================================
-- 2. Trigger function — runs as SECURITY DEFINER so it has
--    permission to insert into profiles on behalf of the new
--    auth.users row.
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

-- ============================================================
-- 3. Trigger — fires after every new auth.users INSERT
-- ============================================================
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
