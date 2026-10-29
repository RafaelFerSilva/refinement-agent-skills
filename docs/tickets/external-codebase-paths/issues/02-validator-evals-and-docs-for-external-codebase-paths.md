# 02: Document external and multi-repo `with-code` setups and evaluate `/ask-refinement` and `/configure-refinement`

Status: resolved
Blocked by: 01
Type: task
Origin: 2026-10-29 (commit 81d7b5f)

`README.md`, `docs/getting-started.md`, `docs/getting-started.pt-BR.md`, and `CONTEXT.md` still imply that `with-code` requires installing inside the product codebase repository and that dedicated refinement workspaces are `without-code` only.

Update documentation across both languages, add an evaluation case to `evals/ask-refinement.json`, verify both `/ask-refinement` and `/configure-refinement` via isolated subagents, and complete the two-axis code review and Definition of Done.

## Acceptance criteria

- `README.md`, `docs/getting-started.md`, `docs/getting-started.pt-BR.md`, `CONTEXT.md`, and `docs/agents/harness.md` document that `with-code` works either inside the product repository or from a dedicated refinement workspace pointing `## Fact sources` at one or more local source repositories (read-only, exposed via Multi-root workspace folders or `claude --add-dir <path>`).
- `evals/ask-refinement.json` adds Case 6 (`pt-BR` question asking whether `with-code` requires installing inside the code repository or supports pointing to separate backend/frontend repository paths), passing `node scripts/validate-skills.mjs`.
- Isolated subagent evaluations confirm Case 6 of `evals/ask-refinement.json` satisfies all assertions and `/configure-refinement` guides external multi-repo `with-code` setup cleanly.
- Two-axis `code-review` (`Standards` and `Spec`) findings are resolved, and `node scripts/validate-skills.mjs` plus `node scripts/build-prompts.mjs --check` exit 0.

## Comments

- 2026-10-29 Preflight (commit 81d7b5f): confirmed
  - Docs: `AGENTS.md:17-26` governs canonical English prose, zero em-dash or en-dash, single source of truth, and Definition of Done; `CONTEXT.md:99-105` and `docs/adr/0006-a-glossary-rule-held-by-a-check.md` govern glossary format; `docs/adr/0004-canonical-english-with-pt-br-localization.md` and `docs/adr/0007-canonical-english-mode-tokens.md` govern localized guides and canonical mode tokens; `docs/agents/harness.md:21` lists validator invariants.
  - Package: `README.md:103,105,170` says `with-code` installs in `The product codebase repository` without covering dedicated workspaces or multi-repo paths; `docs/getting-started.md:11,32,40,72` and `docs/getting-started.pt-BR.md:11,32,40,72` frame dedicated workspaces as `without-code` only and omit Multi-root / `claude --add-dir`; `CONTEXT.md:100,104` omits external read-only codebase paths in `with-code`; `docs/agents/harness.md:21` omits the new `source code in` and `Multi-root`/`--add-dir` validator checks; `evals/ask-refinement.json` ends at Case 5: confirmed. Ticket 01 is resolved; `git log 81d7b5f..HEAD` empty.
  - Reproduction: verified by reading `README.md`, `docs/getting-started.md`, `docs/getting-started.pt-BR.md`, `CONTEXT.md`, `docs/agents/harness.md`, and `evals/ask-refinement.json`.
  - Criteria: 4 still hold, 0 already satisfied, 0 need changing
  - Conflicts: `CONTEXT.md` entries must stay strictly glossary definitions with `_Avoid_` lines (no operational how-to steps); zero em-dash or en-dash across all edited `.md` and `.json` files.
- 2026-10-29 Resolution: updated `README.md`, `docs/getting-started.md`, `docs/getting-started.pt-BR.md`, `CONTEXT.md`, and `docs/agents/harness.md`; added Case 6 to `evals/ask-refinement.json`; verified isolated behavioral subagent runs on `/ask-refinement` Case 6 (4/4 assertions passed, re-verified after pointer refactor) and `/configure-refinement` external multi-repo flow; resolved all `Standards` and `Spec` review findings (positive halt-before-Round-1 rule in `requirements-rigor`, preserving `.` alongside sibling repositories in `configure-refinement`, single-source sandbox guidance via `requirements-rigor` pointer in `ask-refinement`, separated validator block in `validate-skills.mjs`, and bounded structural anchors in `build-prompts.mjs`); and passed `node scripts/validate-skills.mjs` and `node scripts/build-prompts.mjs --check`.
