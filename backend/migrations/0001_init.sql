-- 0001_init.sql
-- Extensions, shared primitives.

CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm;   -- fuzzy search on notes.fields

-- Global monotonic sync cursor.
-- Every mutation visible to an offline client bumps this sequence.
CREATE SEQUENCE change_seq;

CREATE TYPE card_state AS ENUM ('new', 'learning', 'review', 'relearning');

-- Sentinel for unique indexes on nullable columns.
-- uuid_nil() belongs to uuid-ossp, not pgcrypto — use the literal instead.
CREATE OR REPLACE FUNCTION nil_uuid() RETURNS uuid
LANGUAGE sql IMMUTABLE PARALLEL SAFE AS
$$ SELECT '00000000-0000-0000-0000-000000000000'::uuid $$;

-- Bumps updated_at on UPDATE and advances the sync cursor.
CREATE OR REPLACE FUNCTION touch_rev() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  NEW.rev := nextval('change_seq');
  IF to_jsonb(NEW) ? 'updated_at' THEN
    NEW.updated_at := now();
  END IF;
  RETURN NEW;
END $$;
