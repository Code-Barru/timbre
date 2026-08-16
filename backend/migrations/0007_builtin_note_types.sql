-- 0007_builtin_note_types.sql
-- Models shipped with the app (user_id IS NULL).
-- Templates reference fields by key; rendering happens in Rust.
-- Fluent Forever rule: no French or English text on a card,
-- meaning is always carried by an image.

INSERT INTO note_types (id, user_id, key, name, spec) VALUES

-- Single word: the 4 template cards (obraz->slowo, slowo->obraz, audio->obraz, IPA->slowo).
('00000000000000000000000001', NULL, 'ff_slowo', 'Słowo', '{
  "v": 1,
  "fields": [
    {"key": "slowo",       "label": "Słowo",                "kind": "text",     "required": true},
    {"key": "ipa",         "label": "IPA",                  "kind": "ipa",      "required": true},
    {"key": "rodzaj",      "label": "Rodzaj",               "kind": "gender",   "required": false},
    {"key": "skojarzenie", "label": "Skojarzenie",          "kind": "mnemonic", "required": false},
    {"key": "obraz",       "label": "Szukaj obrazka",       "kind": "image",    "required": true},
    {"key": "audio",       "label": "Forvo",                "kind": "audio",    "required": false},
    {"key": "osobiste",    "label": "Skojarzenie osobiste", "kind": "personal", "required": true},
    {"key": "uwagi",       "label": "Uwagi",                "kind": "notes",    "required": false}
  ],
  "templates": [
    {"key": "obraz_slowo", "name": "Karta 1 — obraz → słowo",
     "front": ["obraz"],
     "back":  ["slowo", "ipa", "rodzaj", "skojarzenie", "audio", "osobiste"]},

    {"key": "slowo_obraz", "name": "Karta 2 — słowo → obraz",
     "front": ["slowo"],
     "back":  ["obraz", "ipa", "rodzaj", "audio", "osobiste"]},

    {"key": "audio_obraz", "name": "Karta 3 — audio → obraz",
     "front": ["audio"],
     "back":  ["obraz", "slowo", "ipa", "osobiste"]},

    {"key": "ipa_slowo", "name": "Karta 4 — IPA → pisownia",
     "front": ["ipa", "obraz"],
     "back":  ["slowo", "osobiste"],
     "condition": "spelling_ambiguous"}
  ]
}'::jsonb),

-- Cloze sentence: a new word, new form, or surprising order (04).
('00000000000000000000000002', NULL, 'ff_zdanie', 'Zdanie', '{
  "v": 1,
  "fields": [
    {"key": "zdanie",      "label": "Zdanie z luką",        "kind": "sentence_cloze", "required": true},
    {"key": "odpowiedz",   "label": "Odpowiedź",            "kind": "text",           "required": true},
    {"key": "podpowiedz",  "label": "Podpowiedź",           "kind": "text",           "required": false},
    {"key": "ipa",         "label": "IPA",                  "kind": "ipa",            "required": false},
    {"key": "obraz",       "label": "Obrazek",              "kind": "image",          "required": true},
    {"key": "audio",       "label": "Nagranie",             "kind": "audio",          "required": false},
    {"key": "osobiste",    "label": "Skojarzenie osobiste", "kind": "personal",       "required": true},
    {"key": "uwagi",       "label": "Uwagi",                "kind": "notes",          "required": false}
  ],
  "templates": [
    {"key": "luka", "name": "Luka → słowo",
     "front": ["zdanie", "obraz", "podpowiedz"],
     "back":  ["odpowiedz", "ipa", "audio", "osobiste", "uwagi"]}
  ]
}'::jsonb),

-- Minimal pair: auditory discrimination (02). One card per test direction.
('00000000000000000000000003', NULL, 'ff_para_minimalna', 'Para minimalna', '{
  "v": 1,
  "fields": [
    {"key": "kontrast", "label": "Kontrast",  "kind": "text",  "required": true},
    {"key": "slowo_a",  "label": "Słowo A",   "kind": "text",  "required": true},
    {"key": "ipa_a",    "label": "IPA A",     "kind": "ipa",   "required": true},
    {"key": "audio_a",  "label": "Nagranie A","kind": "audio", "required": true},
    {"key": "slowo_b",  "label": "Słowo B",   "kind": "text",  "required": true},
    {"key": "ipa_b",    "label": "IPA B",     "kind": "ipa",   "required": true},
    {"key": "audio_b",  "label": "Nagranie B","kind": "audio", "required": true}
  ],
  "templates": [
    {"key": "audio_a_wybor", "name": "Nagranie A → które słowo?",
     "front": ["audio_a"], "back": ["slowo_a", "ipa_a", "kontrast"]},
    {"key": "audio_b_wybor", "name": "Nagranie B → które słowo?",
     "front": ["audio_b"], "back": ["slowo_b", "ipa_b", "kontrast"]}
  ]
}'::jsonb),

-- Spelling/sound correspondence (02, card A of pronunciation chapter).
('00000000000000000000000004', NULL, 'ff_wymowa', 'Wymowa', '{
  "v": 1,
  "fields": [
    {"key": "pisownia", "label": "Pisownia",      "kind": "text",  "required": true},
    {"key": "ipa",      "label": "IPA",           "kind": "ipa",   "required": true},
    {"key": "przyklad", "label": "Przykład",      "kind": "text",  "required": true},
    {"key": "audio",    "label": "Nagranie",      "kind": "audio", "required": true},
    {"key": "obraz",    "label": "Obrazek",       "kind": "image", "required": false}
  ],
  "templates": [
    {"key": "pisownia_dzwiek", "name": "Pisownia → dźwięk",
     "front": ["pisownia"], "back": ["ipa", "przyklad", "audio", "obraz"]},
    {"key": "dzwiek_pisownia", "name": "Dźwięk → pisownia",
     "front": ["audio"], "back": ["pisownia", "ipa", "przyklad"]}
  ]
}'::jsonb);
