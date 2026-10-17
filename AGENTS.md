# AGENTS.md: constituição do pacote

> Leia este arquivo antes de qualquer ação neste repositório.

> Fonte única de verdade para agentes. `CLAUDE.md` (Claude Code) e `GEMINI.md` (Gemini CLI) só importam este arquivo; Codex, Cursor e Copilot o leem direto. Mudanças no fluxo de IA vão aqui.

## O que é este repositório

**refinement-skills** é um pacote de skills de agente para refinamento de requisitos em pt-BR e en-US: da transcrição de reunião ao plano de teste, por sabatina. Ele não é o workspace onde as USs são analisadas; é instalado nele. Vocabulário do pacote em `CONTEXT.md`; decisões em `docs/adr/`.

- **Fonte das skills:** `skills/<nome>/SKILL.md`, uma pasta por skill, sem buckets. Cada pasta tem `agents/openai.yaml` com os metadados do Codex.
- **Autocontido:** toda skill que um fluxo chama pela Skill tool vive em `skills/`. Nenhuma dependência de pacote de terceiros, nem citação a um.
- **Manifesto:** `.claude-plugin/plugin.json` lista toda skill de `skills/`; `marketplace.json` faz do repositório seu próprio marketplace.

## Invariantes

- `name` no frontmatter é igual ao nome da pasta. Corpo em pt-BR; chaves do frontmatter em inglês.
- Fluxos (`refine-story`, `qa-plan`, `requirements-discovery`, `meeting-minutes`, `which-flow`, `configure-refinement`) são invocados pelo usuário: `disable-model-invocation: true` e `policy.allow_implicit_invocation: false` no `openai.yaml`. As primitivas `socratic-examination` e `requirements-rigor` são invocadas pelo modelo: a `description` é o ponteiro que decide quando disparam. Uma skill invocada só pelo usuário não pode ser chamada por outra skill; o que um fluxo precisa de outra skill, ele chama de uma primitiva ou faz ele mesmo.
- Regra que mais de um fluxo usa vive em `requirements-rigor` ou em `socratic-examination`, uma vez. Fluxo aponta para lá; não repete.
- Sem travessão em nenhuma prosa do repositório. Reescreva com vírgula, dois-pontos ou ponto.
- Skill nova ou renomeada entra em `plugin.json`, no `README.md` e no roteador `which-flow`. Um roteador que não conhece uma skill é um roteador que mente.
- `prompts/` é gerado de `skills/` por `scripts/build-prompts.mjs` e nunca editado à mão. Mudou uma skill, rode o build; o validador reprova prompt desatualizado. Referência nova a arquivo ou à Skill tool dentro de uma skill precisa de uma regra de adaptação no build, senão ele falha.

## Definição de pronto

`node scripts/validate-skills.mjs` e `claude plugin validate . --strict` verdes; `node scripts/build-prompts.mjs` rodado depois de qualquer mudança em `skills/`. Mensagens de commit em Conventional Commits; commit e push só quando o usuário pedir.

## Como escrever

Todo passo termina em critério de conclusão, checável e exigente. Referência que só alguns ramos usam vai para um arquivo irmão apontado do `SKILL.md`; o que todo ramo precisa fica inline. Frase que não muda o comportamento do agente é cortada. Diga o comportamento desejado em vez de proibir o indesejado. Mantenha cada significado num lugar só.

## Dogfooding e evals

`scripts/link-skills.sh` linka `skills/*` em `~/.claude/skills` e `~/.agents/skills` para usar as skills neste próprio repositório. Evals em `evals/`, no formato do `skill-creator` da Anthropic; `scripts/grade-output.mjs` roda as asserções mecânicas de um artefato. A camada de controle completa está em `docs/agents/harness.md`.
