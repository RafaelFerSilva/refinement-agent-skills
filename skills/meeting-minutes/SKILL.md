---
name: meeting-minutes
description: "Transforms a meeting transcript into auditable minutes: decisions and action items with provenance, presumed agreements for asynchronous confirmation, action items in JSON, and discovery input."
disable-model-invocation: true
argument-hint: "[transcript file path or paste text; 'actions mode' for table and JSON only]"
---

# Meeting minutes

Process a transcript and generate a structured, **auditable** record. Minutes become facts: three weeks later someone will cite this document as proof of what was agreed. Therefore, everything you record is traceable to the transcript, and everything you presume remains visibly separated from what was explicitly stated. Recording is certifying; your analysis must never disguise itself as attendee speech.

This workflow is synthesis without interview: the meeting has already occurred. Questions left open are directed to their recipients via questionnaires, and requirement content flows to `/requirements-discovery`.

Transcript: $ARGUMENTS

## Provenance boundary

Grounded in `requirements-rigor`, here provenance assumes three forms:

- `[STATED: speaker, "short paraphrase"]` (pt-BR: `[DITO: falante, "paráfrase curta"]`): stated in the transcript. Every action, decision, and priority carries who stated it and a 5 to 15 word paraphrase. An honest paraphrase suffices for auditing.
- `[ASSUMED: base]` (pt-BR: `[PRESUMIDO: base]`): your analysis inferred from conversational patterns: silence following a proposal, ambiguous "ok", task implied by a decision that no one explicitly assumed. Presumed items never enter Decisions, Action Items Table, or JSON; they live in presumption sections, with the excerpt and who must confirm.
- `[TO BE DEFINED]` (pt-BR: `[A DEFINIR]`): assignee or deadline neither mentioned nor inferable. The placeholder is the correct answer.

Quick test: "if an attendee reads this line and says 'I never said that', can I point to the excerpt?" Yes: STATED. "They didn't say it directly, but implied it": ASSUMED. Neither: TO BE DEFINED, or excluded from minutes. Remaining markers from `requirements-rigor`, such as `[INFERENCE: base]`, remain valid.

## Steps

1. **Metadata.** Read `docs/agents/refinement.md` in the workspace to identify the configured language (`en-US` or `pt-BR`, default `en-US`) and publishing path. Minutes, questionnaires, and generated inputs follow this language. Identify title, date, duration, attendees with roles, project, and glossary terms distorted by automated transcription. Date is mandatory: deadline arithmetic depends on it. If missing, ask in a single line before proceeding. Read `CONTEXT.md` for glossary terms when present.
   Completed when: date and attendees are established.

2. **Triage.** INTACT (continuous audio, identifiable speakers), DEGRADED (inaudible segments, misassigned speakers, cuts), INSUFFICIENT (too brief, or not the meeting from metadata). INSUFFICIENT: state reason and stop; facade minutes must not circulate as official records. DEGRADED: every gap that might have contained an action or decision becomes an open question ("inaudible segment at ~12min following proposal by X"); gaps are never reconstructed. Distorted terminology: apply glossary spelling and mark `[POSSIBLE TRANSCRIPTION ERROR: original -> adopted]` (pt-BR: `[POSSÍVEL ERRO DE TRANSCRIÇÃO: original -> adotada]`) in section 0, using only the adopted term throughout the body. Personal details, health, family, remarks on absent colleagues: omit from all sections; a project commitment embedded in personal context is recorded without the circumstance. Unidentified speaker with commitment: assignee `[TO BE DEFINED: unidentified speaker at ~Xmin]` and open question. A note that personal content was omitted may appear in triage without details; deadlines mentioned only inside personal context are kept textually without personal circumstance.
   Completed when: triage is recorded in section 0 with detected transcription errors.

3. **Extract.** Apply the rules from [RULES.md](RULES.md): retraction and supersedence, action item granularity, priority with provenance, what counts as a decision.
   Completed when: every decision and action item carries STATED provenance, and presumptions live strictly in sections 4 or 5.

4. **Write minutes** following [TEMPLATE.md](TEMPLATE.md). In "actions mode", write sections 3, 6, and 7 only.
   Completed when: the file exists at `.scratch/<project>-<YYYY-MM-DD>/minutes.md` (or where configured in `docs/agents/refinement.md`), with final disclaimer.

5. **Self-audit** and report in a single line in section 8: every real action in the table has a matching JSON object and no JSON object exists outside the table; every row and decision carries STATED; no ASSUMED leaked into table or decisions; priorities match between table and JSON; JSON dates are ISO or null.
   Completed when: section 8 states "Self-Audit: OK" or details corrections.

6. **Route open items.** Presumed agreements and open questions with recipients outside the session: write one questionnaire per recipient following `QUESTIONNAIRE.md` in `requirements-rigor`, alongside minutes, and link each from the generating section. Excerpts with requirement content (stated needs, capabilities, constraints): write `discovery-input.md` alongside minutes following the template at the end of [TEMPLATE.md](TEMPLATE.md), and instruct user that `/requirements-discovery` begins from it.
   Completed when: each presumed agreement has a recipient and questionnaire, and discovery input exists when the meeting contained requirement content.

## Final notice

> ⚠️ These minutes are an AI-generated draft derived from a transcript. They require attendee validation before circulating as an official record, particularly Presumed Agreements, which were not explicitly verbalized and require confirmation.
