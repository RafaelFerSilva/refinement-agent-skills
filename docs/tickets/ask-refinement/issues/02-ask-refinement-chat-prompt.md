# 02: Generate standalone `prompts/ask-refinement.md` for chat platforms

Status: resolved
Blocked by: 01
Type: task
Origin: 2026-10-28 (commit 0803edb)

Chat-mode users running the standalone prompts in Claude Projects, Custom GPTs, Gemini Gems, or Copilot Studio need a self-contained `prompts/ask-refinement.md` to ask how the prompt collection works, what markers and verdicts mean, and how to maintain `CONTEXT.md`, `product-overview.md`, and ADRs in platform memory without triggering examination rounds.

Extend `scripts/build-prompts.mjs` to compose `prompts/ask-refinement.md` from `skills/ask-refinement/SKILL.md` and the package primitives framed strictly as reference material, adapting workspace and tool references cleanly with zero dead rules.

## Acceptance criteria

- `scripts/build-prompts.mjs` generates `prompts/ask-refinement.md` and updates `prompts/which-flow.md` to reference it alongside the workflow prompts.
- `prompts/ask-refinement.md` carries a chat-mode assistant header instructing single-turn Q&A over user-provided conversation context and platform memory, embeds `socratic-examination` and `requirements-rigor` (plus companion formats) explicitly as reference material rather than active examination instructions, and explains the `"Memory / Knowledge Base Updates"` full-replacement versus append/delta rules accurately.
- Every rule in `RULES` inside `scripts/build-prompts.mjs` is live (removing any rule breaks `--check`), and `node scripts/build-prompts.mjs --check` exits 0 with zero unadapted `Skill tool`, companion `.md` links, `$ARGUMENTS`, or `docs/agents/` paths.

## Comments

- 2026-10-28 Preflight (commit 0803edb, after ticket 01): confirmed
  - Docs: `AGENTS.md:22` (`prompts/` generated via `scripts/build-prompts.mjs`, never edited manually, every file or `Skill tool` reference in `skills/` adapted); `scripts/build-prompts.mjs:4-5` (every rule in `RULES` must be live; a rule whose removal keeps `--check` green is dead weight); `docs/agents/harness.md:14,20` (prompt sync verified mechanically).
  - Package: `Blocked by: 01` is `Status: resolved`: confirmed. `scripts/build-prompts.mjs:100-232` currently generates only `FLOWS` (`bootstrap-context`, `refine-story`, `qa-plan`, `requirements-discovery`, `meeting-minutes`) plus `which-flow.md`, and `prompts/ask-refinement.md` does not exist yet: confirmed.
  - Reproduction: running `node scripts/build-prompts.mjs` right now would neither generate `prompts/ask-refinement.md` nor adapt `skills/ask-refinement/SKILL.md` references (`docs/agents/refinement.md`, `docs/agents/issue-tracker.md`, `Skill tool for \`socratic-examination\``, companion `.md` references).
  - Criteria: 3 still hold, 0 already satisfied, 0 need changing
  - Conflicts: `FLOWS` currently lists the five examination/synthesis workflows referenced in `CHAT()` (`otherFlows`) and `router()` (`five prompts`); keep `ask-refinement` cleanly distinguished (either via `flow.kind` or separate `ASSISTANT` entry) so workflow prompts know `ask-refinement` exists without miscounting examination workflows, and frame `common()` inside `prompts/ask-refinement.md` explicitly as reference sections (`Reference: ...`) so the model never runs examination rounds when using `prompts/ask-refinement.md`.
- 2026-10-28 Resolution: added `askRefinement()` and live adaptation rules in `scripts/build-prompts.mjs`, generating `prompts/ask-refinement.md` (398 lines, with single-turn Q&A chat-mode header and primitives framed explicitly as reference material) and updating `prompts/which-flow.md` to list `ask-refinement.md`. Verified `node scripts/build-prompts.mjs --check` exits 0 and automated rule check confirms 0 dead rules across all 67 rules in `RULES`.

