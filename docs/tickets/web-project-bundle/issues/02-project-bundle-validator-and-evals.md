# 02: Add validator checks and evaluation cases for `prompts/project/`

Status: resolved
Blocked by: 01
Type: task
Origin: 2026-10-28 (commit 8675cac)

Once `prompts/project/` is generated, `scripts/validate-skills.mjs` needs mechanical checks enforcing the modular bundle's structure and non-duplication invariants, plus support for `prompts/project/` evaluation cases in `evals/`, verified behaviorally with isolated subagents.

Update `scripts/validate-skills.mjs` (test-first) to validate `prompts/project/` files and `prompts/project/` eval case shapes, add modular web-workspace cases to `evals/refine-story.json` and `evals/ask-refinement.json`, and run isolated subagent evaluations over the generated `prompts/project/` files.

## Acceptance criteria

- `scripts/validate-skills.mjs` verifies that `prompts/project/INSTRUCTIONS.md`, `prompts/project/refinement-core.md`, and every workflow in `prompts/project/<workflow>.md` exist, that no `prompts/project/<workflow>.md` duplicates `# Socratic examination` or `# Requirements rigor`, and that `prompts/project/` eval cases in `evals/*.json` declare `prompts/project/INSTRUCTIONS.md` and `prompts/project/refinement-core.md` (plus `prompts/project/<skill>.md` for workflow suites) with multi-line inline prompts and no local workspace fixtures (confirmed test-first before updating the eval check).
- `evals/refine-story.json` includes a unified web-workspace case using `prompts/project/INSTRUCTIONS.md`, `prompts/project/refinement-core.md`, and `prompts/project/refine-story.md`, and `evals/ask-refinement.json` includes a unified web-workspace `pt-BR` Q&A case using `prompts/project/INSTRUCTIONS.md` and `prompts/project/refinement-core.md`.
- Isolated subagent runs reading only the declared `prompts/project/` files pass all assertions for both new cases (confirming proper routing + Round 1 socratic examination on the User Story case, and single-turn `pt-BR` Q&A without `❓ Q<n>` rounds on the `ask-refinement` case).

## Comments

- 2026-10-28 Preflight (commit 8675cac): confirmed
  - Docs: `AGENTS.md:21-25` governs prompt validation and Definition of Done; `CONTEXT.md:9-113` governs package vocabulary; `docs/adr/0005-what-pt-br-localizes.md:13-16` governs canonical markers (`INVEST-FAIL`, `MANUAL-ONLY`); `docs/agents/harness.md:20,27` documents `validate-skills.mjs` eval checks.
  - Package: Ticket 01 is `resolved`; `scripts/validate-skills.mjs:213-229` currently rejects `prompts/project/*` in `evals/*.json` `files`, and does not yet check non-duplication of `# Socratic examination` / `# Requirements rigor` inside `prompts/project/<workflow>.md`: confirmed.
  - Reproduction: adding `prompts/project/*` cases to `evals/refine-story.json` and `evals/ask-refinement.json` first so `node scripts/validate-skills.mjs` goes red before updating the validator.
  - Criteria: 3 still hold, 0 already satisfied, 0 need changing
  - Conflicts: none
- 2026-10-28 Resolution: added `evals/refine-story.json` Case 7 and `evals/ask-refinement.json` Case 5 first (reproducing red `validate-skills.mjs`), updated `scripts/validate-skills.mjs` to enforce `prompts/project/` presence, zero primitive duplication across `prompts/project/<workflow>.md`, and valid `prompts/project/` eval case shapes, and verified `6/6` assertions on `refine-story` Case 7 (`d0d77be9`) plus `4/4` assertions on `ask-refinement` Case 5 (`e8c60a38`) via isolated subagents.
