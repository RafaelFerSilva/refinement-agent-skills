# What pt-BR localizes, and what stays canonical

ADR 0004 made English canonical and kept pt-BR first class, listing markers, narrative, Gherkin and verdicts as the localized surface. Running the evals showed the list was the problem: every token outside it was coined per run. The same pt-BR minutes produced "Tabela de Itens de Ação" and "Autoauditoria" where the package had always said "Tabela de ações" and "Autoverificação", the triage labels were reinvented each time, and the final notice was simply dropped because no Portuguese wording existed to copy. A heading coined on the spot is not a cosmetic difference: the next workflow reads the previous artifact by its headings, so an ad hoc translation breaks the chain.

We decided which vocabulary is localized, which stays canonical in both languages, and that localized vocabulary lives where the decision is made rather than in one distant table.

## Localized

Artifact section headings, in the pt-BR table at the end of each workflow `TEMPLATE.md`. Triage labels for the four workflows and the ten anti-pattern type names, in `requirements-rigor`. The minutes `Status: rascunho`. The INVEST result `INDETERMINADO`. The final notice of each workflow, in both wordings, in the workflow that owns it.

The Portuguese forms are the ones the package used before the English translation, recovered from the original pt-BR tree rather than translated anew, so artifacts written under the old vocabulary stay readable.

## Canonical in both languages

INVEST criterion names and the results PASS and FAIL. The priority scale Highest, High, Medium, Low. The recipients PO and DEV. The field names `Status:` and `Azure:`. The operating mode tokens `com-codigo` and `sem-codigo`, which are configuration keys in installed workspaces (superseded by ADR 0007: `with-code` and `without-code` are canonical in both languages, with `com-codigo` and `sem-codigo` accepted on read).

## Considered alternatives

Keeping every localized term in one central table, which we rejected on evidence: a rule stated in a file the run may not open behaves as optional. The anti-pattern tag went from zero of five runs to three of three only when the type names moved into the always loaded file, and the notice scope bound only when it moved next to the notice text. Coining fresh translations, rejected because the package already had a vocabulary and two vocabularies for one concept is the defect this ADR exists to prevent. Localizing the canonical set as well, rejected because those tokens cross into trackers, QA convention and workspace configuration, where a translated key is a broken key.

## Consequences

A new localized term is added in both languages at the point where it is used, and the language table of `scripts/grade-output.mjs` mirrors it, which is what makes the agreement checkable: the grader fails an artifact whose headings, verdicts, triage labels or markers come from the other language.
