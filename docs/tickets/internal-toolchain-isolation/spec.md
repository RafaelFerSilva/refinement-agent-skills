# Spec: isolate internal development skills from external `npx skills add` installation

Status: resolved
Origin: 2026-10-29 (commit c8bb617)

## Problem Statement

This repository maintains its construction toolchain (27 engineering skills derived from `mattpocock/skills`) locally inside `.claude/skills/` and `.agents/skills/` so contributors working in Claude Code or Antigravity have zero global dependencies (`AGENTS.md:34`).

However, the Agent Skills CLI (`npx skills add RafaelFerSilva/refinement-agent-skills`, `vercel-labs/skills`) walks both `skills/` and every `AGENT_PROJECT_SKILL_DIRS` container (including `.agents/skills/` and `.claude/skills/`) when discovering skills in a source repository. Because none of those 27 engineering skills declare `metadata.internal: true` in their `SKILL.md` frontmatter, `npx skills add` discovers all 37 skills (the 10 published `Refinement Skills` plus the 27 internal `General` engineering skills). When invoked inside an agent terminal (such as Antigravity), the CLI enters non-interactive mode and installs all 37 skills into the target workspace, writing all 37 entries into `skills-lock.json` pointing to `RafaelFerSilva/refinement-agent-skills` and copying internal `SKILL.md` files whose bodies reference this repository's `docs/agents/build-*.md`, `docs/agents/ticket-preflight.md`, and `scripts/validate-skills.mjs`.

## Solution

Isolate the internal engineering toolchain from external skill discovery while preserving zero-dependency local usage inside this repository:

1. **Mark all internal `SKILL.md` files with `metadata.internal: true`:** add `internal: true` under the top-level `metadata:` YAML frontmatter map of all 27 engineering skills in both `.claude/skills/` and `.agents/skills/` (merging cleanly into existing `metadata:` blocks such as `pr/SKILL.md` without duplicating map keys). `vercel-labs/skills` excludes `metadata.internal: true` skills from `npx skills add` unless `INSTALL_INTERNAL_SKILLS=1` is explicitly set, whereas Claude Code and Antigravity treat `metadata` as free-form tooling metadata and continue loading repository-local skills normally inside this repository.
2. **Enforce isolation and mirror parity mechanically in `scripts/validate-skills.mjs`:**
   - Require every `SKILL.md` in the repository outside `skills/` to pass shared frontmatter validation (unique keys at every map level, quoted `: ` values, consistent space indentation) and declare `internal: true` directly inside its top-level `metadata:` map.
   - Require every published `SKILL.md` under `skills/` not to declare `internal: true`.
   - Require `.claude/skills/` and `.agents/skills/` to contain the exact same relative file set with byte-for-byte identical contents so an internal skill never drifts or loses `metadata.internal: true` on one side.
3. **Document the boundary in `AGENTS.md` and `docs/agents/harness.md`:** record why internal `SKILL.md` files carry `metadata.internal: true` and what `validate-skills.mjs` enforces.

## User Stories

1. As a user installing `refinement-skills` into a target workspace via `npx skills add RafaelFerSilva/refinement-agent-skills`, I want the CLI to discover and install only the 10 published refinement skills under `skills/`, so that my workspace and `skills-lock.json` are never polluted with internal repository construction skills.
2. As a contributor working inside `refinement-agent-skills` in Claude Code or Antigravity, I want `.claude/skills/` and `.agents/skills/` to remain versioned and active in this repository without global setup, so that `/implement`, `/code-review`, `/diagnosing-bugs`, and sibling build skills continue working out of the box.
3. As a package maintainer adding or updating an engineering skill in `.claude/skills/` or `.agents/skills/`, I want `node scripts/validate-skills.mjs` (and `.githooks/pre-commit`) to fail immediately if any `SKILL.md` outside `skills/` omits `metadata.internal: true`, duplicates a frontmatter key, or drifts between `.claude/skills/` and `.agents/skills/`, so that internal skills can never leak into `npx skills add` again.

## Implementation Decisions

- **Frontmatter `metadata.internal: true` over `.gitignore` removal:** keeping `.claude/skills/` and `.agents/skills/` tracked in git honors `AGENTS.md:34` (zero global dependency for repository construction) while using the standard `vercel-labs/skills` discovery opt-out (`shouldInstallInternalSkills()` skips `metadata.internal === true` unless `INSTALL_INTERNAL_SKILLS=1`).
- **Merge into existing `metadata:` map:** skills such as `pr/SKILL.md` already carry a top-level `metadata:` block (`credits`). Inserting `  internal: true` into an existing `metadata:` map rather than appending a second `metadata:` block prevents YAML duplicate-key parse errors in `skills` CLI.
- **Repository-wide `SKILL.md` boundary check:** checking every `SKILL.md` discovered by `walk(root)` rather than hardcoding only `.claude/skills/` and `.agents/skills/` ensures that any future agent directory (for example `.codex/skills/` or `.cursor/skills/`) also fails validation if it omits `metadata.internal: true`.

## Testing Decisions

Good tests exercise both the package validator seam and the real `skills` CLI discovery seam:

- **Validator seam (`scripts/validate-skills.mjs`, test-first):** add the isolation and mirror-parity checks first and verify `node scripts/validate-skills.mjs` fails on all 54 unmarked internal `SKILL.md` files before editing them, and also verify negative edge cases (duplicate `metadata:` key, nested `internal: true` under `credits:` instead of `metadata:`, missing mirror parity) before confirming exit 0 after the fix.
- **CLI discovery seam (`npx --offline skills add <repo> --list` and temp target install):** verify against the repository working tree that `skills@1.7.4` drops from `Found 37 skills` to `Found 10 skills` with zero YAML warnings, and that installing into a fresh temporary workspace writes only the 10 `Refinement Skills` into `.agents/skills/` and `skills-lock.json`.

## Out of Scope

- Pushing to `origin/main` without explicit user request (`AGENTS.md:26`).
- Modifying the instructions or behavior of any published skill under `skills/` or generated files under `prompts/`.
