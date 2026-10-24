# Discovery: <title>

Status: <open map | in progress | completed>
Azure: <epic ID or none>
Source: <input path>, /requirements-discovery session on <YYYY-MM-DD>

## Target Outcome

<what this discovery delivers when finished: one or two lines; all sessions orient around this>

## Partial Processing

<only when triage was PARTIALLY USABLE: input excerpts that generated no artifact and what is missing in each>

## Domains

| Domain | Description | Confidence |
| --- | --- | --- |

## Stakeholders

| Name or role | Type | Advocates for | Conflicts |
| --- | --- | --- | --- |

Type: business, technical, end-user, or source (who recorded second-hand input).

## Epics

| Epic | Description | Complexity | Rationale | Domain |
| --- | --- | --- | --- | --- |

## Examination Decisions

- <question> -> <answer> (<who>, <date>; pending decision: <path, when originating from map>)

## Pending Decisions

<only with open map: one line per file in issues/NN-decision-<slug>.md, with status>

## Not Yet Specified

<only with open map: scope fog that cannot yet be formulated as a decision; graduated into pending decisions as frontier advances>

## Open Questions

1. [<recipient>] <question> -> <impact if unanswered> (questionnaire: <path or none>)

## Undeclared Dependencies

- <dependency> -> blocks <story> -> <required action>

## Out of Scope

- <item> -> <rationale>

## Primary Flow by Epic

One `flowchart TD` in Mermaid per epic, up to 10 nodes: actors as start and end points, critical steps of happy path, decision nodes only where real branching occurs, `[?]` on nodes with unconfirmed dependencies.

## Candidate Stories

- `issues/01-<slug>.md`: As <role>, I want <capability>. INVEST: <PASS across all | FAIL on <letters>>

> ⚠️ This output is an analytical draft. It requires human review before entering a sprint. Validate: technical feasibility, compliance, and unmapped dependencies.

## Section names in pt-BR

Not part of the artifact. When `Language: pt-BR`, the headings above are written in this form, so that a later workflow reading this artifact finds the section it expects:

| Heading (en-US, default) | Heading (pt-BR) |
| --- | --- |
| Target Outcome | Resultado alvo |
| Partial Processing | Processamento parcial |
| Domains | Domínios |
| Stakeholders | Stakeholders |
| Epics | Épicos |
| Examination Decisions | Decisões da sabatina |
| Pending Decisions | Decisões pendentes |
| Not Yet Specified | Ainda não especificado |
| Open Questions | Perguntas em aberto |
| Undeclared Dependencies | Dependências não declaradas |
| Out of Scope | Fora de escopo |
| Primary Flow by Epic | Fluxo principal por épico |
| Candidate Stories | Histórias candidatas |
