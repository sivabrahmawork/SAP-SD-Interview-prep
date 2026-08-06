-- ============================================================
-- GOOGLE OAUTH MIGRATION
-- Run this in Supabase SQL Editor after enabling Google in
-- Authentication > Providers.
--
-- Why this is needed: your email/password signup already inserts
-- a row into `profiles` manually (see signUp() in storage.js).
-- Google sign-ins skip that function entirely — Supabase creates
-- the auth.users row directly. Without this trigger, a Google
-- user would authenticate successfully but have no profile row,
-- and the app would break trying to read their name/preferences.
--
-- This trigger only fires for NON-email providers (Google, etc.)
-- so your existing email/password signup flow is untouched.
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_oauth_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only auto-create a profile for OAuth sign-ins (Google, etc.)
  -- Email/password signups already get their profile row from
  -- the app's signUp() function — skip those here to avoid a
  -- duplicate-key conflict.
  IF (NEW.raw_app_meta_data->>'provider') IS DISTINCT FROM 'email' THEN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        split_part(NEW.email, '@', 1)
      )
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_oauth ON auth.users;
CREATE TRIGGER on_auth_user_created_oauth
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_oauth_user();

-- Verify: after a Google sign-in, this should show their row
-- SELECT id, email, full_name FROM profiles ORDER BY created_at DESC LIMIT 5;
