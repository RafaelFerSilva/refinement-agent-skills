# 03: Scripted Product Owner answers for US-245, pt-BR

Status: resolved
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

- 2026-10-25 Preflight (commit 9c3d0fe): confirmed
  - Docs: ADR 0005 governs the second and third criteria, since it fixes the verdicts `PRONTA`, `REFINAR` and `BLOQUEADA`, the headings in the pt-BR table of `skills/refine-story/TEMPLATE.md`, the triage label `ANALISÁVEL` and the anti-pattern type names, while `PASS`, `FAIL`, `PO` and `Status:` stay canonical; `evals/README.md` "Scripted Product Owner answers" already carries the protocol, written in ticket 01 for both languages, so only the sentence naming the files needs the twin added; `evals/fixtures/refinement-no-code-pt-BR.md` sets `Language: pt-BR` and the Portuguese markers; `scripts/grade-output.mjs:85` is the pt-BR half of the language table, which is what `--lang pt-BR` grades against.
  - Package: `evals/fixtures/po-answers-245-pt-BR.md` does not exist: confirmed. `evals/fixtures/us-245-silenciar-alertas.md` mirrors the en-US story criterion by criterion, with "de forma simples" for "in a simple way" and "Testado em homologação" for "Tested in staging": confirmed, so the subjects of the en-US fixture carry over one to one. `evals/fixtures/CONTEXT-frota.md` carries **Leitura** with "Pode chegar retroativa quando o rastreador fica sem sinal": confirmed, so the refusal routed to the engineering team rests on the same glossary entry in both languages.
  - Reproduction: not applicable for the missing fixture. The second criterion is itself a measurement, run the same way as ticket 02 and graded with `node scripts/grade-output.mjs <artifact> --skill refine-story --lang pt-BR`.
  - Criteria: 0 still hold, 0 already satisfied, 3 need changing
  - Conflicts: none in the invariants. The fixture is PO speech, so it carries no marker, heading or verdict of its own and adds no localized token; what ADR 0005 governs is the artifact the run publishes, which is where the third criterion is read.
- 2026-10-25 Implemented and measured. `evals/fixtures/po-answers-245-pt-BR.md` carries the eight subjects of the en-US fixture in Portuguese, one for one, with the same refusal routed to the engineering team and the same decisions the story text does not support. `evals/README.md` now names both files. Nothing under `skills/` changed.
  - The run: `refinement-skills-workspace/end-to-end-245-pt-BR/`, driven the same way as ticket 02 and on the same model. Two differences from the en-US run, not one: the language, and one extra sentence in the driver prompt telling the session that the workspace configuration decides the language of the examination and of the artifact. Record in `refinement-skills-workspace/driver-record-245-pt-BR.md`, git ignored, so what matters is quoted here.
  - Convergence: two rounds, six questions then two, and the second round asked things the fixture does not cover (silencing an already silenced vehicle, and whether a manual cancel notifies whoever silenced). Both received the **Qualquer outro assunto** refusal and both became numbered open questions for the PO. The pt-BR run examined more than the en-US run did, which is the opposite of what the localization record in ADR 0005 would predict.
  - Grader: `node scripts/grade-output.mjs refinement-skills-workspace/end-to-end-245-pt-BR/.scratch/245-silenciar-alertas/spec.md --skill refine-story --lang pt-BR` exits 1 with **14 of 15**. The single failure is `no em-dash`, which is ticket 16: the grader enforces a rule no skill states, and Portuguese prose reaches for the travessão by default.
  - Vocabulary against ADR 0005: `Status: REFINAR` and the verdict `🔶 REFINAR` are the pt-BR forms, the markers are `[INFERÊNCIA:`, `[ANTI-PADRÃO:`, `[DEPENDÊNCIA NÃO MAPEADA]`, `[A CALIBRAR NO PLANNING]` and `[INVEST-FAIL: E]`, the triage was `ANALISÁVEL`, and the headings came from the pt-BR table of `TEMPLATE.md`. `PASS`, `FAIL`, `PO` and `Status:` stayed canonical, as the ADR requires. The grader's `markers consistent with pt-BR` and `sections present in pt-BR` both pass, so no English token leaked. One cosmetic drift: the artifact writes "Perguntas em Aberto" where the template says "Perguntas em aberto". The grader matches case insensitively and the next workflow would still find the section, so this is recorded rather than filed.
  - The verdict is the sharpest result. `REFINAR` with `[INVEST-FAIL: E]` on Estimable, pointing at the one question that unblocks it, with the other three open questions explicitly marked as not blocking planning, and a questionnaire written for the engineering team. That is the behavior the package promises, and the en-US run of ticket 02 did not produce it: it published `READY` with no open question at all. What the pair does not establish is why, since the prompts were not identical and each language was run once: ticket 04 is what turns this into a comparison.
  - Ticket 12 corroborated and annotated: this run also never raised the retroactive reading, whose glossary entry exists in both languages.
- 2026-10-25 Amended after ticket 16. The single failure recorded above, `no em-dash`, was a rule the package never states, and the check has been removed from the grader. The pt-BR artifact of this run now grades **14 of 14**. Read as evidence: this run's artifact is unchanged, the grader is what changed, and the difference this ticket reported between the languages was that difference and nothing else.
