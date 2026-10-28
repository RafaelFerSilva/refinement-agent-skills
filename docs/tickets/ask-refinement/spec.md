# Spec: interactive Q&A and workspace diagnostic skill (`/ask-refinement`)

Status: resolved
Origin: 2026-10-28 (commit 0803edb)

## Problem Statement

Teams installing the package into a target workspace only receive the skill directories, without the repository's top-level documentation or Getting Started guides. While the router skill helps pick a workflow command given an input artifact, users frequently encounter operational doubts in day-to-day usage that go beyond command routing: understanding what a rigor marker or readiness verdict means, distinguishing what belongs in the domain glossary versus the product overview or an ADR, knowing how to resume a User Story or QA plan after an asynchronous stakeholder questionnaire returns, understanding why cold starts on ongoing products produce many questions instead of silent inventions, or simply checking the current state of their workspace to know what step comes next.

Without a dedicated, read-only Q&A and diagnostic skill, users either guess commands by trial and error, invoke an examination workflow prematurely (which stops when workspace configuration is missing or opens socratic examination rounds instead of answering a help question), or lack an in-chat way to ask how standalone prompts and platform memory updates work.

## Solution

Introduce a user-invoked, read-only Q&A and diagnostic skill (`/ask-refinement`) alongside its generated standalone chat prompt:

