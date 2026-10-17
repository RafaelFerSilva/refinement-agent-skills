---
name: requirements-rigor
description: "Vocabulary and rigor rules for requirements artifacts. Use when auditing or writing a User Story, acceptance criterion, test condition, or meeting minutes, and whenever deciding if an assertion is an inference or an invention, flagging a gap, evaluating INVEST, converting criteria to Gherkin, or determining readiness verdicts."
---

# Requirements rigor

Shared reference for the `/refine-story`, `/qa-plan`, `/requirements-discovery`, and `/meeting-minutes` workflows. Defines the boundary between what can be asserted and what must be asked, the markers that make that boundary visible, and the standards for narrative, acceptance criteria, and verdicts. This is the single source of truth for these rules: workflows point here rather than repeating them.

## Boundary: inference or invention

**Inference** is a conclusion that directly follows from an input statement, `CONTEXT.md`, or a verified fact, which another person reading the same material would reach. Every inference carries its grounding base: the sentence or source that supports it.

**Invention** is any value, name, system, rule, or behavior without backing in the source material, even when considered "best practice" or "obvious for this type of feature". Common cases: SLA numbers, limits, volumes, percentages, error messages, retry policies, tool names, and protocols.

Quick test: "can I point to the sentence or source that supports this?" Yes: inference, cite the base. No: question, or placeholder when there is no one to ask.

The boundary manifests differently depending on the stage:

| Stage | Inference becomes | Invention becomes |
| --- | --- | --- |
| Examination (question round) | The recommended answer to the question, with grounding base | The question itself, without recommendation |
| Synthesis (final artifact) | Assertion with `[INFERENCE: base]` | `[TO CONFIRM: whom]` with registered question |

During examination, finding facts is the agent's job: glossary, previous stories, workspace documents, and in code mode, the codebase. A found fact does not become a question: it becomes a recommended answer with the cited source. Decisions belong to the PO. Without a basis to recommend, the recommended answer is "no recommendation", and when options exist, list them with the implication of each.

Refinement language is determined by `Language:` (or `Idioma:`) in `docs/agents/refinement.md` (`en-US` or `pt-BR`), with `en-US` as default. When the language is `pt-BR`, examination, markers, narrative, Gherkin, and verdicts adopt their Portuguese form.

## Markers

A visible gap is worth more than a "clean" artifact with hidden assumptions. Markers remain visible in the final artifact and apply across all artifacts; `/meeting-minutes` adds provenance markers, and `/qa-plan` adds origin markers.

| Marker (en-US, default) | Marker (pt-BR) | Meaning | Required action |
| --- | --- | --- | --- |
| `[INFERENCE: base]` | `[INFERÊNCIA: base]` | Conclusion derived from the material | Cite the sentence or source |
| `[TO CONFIRM: whom]` | `[A CONFIRMAR: quem]` | Value or rule no one in the session could provide | Numbered question in the open questions section, with recipient |
| `[AMBIGUITY]` | `[AMBIGUIDADE]` | Term with multiple readings | Question; for high impact, provide two interpretations with distinct implications |
| `[ANTI-PATTERN: type]` | `[ANTI-PADRÃO: tipo]` | Occurrence of an anti-pattern from [ANTI-PATTERNS.md](ANTI-PATTERNS.md) | Question, or correction that preserves behavior |
| `[INVEST-FAIL: letter]` | `[INVEST-FAIL: letra]` | Failed INVEST criterion | One-line rationale and what would resolve it |
| `[DECOMPOSE]` | `[DECOMPOR]` | Story too large for a single sprint | Division proposal |
| `[DIVERGENCE]` | `[DIVERGÊNCIA]` | Narrative promises X, criteria test Y | List both sides; reconciliation belongs to PO |
| `[ORPHAN]` | `[ÓRFÃO]` | Criterion with no counterpart in narrative | Ask which story it belongs to |
| `[CONFLICT]` | `[CONFLITO]` | Two stakeholders in opposing positions | Record both without resolving silently |
| `[VALIDATE WITH TEAM]` | `[VALIDAR COM EQUIPE]` | Requirement voiced by a single party where confirmation matters | Confirmation before entering backlog |
| `[UNMAPPED DEPENDENCY]` | `[DEPENDÊNCIA NÃO MAPEADA]` | Integration or system whose availability is unconfirmed | Action item to confirm; story cannot enter sprint without it |
| `[MANUAL-ONLY]` | `[MANUAL-ONLY]` | Criterion that cannot be automated | Rationale |
| `[ESTIMATE AT RISK]` | `[ESTIMATIVA EM RISCO]` | Existing story points likely invalidated by a gap | Which gap |
| `[CALIBRATE IN PLANNING]` | `[A CALIBRAR NO PLANNING]` | Story points field | One line of context for team discussion |

