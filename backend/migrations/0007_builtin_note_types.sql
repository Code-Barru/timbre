-- 0007_builtin_note_types.sql
-- Models shipped with the app (user_id IS NULL).
-- Templates reference fields by key; rendering happens in Rust.
-- Fluent Forever rule: no text in a language the learner already knows on a
-- card, meaning is always carried by an image. Field keys and template keys
-- below are API identifiers, not card content: they stay English whatever the
-- target language is.

INSERT INTO note_types (id, user_id, key, name, spec) VALUES

-- Single word: the 4 template cards (image->word, word->image, audio->image, IPA->word).
('00000000000000000000000001', NULL, 'ff_word', 'Word', '{
  "v": 1,
  "fields": [
    {"key": "word",     "label": "Word",                "kind": "text",     "required": true},
    {"key": "ipa",      "label": "IPA",                 "kind": "ipa",      "required": true},
    {"key": "gender",   "label": "Gender",              "kind": "gender",   "required": false},
    {"key": "mnemonic", "label": "Mnemonic",            "kind": "mnemonic", "required": false},
    {"key": "image",    "label": "Image search",        "kind": "image",    "required": true},
    {"key": "audio",    "label": "Forvo",               "kind": "audio",    "required": false},
    {"key": "personal", "label": "Personal connection", "kind": "personal", "required": true},
    {"key": "notes",    "label": "Notes",               "kind": "notes",    "required": false}
  ],
  "templates": [
    {"key": "image_word", "name": "Card 1 — image → word",
     "front": ["image"],
     "back":  ["word", "ipa", "gender", "mnemonic", "audio", "personal"]},

    {"key": "word_image", "name": "Card 2 — word → image",
     "front": ["word"],
     "back":  ["image", "ipa", "gender", "audio", "personal"]},

    {"key": "audio_image", "name": "Card 3 — audio → image",
     "front": ["audio"],
     "back":  ["image", "word", "ipa", "personal"]},

    {"key": "ipa_word", "name": "Card 4 — IPA → spelling",
     "front": ["ipa", "image"],
     "back":  ["word", "personal"],
     "condition": "spelling_ambiguous"}
  ]
}'::jsonb),

-- Cloze sentence: a new word, new form, or surprising order (04).
('00000000000000000000000002', NULL, 'ff_sentence', 'Sentence', '{
  "v": 1,
  "fields": [
    {"key": "sentence", "label": "Sentence with a gap",  "kind": "sentence_cloze", "required": true},
    {"key": "answer",   "label": "Answer",               "kind": "text",           "required": true},
    {"key": "hint",     "label": "Hint",                 "kind": "text",           "required": false},
    {"key": "ipa",      "label": "IPA",                  "kind": "ipa",            "required": false},
    {"key": "image",    "label": "Image",                "kind": "image",          "required": true},
    {"key": "audio",    "label": "Recording",            "kind": "audio",          "required": false},
    {"key": "personal", "label": "Personal connection",  "kind": "personal",       "required": true},
    {"key": "notes",    "label": "Notes",                "kind": "notes",          "required": false}
  ],
  "templates": [
    {"key": "cloze", "name": "Gap → word",
     "front": ["sentence", "image", "hint"],
     "back":  ["answer", "ipa", "audio", "personal", "notes"]}
  ]
}'::jsonb),

-- Minimal pair: auditory discrimination (02). One card per test direction.
('00000000000000000000000003', NULL, 'ff_minimal_pair', 'Minimal pair', '{
  "v": 1,
  "fields": [
    {"key": "contrast", "label": "Contrast",    "kind": "text",  "required": true},
    {"key": "word_a",   "label": "Word A",      "kind": "text",  "required": true},
    {"key": "ipa_a",    "label": "IPA A",       "kind": "ipa",   "required": true},
    {"key": "audio_a",  "label": "Recording A", "kind": "audio", "required": true},
    {"key": "word_b",   "label": "Word B",      "kind": "text",  "required": true},
    {"key": "ipa_b",    "label": "IPA B",       "kind": "ipa",   "required": true},
    {"key": "audio_b",  "label": "Recording B", "kind": "audio", "required": true}
  ],
  "templates": [
    {"key": "audio_a_choice", "name": "Recording A → which word?",
     "front": ["audio_a"], "back": ["word_a", "ipa_a", "contrast"]},
    {"key": "audio_b_choice", "name": "Recording B → which word?",
     "front": ["audio_b"], "back": ["word_b", "ipa_b", "contrast"]}
  ]
}'::jsonb),

-- Spelling/sound correspondence (02, card A of pronunciation chapter).
('00000000000000000000000004', NULL, 'ff_pronunciation', 'Pronunciation', '{
  "v": 1,
  "fields": [
    {"key": "spelling", "label": "Spelling",  "kind": "text",  "required": true},
    {"key": "ipa",      "label": "IPA",       "kind": "ipa",   "required": true},
    {"key": "example",  "label": "Example",   "kind": "text",  "required": true},
    {"key": "audio",    "label": "Recording", "kind": "audio", "required": true},
    {"key": "image",    "label": "Image",     "kind": "image", "required": false}
  ],
  "templates": [
    {"key": "spelling_sound", "name": "Spelling → sound",
     "front": ["spelling"], "back": ["ipa", "example", "audio", "image"]},
    {"key": "sound_spelling", "name": "Sound → spelling",
     "front": ["audio"], "back": ["spelling", "ipa", "example"]}
  ]
}'::jsonb);
