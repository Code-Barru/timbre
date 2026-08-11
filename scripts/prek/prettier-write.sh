#!/usr/bin/env bash
set -euo pipefail
cd frontend
files=()
for f in "$@"; do
  files+=("${f#frontend/}")
done
node_modules/.bin/prettier --write "${files[@]}"
git add -- "${files[@]}"
