# Refinement Skills

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Skills](https://img.shields.io/badge/skills-8%20available-blue)](skills/)
[![Languages](https://img.shields.io/badge/languages-en--US%20(default)%20%7C%20pt--BR-green)](#two-modes-and-two-languages)

Agent skills for software requirements refinement: from meeting transcripts to QA test plans, driven by **socratic examination** (sabatina). The AI agent interviews the Product Owner in structured rounds with recommended answers, leaving no silent assumptions behind. Only then does it synthesize and publish. Nothing is invented: statements without backing become questions, and unanswered points are marked as explicit gaps and routed to questionnaires for stakeholders.

The package is self-contained: every skill invoked across the workflow lives directly in this repository.

---

## Workflow Infographic

The diagram below shows how each skill connects across the refinement lifecycle, from initial meeting discussions to automated QA test plans:

```mermaid
flowchart TD
    subgraph Setup["0. Workspace Setup (run once)"]
        CFG["/configure-refinement"] --> CFG_OUT["docs/agents/refinement.md<br/>• Mode: com-codigo or sem-codigo<br/>• Language: en-US (default) or pt-BR"]
    end

    subgraph Router["Router"]
        QF["/which-flow"] -.->|"guides starting point"| ATA
        QF -.-> DISC
        QF -.-> REF
        QF -.-> QA
    end

    subgraph Pipeline["Refinement Pipeline"]
        ATA["/meeting-minutes<br/>Raw meeting transcript"] --> ATA_OUT["Auditable Minutes<br/>+ Discovery Input<br/>+ Stakeholder Questionnaires"]
        ATA_OUT -->|"discovery-input.md"| DISC["/requirements-discovery<br/>Briefing or raw feature idea"]
        DISC --> DISC_OUT["Discovery Spec<br/>Epics and Candidate Stories"]
        DISC_OUT -->|"candidate story"| REF["/refine-story<br/>Product Owner User Story"]
        REF --> REF_OUT["Refined User Story<br/>INVEST Narrative + Gherkin Criteria<br/>Status: READY, REFINE, or BLOCKED"]
        REF_OUT --> QA["/qa-plan<br/>Testability and risks"]
        QA --> QA_OUT["QA Test Matrix<br/>Techniques, layers, and blockers<br/>Status: EXECUTABLE, PARTIAL, or BLOCKED"]
    end

    subgraph Core["Rigor Primitives (invoked by the model)"]
        SAB["socratic-examination<br/>Rounds with recommendations"]
        RIG["requirements-rigor<br/>Inference vs hallucination rules"]
    end

    Pipeline -.-> Core
```

Start at any point in the workflow. A User Story written by the PO can jump directly into `/refine-story`. Each workflow publishes its output to `.scratch/` so subsequent steps can consume it in a separate session. Use `/which-flow` if you are unsure where to begin.

---

## Daily Quick Reference

| Command | What you provide | What the agent delivers | Next step |
| --- | --- | --- | --- |
| `/configure-refinement` | None (interactive conversation) | Configured `refinement.md`, issue tracker rules, and agent instructions | `/which-flow` |
| `/meeting-minutes` | Meeting transcript or text | Auditable minutes with provenance, action items, and discovery input | `/requirements-discovery` |
| `/requirements-discovery` | Briefing, notes, or `discovery-input.md` | Sized epics and candidate stories (`spec.md` or decision map) | `/refine-story` |
| `/refine-story` | Text, file path, or ID of a User Story | Refined US with Gherkin criteria and INVEST verdict | `/qa-plan` |
| `/qa-plan` | Refined User Story | QA test matrix mapped by technique, risk, and testing layers | Sprint planning |
| `/which-flow` | Description of your current input material | Recommendation of the right command to use | Recommended flow |

---

## How Socratic Examination Works

Unlike traditional AI prompts that invent details or generate long specs in a single blind shot, Refinement Skills conducts a **structured examination in rounds**:

1. **Facts belong to the agent:** before asking anything, the agent checks the glossary (`CONTEXT.md`), ADRs, previous stories, and, in code mode, inspects the codebase directly via subagents.
2. **Decisions belong to the PO:** scope, business value, and prioritization are strictly decided by the Product Owner.
3. **Recommended answers:** every question includes a grounded recommendation (`[INFERENCE: base]`). The PO can accept it with a single word or pick an alternative.
4. **No silent hallucinations:** rules or constraints without evidence become explicit questions or visible markers (`[TO CONFIRM: whom]`).

### Example of an interactive examination round

```text
❓ Q1. Who exports the report? (blocking)
The narrative says "user". The domain glossary lists operations analyst and account manager. Which role exports, or both?
Recommendation: operations analyst [INFERENCE: role associated with operational reports in CONTEXT.md].

❓ Q2. What is the maximum acceptable download timeout? (blocking)
The criterion states "fast", which is not testable. What is the maximum time in seconds?
Recommendation: no recommendation (the text provides no baseline for SLA numbers). Suggested options: 3s, 5s, or 10s.
```

---

## Two Modes and Two Languages

### Operating Modes

| | Without Code (`sem-codigo`) | With Code (`com-codigo`) |
| --- | --- | --- |
| Target Audience | Product Owners, business analysts, QA engineers | Engineering teams with repository access |
| Source of Truth | `CONTEXT.md`, previous stories, documents in `docs/` | All workspace files plus source code via subagent |
| Technical Questions | Exported as questionnaires for developers | Answered by reading the code directly |
| Where to install | Dedicated product analysis workspace | The product codebase repository |

### Supported Languages

- **en-US (default):** socratic examination in English, narrative format "As a [role], I want [capability], so that [outcome]", Gherkin criteria with `Given/When/Then`, verdicts `READY`, `REFINE`, `BLOCKED`.
- **pt-BR:** socratic examination in Portuguese, narrative format "Como [papel], quero [capacidade], para que [resultado]", Gherkin criteria with `Dado/Quando/Então`, verdicts `PRONTA`, `REFINAR`, `BLOQUEADA`.

Operating mode and language are saved in `docs/agents/refinement.md` during `/configure-refinement`.

---

## Usage in Chat and Prompt-Based Agents

The [prompts/](prompts/) directory contains standalone, self-contained versions of each flow designed for Claude Projects, custom GPTs, Gems, Copilot Studio, or standard web chats. They are generated from `skills/` via `node scripts/build-prompts.mjs`. In this setup no local repository is needed: the user pastes the context directly into the chat.

---

## Workspace Installation and Setup

### 1. Install the skills

Choose the method that matches your environment:

- **Via Claude Code Plugin:**
  ```text
  /plugin marketplace add RafaelFerSilva/refinement-agent-skills
  /plugin install refinement-skills@refinement-skills
  ```

- **Via Agent Skills CLI (`npx skills`):**
  ```bash
  npx skills add RafaelFerSilva/refinement-agent-skills
  ```

- **Via Direct One-Liner (curl):**
  Install globally for all projects on your machine (`~/.claude/skills` and `~/.agents/skills`):
  ```bash
  curl -fsSL https://raw.githubusercontent.com/RafaelFerSilva/refinement-agent-skills/main/scripts/install.sh | bash
  ```
  Or install locally in your current workspace:
  ```bash
  curl -fsSL https://raw.githubusercontent.com/RafaelFerSilva/refinement-agent-skills/main/scripts/install.sh | bash -s -- --local
  ```

- **Via Local Git Clone:**
  ```bash
  git clone https://github.com/RafaelFerSilva/refinement-agent-skills.git
  cd refinement-agent-skills
  ./scripts/install.sh --global
  ```

### 2. Configure the workspace

Open your AI coding assistant inside your target project and run:

```text
/configure-refinement
```

The interactive skill guides you through:
1. **Operating mode:** `com-codigo` (agent inspects source code) or `sem-codigo` (technical questions become questionnaires).
2. **Language:** `en-US` (default) or `pt-BR`.
3. **Issue tracker:** base URL and prefix for task cards (Azure DevOps, Jira, GitHub Issues, etc.).
4. **Generated files:**
   - `docs/agents/refinement.md`: mode, language, and refinement rules.
   - `docs/agents/issue-tracker.md`: identifier conventions and links.
   - Adds the `## Refinamento` section to `AGENTS.md` or `CLAUDE.md`.

Once configured, run `/which-flow` to pick your first step.

---

## Skills Catalog

**User-Invoked Workflows**

- [which-flow](skills/which-flow/SKILL.md): router skill that identifies the right workflow for your input.
- [meeting-minutes](skills/meeting-minutes/SKILL.md): turns meeting transcripts into auditable minutes, JSON action items, and discovery input.
- [requirements-discovery](skills/requirements-discovery/SKILL.md): transforms raw briefs and notes into epics and candidate user stories.
- [refine-story](skills/refine-story/SKILL.md): refines a User Story through examination until it earns a READY, REFINE, or BLOCKED verdict.
- [qa-plan](skills/qa-plan/SKILL.md): creates test conditions with declared design techniques, risk levels, test layers, and blockers.
- [configure-refinement](skills/configure-refinement/SKILL.md): configures workspace mode, language, tracker, and instructions.

**Model-Invoked Primitives**

- [socratic-examination](skills/socratic-examination/SKILL.md): the underlying examination engine: rounds, decision trees, recommendations with cited evidence, and live glossary updates.
- [requirements-rigor](skills/requirements-rigor/SKILL.md): the shared rules of rigor: inference vs hallucination, markers, INVEST criteria, Gherkin standards, and questionnaire templates.

---

## Guia em Português

Para utilizar o fluxo em português:

1. Instale o pacote usando um dos comandos acima.
2. No seu repositório, execute `/configure-refinement` e selecione o idioma `pt-BR`.
3. O agente conduzirá as perguntas em português, produzirá narrativas no padrão "Como [papel], quero [capacidade], para que [resultado]", critérios com `Dado/Quando/Então`, marcadores como `[INFERÊNCIA: base]` e vereditos `PRONTA`, `REFINAR` ou `BLOQUEADA`.

---

## Development and Testing

- `node scripts/validate-skills.mjs`: verifies frontmatter, plugin manifest, router consistency, self-containment, and prompt freshness.
- `node scripts/build-prompts.mjs`: rebuilds standalone prompts in `prompts/` from `skills/`.
- `claude plugin validate . --strict`: validates plugin manifest.
- `git config core.hooksPath .githooks`: enables the pre-commit hook that runs the three checks above before each commit.
- `scripts/install.sh`: fast installer script for local and remote setups.
- `evals/`: evaluation fixtures following Anthropic skill-creator format.

Contributor guidelines are detailed in [AGENTS.md](AGENTS.md); project vocabulary in [CONTEXT.md](CONTEXT.md); architectural decisions in [docs/adr/](docs/adr/).

---

## License

[MIT](LICENSE). Free and open-source software for the community.