Story points are calibrated by the team. Never assign numbers, hours, or days; when a story already has points, use `[ESTIMATE AT RISK]` rather than contesting the number.

## Narrative

Format (en-US, default): "As a [specific role], I want [a capability, one verb], so that [verifiable outcome]."
Format (pt-BR): "Como [papel específico], quero [uma capacidade, um verbo], para que [resultado verificável]."

- Specific role. Generic "User" fails; use the domain role from `CONTEXT.md` when available.
- One capability per story. Two capabilities joined by "and" are a double requirement: decompose.
- The "so that" clause declares business value. Paraphrasing the "want" clause fails.
- Any field that cannot be inferred from the text receives `[TO CONFIRM: PO]` (or `[A CONFIRMAR: PO]`).

## INVEST Scorecard

Evaluate each criterion as PASS, FAIL, or INDETERMINATE. INDETERMINATE means the source text does not provide enough information to assess, and must become a question, not a guess.

- **Independent**: developable without blocking or being blocked by another story.
- **Negotiable**: describes the problem, not the solution. Prescribing solution instead of problem fails; the solution suggested by the PO is moved to notes, preserved as reference.
- **Valuable**: value for the named role is explicitly declared and real.
- **Estimable**: the team can estimate based on what is written.
- **Small**: fits in a single sprint. If it appears too large: `[DECOMPOSE]`.
- **Testable**: QA can automate tests from the written criteria.

## Acceptance criteria in Gherkin

Format (en-US, default): `Scenario:` descriptive name, `Given` initial state, `When` an event, `Then` verifiable outcome, `And` additional outcome.
Format (pt-BR): `Cenário:` nome descritivo, `Dado` estado inicial, `Quando` um evento, `Então` resultado verificável, `E` resultado adicional.

- `Given` / `Dado` describes state, never an action.
- `When` / `Quando` is exactly one event or user action.
- `Then` / `Então` is verifiable by automation: number, state, or observable condition. "Correctly", "properly", "fast", or any subjective term fails.
- A missing number that would make `Then` / `Então` verifiable receives `[TO CONFIRM: whom]` in place of the number.
- Converting prose criteria to Gherkin preserves the exact described behavior, without adding behavior.
- Missing edge cases become questions for the PO. The text often hints at them: offer them in questions as `[INFERENCE: base]`.

**Self-audit**: before delivering any scenario, re-read each against the first four rules and correct violations. In long outputs, these rules are the most frequently violated.

## Terms that always trigger questions

| Category | Terms | What to ask |
| --- | --- | --- |
| Performance | fast, real-time, responsive, performant | SLA in seconds or requests per second |
| Scale | many, high volume, high demand | Order of magnitude: hundreds, thousands, millions |
| Security | secure, protected, role-based access | Standard or profile: GDPR, LGPD, OWASP, specific permission |
| Integration | integrate with X, import from Y, sync with Z | Available API, authentication, format, external SLA |
| Approval | approved by, manager validation, upon authorization | Who approves, timeout window, what happens upon expiration |
| Open-ended scope | all file formats, any device | Closed, explicit list |

Complete anti-patterns, with examples, problems, and corrective actions, live in [ANTI-PATTERNS.md](ANTI-PATTERNS.md). Read when scanning or auditing text; the Skill tool loads only this file, sibling files must be read separately.

## Verdicts

One of three conclusions, without middle ground:

- **READY** (pt-BR: **PRONTA**): complete INVEST, testable criteria, no blocking gaps. Cosmetic pending items are listed.
- **REFINE** (pt-BR: **REFINAR**): usable once listed questions are answered. Specify which items unblock it.
- **BLOCKED** (pt-BR: **BLOQUEADA**): cannot enter planning. Objective reason: unconfirmed external dependency, indeterminate scope, not a User Story.

The verdict is the `Status:` line of the artifact. For QA plans, corresponding verdicts are `EXECUTABLE`, `PARTIAL`, or `BLOCKED` (pt-BR: `EXECUTÁVEL`, `PARCIAL`, or `BLOQUEADO`). For discovery: `candidate`, `open map`, `in progress`, or `completed` (pt-BR: `candidata`, `mapa aberto`, `em andamento`, or `concluído`). Mapping to external tracker labels lives in `docs/agents/triage-labels.md` when present.

## Questionnaire

An open question whose recipient is outside the refinement session becomes a questionnaire, one per recipient, written alongside the artifact following [QUESTIONNAIRE.md](QUESTIONNAIRE.md).

## Final notice

Every published artifact concludes with a disclaimer stating it is an AI-generated preparation, and that final decisions on scope, value, and priority belong strictly to the PO and team. Each workflow provides its specific disclaimer text.
