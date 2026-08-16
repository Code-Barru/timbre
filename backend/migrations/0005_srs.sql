-- 0005_srs.sql
-- Materialized cards, review log, FSRS-6 params.

CREATE TABLE cards (
    id       text PRIMARY KEY,
    note_id  text NOT NULL REFERENCES notes ON DELETE CASCADE,
    -- user_id and deck_id are denormalized: keeps RLS policies flat
    -- (plain equality, no subquery) and serves the queue indexes.
    user_id  text NOT NULL REFERENCES users ON DELETE CASCADE,
    deck_id  text NOT NULL REFERENCES decks,
    ord      smallint NOT NULL,          -- template index in note_types.spec
    -- NULL = rendered on the fly from the template (hybrid model).
    -- Non-NULL = frozen card, hand-edited, skipped by regeneration.
    override jsonb,

    -- FSRS-6 memory state. Retrievability is never stored:
    -- computed from stability, last_review_at, and decay.
    state          card_state NOT NULL DEFAULT 'new',
    due            timestamptz,
    new_position   integer,
    stability      double precision CHECK (stability > 0),
    difficulty     double precision CHECK (difficulty BETWEEN 1 AND 10),
    last_review_at timestamptz,          -- cache derived from reviews, avoids a JOIN per card
    reps           integer NOT NULL DEFAULT 0,
    lapses         integer NOT NULL DEFAULT 0,
    learning_step  smallint,
    suspended      boolean NOT NULL DEFAULT false,
    buried_until   date,

    rev        bigint NOT NULL DEFAULT nextval('change_seq'),
    deleted_at timestamptz,

    UNIQUE (note_id, ord),
    -- A card outside 'new' always has a memory state.
    CONSTRAINT cards_state_coherent CHECK (
        state = 'new' OR (stability IS NOT NULL AND difficulty IS NOT NULL AND due IS NOT NULL)
    )
);

CREATE INDEX cards_due_idx ON cards (user_id, deck_id, due)
    WHERE deleted_at IS NULL AND NOT suspended AND state <> 'new';

CREATE INDEX cards_new_idx ON cards (user_id, deck_id, new_position)
    WHERE deleted_at IS NULL AND NOT suspended AND state = 'new';

CREATE INDEX cards_note_idx ON cards (note_id);          -- sibling bury
CREATE INDEX cards_sync_idx ON cards (user_id, rev);

CREATE TRIGGER cards_touch_rev
    BEFORE UPDATE ON cards
    FOR EACH ROW EXECUTE FUNCTION touch_rev();

-- Append-only log. Never UPDATE, never DELETE except account deletion.
-- Sole source of truth for optimizer training.
CREATE TABLE reviews (
    id          bigserial PRIMARY KEY,
    card_id     text NOT NULL REFERENCES cards ON DELETE CASCADE,
    user_id     text NOT NULL REFERENCES users ON DELETE CASCADE,
    reviewed_at timestamptz NOT NULL DEFAULT now(),
    rating      smallint NOT NULL CHECK (rating BETWEEN 1 AND 4),  -- again/hard/good/easy
    is_manual   boolean  NOT NULL DEFAULT false,   -- cram, reschedule: excluded from training
    duration_ms integer
);

-- Covers the RLS policy and per-card loading for the optimizer.
CREATE INDEX reviews_train_idx ON reviews (user_id, card_id, reviewed_at);
-- Stats, heatmap, daily counters.
CREATE INDEX reviews_stats_idx ON reviews (user_id, reviewed_at);

CREATE TABLE fsrs_params (
    id         text PRIMARY KEY,
    user_id    text NOT NULL REFERENCES users ON DELETE CASCADE,
    deck_id    text REFERENCES decks ON DELETE CASCADE,   -- NULL = account default params
    weights    double precision[] NOT NULL CHECK (array_length(weights, 1) = 21),  -- FSRS-6
    -- {log_loss, rmse_bins, n_reviews, version:'fsrs-6'}: lets you compare
    -- two trainings and roll back by toggling is_active.
    metrics    jsonb,
    trained_at timestamptz NOT NULL DEFAULT now(),
    is_active  boolean NOT NULL DEFAULT true
);

-- Only one active param set per scope; history stays queryable.
CREATE UNIQUE INDEX fsrs_params_active_idx
    ON fsrs_params (user_id, coalesce(deck_id, nil_id()))
    WHERE is_active;
