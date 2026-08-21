-- 0004_notes.sql
-- Note types (fields + templates in jsonb), notes, community packs.

CREATE TABLE note_types (
    id      text PRIMARY KEY,
    user_id text REFERENCES users ON DELETE CASCADE,   -- NULL = builtin, visible to all
    key     text NOT NULL,                             -- 'ff_word', 'ff_sentence', ...
    name    text NOT NULL,
    -- {v:1, fields:[{key,label,kind,required}], templates:[{key,name,front,back,condition}]}
    spec    jsonb NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT note_types_spec_versioned CHECK (spec ? 'v' AND spec ? 'fields' AND spec ? 'templates')
);

CREATE UNIQUE INDEX note_types_user_key_idx
    ON note_types (coalesce(user_id, nil_id()), key);

CREATE TABLE notes (
    id           text PRIMARY KEY,
    user_id      text NOT NULL REFERENCES users ON DELETE CASCADE,
    note_type_id text NOT NULL REFERENCES note_types,
    deck_id      text NOT NULL REFERENCES decks,
    -- {v:1, word, ipa, gender, mnemonic, personal, notes,
    --  image:<media id>, audio:<media id>}
    fields       jsonb NOT NULL,
    -- 'group:verb-aspect', 'group:case-locative', 'contrast:s-sh'
    -- Feeds user_preferences.max_new_per_group_per_day.
    tags         text[] NOT NULL DEFAULT '{}',

    -- Community pack provenance (minimal pairs, false friends, 625 lists).
    source_pack  text,
    source_key   text,                       -- stable id within the pack
    locked       boolean NOT NULL DEFAULT false,   -- edited locally: import won't overwrite it

    rev          bigint NOT NULL DEFAULT nextval('change_seq'),
    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now(),
    deleted_at   timestamptz,

    CONSTRAINT notes_fields_versioned CHECK (fields ? 'v'),
    CONSTRAINT notes_pack_complete CHECK ((source_pack IS NULL) = (source_key IS NULL))
);

CREATE INDEX notes_fields_idx ON notes USING gin (fields jsonb_path_ops);
CREATE INDEX notes_tags_idx   ON notes USING gin (tags);
CREATE INDEX notes_deck_idx   ON notes (user_id, deck_id) WHERE deleted_at IS NULL;
CREATE INDEX notes_sync_idx   ON notes (user_id, rev);

-- Import idempotence: one UPSERT per (pack, key), no duplicates.
CREATE UNIQUE INDEX notes_pack_key_idx
    ON notes (user_id, source_pack, source_key)
    WHERE source_pack IS NOT NULL;

-- Fuzzy search on the primary lexical field of 'ff_word'.
-- Other note types are searched through notes_fields_idx above.
CREATE INDEX notes_word_trgm_idx
    ON notes USING gin ((fields ->> 'word') gin_trgm_ops);

CREATE TRIGGER notes_touch_rev
    BEFORE UPDATE ON notes
    FOR EACH ROW EXECUTE FUNCTION touch_rev();

CREATE TABLE installed_packs (
    user_id      text REFERENCES users ON DELETE CASCADE,
    pack         text NOT NULL,
    version      text NOT NULL,
    deck_id      text NOT NULL REFERENCES decks,
    installed_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, pack)
);
