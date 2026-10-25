# 09: Eval case against the generated chat prompt

Status: ready-for-agent
Blocked by: none
Type: task
Origin: 2026-10-25 (commit 81547f6)

`prompts/` is a product: the chat version of every workflow, generated from `skills/` by around thirty live adaptation rules. No eval has ever executed one. The validator only checks that the file matches what the build would produce, so a rule that adapts wrongly produces a stable, wrong prompt and passes.

Run `prompts/refine-story.md` as the whole instruction, with the fixture pasted rather than read from disk, and assert the behavior that the adaptation is supposed to preserve: the same triage, a round in the same shape, and the artifact delivered in the response instead of written to a path that does not exist in a chat.

## Acceptance criteria

- A case exists whose instruction is the generated prompt rather than the skill, with the fixture content inline.
- Its assertions cover: triage stated, round in the `socratic-examination` shape, no reference to writing files or to `.scratch/`, and no mention of a mode or a subagent the chat version removes.
- The case is run and its result recorded.

## Comments
