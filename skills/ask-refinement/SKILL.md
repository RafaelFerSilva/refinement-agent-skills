---
name: ask-refinement
description: "Answers questions about how to use the refinement skills package, explains markers, verdicts, workspace files, and workflow handoffs, and diagnoses current workspace status to recommend the next step."
disable-model-invocation: true
argument-hint: "[question about workflows, files, markers, or workspace status]"
---

# Ask refinement

Single-turn, read-only Q&A and workspace diagnostic helper for the Refinement Skills package. Answer operational questions directly and ground guidance in the current workspace state, keeping every file untouched and omitting examination rounds, `Status:` headers, and artifact disclaimers.

Question: $ARGUMENTS

## Steps

1. **Inspect workspace state silently.** Check which workspace files exist: `docs/agents/refinement.md` (configured `Mode:` `with-code` or `without-code`, or legacy `com-codigo` or `sem-codigo`, and `Language:` or legacy `Idioma:` `en-US` or `pt-BR`), `docs/agents/issue-tracker.md`, `CONTEXT.md`, `docs/product-overview.md`, `docs/adr/`, `docs/reference/`, and `.scratch/` (`Status:` lines on artifacts, `issues/` decision files with `Status:` and `Blocked by:` when a discovery spec has `Status: open map` or `Status: mapa aberto`, and any `questionnaire-*.md` or `questionario-*.md` files). When `docs/agents/refinement.md` is absent, record that workspace configuration has not run yet and continue. Select the response language from `Language:` (or `Idioma:`) in `docs/agents/refinement.md` when present, otherwise from the language of the user's question (`en-US` or `pt-BR`, default `en-US`).
   Completed when: response language (`en-US` or `pt-BR`) is selected and existing configuration, context files, open artifacts, decision-map items, and pending questionnaires are inventoried.

2. **Load authoritative rules on demand.** Consult the package primitives strictly as reference material so explanations match canonical package rules:
   - When the question concerns markers, verdicts, triage labels, Gherkin, INVEST, anti-patterns, or questionnaires, invoke the Skill tool for `requirements-rigor` (and read `ANTI-PATTERNS.md` or `QUESTIONNAIRE.md` in `requirements-rigor` when asked about anti-patterns or questionnaires).
   - When the question concerns examination rounds, question frontier, recommended answers, early closure, `CONTEXT.md` rules, or ADRs, invoke the Skill tool for `socratic-examination` (and read `GLOSSARY.md` or `ADR.md` in `socratic-examination` when asked about glossary or ADR format).
   Completed when: every package rule, marker, verdict, or format touched by the question is verified against its authoritative primitive.

3. **Answer directly and recommend the next command.** Resolve the user's question concisely in the selected language, citing the relevant files and statuses observed in step 1 (when input is empty, deliver a concise diagnostic summary of what is configured, open, unblocked, or missing in the workspace). End with the concrete command (and file path, when applicable) to run next.
   Completed when: the answer directly resolves the question (or diagnoses the workspace when input is empty), names relevant existing workspace files, leaves all files untouched, and states the exact next command when an action applies.

## Workspace and lifecycle reference

### File responsibilities in a target workspace

- `docs/agents/refinement.md`: operating mode (`with-code` or `without-code`), language (`en-US` or `pt-BR`), fact-source priority order, and artifact conventions. Created once by `/configure-refinement`.
- `docs/agents/issue-tracker.md`: external work item ID convention (for example `Azure: <ID>`) and local `.scratch/<slug>/` publishing paths.
- `CONTEXT.md`: **domain glossary only** (roles, business entities, domain events, and `_Avoid_` synonyms). Operational prose, scope decisions, and implementation details stay out.
- `docs/product-overview.md`: operational baseline of an ongoing product (purpose, role permissions, production modules, active integrations, cross-cutting rules and SLAs, resolved source conflicts). Created and updated by `/bootstrap-context`.
- `docs/adr/`: architectural and product decisions that are difficult to reverse.
- `docs/reference/`: raw existing product manuals, business rules, specifications, or exported legacy User Stories dropped in without reformatting for `/bootstrap-context` and workflows to consult.
- `.scratch/<slug>/`: published workflow artifacts (`minutes.md`, `discovery-input.md`, `spec.md`, candidate stories under `issues/`, `qa-plan.md`), pending decision files (`issues/NN-decision-*.md`), and asynchronous stakeholder questionnaires (`questionnaire-<recipient>.md` or `questionario-<destinatario>.md`).

### Workflow progression and entry points

- **Unconfigured workspace (`docs/agents/refinement.md` missing):** run `/configure-refinement` first.
- **Ongoing (brownfield) product without `CONTEXT.md` or `docs/product-overview.md`:** drop any existing documentation into `docs/reference/` (optional when none exists) and run `/bootstrap-context` before refining User Stories. Because `requirements-rigor` forbids silent invention, jumping straight into `/refine-story` on an advanced product with empty context produces many first-round baseline questions instead of invented defaults.
- **Pipeline stages (enter at any stage, or run `/which-flow` to route an input):**
  1. `/meeting-minutes`: meeting transcript -> auditable minutes with provenance, questionnaires, and `discovery-input.md`.
  2. `/requirements-discovery`: briefing, notes, or `discovery-input.md` -> domains, sized epics, and candidate stories (or an `open map` / `mapa aberto` decision map when scope exceeds one session).
  3. `/refine-story`: candidate story or PO-written User Story -> INVEST narrative, Gherkin acceptance criteria, and readiness verdict.
  4. `/qa-plan`: refined User Story -> test conditions matrix with techniques, risk, testing layers, automation blockers, and verdict.

### Resuming paused work and session hygiene

- **Resuming after a stakeholder answers a questionnaire (`questionnaire-<recipient>.md` / `questionario-<destinatario>.md`):** start a clean session, paste or attach the stakeholder's answers, and re-run the originating workflow (`/refine-story`, `/qa-plan`, `/requirements-discovery`, or `/bootstrap-context`) passing the existing artifact path in `.scratch/` (or `docs/product-overview.md`). The workflow reads prior decisions from the artifact, resolves open items, and updates the verdict.
- **Progressing an open decision map (`Status: open map` / `Status: mapa aberto`):** re-run `/requirements-discovery <path-to-spec.md>` in a fresh session to examine and resolve one unblocked pending decision per session until the map clears. A pending decision under `issues/` is unblocked when its `Status:` is `open` and every item in its `Blocked by:` line is `resolved` (or `none`).
- **Closing an examination early:** the PO can request closing with current information in any round; consult `socratic-examination` and `requirements-rigor` for how remaining open items are marked, routed to questionnaires, and reflected in verdicts.
- **Session context hygiene:** run `/clear` between workflows so the next workflow reads the published markdown artifact cleanly; keep context uncompacted within an active examination until final synthesis completes.
- **Web chat platforms without a local repository:** teammates on Claude Projects, Custom GPTs, Gemini Gems, or Copilot Studio run the generated standalone prompts in `prompts/`.
