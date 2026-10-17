#!/usr/bin/env bash
# Instalador do refinement-skills
# Uso:
#   curl -fsSL https://raw.githubusercontent.com/RafaelFerSilva/refinement-agent-skills/main/scripts/install.sh | bash
#   ou localmente: ./scripts/install.sh [--global|--local]
set -euo pipefail

REPO_URL="https://github.com/RafaelFerSilva/refinement-agent-skills.git"
INSTALL_DIR="$HOME/.refinement-skills"
SCOPE="global"

for arg in "$@"; do
  case "$arg" in
    --global) SCOPE="global" ;;
    --local)  SCOPE="local" ;;
    *) echo "Opção desconhecida: $arg (use --global ou --local)" >&2; exit 1 ;;
  esac
done

# Se executado dentro do repo clonado, usa a pasta skills local
if [ -d "$(dirname "$0")/../skills" ]; then
  SRC="$(cd "$(dirname "$0")/.." && pwd)/skills"
elif [ -d "./skills" ] && [ -f "./skills/refine-story/SKILL.md" ]; then
  SRC="$(pwd)/skills"
else
  echo "==> Baixando refinement-skills..."
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
  echo "==> Instalando skills globalmente em ~/.claude/skills e ~/.agents/skills..."
else
  DESTS=("$(pwd)/.claude/skills" "$(pwd)/.agents/skills")
  echo "==> Instalando skills no workspace atual (.claude/skills e .agents/skills)..."
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
echo "Sucesso! refinement-skills instalado."
echo "Para configurar seu workspace, abra seu agente e digite: /configure-refinement"
