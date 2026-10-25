# 03: Scripted Product Owner answers for US-245, pt-BR

Status: ready-for-agent
Blocked by: 01
Type: task
Origin: 2026-10-25 (commit 81547f6)

The pt-BR twin of the answers fixture, so synthesis is measured in both languages. The localization layer is where this package has found most of its defects, and an artifact published in pt-BR is the one the grader checks hardest.

Same subjects as the en-US fixture, in Portuguese, for `evals/fixtures/us-245-silenciar-alertas.md`. Keeping the two fixtures parallel in subject and divergent only in language is what makes a difference between the runs attributable to the package rather than to the input.

## Acceptance criteria

- `evals/fixtures/po-answers-245-pt-BR.md` exists and covers the same subjects as the en-US fixture, in Portuguese.
- A session driven with it publishes a pt-BR artifact that grades with `--lang pt-BR`, and the result is recorded.
- The published headings, verdict and markers match the pt-BR vocabulary of ADR 0005 rather than an ad hoc translation.

## Comments
