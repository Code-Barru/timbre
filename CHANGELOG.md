# Changelog

All notable changes to `timbre` will be documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/).

## [0.4.0] - 2026-08-24

### Features

- feat(frontend): state and endpoint management

## [0.3.0] - 2026-08-21

### Features

- feat(database): changed defaults to english

## [0.2.1] - 2026-08-20

### Bug Fixes

- fix(ci): ferrflow was in skip ci

## [0.2.0] - 2026-08-20

### Features

- feat(backend): added validator to user route dtos
- feat(backend): user management endpoints
- feat(auth): added rls policy
- feat(backend): authentication endpoints
- feat(backend): auth endpoints
- feat(backend): now gracefully shutdowns
- feat(global): Dockerfile + static serving of frontend
- feat(database): scaffolded db schema
- feat(backend): scaffolded backend endpoints structure

### Bug Fixes

- fix(auth): hashes password in all cases to avoid timing attacks
- fix(ci): uses forgejo's rust toolchain fork
