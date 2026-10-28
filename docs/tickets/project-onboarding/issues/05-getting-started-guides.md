# 05: Publish `Getting Started` guides (`en-US` and `pt-BR`) and update `README.md` onboarding

Status: resolved
Blocked by: 01, 02, 03
Type: task
Origin: 2026-10-28 (commit 4a0a98f)

Users adopting the package lack structured documentation explaining target workspace layout, how greenfield adoption differs from ongoing (brownfield) adoption, why cold-start sessions ask more questions instead of hallucinating, how to prepare `docs/reference/` and run `/bootstrap-context`, and how to keep `CONTEXT.md` and `product-overview.md` updated in chat platform memory.

Write dedicated Getting Started guides in both supported languages and update `README.md` onboarding entry points.

## Acceptance criteria

- `docs/getting-started.md` (`en-US`) and `docs/getting-started.pt-BR.md` (`pt-BR`) exist, covering: target workspace directory anatomy, greenfield playbook, ongoing/brownfield playbook (`without-code` and `with-code`), cold-start behavior and anti-hallucination guarantees (`[INFERENCE: base]`, `no recommendation`, `[TO CONFIRM: whom]`), seeding context with `docs/reference/` and `/bootstrap-context`, day-to-day module batching tips, and maintaining `CONTEXT.md`, `product-overview.md`, and ADRs in chat platform Memory / Knowledge Base.
- `README.md` links both Getting Started guides prominently (in the main English onboarding and in `Guia em Português`), updates the skills badge count, Mermaid workflow infographic, Daily Quick Reference table, and `npx skills update` command list to include `bootstrap-context`.
- `node scripts/validate-skills.mjs`, `node scripts/build-prompts.mjs --check`, and `claude plugin validate . --strict` pass with zero prose or link errors.

## Comments

- 2026-10-28 Preflight (commit 4a0a98f, after tickets 01, 02, and 03): confirmed
  - Docs: `AGENTS.md` Invariants (no em-dash or en-dash in any `.md` file, `README.md` links every skill under `skills/`), ADR `0004` (`en-US` canonical + `pt-BR` first-class support), ADR `0007` (`with-code` and `without-code`), and `CONTEXT.md` vocabulary apply.
  - Package: `Blocked by: 01, 02, 03` are all `Status: resolved`: confirmed. `docs/getting-started.md` and `docs/getting-started.pt-BR.md` do not exist yet, and `README.md:4,17-62,182,212-219` still shows `8 available` skills and lacks onboarding guides and `/bootstrap-context` in the infographic, quick-reference table, and `npx skills update` list: confirmed.
  - Reproduction: verified by reading `README.md` and listing `docs/`.
  - Criteria: 3 still hold, 0 already satisfied, 0 need changing
  - Conflicts: `README.md` must retain `skills/<sName>/SKILL.md` links for all 9 skills (`scripts/validate-skills.mjs:108`); zero dashes (`\u2013` or `\u2014`) across all prose.
- 2026-10-28 Implemented: published `docs/getting-started.md` (`en-US`) and `docs/getting-started.pt-BR.md` (`pt-BR`) covering target workspace anatomy, greenfield vs. ongoing playbooks, cold-start anti-hallucination guarantees, `docs/reference/` + `/bootstrap-context` onboarding across all three input modes, day-to-day module batching, and `prompts/` platform Memory / Knowledge Base synchronization; updated `README.md` (onboarding callout, `9 available` badge, Mermaid infographic, Daily Quick Reference, chat mode section, `npx skills update` list, and `Guia em Português`), `.claude-plugin/plugin.json`, and `.claude-plugin/marketplace.json`; `./.githooks/pre-commit` green.

