# Refinement

Mode: com-codigo
Language: en-US

Workspace configuration fixture: stands in for `docs/agents/refinement.md` during evals.

## Mode

- **com-codigo** (with code): before asking questions, the agent inspects source code directly. Architecture questions are resolved by reading code, citing the source file. The PO receives only business and expected-behavior questions.

## Language

- **en-US**: examination and questions conducted in English. Narratives in the format "As a [role], I want [capability], so that [outcome]". Gherkin criteria using `Scenario:`, `Given`, `When`, `Then`, `And`. Verdicts `READY`, `REFINE`, `BLOCKED` (QA: `EXECUTABLE`, `PARTIAL`, `BLOCKED`). Rigor markers in English: `[INFERENCE: base]`, `[TO CONFIRM: whom]`, `[AMBIGUITY]`, `[DECOMPOSE]`.

## Fact sources

In priority order: `CONTEXT.md` (product domain glossary), `docs/adr/`, previous stories in `.scratch/`, documents in `docs/`, source code in `evals/fixtures/code-workspace/`.

## Work items

Every User Story originates as a work item in `https://dev.azure.com/routewise/fleet/_workitems/edit/`. Each artifact carries `Azure: <ID>` directly below `Status:`, or `Azure: none`.

## Slugs

Directories in `.scratch/` use kebab-case: meeting `<project>-<YYYY-MM-DD>`, discovery `<topic>`, US `<ID>-<short-title>`.

## Publishing locations by workflow

| Workflow | Artifact |
| --- | --- |
| `/meeting-minutes` | `.scratch/<project>-<date>/minutes.md` and `discovery-input.md` |
| `/requirements-discovery` | `.scratch/<topic>/spec.md`, `issues/NN-<slug>.md` and `issues/NN-decision-<slug>.md` |
| `/refine-story` | `.scratch/<ID>-<title>/spec.md` |
| `/qa-plan` | `.scratch/<ID>-<title>/qa-plan.md` |
| questionnaires | written alongside generating artifact: `questionnaire-<recipient>.md` |
