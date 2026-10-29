# 01: Support external and multi-repo codebase paths in `configure-refinement`, `requirements-rigor`, `which-flow`, `ask-refinement`, and `build-prompts`

Status: resolved
Blocked by: none
Type: task
Origin: 2026-10-29 (commit 81d7b5f)

`with-code` workflows already read `## Fact sources` in `docs/agents/refinement.md`, yet `/configure-refinement` does not ask for or template external/multi-repo codebase paths, `requirements-rigor` does not define the read-only path resolution and unreadable-path guard, and `which-flow` / `ask-refinement` do not explain external `with-code` paths.

Add the validator checks test-first in `scripts/validate-skills.mjs`, update `skills/requirements-rigor/SKILL.md`, `skills/configure-refinement/SKILL.md`, `skills/configure-refinement/refinement.md`, `skills/which-flow/SKILL.md`, `skills/ask-refinement/SKILL.md`, and `scripts/build-prompts.mjs`, and regenerate `prompts/`.

## Acceptance criteria

- `scripts/validate-skills.mjs` checks that `skills/configure-refinement/refinement.md` templates `source code in` under `## Fact sources` and that `skills/configure-refinement/SKILL.md` and `skills/requirements-rigor/SKILL.md` include external codebase path and sandbox (`Multi-root` and `--add-dir`) guidance (failing red before the skill edits and passing green after).
- `skills/requirements-rigor/SKILL.md` defines once that `with-code` inspects source code strictly read-only at every codebase path listed in `## Fact sources` of `docs/agents/refinement.md` (defaulting to `.` when none is listed), and instructs halting before Round 1 when any listed path is missing or sandbox-blocked to report `Multi-root` / `claude --add-dir <path>` access instructions and wait for the user to expose the path or confirm `without-code`.
- `skills/configure-refinement/SKILL.md` and `skills/configure-refinement/refinement.md` support external and multi-repo codebase paths in `with-code` mode (exploring existing `## Fact sources` paths in Step 1, inquiring about external or additional sibling repo paths and checking readability in Step 2, writing `source code in ...` under `## Fact sources` in Step 3 while omitting it in `without-code`, and reminding about `Multi-root` / `--add-dir` in Step 4).
- `skills/which-flow/SKILL.md` and `skills/ask-refinement/SKILL.md` reflect in-repo and external/multi-repo `with-code` setups, `scripts/build-prompts.mjs` regenerates `prompts/` cleanly with zero dead rules, and `node scripts/validate-skills.mjs` passes.

## Comments

- 2026-10-29 Preflight (commit 81d7b5f): confirmed
  - Docs: `AGENTS.md:18-22` governs shared rules in `requirements-rigor` or `socratic-examination`, zero dashes, `<500` lines per `SKILL.md`, and `scripts/build-prompts.mjs` regeneration; `CONTEXT.md:99-105` defines Workspace and Mode; `docs/adr/0007-canonical-english-mode-tokens.md` governs canonical `with-code` and `without-code` tokens; `docs/agents/harness.md:20` governs `validate-skills.mjs` mode checks.
  - Package: `skills/configure-refinement/SKILL.md:13-20,31` checks code signals only in the workspace root and never asks for external or sibling repository paths; `skills/configure-refinement/refinement.md:11,20` omits `source code in` from `## Fact sources`; `skills/requirements-rigor/SKILL.md:27` does not specify read-only path resolution from `## Fact sources` or unreadable/sandboxed path handling; `skills/which-flow/SKILL.md:32` and `skills/ask-refinement/SKILL.md:16,31` do not mention external codebase paths: confirmed. `git log 81d7b5f..HEAD` empty.
  - Reproduction: verified by inspecting `skills/configure-refinement/SKILL.md`, `skills/configure-refinement/refinement.md`, and `skills/requirements-rigor/SKILL.md`.
  - Criteria: 4 still hold, 0 already satisfied, 0 need changing
  - Conflicts: `scripts/build-prompts.mjs:67,103,106,352` matches exact passages in `requirements-rigor`, `ask-refinement`, and `which-flow`, so those adaptation regexes must update in lockstep with zero dead rules; `configure-refinement/SKILL.md` and `requirements-rigor/SKILL.md` must keep all four mode tokens (`with-code`, `without-code`, `com-codigo`, `sem-codigo`).
- 2026-10-29 Resolution: added test-first checks in `scripts/validate-skills.mjs` (confirmed red with 5 errors before skill edits), defined read-only `Fact sources` codebase path resolution and unreadable/sandboxed path reporting (`Multi-root` and `claude --add-dir <path>`) once in `skills/requirements-rigor/SKILL.md`, updated `skills/configure-refinement/SKILL.md`, `skills/configure-refinement/refinement.md`, `skills/which-flow/SKILL.md`, `skills/ask-refinement/SKILL.md`, and `scripts/build-prompts.mjs`, regenerated `prompts/` with zero dead rules and zero chat-mode filesystem leaks, and passed `node scripts/validate-skills.mjs`.
