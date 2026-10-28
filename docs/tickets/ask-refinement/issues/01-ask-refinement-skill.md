# 01: Add the `/ask-refinement` read-only Q&A and workspace diagnostic skill

Status: resolved
Blocked by: none
Type: task
Origin: 2026-10-28 (commit 0803edb)

Users adopting the package in a target workspace have no read-only skill to answer operational questions about workflows, workspace files, rigor markers, verdicts, or how to resume work after questionnaires and open decision maps, nor to diagnose the current state of their workspace and recommend the next step.

Create `skills/ask-refinement/SKILL.md` and `skills/ask-refinement/agents/openai.yaml` as a user-invoked, single-turn Q&A and diagnostic skill that inspects workspace state without writing files, loads `requirements-rigor` and `socratic-examination` on demand instead of duplicating their rules, supports both `en-US` and `pt-BR` (including unconfigured workspaces), and register it across package manifests and the router.

## Acceptance criteria

- `skills/ask-refinement/SKILL.md` and `skills/ask-refinement/agents/openai.yaml` exist with `disable-model-invocation: true` and `allow_implicit_invocation: false`, and every step in `SKILL.md` ends with a checkable `Completed when:` criterion.
- `/ask-refinement` operates strictly read-only in a single turn (never creating or editing files and never opening `❓ Q<n>` examination rounds), inspects workspace files (`docs/agents/refinement.md`, `docs/agents/issue-tracker.md`, `CONTEXT.md`, `docs/product-overview.md`, `docs/adr/`, `docs/reference/`, `.scratch/`) when present, and falls back gracefully when `docs/agents/refinement.md` is absent instead of stopping.
- Shared rigor and examination rules are consulted on demand via the Skill tool (`requirements-rigor` and `socratic-examination` plus their companion files) rather than duplicated inline, while `SKILL.md` covers workspace file responsibilities, workflow progression, resuming from questionnaires and open decision maps, early closure, `/clear` hygiene, and empty-argument status diagnosis.
- `ask-refinement` is registered in `.claude-plugin/plugin.json`, `skills/which-flow/SKILL.md`, and `AGENTS.md`.

## Comments

- 2026-10-28 Preflight (commit 0803edb): confirmed
  - Docs: `CONTEXT.md:41-113` governs package vocabulary and `_Avoid_` lists; `AGENTS.md:11-31` governs user-invoked skill invariants (`disable-model-invocation: true`, `allow_implicit_invocation: false`), single-source-of-truth rules in `requirements-rigor` and `socratic-examination`, zero dashes, manifest/router registration, and `Completed when:` on every step; ADRs `0004`, `0005`, and `0007` govern language resolution and mode tokens; `docs/agents/harness.md:20` and `scripts/validate-skills.mjs:44-118` govern mechanical checks (including `Skill tool for \`<name>\`` self-containment).
  - Package: `skills/ask-refinement/` absent: confirmed. `.claude-plugin/plugin.json:20-30`, `skills/which-flow/SKILL.md:1-45`, and `AGENTS.md:18` do not yet list `ask-refinement`: confirmed. `git log 0803edb..HEAD` empty.
  - Reproduction: not applicable (new skill).
  - Criteria: 4 still hold, 0 already satisfied, 0 need changing
  - Conflicts: `Skill tool for \`requirements-rigor\`` and `Skill tool for \`socratic-examination\`` calls plus companion `.md` references in `skills/ask-refinement/SKILL.md` will require live adaptation rules in Ticket 02 (`scripts/build-prompts.mjs`), and `validate-skills.mjs:108` requires `README.md` link in Ticket 03 before the full validator turns green.
- 2026-10-28 Resolution: created `skills/ask-refinement/SKILL.md` (74 lines, all three steps concluding with `Completed when:`, read-only single-turn workspace inspection, on-demand `Skill tool for \`requirements-rigor\`` and `Skill tool for \`socratic-examination\`` loading with zero rule duplication) and `skills/ask-refinement/agents/openai.yaml` (`allow_implicit_invocation: false`), and registered `ask-refinement` in `.claude-plugin/plugin.json`, `skills/which-flow/SKILL.md`, and `AGENTS.md`.

