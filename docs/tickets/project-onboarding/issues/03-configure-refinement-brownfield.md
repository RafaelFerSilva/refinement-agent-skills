# 03: Guide ongoing-project setup and `docs/reference/` in `/configure-refinement`

Status: resolved
Blocked by: 01
Type: task
Origin: 2026-10-28 (commit 4a0a98f)

`/configure-refinement` currently configures operating mode, language, and tracker conventions while treating missing `CONTEXT.md` identically for greenfield and ongoing products ("no action needed now: the first examination that resolves a domain term will create it"). Teams onboarding an ongoing product do not learn where to place existing documentation or that `/bootstrap-context` should run before their first User Story.

Extend `skills/configure-refinement/SKILL.md` and `skills/configure-refinement/refinement.md` to support ongoing-project onboarding cleanly.

## Acceptance criteria

- Step 1 (`Explore`) inspects `docs/` (including `docs/product-overview.md` and `docs/reference/`) alongside existing workspace signals.
- Step 2 (`Inquire`) asks whether the product is new (greenfield) or ongoing (already in production/advanced), recommends based on explored files/code, explains where existing reference documents belong (`docs/reference/`), and replaces the greenfield-only glossary note with stage-aware guidance.
- Step 3 (`Confirm and write`) creates `docs/reference/` (when confirmed for an ongoing product with reference docs) and writes `docs/agents/refinement.md` from an updated `skills/configure-refinement/refinement.md` that includes `/bootstrap-context`, lists `docs/product-overview.md` and `docs/reference/` in `## Fact sources`, and maps `/bootstrap-context` in `## Publishing locations by workflow`.
- Step 4 (`Conclude`) directs ongoing products to drop existing manuals, rules, or exported stories into `docs/reference/` and run `/bootstrap-context` before `/refine-story`.
- All existing workspace configuration checks in `scripts/validate-skills.mjs` pass.

## Comments

- 2026-10-28 Preflight (commit 4a0a98f, after ticket 01): confirmed
  - Docs: `AGENTS.md` Invariants (canonical mode tokens `with-code` and `without-code`, legacy `com-codigo` and `sem-codigo` accepted on read, no dashes, `<500` lines), ADR `0001` and ADR `0007`, and `docs/agents/harness.md:20` (`validate-skills.mjs` checks on `skills/configure-refinement/refinement.md`, `skills/configure-refinement/SKILL.md`, and `evals/fixtures/refinement-*.md`) apply.
  - Package: `Blocked by: 01` is `Status: resolved`: confirmed. `skills/configure-refinement/SKILL.md:13-29,41` does not inspect `docs/product-overview.md` or `docs/reference/`, does not ask whether the product is greenfield or ongoing, and tells every workspace without `CONTEXT.md` that no action is needed now: confirmed. `skills/configure-refinement/refinement.md:6,20,30-42` and `evals/fixtures/refinement-*.md` do not list `/bootstrap-context`, `docs/product-overview.md`, or `docs/reference/`: confirmed.
  - Reproduction: verified by reading `skills/configure-refinement/SKILL.md` and `skills/configure-refinement/refinement.md`.
  - Criteria: 5 still hold, 0 already satisfied, 0 need changing
  - Conflicts: `skills/configure-refinement/SKILL.md` must retain all four mode tokens (`with-code`, `without-code`, `com-codigo`, `sem-codigo`) on read per `scripts/validate-skills.mjs:162-171`, `skills/configure-refinement/refinement.md` must write `Mode: <with-code | without-code>` with zero legacy tokens, and `evals/fixtures/refinement-with-code-en-US.md` must keep `evals/fixtures/code-workspace/`. `configure-refinement` is not in `FLOWS` of `scripts/build-prompts.mjs`.
- 2026-10-28 Implemented: updated `skills/configure-refinement/SKILL.md` (Step 1 inspects `docs/product-overview.md` and `docs/reference/`; Step 2 inquires new vs. ongoing product stage and explains `docs/reference/` plus `/bootstrap-context`; Step 3 creates `docs/reference/` for ongoing products and records custom paths under `## Fact sources`; Step 4 directs ongoing products to `/bootstrap-context` before `/refine-story`), `skills/configure-refinement/refinement.md` (added `/bootstrap-context`, `docs/product-overview.md`, and `docs/reference/`), and `evals/fixtures/refinement-{no-code-en-US,no-code-pt-BR,with-code-en-US}.md`; `node scripts/validate-skills.mjs` green.

