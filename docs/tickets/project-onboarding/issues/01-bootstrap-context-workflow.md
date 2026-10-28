# 01: Add the `/bootstrap-context` workflow, mechanical grader checks, and generated prompt

Status: resolved
Blocked by: none
Type: task
Origin: 2026-10-28 (commit 4a0a98f)

Ongoing products adopting the package lack a workflow to turn scattered legacy documentation, existing product code, or tacit team knowledge into the structured domain glossary (`CONTEXT.md`) and operational baseline (`docs/product-overview.md`) that `/refine-story`, `/qa-plan`, `/requirements-discovery`, and `/meeting-minutes` consult before asking questions.

Build `/bootstrap-context` end to end as a user-invoked workflow built on `requirements-rigor` and `socratic-examination`, keeping `CONTEXT.md` strictly a domain glossary while consolidating operational baseline facts (overview, roles summary, production modules/capabilities, active integrations, cross-cutting rules and SLAs, examination decisions, open questions, and readiness verdict) into `docs/product-overview.md`.

## Acceptance criteria

- `skills/bootstrap-context/SKILL.md`, `skills/bootstrap-context/TEMPLATE.md`, and `skills/bootstrap-context/agents/openai.yaml` exist with `disable-model-invocation: true` and `allow_implicit_invocation: false`.
- `/bootstrap-context` handles three input branches: reference documentation (files in `docs/reference/` or passed paths), product codebase inspection via subagent in `with-code` mode, and tacit-knowledge onboarding examination when neither documents nor code exist.
- Triage labels (`DOCUMENTED`, `PARTIAL SOURCES`, `TACIT ONLY` in `en-US`; `DOCUMENTADO`, `FONTES PARCIAIS`, `APENAS TÁCITO` in `pt-BR`) and verdicts (`BASELINE READY`, `PARTIAL`, `BLOCKED` in `en-US`; `BASE PRONTA`, `PARCIAL`, `BLOQUEADO` in `pt-BR`) are declared in `skills/requirements-rigor/SKILL.md`, `CONTEXT.md`, `skills/bootstrap-context/TEMPLATE.md` (with `pt-BR` section heading table), and `scripts/grade-output.mjs`.
- `bootstrap-context` is registered in `.claude-plugin/plugin.json`, `skills/which-flow/SKILL.md`, `README.md`, and `scripts/build-prompts.mjs` (generating `prompts/bootstrap-context.md` with zero unadapted references or dead rules).
- `scripts/grade-output.mjs` supports `--skill bootstrap-context` in `en-US` and `pt-BR`, with regression fixtures `evals/fixtures/artifacts/bootstrap-context-en-US.md` and `evals/fixtures/artifacts/bootstrap-context-pt-BR.md` passing and check counts recorded in `docs/agents/harness.md`.

## Comments

- 2026-10-28 Preflight (commit 4a0a98f): confirmed
  - Docs: `CONTEXT.md:7-36,85-93` defines Artifacts, Verdict, and Workflow; `AGENTS.md` Invariants (user-invoked `disable-model-invocation: true` + `allow_implicit_invocation: false`, shared rules once in primitives, no dashes, manifest/README/router sync, generated `prompts/`), Writing style, and Definition of Done apply; ADRs `0001` (two modes), `0002` (socratic examination before synthesis), `0004` and `0005` (canonical English with localized headings in `TEMPLATE.md`, triage labels and verdicts in `requirements-rigor` + `grade-output.mjs`, workflow-owned final notice), `0006` (`diff-glossary.mjs` check on `CONTEXT.md`), and `0007` (`with-code` and `without-code`) apply; `docs/agents/harness.md:20,35-55` requires check counts documented for every `evals/fixtures/artifacts/` fixture; `skills/requirements-rigor/SKILL.md:8,116-146` and `skills/socratic-examination/SKILL.md:42,60,63` govern shared rigor and glossary purity.
  - Package: `skills/bootstrap-context/` absent: confirmed. `skills/requirements-rigor/SKILL.md:8,120-145`, `CONTEXT.md:85-93`, `.claude-plugin/plugin.json:20-29`, `skills/which-flow/SKILL.md`, `README.md`, `scripts/build-prompts.mjs:141-194`, and `scripts/grade-output.mjs:9` list only the existing workflows: confirmed. `git log 4a0a98f..HEAD` empty.
  - Reproduction: not applicable (new workflow); test-first will write `evals/fixtures/artifacts/bootstrap-context-{en-US,pt-BR}.md` and confirm `grade-output.mjs --skill bootstrap-context` fails (exit 2) before adding grader support.
  - Criteria: 5 still hold, 0 already satisfied, 0 need changing
  - Conflicts: `skills/bootstrap-context/SKILL.md` references to `Skill tool`, companion `.md` files, `$ARGUMENTS`, and `docs/agents/refinement.md` must match existing `RULES` in `scripts/build-prompts.mjs` or add live adaptation rules without stranding existing ones; `skills/which-flow/SKILL.md` edits must keep `router()` in `scripts/build-prompts.mjs` clean under `adapt()`.
- 2026-10-28 Implemented: added `evals/fixtures/artifacts/bootstrap-context-{en-US,pt-BR}.md` and confirmed `grade-output.mjs` failed (exit 2) before adding `--skill bootstrap-context` checks (`18/18` passing in both languages, both with `--lang` and via automatic detection, documented in `docs/agents/harness.md`); added `Product overview` and updated `Verdict` and `Workflow` in `CONTEXT.md`; added `/bootstrap-context` triage labels and verdicts in `skills/requirements-rigor/SKILL.md`; created `skills/bootstrap-context/{SKILL.md,TEMPLATE.md,agents/openai.yaml}`; registered `bootstrap-context` in `.claude-plugin/plugin.json`, `skills/which-flow/SKILL.md`, `README.md`, and `scripts/build-prompts.mjs` (`prompts/bootstrap-context.md` generated); `node scripts/validate-skills.mjs` green (`9 valid skills, 11 artifact fixtures graded`).

