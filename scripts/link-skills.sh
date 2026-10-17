#!/usr/bin/env bash
# Linka skills/* nas pastas de skills do usuário (~/.claude/skills, ~/.agents/skills)
# para usar as skills neste próprio repositório. Um git pull mantém os links atuais.
# uso: scripts/link-skills.sh [--link|--unlink]
set -euo pipefail
cd "$(dirname "$0")/.."
SRC="$(pwd)/skills"
DESTS=("$HOME/.claude/skills" "$HOME/.agents/skills")
mode="${1:---link}"

for dest in "${DESTS[@]}"; do
  mkdir -p "$dest"
  for skill in "$SRC"/*/; do
    name="$(basename "$skill")"
    target="$dest/$name"
    case "$mode" in
      --link)
        if [ -e "$target" ] && [ ! -L "$target" ]; then
          echo "pulado: $target existe e não é link" >&2
          continue
        fi
        ln -sfn "${skill%/}" "$target"
        echo "linkado: $target"
        ;;
      --unlink)
        if [ -L "$target" ]; then
          rm "$target"
          echo "removido: $target"
        fi
        ;;
      *)
        echo "uso: $0 [--link|--unlink]" >&2
        exit 2
        ;;
    esac
  done
done
