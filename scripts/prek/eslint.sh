#!/usr/bin/env bash
set -euo pipefail
cd frontend
files=()
for f in "$@"; do
  files+=("${f#frontend/}")
done
exec node_modules/.bin/eslint "${files[@]}"
