CREATE TABLE IF NOT EXISTS api_keys (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  hashed_key text NOT NULL UNIQUE,
  device_name text,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  last_used timestamp with time zone
);

DROP TABLE IF EXISTS agents;

CREATE TABLE agents (
  id text PRIMARY KEY,
  user_id text REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  shortcut text,
  shortcut_key text,
  system_prompt text NOT NULL,
  is_built_in boolean DEFAULT false,
  enabled boolean DEFAULT true,
  icon text,
  parent_id text,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS api_keys_user_id_idx ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS agents_user_id_idx ON agents(user_id);
