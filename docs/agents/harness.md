# Camada de controle (harness)

O que mantém este pacote consistente, e onde mudar cada coisa. Instruções para agentes ficam em `AGENTS.md`; esta página cobre o que é imposto por script ou manifesto.

## Fonte e distribuição

| Preocupação | Onde |
| --- | --- |
| Fonte das skills | `skills/<nome>/` |
| Manifesto do plugin Claude Code | `.claude-plugin/plugin.json` (lista explícita de `skills/`) |
| Marketplace próprio | `.claude-plugin/marketplace.json` (fallback para instalar direto do repositório) |
| Metadados do Codex | `skills/<nome>/agents/openai.yaml` |
| Instalação por cópia | `skills/*` para a pasta de skills do agente no workspace |
| Chat e agentes por instruções | `prompts/<fluxo>.md`, gerado de `skills/` por `scripts/build-prompts.mjs` |

Não há cópia das skills dentro deste repositório para nenhum CLI. Para usar as skills aqui mesmo, `scripts/link-skills.sh` cria symlinks em `~/.claude/skills/` e `~/.agents/skills/`; um `git pull` mantém os links atuais. `--unlink` remove.

## Validação

- `node scripts/validate-skills.mjs`: frontmatter válido e `name` igual à pasta; `description` presente e dentro do limite; `openai.yaml` presente e coerente com `disable-model-invocation`; `plugin.json`, `README.md` e `which-flow` conhecendo toda skill; toda chamada à Skill tool apontando para uma skill de `skills/`; sem travessão na prosa; `SKILL.md` abaixo de 500 linhas; `prompts/` idêntico ao que o build geraria.
- `claude plugin validate . --strict`: o manifesto do plugin.

Rode os dois antes de commitar. Não há CI nem pre-commit ainda; quando houver, os dois comandos entram lá.

## Evals

`evals/<skill>.json` segue o esquema do `skill-creator` da Anthropic (prompt, expected_output, files, assertions). `evals/fixtures/` tem apenas material fictício. Os fluxos de sabatina são avaliados pela primeira rodada; as sínteses, pelo artefato. `scripts/grade-output.mjs <artefato> --skill <nome>` roda as asserções mecânicas e serve de grader. Ver `evals/README.md`.

## Autocontenção

Nenhuma skill de fora. O validador confere que toda chamada à Skill tool nos `SKILL.md` aponta para uma skill deste pacote; uma chamada a um nome desconhecido reprova.
