# 03: Add `evals/ask-refinement.json`, validator support, and documentation updates

Status: resolved
Blocked by: 01, 02
Type: task
Origin: 2026-10-28 (commit 0803edb)

`/ask-refinement` and `prompts/ask-refinement.md` need coverage in `evals/`, support in `scripts/validate-skills.mjs` for testing unconfigured workspaces, and discoverability in `README.md` and the Getting Started guides (`en-US` and `pt-BR`).

Update the validator and harness documentation, create `evals/ask-refinement.json` covering configured `en-US` and `pt-BR` workspaces, unconfigured cold start, and standalone chat mode, verify sample runs via isolated subagents, and update `README.md`, `docs/getting-started.md`, and `docs/getting-started.pt-BR.md`.

## Acceptance criteria

- `scripts/validate-skills.mjs` allows `evals/ask-refinement.json` skill cases without a workspace configuration fixture when testing unconfigured cold-start behavior (confirmed test-first before updating the check), documented in `docs/agents/harness.md`.
- `evals/ask-refinement.json` exists and passes `node scripts/validate-skills.mjs`, covering: (1) configured `en-US` workspace diagnosis and resuming a User Story after a developer questionnaire, (2) configured `pt-BR` ongoing product guidance explaining `[INFERÊNCIA:` versus invention, `[A CONFIRMAR: DEV]`, and `/bootstrap-context`, (3) unconfigured workspace cold start directing to `/configure-refinement` without failing, and (4) standalone chat-prompt execution (`prompts/ask-refinement.md`) explaining prompt usage and platform memory updates in one turn.
- Sample runs of `evals/ask-refinement.json` are executed via isolated subagents confirming single-turn read-only answers in `en-US`, `pt-BR`, unconfigured workspace, and chat mode.
- `README.md` (skills badge, workflow diagram, quick reference table, `npx skills update` command, skills catalog), `docs/getting-started.md`, `docs/getting-started.pt-BR.md`, and `evals/README.md` include `/ask-refinement` and `prompts/ask-refinement.md`, and all Definition of Done checks (`node scripts/validate-skills.mjs`, `node scripts/build-prompts.mjs --check`, `claude plugin validate . --strict`) pass.

## Comments

- 2026-10-28 Preflight (commit 0803edb, after tickets 01 and 02): confirmed
  - Docs: `evals/README.md:67-94` and `docs/agents/harness.md:20,27` govern `evals/<skill>.json` schema (`prompt`, `expected_output`, `files`, `assertions`), workspace configuration pairing, chat-prompt cases (`prompts/ask-refinement.md` alone in `files`, multi-line inline prompt, no `evals/fixtures/` or `docs/agents/refinement.md` path in prompt), and ADR 0005 canonical marker wording (`INVEST-FAIL` and `MANUAL-ONLY` named if demanding Portuguese markers); `AGENTS.md:20-26` governs README registration, zero dashes, and Definition of Done.
  - Package: `Blocked by: 01, 02` are both `Status: resolved`: confirmed. `scripts/validate-skills.mjs:228-230` currently rejects any non-chat eval case with `configs.length === 0`, `evals/ask-refinement.json` does not exist yet, and `README.md`, `docs/getting-started.md`, `docs/getting-started.pt-BR.md`, and `evals/README.md` do not yet list `ask-refinement`: confirmed.
  - Reproduction: test-first will update `README.md` and create `evals/ask-refinement.json` including Case 3 (unconfigured workspace with `files: []`), confirm `node scripts/validate-skills.mjs` fails specifically on `evals/ask-refinement.json: case 3 provides no workspace configuration fixture`, then update `scripts/validate-skills.mjs:229` and `docs/agents/harness.md:20` and confirm green.
  - Criteria: 4 still hold, 0 already satisfied, 0 need changing
  - Conflicts: none; avoid any em-dash or en-dash in `README.md`, Getting Started guides, and `evals/ask-refinement.json`, and respect `CONTEXT.md` `_Avoid_` vocabulary.
- 2026-10-28 Resolution: verified test-first validator failure on Case 3 before updating `scripts/validate-skills.mjs` (`CONFIG_OPTIONAL_SUITES` requiring at least one unconfigured cold-start skill case while preserving prompt/config agreement and `code-workspace/` leak checks), created `evals/ask-refinement.json` (4 cases), verified all 16 behavioral assertions across isolated subagent runs (`en-US`, `pt-BR`, unconfigured workspace, and standalone chat prompt), addressed two-axis `code-review` findings (`Idioma:` legacy read support, unblocked decision-map rule, `MEMORY_UPDATES_BULLETS` deduplication, `"Template"` reference adaptation in `prompts/ask-refinement.md`, and `README.md` support-skill grouping), and updated `README.md`, `docs/getting-started.md`, `docs/getting-started.pt-BR.md`, `docs/agents/harness.md`, and `evals/README.md`.


