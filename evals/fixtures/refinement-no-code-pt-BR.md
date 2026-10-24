# Refinement

Mode: sem-codigo
Language: pt-BR

Workspace configuration fixture: stands in for `docs/agents/refinement.md` during evals.

## Mode

- **sem-codigo** (without code): the PO is the source of answers. Facts originate from `CONTEXT.md`, previous stories in `.scratch/`, and documents in `docs/`. Architecture, observability, and test-layer questions flow to the engineering team via questionnaires; never answered by assumption.

## Language

- **pt-BR**: examination and questions conducted in Portuguese. Narratives in the format "Como [papel], quero [capacidade], para que [resultado]". Gherkin criteria using `Cenário:`, `Dado`, `Quando`, `Então`, `E`. Verdicts `PRONTA`, `REFINAR`, `BLOQUEADA` (QA: `EXECUTÁVEL`, `PARCIAL`, `BLOQUEADO`). Rigor markers in Portuguese: `[INFERÊNCIA: base]`, `[A CONFIRMAR: quem]`, `[AMBIGUIDADE]`, `[DECOMPOR]`.

## Fact sources

In priority order: `CONTEXT.md` (product domain glossary), `docs/adr/`, previous stories in `.scratch/`, documents in `docs/`.

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
| questionnaires | written alongside generating artifact: `questionario-<destinatario>.md` |
