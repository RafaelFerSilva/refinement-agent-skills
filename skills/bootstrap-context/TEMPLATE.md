# Product Overview: <Product name>

Status: <BASELINE READY | PARTIAL | BLOCKED>
Source: <paths in docs/reference/, codebase in with-code mode, or "tacit onboarding examination">, /bootstrap-context session on <YYYY-MM-DD>

## Triage

<DOCUMENTED | PARTIAL SOURCES | TACIT ONLY>: <1 to 2 lines stating which sources were inspected and what lacked written coverage>

## Product Purpose

<One to three sentences stating what the product solves, for whom, and its current stage in production, carrying [INFERENCE: source] when derived from documents or code, or unmarked when stated by the PO.>

## Roles and Permissions

| Role | Responsibility | Access or constraint | Provenance |
| --- | --- | --- | --- |
| <canonical role in CONTEXT.md> | <what this role does> | <permission boundary or [TO CONFIRM: whom]> | <PO decision (<date>) or [INFERENCE: source]> |

## Production Modules

| Module or capability | Current behavior | Provenance |
| --- | --- | --- |
| <module> | <what runs in production today> | <PO decision (<date>) or [INFERENCE: source]> |

## Active Integrations

| External system | Direction and purpose | Known SLA or constraint | Provenance |
| --- | --- | --- | --- |
| <system or "none"> | <inbound or outbound purpose> | <confirmed limit or [TO CONFIRM: whom]> | <PO decision (<date>), [INFERENCE: source], or [UNMAPPED DEPENDENCY]> |

## Cross-Cutting Rules and SLAs

- <business rule, compliance requirement, retention window, volume limit, or SLA currently in force, carrying [INFERENCE: source], PO decision (<date>), or [TO CONFIRM: whom]>

## Source Conflicts Resolved

- <conflicting synonym or outdated rule across legacy docs or code> -> <canonical term or active rule chosen> (<who>, <date>)

## Examination Decisions

- <question> -> <PO answer> (<who>, <date>)

## Open Questions

1. [<recipient>] <question> -> <impact on upcoming stories> (questionnaire: <path or none>)

## Verdict

<✅ BASELINE READY | 🔶 PARTIAL, unblocks with questions <n>, <m> | ⛔ BLOCKED: <rationale>>

> ⚠️ This output is an analytical baseline of product context, not a replacement for team validation. Decisions on domain vocabulary, active rules, and scope belong strictly to the PO and team.

## Section names in pt-BR

Not part of the artifact. When `Language: pt-BR`, the title prefix is `# Panorama do produto: <Nome>` (`Fonte:` in place of `Source:`) and the headings above are written in this form, so that a later workflow or grader reading this artifact finds the section it expects:

| Heading (en-US, default) | Heading (pt-BR) |
| --- | --- |
| Triage | Triagem |
| Product Purpose | Propósito do produto |
| Roles and Permissions | Papéis e permissões |
| Production Modules | Módulos em produção |
| Active Integrations | Integrações ativas |
| Cross-Cutting Rules and SLAs | Regras transversais e SLAs |
| Source Conflicts Resolved | Conflitos de fonte resolvidos |
| Examination Decisions | Decisões da sabatina |
| Open Questions | Perguntas em aberto |
| Verdict | Veredito |
