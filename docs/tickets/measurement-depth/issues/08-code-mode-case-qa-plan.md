# 08: Eval case for qa-plan in mode com-codigo

Status: ready-for-agent
Blocked by: 06
Type: task
Origin: 2026-10-25 (commit 81547f6)

In `sem-codigo` every DEV question becomes a questionnaire. In `com-codigo` the plan is supposed to answer them by reading code, which changes what the matrix can assert: an observation point found in the source turns an undefined result into a specified one, and a layer stops being `[LAYER TO VALIDATE WITH DEV]`.

That is also the risk worth measuring. The three-layer boundary says `[SPECIFIED]` claims the cited excerpt states the outcome in words; code is not the specification, so a fact read from code grounds a layer or an observation point, not a business result. A case here should catch a plan that promotes a code reading into a specified business outcome.

## Acceptance criteria

- A case in `evals/qa-plan.json` runs with the `com-codigo` configuration fixture.
- Its assertions cover: a DEV question answered from code with a file citation instead of reaching the questionnaire, a layer settled rather than deferred, and no business result marked `[SPECIFIED]` on the strength of code alone.
- The case is run and its result recorded.

## Comments
