# 06: Toy product repository for mode com-codigo

Status: ready-for-agent
Blocked by: none
Type: task
Origin: 2026-10-25 (commit 81547f6)

Mode `com-codigo` is half of what ADR 0001 promises, the half where the agent reads product code before asking, and it has no coverage at all. Every case today runs `sem-codigo`.

Build the smallest workspace that makes the mode real: a fixture directory holding a handful of source files for the RouteWise fleet domain the other fixtures already use, plus a `refinement-no-code` sibling configured with `Mode: com-codigo`. The code has to contain answers worth finding, so that a fact the PO would otherwise be asked for is instead recovered from a file with a citation: an alert threshold in a constant, a silencing field absent from a model, a missing lock on closure.

Small on purpose. Enough for an agent to cite file and line, not a working application.

## Acceptance criteria

- `evals/fixtures/code-workspace/` holds a few source files in the fleet domain, with at least three facts a workflow would otherwise ask about.
- `evals/fixtures/refinement-with-code-en-US.md` declares `Mode: com-codigo` and points at that directory.
- The validator still passes, and the new files are declared in the eval case that uses them.

## Comments
