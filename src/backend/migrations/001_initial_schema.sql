-- Migration: 001_initial_schema
-- Description: Create initial database schema for Archetect
-- Created: 2025-11-18

-- ============================================================================
-- EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE subscription_tier AS ENUM ('free', 'professional', 'enterprise');
CREATE TYPE oauth_provider AS ENUM ('google', 'github', 'linkedin');
CREATE TYPE profile_approach AS ENUM ('astrological', 'big_five');
CREATE TYPE crm_type AS ENUM ('hubspot', 'salesforce', 'pipedrive');

-- ============================================================================
-- USERS TABLE
-- ============================================================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  subscription_tier subscription_tier DEFAULT 'free',
  oauth_provider oauth_provider,
  oauth_id VARCHAR(255),
  email_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,

  CONSTRAINT oauth_unique UNIQUE (oauth_provider, oauth_id)
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_oauth ON users(oauth_provider, oauth_id);
CREATE INDEX idx_users_subscription ON users(subscription_tier);

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  approach profile_approach NOT NULL,

  -- Astrological approach data
  birth_date DATE,
  birth_time TIME,
  birth_location_lat DECIMAL(10, 8),
  birth_location_lon DECIMAL(11, 8),
  birth_location_city VARCHAR(255),
  birth_location_timezone VARCHAR(100),
  sidereal_data JSONB,

  -- Big Five approach data
  big_five_traits JSONB,
  questionnaire_responses JSONB,

  -- Common output (both approaches)
  personality_type VARCHAR(100) NOT NULL,
  energy_style VARCHAR(50),
  flow_mode VARCHAR(50),
  season_name VARCHAR(50),
  season_number INTEGER,
  discipline_type VARCHAR(100),

  communication_style JSONB NOT NULL,
  work_environment_fit JSONB,
  meeting_prep JSONB,

  confidence_score DECIMAL(3, 2) NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT check_approach_data CHECK (
    (approach = 'astrological' AND birth_date IS NOT NULL AND birth_time IS NOT NULL) OR
    (approach = 'big_five' AND big_five_traits IS NOT NULL)
  )
);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_personality_type ON profiles(personality_type);
CREATE INDEX idx_profiles_approach ON profiles(approach);
CREATE INDEX idx_profiles_created_at ON profiles(created_at DESC);

-- ============================================================================
-- TEAMS TABLE
-- ============================================================================

CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_teams_owner_id ON teams(owner_id);

-- ============================================================================
-- TEAM MEMBERS TABLE
-- ============================================================================

CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(100),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT team_member_unique UNIQUE (team_id, user_id)
);

CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);

-- ============================================================================
-- TEAM COMPATIBILITY TABLE
-- ============================================================================

CREATE TABLE team_compatibility (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_1_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_2_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  compatibility_score DECIMAL(3, 2) NOT NULL CHECK (compatibility_score >= 0 AND compatibility_score <= 1),
  complementarity VARCHAR(100),
  recommendations JSONB,
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT check_different_users CHECK (user_1_id != user_2_id),
  CONSTRAINT unique_team_pair UNIQUE (
    LEAST(user_1_id, user_2_id),
    GREATEST(user_1_id, user_2_id)
  )
);

CREATE INDEX idx_team_compatibility_users ON team_compatibility(user_1_id, user_2_id);

-- ============================================================================
-- CRM INTEGRATIONS TABLE
-- ============================================================================

CREATE TABLE crm_integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  crm_type crm_type NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  sync_enabled BOOLEAN DEFAULT TRUE,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_status VARCHAR(50),
  sync_error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT user_crm_unique UNIQUE (user_id, crm_type)
);

CREATE INDEX idx_crm_integrations_user_id ON crm_integrations(user_id);
CREATE INDEX idx_crm_integrations_sync_enabled ON crm_integrations(sync_enabled);

-- ============================================================================
-- CRM CONTACTS TABLE
-- ============================================================================

CREATE TABLE crm_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  integration_id UUID NOT NULL REFERENCES crm_integrations(id) ON DELETE CASCADE,
  external_id VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  linkedin_url TEXT,
  profile_id UUID REFERENCES profiles(id),
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT integration_contact_unique UNIQUE (integration_id, external_id)
);

CREATE INDEX idx_crm_contacts_integration_id ON crm_contacts(integration_id);
CREATE INDEX idx_crm_contacts_email ON crm_contacts(email);
CREATE INDEX idx_crm_contacts_profile_id ON crm_contacts(profile_id);

-- ============================================================================
-- REFRESH TOKENS TABLE
-- ============================================================================

CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  revoked_at TIMESTAMP WITH TIME ZONE,

  CONSTRAINT token_hash_unique UNIQUE (token_hash)
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

-- ============================================================================
-- API KEYS TABLE (for Enterprise)
-- ============================================================================

CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  key_hash VARCHAR(255) NOT NULL,
  permissions JSONB DEFAULT '[]',
  last_used_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  revoked_at TIMESTAMP WITH TIME ZONE,

  CONSTRAINT key_hash_unique UNIQUE (key_hash)
);

CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_key_hash ON api_keys(key_hash);

-- ============================================================================
-- AUDIT LOG TABLE
-- ============================================================================

CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100),
  resource_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at DESC);
CREATE INDEX idx_audit_log_resource ON audit_log(resource_type, resource_id);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crm_integrations_updated_at BEFORE UPDATE ON crm_integrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to get user's current profile
CREATE OR REPLACE FUNCTION get_user_profile(p_user_id UUID)
RETURNS TABLE (
  profile_id UUID,
  personality_type VARCHAR,
  energy_style VARCHAR,
  approach profile_approach
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.personality_type,
    p.energy_style,
    p.approach
  FROM profiles p
  WHERE p.user_id = p_user_id
  ORDER BY p.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE users IS 'User accounts and authentication';
COMMENT ON TABLE profiles IS 'User personality profiles (astrological or Big Five approach)';
COMMENT ON TABLE teams IS 'Team groups for collaboration';
COMMENT ON TABLE team_members IS 'Team membership relationships';
COMMENT ON TABLE team_compatibility IS 'Pairwise compatibility scores between users';
COMMENT ON TABLE crm_integrations IS 'CRM platform integrations';
COMMENT ON TABLE crm_contacts IS 'Contacts synced from CRM platforms';
COMMENT ON TABLE refresh_tokens IS 'JWT refresh tokens for authentication';
COMMENT ON TABLE api_keys IS 'API keys for enterprise users';
COMMENT ON TABLE audit_log IS 'Audit trail for security and compliance';