1. In a target workspace, `/ask-refinement` inspects existing configuration, context files, reference material, and published artifacts before answering in a single turn, adapting its response language to the configured workspace language (or to the user's question language when the workspace is not yet configured) and grounding its guidance on the actual files and statuses present.
2. Rather than duplicating rules owned by the model-invoked primitives, `/ask-refinement` loads `requirements-rigor` and `socratic-examination` on demand when questions touch markers, verdicts, triage labels, Gherkin, INVEST, questionnaires, examination rounds, glossary rules, or ADRs, while carrying concise operational reference on workspace file anatomy, workflow handoffs, resuming after questionnaires or open decision maps, early closure, and context hygiene.
3. The prompt generator composes a self-contained chat-mode version of `/ask-refinement` that embeds the primitives strictly as reference material so web-chat users on platforms with persistent memory or knowledge bases can ask questions about workflows, markers, and the consolidated memory-update protocol in a single turn without triggering examination rounds.
4. Package manifests, the router skill, entry-point guides, validator rules, and evaluation cases are updated to cover configured workspaces in `en-US` and `pt-BR`, unconfigured workspaces, and standalone chat-prompt execution.

## User Stories

1. As a new user who just installed the package into an unconfigured workspace, I want to run `/ask-refinement` to ask how to start, so that the agent detects that workspace configuration is missing, answers in my language without failing, and guides me to `/configure-refinement`.
2. As a Product Owner on an ongoing product wondering why `/refine-story` asks many first-round questions, I want `/ask-refinement` to explain the boundary between grounded inference and forbidden invention and show me how to populate reference docs and run `/bootstrap-context`, so that I know how to eliminate cold-start friction.
3. As a Product Owner or QA engineer reading a published artifact, I want to ask `/ask-refinement` what specific rigor markers, anti-pattern labels, triage labels, or readiness verdicts mean in `en-US` or `pt-BR`, so that I get an authoritative explanation drawn directly from `requirements-rigor` without opening an examination session.
4. As a Product Owner who received developer answers to an exported questionnaire, I want to ask `/ask-refinement` how to continue my User Story or QA plan, so that the agent inspects my workspace artifacts, identifies the paused User Story and questionnaire, and gives me the exact command and inputs to resume.
5. As a Product Owner working through a large discovery effort with an open decision map, I want to ask `/ask-refinement` how decision maps progress and what is currently unblocked in my workspace, so that I know how to resolve the next decision one session at a time.
6. As a user unsure what belongs in `CONTEXT.md` versus the product overview versus architectural decision records, I want `/ask-refinement` to explain the responsibility of each file and inspect which ones already exist in my workspace, so that I keep the domain glossary pure.
7. As a Product Owner in the middle of planning who wants to know whether an examination can end before every edge case is settled, I want `/ask-refinement` to explain early closure, `[TO CONFIRM: whom]` routing, and how remaining gaps affect verdicts, so that I can manage session time deliberately.
8. As a user running `/ask-refinement` with no arguments or asking "what should I do next?", I want the agent to diagnose my current workspace state (configuration, baseline context, open artifacts, pending questionnaires) and recommend the concrete next command, so that I never lose track between sessions.
9. As a chat-mode user on Claude Projects, Custom GPTs, Gemini Gems, or Copilot Studio, I want a standalone `ask-refinement` prompt that answers questions about the prompt collection and explains full-file versus append-only platform memory updates in a single turn, so that I can troubleshoot usage without triggering examination rounds or disk-oriented instructions.
10. As a user asking `/which-flow` when I have a general usage question rather than an artifact to process, I want the router to point me to `/ask-refinement`, so that both entry points stay aligned.
11. As a package maintainer, I want `/ask-refinement` registered in manifests, guides, prompt generation, validator checks, and evaluation suites, so that regressions in self-containment, prompt adaptation, or read-only Q&A behavior are caught mechanically and behaviorally.

## Implementation Decisions

- **User-invoked, strictly read-only, single-turn assistant:** `/ask-refinement` is user-invoked (`disable-model-invocation: true`, `allow_implicit_invocation: false`) so its instructions impose zero permanent context load during normal workflows. Unlike artifact-producing examination workflows, `/ask-refinement` never creates, modifies, or deletes files, never emits a workflow status verdict or artifact disclaimer, and answers directly in a single turn without opening `❓ Q<n>` socratic examination rounds.
- **Graceful workspace diagnostic before answering:** Instead of halting when workspace configuration is absent, `/ask-refinement` inspects workspace configuration, tracker configuration, domain glossary, product overview, ADRs, reference documentation folder, and published artifacts/questionnaires as optional diagnostic signals. Language follows the configured workspace language when present; when workspace configuration is absent (or in chat mode), language follows the user's question (`en-US` or `pt-BR`, defaulting to `en-US`). When invoked with an empty argument, it defaults to reporting a concise workspace status diagnosis and the recommended next command.
- **Single source of truth via on-demand primitive loading:** To uphold the package invariant that shared rules live once in `requirements-rigor` or `socratic-examination`, `/ask-refinement` does not restate marker tables, verdict tables, INVEST criteria, Gherkin rules, or glossary/ADR templates. Instead, its steps instruct invoking `requirements-rigor` and/or `socratic-examination` (and reading their companion format files when asked about anti-patterns, questionnaires, glossary format, or ADR format) whenever the user's question touches those rules, keeping only workspace anatomy, cross-workflow lifecycle, questionnaire/map resumption, context hygiene, and platform-memory guidance in `/ask-refinement` itself.
- **Assistant mode in the prompt builder:** `build-prompts` generates a standalone `ask-refinement` prompt alongside the existing workflow prompts and router. Its chat-mode preamble frames the prompt as a single-turn Q&A helper over the prompt collection, treats embedded `socratic-examination` and `requirements-rigor` sections strictly as reference material to consult rather than examination instructions to execute, removes local disk inspection claims in favor of whatever context or artifacts the user pasted or configured in platform memory, and keeps `which-flow` out of the workflow-only prompt count or updates the router's prompt list dynamically so every standalone prompt is discoverable.
- **Validator allowance for unconfigured-workspace eval cases:** Because `/ask-refinement` intentionally handles workspaces that do not yet have configuration, the validator's workspace-configuration fixture check allows `ask-refinement` skill evaluation cases to run with zero configuration fixtures when testing cold unconfigured onboarding, while still validating configured `en-US`, configured `pt-BR`, and standalone chat-prompt cases.

## Testing Decisions

Good tests verify observable external behavior at existing package seams rather than internal wording:

- **Package validator and prompt builder seam (`validate-skills`, `build-prompts --check`, and `claude plugin validate --strict`):** verifies frontmatter and `openai.yaml` consistency, manifest/README/`which-flow` registration, valid Skill tool references to the two primitives, zero em-dashes or en-dashes across all markdown files, live prompt-adaptation rules with zero dead rules and zero unadapted workspace/tool leaks in the generated `ask-refinement` prompt, and valid evaluation suite structure (including unconfigured-workspace coverage for `ask-refinement`).
- **Evaluation suite seam (`evals/ask-refinement.json`):** follows prior art in `evals/refine-story.json` and `evals/bootstrap-context.json`, testing four observable scenarios via isolated subagents: (1) configured `en-US` workspace diagnosis and resuming a paused User Story with an exported developer questionnaire, (2) configured `pt-BR` ongoing product guidance explaining rigor markers (`[INFERÊNCIA:` vs. invention, `[A CONFIRMAR: DEV]`) and `/bootstrap-context` in Portuguese, (3) unconfigured workspace cold start guiding the user to `/configure-refinement` without failing, and (4) standalone chat-prompt execution explaining the prompt workflow and platform memory updates (`Append to CONTEXT.md` vs. full replacement) in one turn without opening examination rounds or referencing local disk writes.

## Out of Scope

- Mutating workspace files, automatically running `/configure-refinement` or `/bootstrap-context` on the user's behalf, or starting multi-round socratic examinations from inside `/ask-refinement`.
- Answering general software engineering questions unrelated to requirements refinement or this package's workflows and workspace conventions.
- Mechanical artifact grading in `grade-output`, since `/ask-refinement` publishes no artifact file.

## Further Notes

- Keeping `CONTEXT.md`'s definition of **Workflow** scoped to examination skills that publish artifacts preserves existing domain terminology while listing `ask-refinement` alongside `which-flow` and `configure-refinement` as user-invoked support skills in package documentation.

## Comments

- 2026-10-28 Resolution: all three tickets (`01-ask-refinement-skill`, `02-ask-refinement-chat-prompt`, `03-ask-refinement-evals-and-docs`) resolved, behavioral evaluations verified across all 4 cases (`en-US`, `pt-BR`, unconfigured cold-start, and standalone chat prompt), two-axis `code-review` findings applied, and all Definition of Done checks passing.

