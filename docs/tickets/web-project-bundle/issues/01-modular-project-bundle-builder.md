# 01: Extend `build-prompts.mjs` to generate the modular `prompts/project/` bundle

Status: resolved
Blocked by: none
Type: task
Origin: 2026-10-28 (commit 8675cac)

Web agent platforms with persistent instructions and Knowledge Base files (Claude Projects, ChatGPT Projects, Custom GPTs, Gemini Gems, Copilot Studio) currently have to upload six self-contained `prompts/*.md` files that repeat `socratic-examination` and `requirements-rigor` six times (~3,000 lines total), wasting Knowledge Base capacity and creating duplicate chunks in RAG search.

Extend `scripts/build-prompts.mjs` to generate `prompts/project/` alongside `prompts/*.md`, update `skills/which-flow/SKILL.md` and `skills/ask-refinement/SKILL.md` so router and Q&A guidance know about both `prompts/project/` (unified web workspaces) and `prompts/*.md` (ad-hoc chats), and ensure `node scripts/build-prompts.mjs --check` checks both distributions with zero dead rules.

## Acceptance criteria

- `node scripts/build-prompts.mjs` generates `prompts/project/INSTRUCTIONS.md`, `prompts/project/refinement-core.md`, and the five lean workflow files (`bootstrap-context.md`, `meeting-minutes.md`, `requirements-discovery.md`, `refine-story.md`, `qa-plan.md`), while keeping `prompts/*.md` self-contained at the root of `prompts/`.
- `prompts/project/INSTRUCTIONS.md` combines global chat-mode and `Memory / Knowledge Base Updates` rules, workflow routing (`which-flow`), and single-turn read-only Q&A (`ask-refinement`), instructing the agent to consult `refinement-core.md` and the target `<workflow>.md` file from the Knowledge Base.
- `prompts/project/refinement-core.md` holds `socratic-examination` (`SKILL.md`, `GLOSSARY.md`, `ADR.md`) and `requirements-rigor` (`SKILL.md`, `ANTI-PATTERNS.md`, `QUESTIONNAIRE.md`) once, and none of the five `prompts/project/<workflow>.md` files inline those primitive sections, reducing total `prompts/project/` line count by more than 50% compared to `prompts/*.md`.
- `skills/ask-refinement/SKILL.md` and standalone `prompts/which-flow.md` / `prompts/ask-refinement.md` distinguish `prompts/project/` (unified web workspace) from `prompts/*.md` (ad-hoc single chat), `node scripts/build-prompts.mjs --check` verifies both `prompts/*.md` and `prompts/project/*.md`, and every rule in `RULES` is live (0 dead rules).

## Comments

- 2026-10-28 Preflight (commit 8675cac): confirmed
  - Docs: `AGENTS.md:21` governs `prompts/` generation via `scripts/build-prompts.mjs` with zero manual edits; `scripts/build-prompts.mjs:4-5` governs the zero-dead-rules invariant; `CONTEXT.md:9-113` governs package vocabulary; `docs/agents/harness.md:14,20` governs prompt freshness checks.
  - Package: `scripts/build-prompts.mjs:280-307` generates only top-level `prompts/*.md`, `prompts/project/` does not exist yet, and `skills/ask-refinement/SKILL.md:58` does not yet distinguish `prompts/project/` from `prompts/*.md`: confirmed. `git log 8675cac..HEAD` empty.
  - Reproduction: not applicable (new modular bundle target).
  - Criteria: 4 still hold, 0 already satisfied, 0 need changing
  - Conflicts: parameterize cross-section references in `scripts/build-prompts.mjs` rather than adding parallel dead rules, so removing any rule in `RULES` breaks `--check`.
- 2026-10-28 Resolution: extended `scripts/build-prompts.mjs` to emit `prompts/project/INSTRUCTIONS.md`, `prompts/project/refinement-core.md`, and the five lean workflow files (`bootstrap-context.md`, `meeting-minutes.md`, `requirements-discovery.md`, `refine-story.md`, `qa-plan.md`, 1,436 lines total vs 3,042 standalone lines, >52% reduction and >56% Knowledge Base reduction) alongside self-contained `prompts/*.md`, updated `skills/ask-refinement/SKILL.md`, `prompts/which-flow.md`, and `prompts/ask-refinement.md`, added unexpected-file checks on `--check`, and verified 68/68 rules live (`0` dead rules).

