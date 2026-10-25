# A glossary rule held by a check, not by its rate

`socratic-examination` tells a session to challenge an answer that widens a term the glossary already defines, and measured over nine driven sessions in two placements and three wordings the rule fired in two runs of three every time, below the threshold `evals/README.md` holds an assertion to. We decided to keep the rule as worded and make its violation detectable instead of rewording it again: `scripts/diff-glossary.mjs` fails a run in which a term defined at the start was rewritten without a confirm marker, and that result aggregates over runs like any other grade. The rationale is the shape of the misses: the sessions that missed did not disobey the rule, they did not see the widening as a widening, and a sentence does not reach a session that is not looking, while a check does not need it to look.

## Considered alternatives

Accepting the rule at two of three with a note in `harness.md`, rejected because a rule nobody can see failing is the defect the measurement effort exists to remove. A mechanism instead of a sentence, the glossary conflict as an item on the frontier or a field in the round, deferred rather than rejected: it changes round shape, which ticket 12 of `docs/tickets/measurement-depth/` also touches, and the check built here is how either of those would be measured. Dropping the rule, rejected because it removed the self-contradicting glossary of ticket 14 in six of six runs.

The check is a script of its own rather than a mode of `scripts/grade-output.mjs`, which the spec of `docs/tickets/measurement-depth/` names as the one mechanical seam. The grader reads one artifact through a language table, section by section; this reads two copies of one file and no section, so a mode would have carried a second input and an empty language branch through machinery built for neither. The seam that stays shared is the output: the same expectations shape, aggregated by the same script.

## Consequences

A rule whose rate is known and below threshold ships with the check that counts it, and the record says both numbers. The check reads a definition that changed; it does not read a new entry that contradicts another term without touching it, which stays on the list of what the harness does not check, and the `names` the check prints for each added term is where that reading starts.
