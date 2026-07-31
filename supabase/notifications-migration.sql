-- ============================================================
-- NOTIFICATIONS MIGRATION
-- Run this in Supabase SQL Editor (after schema.sql and admin-migration.sql)
-- Adds notification preference columns to the profiles table.
-- ============================================================

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notifications_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS question_notif_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS question_notif_module TEXT DEFAULT 'SAP SD';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS question_notif_difficulty TEXT DEFAULT 'easy'
  CHECK (question_notif_difficulty IN ('easy','medium','hard'));

-- Existing users created before this migration automatically get these
-- default values (FALSE / FALSE / 'SAP SD' / 'easy') as soon as this
-- migration runs — Postgres backfills the DEFAULT for existing rows too.

-- Verify:
-- SELECT email, notifications_enabled, question_notif_enabled, question_notif_module, question_notif_difficulty FROM profiles LIMIT 5;
