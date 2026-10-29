---
name: implement-spec
description: "Implement the result of /to-spec and /to-tickets on this package."
disable-model-invocation: true
metadata:
  internal: true
---

You have been provided a spec. This spec should have tickets associated with it under `docs/tickets/<feature-slug>/`, describing how to implement the spec.

Read the issue tracker in [`docs/agents/build-issue-tracker.md`](../../../docs/agents/build-issue-tracker.md) and domain rules in [`docs/agents/build-domain.md`](../../../docs/agents/build-domain.md).

The goal is the entire spec implemented on a single **integration branch**, with every ticket resolved the way [`docs/agents/build-issue-tracker.md`](../../../docs/agents/build-issue-tracker.md) closes work.

The tickets are not a list of steps. They are a **task graph** with blocking relationships between them. This means there is always a **frontier** of tickets which are ready to be grabbed.

Communication to and from subagents should be sparse. Communicate primarily through **context pointers**: to the spec, tickets, research notes, and previous commits. Don't duplicate information already available via pointers.

**Implementer subagents** should be run in the background where possible for maximum concurrency.

## Steps

1. Read the spec and tickets to understand the task graph.

2. (optional) Use an **exploration subagent** to conduct any exploration required by the tickets, relevant codebase files or external documentation. Ensure the exploration subagent can save files: it should save its markdown notes in a directory outside the repo, accessible by all future subagents. This lets **implementer subagents** focus on implementation rather than exploration.

3. Create the integration branch. If the user explicitly asks for a draft PR, open one after the first merge in step 5 (a branch with no commits ahead of main can't open one), marked as closing the spec and tickets.

4. Use **implementer subagents** to implement each ticket, each in its own worktree on its own branch. Each implementer subagent:
   - confirms its worktree is based on the integration branch before starting, and resets onto it if not;
   - reads and follows [`implement`](../implement/SKILL.md), starting with the ticket preflight in [`docs/agents/ticket-preflight.md`](../../../docs/agents/ticket-preflight.md) and halting on any outcome other than **confirmed** or **adjusted**;
   - stages explicit paths rather than `git add -A` when committing to its worktree branch, and merges the integration branch tip into its own branch before reporting done

5. Once an **implementer subagent** completes, merge its work to the integration branch with a **merger subagent**.

6. If this changes the **frontier** of available tickets, kick off more **implementer subagents** to work on the new tickets. This allows for maximum concurrency.

7. Once all tickets are complete, run the Definition of Done from `AGENTS.md` (`node scripts/validate-skills.mjs`, `node scripts/build-prompts.mjs --check`, and `claude plugin validate . --strict`), then read and follow [`code-review`](../code-review/SKILL.md) on the integration branch. Fix all issues raised by the code review in a single **implementer subagent**.

8. Resolve each completed ticket per [`docs/agents/build-issue-tracker.md`](../../../docs/agents/build-issue-tracker.md) and report the integration branch. Do not push or merge into `main` without explicit user authorization.

9. Clean up all **implementer subagent** worktrees.
