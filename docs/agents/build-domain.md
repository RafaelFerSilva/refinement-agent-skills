# Build domain docs

How the engineering skills should consume this package's own documentation while working on it. Single context: one glossary, one ADR directory, both at the root.

## Before exploring, read these

- **`CONTEXT.md`** at the repository root. This package's glossary is `CONTEXT.md`, not a `GLOSSARY.md`: the name is fixed by the package itself, which generates and consumes `CONTEXT.md` as the domain glossary of every workspace it is installed into, and ADR 0005 records the vocabulary decisions.
- **`docs/adr/`**: the ADRs that touch the area about to change. The format is the one in `skills/socratic-examination/ADR.md`, and the bar for writing a new one is in that same file: hard to reverse, surprising without context, and the result of a genuine choice.
- **`AGENTS.md`**: the invariants, the writing style and the Definition of Done. It is the constitution, and it outranks an assumption a skill brings from another repository.
- **`docs/agents/harness.md`**: what the validator and the grader enforce, and the section on what they do not check.

## File structure

```
/
├── AGENTS.md
├── CONTEXT.md                 the domain glossary
├── docs/
│   ├── adr/                   decisions, format in skills/socratic-examination/ADR.md
│   ├── agents/                harness, preflight, and this build configuration
│   └── tickets/               specs and tickets for building the package
├── skills/                    the product
├── prompts/                   generated from skills/, never edited by hand
└── scripts/                   validator, prompt build, grader
```

## Use the glossary's vocabulary

When output names a domain concept, in a ticket title, a spec, a hypothesis or a check name, use the term as `CONTEXT.md` defines it, and avoid the synonyms its `_Avoid_` lists name. A concept missing from the glossary is a signal: either the language is being invented, which calls for a second look, or there is a real gap worth recording.

## Flag ADR conflicts

When output contradicts an ADR, surface it rather than overriding it silently:

> Contradicts ADR 0005 on what pt-BR localizes, and worth reopening because...
