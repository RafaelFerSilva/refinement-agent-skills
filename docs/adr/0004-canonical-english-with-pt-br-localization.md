# Canonical English with Brazilian Portuguese Localization

The package was originally authored with internal prompt instructions and repository governance in Portuguese (pt-BR), offering en-US as an output language option. To ensure global adoption, lower token consumption, and maximize LLM instruction adherence, we decided to make English the canonical language of the repository.

All skill instructions, companion references, repository governance (`AGENTS.md`), and package vocabulary (`CONTEXT.md`) are written canonically in English (en-US).

Workspaces continue to support Brazilian Portuguese (pt-BR) as a first-class citizen:

1. Operating language is selected in `docs/agents/refinement.md` (`Language: en-US` by default, or `Language: pt-BR`).
2. When `pt-BR` is selected, skills provide exact translation tables:
   - Socratic examination dialogues in Portuguese.
   - User Story narratives follow "Como [papel], quero [capacidade], para que [resultado]".
   - Acceptance criteria in Gherkin use `Dado`, `Quando`, `Então`, `E`.
   - Rigor markers use Portuguese equivalents: `[INFERÊNCIA: base]`, `[A CONFIRMAR: quem]`, `[AMBIGUIDADE]`, `[DECOMPOR]`, `[DITO: falante, "paráfrase"]`, `[PRESUMIDO: base]`, `[ESPECIFICADO: trecho]`, `[DERIVADO: técnica]`.
   - Artifact verdicts use Portuguese terms: `PRONTA`, `REFINAR`, `BLOQUEADA` for User Stories; `EXECUTÁVEL`, `PARCIAL`, `BLOQUEADO` for QA plans.
3. When `en-US` is selected (default), standard English terminology is applied directly without translation overhead.

We considered and rejected maintaining two separate parallel skill directories for English and Portuguese: it would duplicate rules of rigor and cause inevitable drift. Writing canonical instructions in English and providing precise localization guidelines maintains a single source of truth while ensuring optimal LLM performance.

Consequence: the package is immediately accessible to international developers and teams, LLMs follow canonical instructions with greater fidelity and lower token costs, while pt-BR users retain complete native support.
