# 02: Deliver consolidated memory updates at synthesis in chat prompts

Status: resolved
Blocked by: 01
Type: task
Origin: 2026-10-28 (commit 4a0a98f)

In chat mode (`prompts/`), users often store `CONTEXT.md`, `product-overview.md`, and ADRs in an AI platform's persistent memory or knowledge base (Claude Projects, Custom GPTs, Gems, Copilot Studio), which the model cannot update automatically. Currently `scripts/build-prompts.mjs` instructs the model to emit isolated `"Glossary"` blocks mid-round, scattering updates across intermediate turns and leaving an unadapted workspace reference in `socratic-examination` (`where the workspace has one`).

Upgrade `scripts/build-prompts.mjs` and regenerate all examination prompts (`bootstrap-context`, `refine-story`, `requirements-discovery`, `qa-plan`) so context updates are delivered cleanly at synthesis without risking data loss on platforms that retrieve knowledge files via partial search chunks (RAG).

## Acceptance criteria

- During examination rounds in chat mode, resolved glossary terms and baseline changes are acknowledged briefly without dumping file blocks mid-round.
- At synthesis in chat mode, whenever a session adds or flags `CONTEXT.md` entries, modifies `product-overview.md` facts, or records an ADR, the response includes a dedicated Knowledge Base / Memory Updates section containing copy-ready blocks.
- For `CONTEXT.md` and `product-overview.md`, the prompt distinguishes full-file replacement (when creating from scratch or when the complete prior file was pasted inline in the conversation) from an append/delta update block (when prior context came from platform memory or knowledge retrieval where unseen entries may exist).
- The unadapted `where the workspace has one` phrasing from `socratic-examination` is adapted cleanly for chat mode, and the final report step reminds the user to update modified files in their agent platform's memory or knowledge base before starting the next session (omitting the section when nothing changed).
- `node scripts/build-prompts.mjs` and `node scripts/validate-skills.mjs` pass with zero dead rules in `RULES`.

## Comments

- 2026-10-28 Preflight (commit 4a0a98f, after ticket 01): confirmed
  - Docs: `AGENTS.md` Invariants (`prompts/` generated from `skills/` via `scripts/build-prompts.mjs`, never edited manually, zero dead rules in `RULES`, no dashes) and ADR `0004`/`0005` (`en-US` and `pt-BR` localization) apply; `docs/agents/harness.md:20,62` and `evals/refine-story.json:98-113` govern chat-prompt invariants (Round 1 makes no reference to writing/saving files, `.scratch/`, `docs/agents/refinement.md`, `/configure-refinement`, operating modes, or subagents).
  - Package: `Blocked by: 01` is `Status: resolved`: confirmed. `scripts/build-prompts.mjs:77-80,103` still emits mid-round `"Glossary"` blocks, `skills/socratic-examination/SKILL.md:42` leaves `Re-read CONTEXT.md, where the workspace has one` unadapted in `prompts/*.md`, and `prompts/bootstrap-context.md:31,47,49` still carries `in no-code mode` and `docs/` save paths: confirmed.
  - Reproduction: verified in `prompts/refine-story.md:10,114` and `prompts/bootstrap-context.md:10,31,37,47,49`.
  - Criteria: 5 still hold, 0 already satisfied, 0 need changing
  - Conflicts: Round 1 behavior in chat prompts must remain free of file-saving chatter so `evals/refine-story.json` case 6 assertions hold; every entry in `RULES` must change at least one generated prompt (`0` dead rules).
- 2026-10-28 Implemented: updated `CHAT()` and `RULES` in `scripts/build-prompts.mjs` across all examination prompts (`bootstrap-context`, `refine-story`, `requirements-discovery`, `qa-plan`) so mid-round resolutions are acknowledged in one brief line and consolidated at final synthesis under a dedicated "Memory / Knowledge Base Updates" section ("Atualizações para a Memória / Base de Conhecimento" in `pt-BR`), distinguishing full-file replacement (when creating from scratch or when the entire prior file was pasted inline) from append/delta blocks (`Append to CONTEXT.md` / `Adicionar ao CONTEXT.md`) when prior context came from platform memory/RAG, plus a reminder in the report step when context changed; adapted `where the workspace has one` in `socratic-examination` and `bootstrap-context` step paths; verified `52` live rules (`0` dead rules) and `node scripts/validate-skills.mjs` green.

