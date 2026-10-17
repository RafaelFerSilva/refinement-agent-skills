# ADR Format

File `docs/adr/NNNN-<slug>.md`, numbered sequentially from the highest existing number plus one. Create the directory when the first ADR is required.

```md
# <Short decision title>

<One to three sentences: context, decision, rationale.>
```

An ADR can be a single paragraph. The value lies in recording that the decision occurred and why, not in filling arbitrary sections. Optional sections, only when they add value: Status (proposed, accepted, superseded by NNNN), Considered alternatives, Consequences.

Record an ADR only when all three criteria apply: difficult to reverse; surprising without context; result of a genuine choice among alternatives. If any criterion is missing, do not record an ADR.
