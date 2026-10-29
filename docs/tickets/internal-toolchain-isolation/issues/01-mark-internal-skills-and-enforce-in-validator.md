# 01: Mark internal engineering skills with `metadata.internal: true` and enforce isolation in `validate-skills.mjs`

Status: resolved
Blocked by: none
Type: task
Origin: 2026-10-29 (commit c8bb617)

Running `npx skills add RafaelFerSilva/refinement-agent-skills` discovers 37 skills instead of 10 because `vercel-labs/skills` walks `.agents/skills/` and `.claude/skills/` alongside `skills/`, and none of the 27 vendored construction skills carry `metadata.internal: true`.

Add the test-first validator checks in `scripts/validate-skills.mjs`, mark all 27 engineering skills in `.claude/skills/` and `.agents/skills/` with `metadata.internal: true`, document the invariant in `AGENTS.md` and `docs/agents/harness.md`, and verify against `skills@1.7.4` plus the Definition of Done.

## Acceptance criteria

- `scripts/validate-skills.mjs` fails whenever any `SKILL.md` outside `skills/` lacks `internal: true` directly under a unique top-level `metadata:` frontmatter map, whenever any `SKILL.md` inside `skills/` declares `internal: true`, or whenever `.claude/skills/` and `.agents/skills/` differ in file set or file contents.
- Every `SKILL.md` under `.claude/skills/` (27 skills) and `.agents/skills/` (27 skills) declares `metadata.internal: true` with valid, duplicate-free YAML frontmatter (`pr/SKILL.md` merges `internal: true` into its existing `metadata:` map), and `.claude/skills/` matches `.agents/skills/` byte for byte.
- `npx --offline skills add /home/rafael/Documents/refinement-agent-skills --list` reports `Found 10 skills` (only `Refinement Skills`, zero `General` skills, zero YAML parse warnings), and a non-interactive install into a temporary directory writes only the 10 package skills into `skills-lock.json`.
- `AGENTS.md` and `docs/agents/harness.md` document the `metadata.internal: true` isolation invariant and validator checks, and `node scripts/validate-skills.mjs`, `node scripts/build-prompts.mjs --check`, and `claude plugin validate . --strict` exit 0.

## Comments

- 2026-10-29 Preflight (commit c8bb617): confirmed
  - Docs: `AGENTS.md:12,26,34` governs self-containment under `skills/`, Definition of Done, and local construction skills in `.claude/skills/` and `.agents/skills/`; `CONTEXT.md:99-101` defines target Workspace; `docs/agents/harness.md:7-22` records distribution and `validate-skills.mjs` checks; `docs/adr/` carries no conflicting ADR.
  - Package: `.claude/skills/*/SKILL.md` (27 files) and `.agents/skills/*/SKILL.md` (27 files) match byte for byte (`diff -rq` exits 0), none declare `metadata.internal: true`, `.claude/skills/pr/SKILL.md:4-9` and `.agents/skills/pr/SKILL.md:4-9` already carry a `metadata:` map (`credits`), and `scripts/validate-skills.mjs:39-67,131-136` checks frontmatter only under `skills/`: confirmed. `git log c8bb617..HEAD` empty.
  - Reproduction: `npx skills add /home/rafael/Documents/refinement-agent-skills --list` (`skills@1.7.4`) outputs `Found 37 skills` (`Refinement Skills` 10 + `General` 27), and `npx --offline skills add /home/rafael/Documents/refinement-agent-skills --json -y` in `/tmp/repro-target` installs all 37 skills and writes all 37 into `skills-lock.json`.
  - Criteria: 4 still hold, 0 already satisfied, 0 need changing
  - Conflicts: `skills/` is untouched so `prompts/` requires no regeneration, though `build-prompts.mjs --check` remains part of Definition of Done; merge `internal: true` into existing `metadata:` in `pr/SKILL.md` to avoid duplicate YAML keys.
- 2026-10-29 Resolution: extended `frontmatter()` in `scripts/validate-skills.mjs` to parse block-indented YAML maps (enforcing unique keys at every nesting level, consistent indentation, and quoted `: ` scalars across both `skills/` and internal skills), required `metadata.internal: true` on every `SKILL.md` outside `skills/`, forbade `internal: true` under `skills/`, enforced byte-for-byte parity between `.claude/skills/` and `.agents/skills/`, marked all 27 engineering skills in `.claude/skills/` and `.agents/skills/` with `metadata.internal: true`, updated `AGENTS.md` and `docs/agents/harness.md`, resolved two-axis review findings (`Standards` and `Spec`), and verified `npx --offline skills add /home/rafael/Documents/refinement-agent-skills --list` (`Found 10 skills`, 0 warnings) plus a clean temp workspace install (`10` skills in `skills-lock.json`).
