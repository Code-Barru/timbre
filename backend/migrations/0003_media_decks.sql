-- 0003_media_decks.sql
-- Media (single backend chosen per env, abstracted in Rust) and deck tree.

CREATE TABLE media (
    id          text PRIMARY KEY,
    user_id     text NOT NULL REFERENCES users ON DELETE CASCADE,
    storage_key text NOT NULL,          -- 'ab/cd/<sha256>.jpg' — opaque key, never an absolute path
    sha256      bytea  NOT NULL,
    mime        text   NOT NULL,
    byte_size   bigint NOT NULL CHECK (byte_size > 0),
    source_url  text,                   -- Forvo, Google Images, community pack
    -- Distinguishes own voice from Forvo pronunciation: while false,
    -- Card 3 (audio -> image) still needs replacing once phase 02 is done.
    is_own_recording boolean NOT NULL DEFAULT false,
    created_at  timestamptz NOT NULL DEFAULT now(),
    UNIQUE (user_id, sha256)            -- content dedup, per user
);

CREATE TABLE decks (
    id      text PRIMARY KEY,
    user_id text NOT NULL REFERENCES users ON DELETE CASCADE,
    name    text NOT NULL,
    path    text NOT NULL,                     -- 'spanish::pronunciation' — prefix hierarchy
    lang    text NOT NULL DEFAULT 'en',
    kind    text NOT NULL DEFAULT 'standard'
            CHECK (kind IN ('standard', 'pronunciation', 'catalog')),
    -- NULL = fully inherits user_preferences.
    -- Otherwise partial override, merged field by field in Rust.
    config  jsonb,
    rev     bigint NOT NULL DEFAULT nextval('change_seq'),
    created_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz,                    -- soft delete = sync tombstone
    UNIQUE (user_id, path)
);

CREATE INDEX decks_sync_idx ON decks (user_id, rev);
CREATE INDEX decks_path_idx ON decks (user_id, path text_pattern_ops)
    WHERE deleted_at IS NULL;                  -- subtrees via LIKE 'spanish::%'

CREATE TRIGGER decks_touch_rev
    BEFORE UPDATE ON decks
    FOR EACH ROW EXECUTE FUNCTION touch_rev();
