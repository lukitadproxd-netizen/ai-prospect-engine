-- ============================================
-- MIGRATION: RLS Policies + Credits RPC
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Atomic credit increment function
CREATE OR REPLACE FUNCTION increment_credits_used(user_id_input UUID)
RETURNS void AS $$
BEGIN
  UPDATE users SET credits_used = COALESCE(credits_used, 0) + 1
  WHERE id = user_id_input;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies (avoid duplicates)
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can view own campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can create own campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can update own campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can view own leads" ON leads;
DROP POLICY IF EXISTS "Users can update own leads" ON leads;
DROP POLICY IF EXISTS "Users can insert leads" ON leads;

-- 4. Users table (each user sees only their own profile)
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- 5. Campaigns table (each user sees only their own campaigns)
CREATE POLICY "Users can view own campaigns" ON campaigns
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own campaigns" ON campaigns
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own campaigns" ON campaigns
  FOR UPDATE USING (auth.uid() = user_id);

-- 6. Leads table (users see leads from their campaigns only)
CREATE POLICY "Users can view own leads" ON leads
  FOR SELECT USING (
    campaign_id IN (SELECT id FROM campaigns WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can insert leads" ON leads
  FOR INSERT WITH CHECK (
    campaign_id IN (SELECT id FROM campaigns WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update own leads" ON leads
  FOR UPDATE USING (
    campaign_id IN (SELECT id FROM campaigns WHERE user_id = auth.uid())
  );

-- 7. Fix credits: set credits_used = 1 for user who already has 1 campaign
UPDATE users SET credits_used = 1 WHERE credits_used IS NULL OR credits_used = 0;
