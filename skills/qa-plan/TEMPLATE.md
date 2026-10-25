# QA Plan: <US ID or title>

Status: <EXECUTABLE | PARTIAL | BLOCKED>
Azure: <work item ID or none>
Source: <refined US path>, /qa-plan session on <YYYY-MM-DD>

## Testability Triage

<TESTABLE | TESTABLE WITH RESERVATIONS | NOT TESTABLE> + rationale in half a line. Note on prior refinement, if applicable.

## Test Conditions Matrix

Grouped by originating criterion or behavior.

| # | Condition | Origin | Expected Result | Priority | Layer |
| --- | --- | --- | --- | --- | --- |

## Risk Analysis

Count of P1, P2, and P3 conditions. Top three highest-risk conditions and rationale. Where automation effort concentrates. INDETERMINATE impacts linked to questions.

Condition rationales: `#n`: half a line.

## P1 Scenarios in Gherkin

P1 conditions only; remaining conditions live in the matrix. Each scenario notes the target layer and test data prerequisites.

Scenario: <name>
  Given <state>
  When <event>
  Then <verifiable outcome>

## Automatability Audit

Per P1 and P2 scenario: four blockers evaluated, `[BLOCKER: type]` where present, and required action or question to remove it. Summary: consolidated list of automation prerequisites (mocks, test data, environment controls).

## Regression Impact

Existing flows touched by this US, what could silently break, and which verification covers it. Without existing system context: list impact questions for DEV.

## Examination Decisions

- <question> -> <PO answer> (<who>, <date>)

## Open Questions

1. [PO|DEV] <question> -> unblocks #<n>, #<n>: the conditions whose expected result waits on this answer, or "no result" when the answer settles a layer, an automation blocker or the regression impact instead (questionnaire: <path or none>)

## Coverage Verdict

<✅ EXECUTABLE PLAN | 🔶 PARTIALLY EXECUTABLE: P1 executable; <n> conditions await questions <list> and <m> await blocker removal <list> | ⛔ BLOCKED PLAN: <rationale>. Recommendation: <return to refinement | resolve infrastructure blockers first>>

> ⚠️ This output provides the analytical baseline for a test plan, not the final test plan. Decisions on coverage, prioritization, and effort belong to the QA team, with validation from PO (undefined behaviors) and Dev (architecture and layers).

## Section names in pt-BR

Not part of the artifact. When `Language: pt-BR`, the headings above are written in this form, so that a later workflow reading this artifact finds the section it expects:

| Heading (en-US, default) | Heading (pt-BR) |
| --- | --- |
| Testability Triage | Triagem de testabilidade |
| Test Conditions Matrix | Matriz de condições de teste |
| Risk Analysis | Análise de risco |
| P1 Scenarios in Gherkin | Cenários P1 em Gherkin |
| Automatability Audit | Auditoria de automatizabilidade |
| Regression Impact | Impacto de regressão |
| Examination Decisions | Decisões da sabatina |
| Open Questions | Perguntas em aberto |
| unblocks #n | destrava #n |
| Coverage Verdict | Veredito de cobertura |
