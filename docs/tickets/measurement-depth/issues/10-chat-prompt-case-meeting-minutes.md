# 10: Eval case against the generated chat prompt for synthesis

Status: ready-for-agent
Blocked by: 09
Type: task
Origin: 2026-10-25 (commit 81547f6)

The adaptation rules bite hardest where a workflow publishes files. `meeting-minutes` writes minutes, a discovery input and one questionnaire per recipient, and in the chat version all of that has to arrive in the response, each artifact in its own block named for the file it would have been.

This is also the only chat case where the mechanical grader applies: the minutes delivered in a block can be saved and graded like any published artifact.

## Acceptance criteria

- A case runs `prompts/meeting-minutes.md` with the transcript inline.
- Its assertions cover: every artifact delivered in its own titled block, the self-audit present, and no path under `.scratch/` claimed as written.
- The delivered minutes are saved and graded with `scripts/grade-output.mjs`, and the result recorded.

## Comments
