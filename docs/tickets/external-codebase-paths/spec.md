# Spec: external and multi-repository codebase paths in `with-code` mode

Status: resolved
Origin: 2026-10-29 (commit 81d7b5f)

## Problem Statement

Teams adopting `refinement-skills` in `with-code` mode often work across multiple source repositories (for example separate `backend`, `frontend`, and `mobile` repos) or prefer keeping product refinement artifacts (`CONTEXT.md`, `docs/reference/`, `.scratch/`) in a dedicated refinement workspace rather than inside an engineering codebase repository.

While examination workflows already consult `## Fact sources` in `docs/agents/refinement.md` (as exercised by `evals/fixtures/refinement-with-code-en-US.md`), three gaps prevent external and multi-repo `with-code` setups from working smoothly out of the box:

1. **`/configure-refinement` assumes code lives in the current directory:** Step 1 only checks the workspace root for code signals, Step 2 does not offer `with-code` with external repository path(s) when the current folder has no source code (nor ask about sibling repositories in multi-repo products), and `skills/configure-refinement/refinement.md` omits `source code in <path>` from `## Fact sources`.
2. **No shared primitive rule for external codebase paths or sandbox boundaries:** neither `requirements-rigor` nor `socratic-examination` states that `with-code` reads the codebase path(s) listed in `## Fact sources` strictly read-only (defaulting to `.` when none is listed) or instructs halting before Round 1 when a path is unreadable in the session to report how to grant read-only access (Multi-root workspace folders or `claude --add-dir <path>`).
3. **Documentation implies `with-code` requires installing inside the code repo:** `README.md`, `docs/getting-started.md`, `docs/getting-started.pt-BR.md`, `CONTEXT.md`, `which-flow`, and `ask-refinement` describe dedicated workspaces only for `without-code` mode.

## Solution

Support both in-repo and external/multi-repo `with-code` setups cleanly across configuration, shared primitives, Q&A, and documentation:

1. **Authoritative `with-code` path and sandbox rule in `skills/requirements-rigor/SKILL.md`:** define once (loaded in Step 1 of every workflow) that `with-code` inspects source code strictly read-only at every codebase path declared in `## Fact sources` of `docs/agents/refinement.md` (defaulting to the workspace root `.` when no separate path is listed), and that if any declared codebase path is missing or unreadable in the current session, the agent halts before opening Round 1, reports the unreadable path and how to grant read-only access (adding the folder to a Multi-root workspace in Antigravity, VS Code, or Cursor, or passing `claude --add-dir <path>`), and waits for the user either to expose the path or to confirm continuing in `without-code` mode.
2. **First-class external and multi-repo setup in `/configure-refinement`:**
   - Explore existing codebase paths in `docs/agents/refinement.md` alongside local code signals in Step 1.
   - Inquire about external codebase path(s) when the user chooses `with-code` in a code-free workspace, and about additional sibling repository paths when code exists locally in a multi-repo product; check whether confirmed paths are currently readable and provide Multi-root / `claude --add-dir` instructions whenever paths live outside the workspace root.
   - Update `skills/configure-refinement/refinement.md` (`## Mode` and `## Fact sources`) so `with-code` records `source code in <"." or read-only codebase path(s)>` and `without-code` omits it.
3. **Align `which-flow`, `ask-refinement`, `CONTEXT.md`, `README.md`, and Getting Started guides (`en-US` and `pt-BR`):** explain both in-repo `with-code` and dedicated-workspace / multi-repo `with-code` (including Multi-root workspace and `claude --add-dir <path>` setup), regenerate `prompts/` via `scripts/build-prompts.mjs` with zero dead rules, and add mechanical validator checks plus an `evals/ask-refinement.json` evaluation case.

## User Stories

1. As a Product Owner or QA engineer maintaining a dedicated refinement workspace for a product with separate backend and frontend repositories, I want `/configure-refinement` to configure `Mode: with-code` pointing `## Fact sources` at `../product-api` and `../product-web` (read-only) and tell me how to expose those folders to my agent session, so that workflows inspect real source code without cluttering engineering repositories.
2. As an engineer running `/bootstrap-context`, `/refine-story`, `/qa-plan`, or `/requirements-discovery` in `with-code` mode with external repository paths, I want the agent to inspect all listed codebase paths strictly read-only, and alert me immediately if a path is missing or blocked by the sandbox instead of silently skipping code checks.
3. As a user asking `/ask-refinement` (or reading `README.md` and the Getting Started guides in `en-US` or `pt-BR`) whether `with-code` must run inside the code repository, I want a clear explanation of both setups (in-repo vs. dedicated workspace pointing to one or more local repository paths, plus Multi-root / `claude --add-dir`).

## Implementation Decisions

- **Single shared rule in `requirements-rigor`:** every workflow invokes `requirements-rigor` in Step 1 before any codebase inspection (`bootstrap-context` Step 1, `requirements-discovery` Step 3, `refine-story` Step 4, `qa-plan` Step 4), making `skills/requirements-rigor/SKILL.md` the single authoritative home per `AGENTS.md:19`.
- **Clean stripping in `scripts/build-prompts.mjs`:** chat-mode prompts (`prompts/*.md` and `prompts/project/*.md`) always run `without-code`, so `RULES` strips the `with-code` filesystem/sandbox sentence from `requirements-rigor` and adapts `which-flow` / `ask-refinement` cleanly with zero dead rules.
- **Read-only guarantee on external codebase paths:** refinement workflows only write to the refinement workspace (`CONTEXT.md`, `docs/`, `.scratch/`); external source repositories listed in `## Fact sources` are never modified.

## Testing Decisions

- **Validator seam (`scripts/validate-skills.mjs`, test-first):** verify mechanically that `skills/configure-refinement/refinement.md` includes `source code in` under `## Fact sources`, that `skills/configure-refinement/SKILL.md` and `skills/requirements-rigor/SKILL.md` cover external codebase paths plus `Multi-root` and `--add-dir` sandbox guidance, and that `prompts/` stays in sync with zero dead adaptation rules.
- **Behavioral evaluation seam (`evals/ask-refinement.json` + isolated subagents):** add Case 6 to `evals/ask-refinement.json` (`pt-BR` question on in-repo vs. external multi-repo `with-code` setup) and execute isolated subagents on both `/ask-refinement` Case 6 and `/configure-refinement` in an empty workspace targeting external multi-repo paths.

## Out of Scope

- Cloning remote GitHub/GitLab URLs automatically during refinement runs (local checkouts on disk remain the source for read-only subagent inspection).
- Changing chat-mode prompts (`prompts/`) away from `without-code`.
