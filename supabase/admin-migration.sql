-- ============================================================
-- ADMIN ACCESS MIGRATION
-- Run this in Supabase SQL Editor AFTER your main schema.sql
-- This adds an is_admin flag and lets that one user read everyone's data
-- ============================================================

-- 1. Add admin flag column (defaults to false for everyone)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- 2. New RLS policies: allow SELECT for own row OR if the requester is flagged admin
-- (Postgres evaluates policies with OR, so these ADD to the existing "own data" policies —
--  they don't replace them. Regular users still only see their own data.)

CREATE POLICY "Admin can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

CREATE POLICY "Admin can view all results" ON quiz_results
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

CREATE POLICY "Admin can view all feedback" ON feedback
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- ============================================================
-- 3. MANUAL STEP — run this ONE line yourself, replacing the email:
-- Flip the switch for your own account only. Do this AFTER you've
-- signed up on the live site with the account you want as admin.
-- ============================================================

-- UPDATE profiles SET is_admin = TRUE WHERE email = 'sivabrahmawork@email.com';

-- To verify it worked:
-- SELECT id, email, is_admin FROM profiles WHERE is_admin = TRUE;
