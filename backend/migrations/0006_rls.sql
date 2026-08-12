-- 0006_rls.sql
-- Row Level Security.
--
-- Deploy requirement: migrations run as an owner role, the app connects
-- as a separate NON-owner role. Table owners bypass RLS unless FORCE ROW LEVEL SECURITY.
--
-- In Rust, each authenticated request runs inside a transaction opened with:
--     SELECT set_config('app.user_id', $1, true)
-- The third argument (true) means SET LOCAL: the value dies with the
-- transaction, so it never leaks to the next request on the same pooled connection.

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_user') THEN
        CREATE ROLE app_user NOLOGIN;   -- password set outside migration
    END IF;
END $$;

GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT USAGE, SELECT ON SEQUENCES TO app_user;

-- STABLE is required: as VOLATILE (the default), Postgres would re-evaluate
-- the function per scanned row instead of once per query.
-- Returns NULL if the setting isn't set, which fails every policy: fail closed.
CREATE OR REPLACE FUNCTION current_app_user() RETURNS uuid
LANGUAGE sql STABLE PARALLEL SAFE AS
$$ SELECT nullif(current_setting('app.user_id', true), '')::uuid $$;

-- All policies are plain equality on a local user_id column.
-- No subquery, no join: the planner treats them as an ordinary
-- predicate and keeps existing indexes.
DO $$
DECLARE t text;
BEGIN
    FOREACH t IN ARRAY ARRAY[
        'user_preferences', 'media', 'decks', 'notes',
        'installed_packs', 'cards', 'reviews', 'fsrs_params'
    ] LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
        EXECUTE format('ALTER TABLE %I FORCE  ROW LEVEL SECURITY', t);
        EXECUTE format($f$
            CREATE POLICY %1$I_owner ON %1$I
                USING (user_id = current_app_user())
                WITH CHECK (user_id = current_app_user())
        $f$, t);
    END LOOP;
END $$;

-- users: an account only sees itself. Key column is id, not user_id.
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE users FORCE  ROW LEVEL SECURITY;

CREATE POLICY users_self ON users
    USING (id = current_app_user())
    WITH CHECK (id = current_app_user());

-- note_types: builtin models (user_id IS NULL) are readable by all,
-- only personal models are writable.
ALTER TABLE note_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_types FORCE  ROW LEVEL SECURITY;

CREATE POLICY note_types_read ON note_types FOR SELECT
    USING (user_id IS NULL OR user_id = current_app_user());

CREATE POLICY note_types_write ON note_types FOR ALL
    USING (user_id = current_app_user())
    WITH CHECK (user_id = current_app_user());

-- sessions stays outside RLS: the session must be read BEFORE knowing
-- which user to set in app.user_id.
-- Signup and login therefore run outside RLS context,
-- via a dedicated backend path that never sets app.user_id.
