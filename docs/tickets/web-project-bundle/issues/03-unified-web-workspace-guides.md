# 03: Document unified web workspace setup in Getting Started guides, `README.md`, and harness docs

Status: resolved
Blocked by: 01, 02
Type: task
Origin: 2026-10-28 (commit 8675cac)

Users adopting prompts on web platforms need a clear step-by-step guide explaining how to set up a single shared web workspace (`prompts/project/`) versus pasting standalone prompts (`prompts/*.md`) in ad-hoc chats, why opening a new chat inside the same web workspace mirrors `/clear`, and how platform file limits and memory updates work.

Update `docs/getting-started.pt-BR.md`, `docs/getting-started.md`, `README.md`, `docs/agents/harness.md`, and `evals/README.md`, run two-axis `code-review` (`Standards` and `Spec`), and verify all Definition of Done checks.

## Acceptance criteria

- `docs/getting-started.pt-BR.md` and `docs/getting-started.md` clearly present **Option A: Unified Web Workspace (`prompts/project/`)** (step-by-step setup of `INSTRUCTIONS.md` in System Prompt / Instructions, the 6 modular files + product context in Knowledge Base, why opening a new thread inside the same Project mirrors `/clear` while keeping knowledge shared, and Memory / Knowledge Base Updates) alongside **Option B: Ad-hoc Single Chat (`prompts/*.md`)**.
- `README.md` (`Usage in Chat and Prompt-Based Agents`), `docs/agents/harness.md`, and `evals/README.md` reflect both `prompts/*.md` and `prompts/project/`.
- Two-axis `code-review` (`Standards` and `Spec`) completes with any findings resolved, and all Definition of Done checks (`node scripts/validate-skills.mjs`, `node scripts/build-prompts.mjs --check`, `claude plugin validate . --strict`) pass with zero dashes across all repository prose.

## Comments

- 2026-10-28 Preflight (commit 8675cac): confirmed
  - Docs: `AGENTS.md:19-28` governs zero dashes, concise writing, and Definition of Done; `CONTEXT.md:9-113` governs package vocabulary (`User Story`, `examination`, `invention`, `workspace`); `docs/adr/0004-canonical-english-with-pt-br-localization.md` governs `en-US` and `pt-BR` parity.
  - Package: Tickets 01 and 02 are `resolved`; `docs/getting-started.pt-BR.md:85-105`, `docs/getting-started.md:85-105`, `README.md:11,116-119,227,241`, `docs/agents/harness.md:14,20,27`, and `evals/README.md:9,69,93` still describe only standalone `prompts/*.md` without `prompts/project/`: confirmed.
  - Reproduction: not applicable (documentation and final two-axis review).
  - Criteria: 3 still hold, 0 already satisfied, 0 need changing
  - Conflicts: check anchor link from `README.md:118` to `docs/getting-started.md` Section 4 heading so the markdown anchor stays valid.
- 2026-10-28 Resolution: documented Option A (Unified Web Workspace via `prompts/project/`) vs. Option B (Ad-hoc Single Chat via `prompts/*.md`) across `docs/getting-started.pt-BR.md`, `docs/getting-started.md`, `README.md`, `skills/which-flow/SKILL.md`, `CONTEXT.md`, `docs/agents/harness.md`, and `evals/README.md`, completed two-axis `code-review` (`Standards` `257e69c3` and `Spec` `f444919f`), resolved all findings (eliminated intra-file duplication in `prompts/project/INSTRUCTIONS.md`, enforced 0 dead rules inside `build-prompts.mjs`, restricted `prompts/project/` eval suites in `validate-skills.mjs`, checked all 6 primitive headings, and aligned Knowledge Base input wording), and passed all Definition of Done gates.
