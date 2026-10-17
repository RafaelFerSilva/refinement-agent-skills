# Requirements Anti-Patterns

Scan source text for each of these anti-patterns. Each occurrence receives an inline `[ANTI-PATTERN: type]` tag and triggers a question or a correction that preserves the described behavior. The first five appear in any input; the last five are typical in pre-written User Stories.

## In any input

**Passive voice without subject**
Example: "the system must be validated", "data needs to be processed".
Problem: no actor; without an actor there is no story.
Action: ask who performs the action.

**Unverifiable outcome**
Example: "good user experience", "intuitive", "seamless".
Problem: QA cannot write an automated test.
Action: ask for measurable criteria: response time, error rate, observable state.

**Implicitly infinite scope**
Example: "support all file types", "work on any device".
Problem: impossible to estimate; any implementation can be contested.
Action: ask for the closed list of supported cases.

**Double requirement**
Example: "monitor speed and generate monthly reports".
Problem: two separate capabilities in one story; fails Independent (I) in INVEST.
Action: propose decomposing into two independent stories.

**Circular dependency**
Example: Story A depends on Story B being ready; Story B depends on Story A.
Problem: neither can enter a sprint.
Action: identify the actual prerequisite and what can be stubbed or mocked.

## In pre-written stories

**Solution in place of problem**
Example: "I want a dropdown with the last 10 items" when the actual problem is "quickly find recently accessed items".
Problem: kills Negotiable (N) in INVEST; the engineering team cannot propose a better solution.
Action: rewrite capability as a business need and move the suggested solution to notes, preserved as PO reference.

**Acceptance criterion that is a technical task**
Example: "AC: create database table", "AC: update API endpoint".
Problem: describes internal implementation rather than observable behavior.
Action: move to suggested tasks; if the behavior enabled by the task is not in another criterion, ask what it is.

**Divergent narrative and criteria**
Example: narrative promises report export, but criteria test search filters.
Problem: actual scope is ambiguous; each reader assumes a different interpretation.
Action: add `[DIVERGENCE]` listing what narrative covers versus criteria, and vice versa. Reconciliation belongs to PO.

**Orphan criterion**
Example: criterion testing behavior not mentioned anywhere in narrative.
Problem: hidden scope or leftover from copy-paste.
Action: add `[ORPHAN]` and ask if it belongs to this story or another.

**Definition of Done disguised as criterion**
Example: "AC: code reviewed", "AC: tests passing", "AC: deployed to staging".
Problem: applies across all stories; this is team DoD, not story-specific criteria.
Action: remove from criteria and notify. If the team has no formal DoD, note as observation.
