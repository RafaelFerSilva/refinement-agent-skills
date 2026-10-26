#!/usr/bin/env bash
# Links skills/* into the user skills folders (~/.claude/skills, ~/.agents/skills, ~/.gemini/config/skills)
# to use the skills inside this repository. A git pull keeps the links current.
# usage: scripts/link-skills.sh [--link|--unlink]
set -euo pipefail
cd "$(dirname "$0")/.."
SRC="$(pwd)/skills"
DESTS=("$HOME/.claude/skills" "$HOME/.agents/skills" "$HOME/.gemini/config/skills")
mode="${1:---link}"

for dest in "${DESTS[@]}"; do
  mkdir -p "$dest"
  for skill in "$SRC"/*/; do
    name="$(basename "$skill")"
    target="$dest/$name"
    case "$mode" in
      --link)
        if [ -e "$target" ] && [ ! -L "$target" ]; then
          echo "skipped: $target exists and is not a link" >&2
          continue
        fi
        ln -sfn "${skill%/}" "$target"
        echo "linked: $target"
        ;;
      --unlink)
        if [ -L "$target" ]; then
          rm "$target"
          echo "removed: $target"
        fi
        ;;
      *)
        echo "usage: $0 [--link|--unlink]" >&2
        exit 2
        ;;
    esac
  done
done
