# 04: Add evaluation suite and fixtures for `/bootstrap-context` and chat memory handoff

Status: resolved
Blocked by: 01, 02
Type: task
Origin: 2026-10-28 (commit 4a0a98f)

`/bootstrap-context` and the upgraded chat-mode memory handoff need coverage in `evals/` matching the package's existing suites (`refine-story`, `qa-plan`, `requirements-discovery`, `meeting-minutes`).

Create fictional brownfield reference fixtures in `en-US` and `pt-BR` and `evals/bootstrap-context.json` exercising `without-code` documentation curation, `with-code` codebase inspection, tacit-only cold start, and standalone chat-prompt execution.

## Acceptance criteria

- Fictional brownfield documentation fixtures exist in `evals/fixtures/` in both `en-US` and `pt-BR`, containing domain roles, entities, conflicting legacy synonyms, and at least one unconfirmed operational or architectural claim.
- `evals/bootstrap-context.json` exists and passes all `scripts/validate-skills.mjs` checks, covering: `without-code` (`en-US` and `pt-BR`) with reference docs, `with-code` (`en-US`) over `evals/fixtures/code-workspace/`, tacit-only `without-code` (`en-US`), and a chat-prompt case (`prompts/bootstrap-context.md`) with inline inputs.
- Assertions verify triage label declaration, non-invention of missing numbers/rules, socratic challenge of conflicting synonyms with cited recommendations, waiting for PO responses in round 1, and chat-mode memory handoff rules.
- Sample runs of the new cases are executed via isolated subagents to verify actual first-round behavior in both languages and chat mode.

## Comments

- 2026-10-28 Preflight (commit 4a0a98f, after tickets 01 and 02): confirmed
  - Docs: `evals/README.md:67-93` and `docs/agents/harness.md:20,27` govern fixture naming (English names hold `en-US` material, Portuguese names hold `pt-BR` material), workspace configuration pairing (`refinement-no-code-{en-US,pt-BR}.md` without `code-workspace/` files, `refinement-with-code-en-US.md` declaring all four `evals/fixtures/code-workspace/*` files), chat-prompt cases (`prompts/bootstrap-context.md` alone in `files`, multi-line inline prompt, no `evals/fixtures/` or `docs/agents/refinement.md` in prompt), and ADR 0005 canonical marker wording (`INVEST-FAIL` and `MANUAL-ONLY` named if asserting Portuguese markers per `scripts/validate-skills.mjs:258-281`).
  - Package: `Blocked by: 01, 02` are both `Status: resolved`: confirmed. `evals/bootstrap-context.json`, `evals/fixtures/legacy-fleet-manual.md`, and `evals/fixtures/manual-legado-frota.md` do not exist yet: confirmed.
  - Reproduction: not applicable (new eval suite); mechanical rules verified against `scripts/validate-skills.mjs:198-281` and behavioral Round 1 execution will be verified via isolated read-only subagents.
  - Criteria: 4 still hold, 0 already satisfied, 0 need changing
  - Conflicts: pt-BR marker assertion in case 2 must explicitly name `INVEST-FAIL` and `MANUAL-ONLY` per `scripts/validate-skills.mjs:277-278`; no dashes in fixtures or JSON strings.
- 2026-10-28 Resolution: created `evals/fixtures/legacy-fleet-manual.md`, `evals/fixtures/manual-legado-frota.md`, and `evals/bootstrap-context.json` (6 cases: `without-code` `en-US`, `without-code` `pt-BR`, `with-code` `en-US` over `evals/fixtures/code-workspace/`, `TACIT ONLY` `without-code` `en-US`, chat-prompt `prompts/bootstrap-context.md` Round 1 with inline rollout notes and glossary snippet, and chat-prompt `prompts/bootstrap-context.md` synthesis verifying `Memory / Knowledge Base Updates` delta handoff). Verified mechanically via `node scripts/validate-skills.mjs` (green) and behaviorally via three isolated subagent sample runs:
  - Case 2 (`pt-BR`, `without-code`): opened with `FONTES PARCIAIS`, conducted Round 1 in Portuguese (`**Recomendação:**`, `[INFERÊNCIA:`, `[A CONFIRMAR: DEV]`, zero English rigor markers), challenged competing synonyms (`Operador de despacho` vs. `Agente da central`, `Rastreador` vs. `Caixa GPS`) citing `manual-legado-frota.md`, routed TeleTrack webhook batch/idempotency and SAP contract questions to `DEV`, invented no numbers, and waited for the PO.
  - Case 3 (`en-US`, `with-code`): opened with `PARTIAL SOURCES`, surfaced the `100 km/h` manual vs. `SPEED_ALERT_THRESHOLD_KMH = 110` contradiction citing `legacy-fleet-manual.md` and `alert-evaluator.ts`, cited `schema.sql`, `alert-service.ts` (`CLOSE_REASONS`), and `operational-report.ts` (`REPORT_READER_ROLES`, readings-only aggregation), did not ask the PO to supply facts already implemented in code, and waited for the PO.
  - Cases 5 and 6 (`prompts/bootstrap-context.md`, chat mode): Round 1 opened with `PARTIAL SOURCES`, recommended `Dispatch operator` citing the existing glossary, challenged widening `Operational report` with closed alerts, emitted zero mid-round file/glossary blocks and zero disk/mode/subagent leaks, and waited for the PO; Step B synthesis graded `19/19` on `scripts/grade-output.mjs --skill bootstrap-context --lang en-US` and emitted `Append to CONTEXT.md` under `Memory / Knowledge Base Updates` plus the platform memory reminder in `Report`.

