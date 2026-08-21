-- 0002_accounts.sql
-- Accounts, study preferences, sessions.

CREATE TABLE users (
    id            text PRIMARY KEY,
    email         citext UNIQUE NOT NULL,
    password_hash text   NOT NULL,                        -- argon2id
    display_name  text   NOT NULL,
    is_admin      boolean NOT NULL DEFAULT false,
    timezone      text   NOT NULL DEFAULT 'UTC',
    settings      jsonb  NOT NULL DEFAULT '{"v": 1}',     -- day_cutoff_hour, misc flags
    created_at    timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT users_settings_versioned CHECK (settings ? 'v')
);

-- Default study settings. A deck may partially override them (decks.config).
CREATE TABLE user_preferences (
    user_id                   text PRIMARY KEY REFERENCES users ON DELETE CASCADE,
    new_per_day               integer  NOT NULL DEFAULT 20  CHECK (new_per_day >= 0),
    reviews_per_day           integer  NOT NULL DEFAULT 200 CHECK (reviews_per_day >= 0),
    learning_steps_min        integer[] NOT NULL DEFAULT '{1,10}',
    relearning_steps_min      integer[] NOT NULL DEFAULT '{10}',
    max_interval_days         integer  NOT NULL DEFAULT 36500 CHECK (max_interval_days > 0),
    desired_retention         real     NOT NULL DEFAULT 0.90
                                       CHECK (desired_retention BETWEEN 0.70 AND 0.99),
    bury_siblings             boolean  NOT NULL DEFAULT true,
    -- Anti-interference guard (07): only one item per group
    -- (case, aspectual pair, phoneme series) introduced per day.
    max_new_per_group_per_day integer  NOT NULL DEFAULT 1 CHECK (max_new_per_group_per_day >= 0),
    ui                        jsonb    NOT NULL DEFAULT '{"v": 1}'
);

-- Creates the preferences row alongside the account.
CREATE OR REPLACE FUNCTION create_default_preferences() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
    INSERT INTO user_preferences (user_id) VALUES (NEW.id);
    RETURN NEW;
END $$;

CREATE TRIGGER users_default_preferences
    AFTER INSERT ON users
    FOR EACH ROW EXECUTE FUNCTION create_default_preferences();

-- Token never stored in clear: cookie holds the secret, DB holds only its sha256.
CREATE TABLE sessions (
    token_hash bytea PRIMARY KEY,
    user_id    text  NOT NULL REFERENCES users ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    expires_at timestamptz NOT NULL
);

CREATE INDEX sessions_user_idx    ON sessions (user_id);
CREATE INDEX sessions_expiry_idx  ON sessions (expires_at);   -- periodic purge
