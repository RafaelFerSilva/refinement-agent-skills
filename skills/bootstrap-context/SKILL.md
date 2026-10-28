---
name: bootstrap-context
description: "Extracts and curates baseline product context for ongoing products from existing documentation, product code, or a structured PO examination, publishing CONTEXT.md, docs/product-overview.md, and stakeholder questionnaires."
disable-model-invocation: true
argument-hint: "[optional reference path, file list, or pasted documentation]"
---

# Bootstrap product context

Establish the reusable domain and operational baseline of an ongoing product through **socratic examination** before refining individual User Stories. Extract facts from every available source, surface contradictions and silent gaps in structured rounds with the PO, and split validated knowledge cleanly across `CONTEXT.md` (domain glossary only), `docs/product-overview.md` (operational baseline), and `docs/adr/` (irreversible decisions).

Input: $ARGUMENTS

## Before starting

Read `docs/agents/refinement.md` in the workspace: it defines the operating **mode** (`with-code` or `without-code`), **language** (`en-US` or `pt-BR`, default `en-US`), and fact sources. If missing, ask the user to run `/configure-refinement` and stop. All examination dialogue, markers, headings, and published artifacts follow the configured workspace language.

## Steps

1. **Load and inspect sources.** Read any paths or text in the input, existing files in `docs/reference/` and `docs/` (excluding `docs/agents/`), `CONTEXT.md`, domain ADRs in `docs/adr/`, and existing `docs/product-overview.md` when present, and invoke the Skill tool for `requirements-rigor`. In code mode, dispatch a subagent to map implemented domain entities, user roles and permission checks, external integrations, and configured limits or SLAs in the codebase, citing source files. In no-code mode, inspection is restricted to workspace files without subagents; if neither reference documents nor prior context files exist, proceed directly to tacit onboarding triage.
   Completed when: every available source is cataloged and you can classify input coverage in a single line: DOCUMENTED (sources cover purpose, roles, modules, integrations, and active rules), PARTIAL SOURCES (sources cover part of the baseline while leaving operational or technical gaps), or TACIT ONLY (no written documents or product code available; baseline comes from PO examination).

2. **Audit candidates and conflicts silently.** Extract candidate entries across two buckets without writing files yet:
   - **Domain vocabulary for `CONTEXT.md`:** user roles, business entities, domain events, and competing synonyms across sources (for example, one manual saying "Account", another saying "Depot", and code naming `RegionalBranch`), applying the glossary challenge rules in `socratic-examination` against any existing `CONTEXT.md`.
   - **Operational baseline for `docs/product-overview.md`:** product purpose, role permission boundaries, production modules, active external integrations, and cross-cutting rules or SLAs. Apply `requirements-rigor` to separate grounded inferences (`[INFERENCE: source]`) from unbacked numbers, retry policies, SLAs, or stale legacy claims (`[CONFLICT]`, `[AMBIGUITY]`, `[UNMAPPED DEPENDENCY]`). Separate architectural and implementation-state questions for `DEV` from vocabulary, active business rule, and scope questions for `PO`.
   Completed when: every extracted term and operational claim is assigned to its target artifact (`CONTEXT.md`, `docs/product-overview.md`, or candidate ADR), every cross-source contradiction or glossary widening has a formulated PO question, and every technical gap in no-code mode is assigned to `DEV`.

3. **Examine.** Invoke the Skill tool for `socratic-examination` and follow its round, glossary, and `[TO CONFIRM]` discipline:
   - Open round 1 with the one-line triage classification (and in no-code mode with `TACIT ONLY`, state in one line that no workspace reference documents were found).
   - When sources exist (`DOCUMENTED` or `PARTIAL SOURCES`), ask blocking curation questions first: canonical term choices where sources use competing synonyms (recommending the dominant domain term with `[INFERENCE: source]`), whether legacy rules still hold in production, permission boundaries per role, and any glossary conflict against pre-existing `CONTEXT.md`.
   - When `TACIT ONLY`, open a focused onboarding frontier asking for: (a) product purpose in one sentence, (b) active user roles and who is restricted from what, (c) the 5 to 10 core domain entities, (d) modules already running in production, and (e) active external integrations and cross-cutting constraints, each with "no recommendation: no written source in workspace".
   - Architectural and code-level questions (`DEV`) do not enter PO rounds; note at the bottom of round 1 which technical questions were routed to engineering questionnaires.
   Completed when: the PO question frontier is empty, or the PO requests closing with current information.

4. **Synthesize.** Publish the curated context:
   - Ensure `CONTEXT.md` holds only resolved domain glossary entries (and `[TO CONFIRM: PO]` markers on unsettled challenges) per `socratic-examination`.
   - Write `docs/product-overview.md` following [TEMPLATE.md](TEMPLATE.md), citing `[INFERENCE: source]` on document-derived or code-derived claims not explicitly restated as PO decisions, keeping open gaps visible as `[TO CONFIRM: whom]` or `[UNMAPPED DEPENDENCY]`, and assigning the verdict: `BASELINE READY` (no open blocking or operational `[TO CONFIRM]` gaps), `PARTIAL` (usable for `/refine-story` while naming the open question numbers that unblock full baseline coverage), or `BLOCKED` (fundamental product purpose or core roles remain indeterminate or deadlocked in `[CONFLICT]`).
   - Write an ADR in `docs/adr/` only when a resolved decision meets the criteria in `socratic-examination`.
   Completed when: `docs/product-overview.md` exists with `Status:` matching the verdict and final disclaimer present, and `CONTEXT.md` holds every resolved domain term without silent rewrites or operational prose.

5. **Route open items.** For each recipient outside the session with `[TO CONFIRM]` items, write one questionnaire per recipient following `QUESTIONNAIRE.md` in `requirements-rigor`, alongside `docs/product-overview.md`, and link the file from the open questions section.
   Completed when: no `[TO CONFIRM]` marker remains without a numbered open question, recipient, and questionnaire when the recipient is outside the session.

6. **Report.** State concisely: verdict, count of domain terms recorded in `CONTEXT.md`, path to `docs/product-overview.md` (and any ADRs or questionnaires created), which questions unblock `BASELINE READY` when `PARTIAL`, and the recommended next workflow (`/refine-story` for an existing story or `/requirements-discovery` for raw scope).
   Completed when: verdict, glossary term count, delivered artifact summary, unblocking questions when `PARTIAL`, and next workflow are reported.

## Final notice

Published artifacts only (`docs/product-overview.md`). An examination round publishes nothing and carries no notice.

> ⚠️ This output is an analytical baseline of product context, not a replacement for team validation. Decisions on domain vocabulary, active rules, and scope belong strictly to the PO and team.

In a pt-BR workspace:

> ⚠️ Este output é uma base analítica do contexto do produto, não substitui a validação do time. A decisão sobre vocabulário de domínio, regras vigentes e escopo é do PO e do time.
