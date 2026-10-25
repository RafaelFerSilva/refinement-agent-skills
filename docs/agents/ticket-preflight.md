# Ticket preflight

A ticket describes the package as it was on the day it was written (`Origin: YYYY-MM-DD (commit <hash>)`). The preflight confirms, **before any edit**, that its premises still hold. It applies to every piece of work that starts from a ticket or a spec, with or without `/implement`.

Why this package needs it: its evidence is dated by construction. A rule that behaved one way when it was measured can behave differently after a neighbouring rule changes, which happened repeatedly in the sessions recorded in `docs/adr/`; `prompts/` is generated, so a skill edit silently invalidates it; and the eval numbers in any ticket are a snapshot of one run, not a property of the package. Treat every claim in a ticket as a hypothesis to re-verify, not a requirement to execute.

## Required steps

1. **Read the ticket and its surroundings.**
   - Read the whole ticket at `docs/tickets/<feature-slug>/issues/<NN>-<slug>.md`, including `## Comments`, the feature `spec.md`, and the `Blocked by:` line.
   - Completed when: the ticket is open for work and every ticket in `Blocked by:` is resolved. Otherwise go to step 5 with the outcome **blocked**.

2. **Read the documents that govern the area.**
   - [`CONTEXT.md`](../../CONTEXT.md): the canonical term for anything the ticket names, and its `_Avoid_` list.
   - [`AGENTS.md`](../../AGENTS.md): Invariants, Writing style, Definition of Done.
   - [`docs/adr/`](../adr/): the decisions that already settled this area, ADR 0005 in particular when the ticket touches vocabulary.
   - [`harness.md`](harness.md): what the validator and the grader enforce, and the section on what they do not check.
   - The `SKILL.md` the ticket touches, plus its companion files; for a shared rule, `skills/requirements-rigor/SKILL.md` or `skills/socratic-examination/SKILL.md`.
   - Completed when: for each source you point at the passage that applies, or record that none does.

3. **Check every claim of the ticket against the current package, and reproduce before fixing.**
   - Open each file, step, completion criterion, marker, heading or check the ticket cites, and read it as it stands now.
   - Read `git log` for those files since the commit on the `Origin:` line.
   - When the ticket claims a behavior defect, reproduce it before changing any rule: run `node scripts/grade-output.mjs <artifact> --skill <name> --lang <language>` against an artifact that shows it, or run the eval case the defect belongs to and read the output. A rule changed against an unreproduced claim is a guess, and the measured series in ADR 0005 exists because asking harder is worth less than reproducing.
   - Completed when: every claim carries a verdict (**confirmed**, **changed** or **false**) and every acceptance criterion is classified (**still holds**, **already satisfied** or **needs changing**).

4. **Check the conflicts the invariants make possible.** Only the lines that apply.
   - Touches a skill under `skills/`? `name` matches the folder, and `plugin.json`, `README.md` and the `which-flow` router all know it. User-invoked or model-invoked must agree between the frontmatter and `agents/openai.yaml`.
   - Touches a rule used by more than one workflow? It belongs in `requirements-rigor` or `socratic-examination`, once, and the workflows point at it.
   - Touches localized vocabulary, a marker, a section heading, a triage label, a verdict or a notice? Both languages, at the point where the decision is made, plus the language table of `scripts/grade-output.mjs`. ADR 0005 holds the split between what is localized and what stays canonical.
   - Adds a reference to a file or to the Skill tool inside a skill? An adaptation rule in `scripts/build-prompts.mjs`, and the rule set stays live: a rule whose removal keeps `--check` green is dead weight.
   - Changes behavior that the evals assert? Update `evals/*.json`, and `evals/fixtures/artifacts/` when the shape of a published artifact changed.
   - Prose: no em-dash or en-dash, and `SKILL.md` under 500 lines.
   - Completed when: the conflicts are listed, or you state that there are none.

5. **Record in `## Comments` and decide.**
   - Append the entry below to the `## Comments` section of the ticket itself.
   - Follow the action in the outcomes table strictly. Start coding only on **confirmed** or **adjusted**.

## Log entry, in the ticket `## Comments`

```markdown
- YYYY-MM-DD Preflight (commit <short hash>): <outcome>
  - Docs: <source: the passage that applies>
  - Package: <file:line: confirmed | changed: ... | false: ...>
  - Reproduction: <command and what it showed, or "not applicable">
  - Criteria: <n> still hold, <n> already satisfied, <n> need changing
  - Conflicts: <list or "none">
```

## Outcomes

| Outcome | When it applies | What to do |
|---|---|---|
| **confirmed** | Every premise and criterion matches the package as it stands | Mark the ticket as claimed in the same edit as the log entry, and start implementing |
| **adjusted** | The intent holds, details moved (path, step number, wording, check name) | Update the ticket text in the same edit as the log entry, and start implementing |
| **already done** | Every acceptance criterion is already satisfied at `HEAD` | Do not code. Resolve the ticket, citing the commit, the check or the measurement as evidence |
| **false premise** | A central claim is refuted by the package, or conflicts with an ADR or an invariant | Do not code. Send the ticket back for information, record the evidence, and tell the user |
| **needs a decision** | A product or vocabulary decision is missing and is not the agent's to arbitrate | Do not code. Hand the ticket back to the user with the question stated plainly |
| **blocked** | A ticket in `Blocked by:` is not resolved | Do not code. Say which blocking ticket has to land first |

Where tickets live is in [`build-issue-tracker.md`](build-issue-tracker.md) and the status vocabulary is in [`build-triage-labels.md`](build-triage-labels.md).
