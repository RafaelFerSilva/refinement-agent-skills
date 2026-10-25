# 07: Eval case for refine-story in mode com-codigo

Status: ready-for-agent
Blocked by: 06
Type: task
Origin: 2026-10-25 (commit 81547f6)

With a repository to read, measure the behavior the mode exists for: a fact found in code becomes a recommended answer citing the source file, not a question to the Product Owner.

The case asserts the difference from `sem-codigo` rather than repeating what that mode already covers: the fact that the code answers is not asked; the citation names file and line; a fact the code contradicts enters the round as a question rather than being resolved unilaterally, which is what `socratic-examination` requires; and the architecture questions that in `sem-codigo` go to a questionnaire are answered here.

## Acceptance criteria

- A case in `evals/refine-story.json` runs with the `com-codigo` configuration fixture.
- Its assertions cover: a code-sourced fact appearing as a recommendation with a file citation, that same fact not being asked of the PO, and a contradiction between code and ticket entering the round as a question.
- The case is run and its result recorded, over the number of runs ticket 04 sets.

## Comments
