---
name: which-flow
description: "Ask which refinement workflow to use. A router over the skills in this package."
disable-model-invocation: true
---

# Which flow?

You do not need to memorize every skill; ask.

A **workflow** is a path through the skills. The primary path runs from meeting to sprint planning; each step publishes an artifact to the tracker that the subsequent step consumes. Underneath run two model-invoked primitives consulted by all workflows.

## Primary workflow: meeting to planning

1. **`/meeting-minutes`** when the starting point is a meeting transcript. Produces auditable minutes with provenance, questionnaires to confirm presumed agreements, and discovery input.
2. **`/requirements-discovery`** when the starting point is raw input: discovery input from minutes, a briefing, an email, or a feature idea. Conducts breadth-first examination and publishes epics and candidate stories. When scope exceeds a single session, it opens a **decision map**, and running the same command on the spec resolves one decision per session until the map clears.
3. **`/refine-story`** per story, whether candidate or written by the PO. Conducts examination until the question frontier is empty and publishes the refined story with a readiness verdict: READY, REFINE, or BLOCKED.
4. **`/qa-plan`** on the refined story. Derives test conditions with declared design techniques, examines the PO on undefined behavior, and routes architectural dependencies to the engineering team.

Enter at any step. A User Story written directly by the PO enters `/refine-story`; a story refined elsewhere enters `/qa-plan`.

### Context hygiene

Each workflow fits in a single session and publishes to the tracker. Between workflows, run `/clear`: the subsequent step reads the published artifact, not the conversation history. Within a workflow session, do not compact context before final synthesis: the examination and the resulting artifact require the same continuous reasoning.

## Two operating modes

The workspace declares in `docs/agents/refinement.md` whether it runs **with code** (`com-codigo`) or **without code** (`sem-codigo`). With code, workflows inspect the codebase before asking questions and resolve architectural questions directly. Without code, the PO is the source of facts, the glossary and previous stories serve as memory, and architectural questions become questionnaires for the engineering team. The workflows remain identical; only who answers what changes.

## Underlying primitives

- **`socratic-examination`**: the examination engine itself: rounds, frontier, recommended answers with grounded citations, facts by the agent and decisions by the PO, glossary and ADRs updated on the spot. Invoked by all examination workflows; invoke directly when you want to be examined on any topic without requirements domain framing.
- **`requirements-rigor`**: boundary between inference and invention, markers, INVEST criteria, Gherkin standards, anti-patterns, verdicts, and questionnaire format. Invoked by all workflows.

## When key stakeholders are outside the session

Workflows conclude by writing a questionnaire per recipient alongside the artifact, containing questions that examination could not resolve. Send the file, paste responses into a new conversation, and run the workflow again against the artifact: it resumes from where it left off.

## Prerequisite

**`/configure-refinement`**, run once per workspace: sets up operating mode, tracker, and publishing conventions.
