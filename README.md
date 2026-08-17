# Timbre

Timbre is a self-hostable language learning app, based on the principles of [Fluent Forever](https://www.amazon.com/Fluent-Forever-Learn-Language-Forget/dp/0385348118), which revolve around making the target language feel like a new way of thinking instead of just another way of thinking the same things.

<!-- OUTLINE — sections below are bullet-point plans, not final copy.
     Each bullet = one thing to cover. Delete a bullet once it's written out. -->

<!-- TODO intro: the paragraph above says *what* but not *why you'd pick it*.
     Add 3-5 bullets right under it, before the ToC:
     - Multi-user by design (Postgres RLS), not single-user + sync bolted on
     - FSRS-6 scheduler with per-deck parameter training, not SM-2
     - Self-hosted: your data, one container + Postgres
     - Fluent Forever workflow first-class: image mnemonics, minimal pairs,
       no translation on the front of cards
     - Add a screenshot or GIF here. Single highest-impact item in the whole
       README for a public repo. -->

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

<!-- TODO: fix anchors — GitHub lowercases them. Done above; verify after
     section titles are final. Consider dropping the ToC entirely if the
     README stays under ~200 lines; GitHub renders its own outline widget. -->

## Installation

### Docker

Images are published to `ghcr.io/code-barru/timbre`.

Save this as `compose.yaml` and run `docker compose up -d`:

```yaml
services:
  timbre:
    image: ghcr.io/Code-Barru/timbre:latest
    restart: unless-stopped
    depends_on:
      database:
        condition: service_healthy
    environment:
      DATABASE_URL: postgres://timbre:CHANGE_ME@database/timbre
      PORT: 3000
      DB_MAX_CONNECTIONS: 10
      PUBLIC_URL: https://timbre.example.com
      SESSION_TTL_DAYS: 30
      # Set to false if you serve over http
      COOKIE_SECURE: "true"
      # Set to false if you want to disable account creation
      ALLOW_REGISTRATION: "true"
    ports:
      - "3000:3000"

  database:
    image: postgres:17
    restart: unless-stopped
    environment:
      POSTGRES_USER: timbre
      POSTGRES_PASSWORD: timbre
      POSTGRES_DB: timbre
    volumes:
      - db-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U timbre -d timbre"]
      interval: 5s
      timeout: 5s
      retries: 10

volumes:
  db-data:
```

<!-- TODO: add the media directory to that command once media storage
     is implemented — see the Usage section. -->

## Quick Start

<!-- TODO — replace section 3 with the real flow once the study UI lands.
     Target: from zero to a first completed review in under 5 minutes.
       - Open the web UI, log in.
       - Create a deck.
       - Add one note with the built-in `ff_slowo` type. Use a real word
         with a real image, not a placeholder — this is where the Fluent
         Forever philosophy becomes obvious, and it is the single most
         persuasive thing in the README.
       - Show the four cards that one note generates.
       - Do one review; one sentence on what again/hard/good/easy tell
         the scheduler.
     Also revisit the "Timbre is early" banner at the top of this section
     and the curl-based steps above — once the UI exists, steps 1 and 2
     should be "open http://localhost:3000 and sign up", and the API
     version moves to the API docs. -->

<!-- TODO: the built-in note types in 0007_builtin_note_types.sql are
     Polish-only (`ff_slowo`, fields labelled Słowo / Rodzaj /
     Skojarzenie). A self-hoster learning Spanish gets Polish labels.
     Decide before launch whether that is a starter deck, a hardcoded
     assumption to generalise, or a documented limitation — and say so
     here, because it is the first thing a new user will hit. -->

## Usage

<!--- **Concepts and how they nest.** Define each term once, since the codebase
  and the API both use them: note types, notes, cards, decks, media.
  Emphasise the note → cards relationship (one note generates N cards from
  the note type's templates) because it's the part people get wrong.
- **The Fluent Forever method as implemented here.** What the built-in note
  types are (`0007_builtin_note_types.sql`), and why each field exists:
  image over translation, personal connection, minimal pairs for
  pronunciation, spelling/sound cards. This is the section that
  differentiates the project — write it properly, it's worth 30 lines.
- **The scheduler.** FSRS-6, 21 weights, per-deck or per-account parameter
  sets, retrained from the append-only review log. Say what's configurable
  (desired retention, learning steps, daily limits) and what isn't. Link
  to the FSRS spec rather than re-explaining the algorithm.
- **Media handling.** Where images and audio live, what the size limits
  are, and — for self-hosters — what needs backing up beyond Postgres.
  Resolve this before launch; it changes the Docker volume advice above.
- **Import / export.** State the position even if the answer is "not yet":
  Anki `.apkg` import is the single most-requested feature for any SRS
  project, and saying "planned, see #N" prevents ten duplicate issues.
- **Multi-user.** Registration control, session lifetime, the fact that
  users are isolated at the database level by RLS. Frame it as a feature —
  families, classrooms, small communities — since that's a real
  differentiator versus Anki.
- **API.** Decide whether it's public and supported or internal. If public,
  list the endpoints (`/api/health`, `/api/auth/register`, `/api/auth/login`,
  `/api/auth/logout` today) and the cookie-based auth scheme. If internal,
  say so plainly so nobody builds on it and then files a breakage issue.-->

## Contributing

<!-- Keep this section short — 5 lines and a link to CONTRIBUTING.md, which
     doesn't exist yet. The bullets below are the plan for *that* file. -->

<!--- Link to `CONTRIBUTING.md` (to be written) and to a `CODE_OF_CONDUCT.md`
  (Contributor Covenant, copy-paste).
- Dev environment setup lives in `CONTRIBUTING.md`, not in this README.
  What it needs to cover: Rust (edition 2024), Node 22+, `docker compose
up -d database` for Postgres, then `cargo run` and `npm run dev` in two
  terminals. Include the gotcha that a debug build serves the API only
  (static serving is `#[cfg(not(debug_assertions))]` in `app.rs`), so the
  browser goes to the Vite port.
- **`prek` hooks are the contract.** Explain installing them, and that they
  run `cargo check`, `cargo clippy --pedantic -D warnings`, `prettier
--write`, and `eslint`. A contributor who skips this gets a red CI.
- **Align CI with the hooks before publishing.** `prek.toml` runs clippy
  with `-W clippy::pedantic`, the CI workflow doesn't, and neither runs
  `cargo fmt --check`. Fix the mismatch, then document one command
  contributors can run locally to reproduce CI exactly.
- Commit convention: Conventional Commits, which the history already
  follows (`feat(auth):`, `fix(backend):`, `chore(doc):`). List the allowed
  scopes.
- Branch and PR flow: target branch, whether you want issues opened first,
  what a good PR description contains.
- **Migrations policy.** Numbered, append-only, never edit a merged
  migration. This is the rule most likely to be broken by a first-time
  contributor and the most expensive to unbreak.
- Architecture note for newcomers: the backend module layout
  (`dto` / `handlers` / `model` / `repository` / `service` per feature) and
  the two-pool design (owner pool for auth and migrations, `app_user` pool
  for everything user-scoped, via `AppState::rls_transaction`). Point at
  `backend/README.md` for the SQL schema — which is currently an empty
  heading and needs filling in.
- Where to start: label some issues `good first issue` before announcing
  the project anywhere.-->

## License

Timbre is free software, licensed under the **GNU AGPLv3**. The full text is in [LICENSE](LICENSE).

Contributions are accepted under the same license.

## Acknowledgments

Timbre stands on other people's work.

**Gabirel Wyner**, whose book _Fluent Forever_ is the sole reason this project exists. Every steps of the timbre workflow comes from this book. If Timbre is useful to you and you want to understand why it works, please read the book.

**[FSRS](https://github.com/open-spaced-repetition)** and the open-spaced-repetition community, for the scheduling algorithms. Timbre implements FSRS-6, which was not deisgn by us.

**[Anki](https://apps.ankiweb.net/)**, for two decades of prior art. The
note / note type / card / deck model Timbre uses is Anki's.

**[Forvo](https://forvo.com/)**, for pronunciations recorded by native
speakers, which is what makes audio cards worth doing at all.

> Timbre is an independent project. It is inspired by the Fluent Forever
> method but is not affiliated with, endorsed by, or connected to Fluent
> Forever Inc. or its app. "Fluent Forever" is their trademark.

<!-- TODO: once there are contributors, add a line here linking to
     https://github.com/Code-Barru/timbre/graphs/contributors — or wire up
     all-contributors if you want non-code contributions credited too. -->

<!-- TODO: the disclaimer above is deliberately placed in Acknowledgments
     where it reads as courtesy rather than as a legal notice. If you ever
     use the words "Fluent Forever" in the project name, domain, or app
     store listing, it needs to move somewhere more prominent — and you
     should probably not do that at all. -->
