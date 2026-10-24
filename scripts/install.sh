#!/usr/bin/env bash
# refinement-skills installer
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/RafaelFerSilva/refinement-agent-skills/main/scripts/install.sh | bash
#   or locally: ./scripts/install.sh [--global|--local]
set -euo pipefail

REPO_URL="https://github.com/RafaelFerSilva/refinement-agent-skills.git"
INSTALL_DIR="$HOME/.refinement-skills"
SCOPE="global"

for arg in "$@"; do
  case "$arg" in
    --global) SCOPE="global" ;;
    --local)  SCOPE="local" ;;
    *) echo "Unknown option: $arg (use --global or --local)" >&2; exit 1 ;;
  esac
done

# When run inside the cloned repository, use the local skills folder
if [ -d "$(dirname "$0")/../skills" ]; then
  SRC="$(cd "$(dirname "$0")/.." && pwd)/skills"
elif [ -d "./skills" ] && [ -f "./skills/refine-story/SKILL.md" ]; then
  SRC="$(pwd)/skills"
else
  echo "==> Downloading refinement-skills..."
  if [ -d "$INSTALL_DIR/.git" ]; then
    git -C "$INSTALL_DIR" pull --quiet
  else
    mkdir -p "$(dirname "$INSTALL_DIR")"
    git clone --depth 1 --quiet "$REPO_URL" "$INSTALL_DIR"
  fi
  SRC="$INSTALL_DIR/skills"
fi

if [ "$SCOPE" = "global" ]; then
  DESTS=("$HOME/.claude/skills" "$HOME/.agents/skills")
  echo "==> Installing skills globally into ~/.claude/skills and ~/.agents/skills..."
else
  DESTS=("$(pwd)/.claude/skills" "$(pwd)/.agents/skills")
  echo "==> Installing skills into the current workspace (.claude/skills and .agents/skills)..."
fi

for dest in "${DESTS[@]}"; do
  mkdir -p "$dest"
  for skill in "$SRC"/*/; do
    name="$(basename "$skill")"
    target="$dest/$name"
    ln -sfn "${skill%/}" "$target"
    echo "  + $name -> $target"
  done
done

echo ""
echo "Done. refinement-skills installed."
echo "To configure your workspace, open your agent and type: /configure-refinement"
