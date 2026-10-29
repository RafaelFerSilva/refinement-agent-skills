#!/usr/bin/env node
// Generates prompts/<flow>.md (self-contained single-chat prompts) and prompts/project/*.md
// (zero-duplication modular bundle for unified web workspaces with Knowledge Base files).
// Single source of truth are the skills; this file only composes and adapts. Do not edit prompts/ manually.
// Every rule in RULES is mechanically verified live on every build: any rule matching zero times throws.
// usage: node scripts/build-prompts.mjs [--check]
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'prompts');
const read = (p) => readFileSync(join(root, 'skills', p), 'utf8');

const noFrontmatter = (t) => t.replace(/^---\n[\s\S]*?\n---\n/, '');
const noTitle = (t) => t.replace(/^# [^\n]*\n/, '');
const body = (p) => noTitle(noFrontmatter(read(p)).trim()).trim();
const verbatim = (p) => noFrontmatter(read(p)).trim();
const part = (title, text) => `# ${title}\n\n${text}\n`;
const dropSection = (text, heading) => text.replace(new RegExp(`\\n## ${heading}\\n[\\s\\S]*?(?=\\n## |\\s*$)`), '\n');
const dropSubSection = (text, heading) => text.replace(new RegExp(`\\n### ${heading}\\n[\\s\\S]*?(?=\\n### |\\n## |\\s*$)`), '\n');

function replaceExact(text, pattern, replacement, label) {
  const next = text.replace(pattern, replacement);
  if (next === text) throw new Error(`unmatched targeted replacement in ${label}`);
  return next;
}

const RULES = [
  // Skill tool invocation for requirements-rigor
  [/invoke the Skill tool for `requirements-rigor`/gi, 'apply the "Requirements rigor" section of this prompt'],

  // Skill tool invocation for socratic-examination
  [/Invoke the Skill tool for `socratic-examination`/g, 'Apply the "Socratic examination" section of this prompt'],
  [/Continue rounds of `socratic-examination`/g, 'Continue rounds of socratic examination'],
  [/Resolve it with `socratic-examination`/g, 'Resolve it with socratic examination'],

  // ANTI-PATTERNS companion file
  [/\(read `ANTI-PATTERNS\.md` in `requirements-rigor` separately\)/g, '(see the "Anti-patterns" section of this prompt)'],
  [/`ANTI-PATTERNS\.md` of `requirements-rigor` is a separate read and holds the type names the tags below use, so the scan starts there\./g, 'The "Anti-patterns" section of this prompt holds the type names the tags below use, so the scan starts there.'],
  [/anti-pattern from \[ANTI-PATTERNS\.md\]\(ANTI-PATTERNS\.md\)/g, 'anti-pattern from the "Anti-patterns" section of this prompt'],
  [/live in \[ANTI-PATTERNS\.md\]\(ANTI-PATTERNS\.md\), read when scanning or auditing a text\./g, 'live in the "Anti-patterns" section of this prompt.'],

  // QUESTIONNAIRE companion file
  [/following `QUESTIONNAIRE\.md` in `requirements-rigor`/g, 'following the "Questionnaire" section of this prompt'],
  [/following \[QUESTIONNAIRE\.md\]\(QUESTIONNAIRE\.md\)/g, 'following the "Questionnaire" section of this prompt'],

  // TEMPLATE companion file
  [/following the template at the end of \[TEMPLATE\.md\]\(TEMPLATE\.md\)/g, 'following the "Discovery input" format in the "Template" section of this prompt'],
  [/following \[TEMPLATE\.md\]\(TEMPLATE\.md\)/g, 'following the "Template" section of this prompt'],
  [/following `skills\/refine-story\/TEMPLATE\.md`/g, 'following the "Candidate story template" section of this prompt'],
  [/listed at the end of the workflow `TEMPLATE\.md`/g, 'listed at the end of the "Template" section of this prompt'],

  // TEST-DESIGN companion file
  [/\[TEST-DESIGN\.md\]\(TEST-DESIGN\.md\)/g, 'the "Test design" section of this prompt'],

  // RULES companion file
  [/\[RULES\.md\]\(RULES\.md\)/g, 'the "Synthesis rules" section of this prompt'],

  // GLOSSARY & ADR companion files
  [/format of \[GLOSSARY\.md\]\(GLOSSARY\.md\)/g, 'format of the "Glossary format" section of this prompt'],
  [/in \[ADR\.md\]\(ADR\.md\)/g, 'in the "ADR format" section of this prompt'],

  // Workspace / scratch / file delivery adapting
  [/Read `docs\/agents\/refinement\.md` in the workspace to identify the configured language \(`en-US` or `pt-BR`, default `en-US`\) and publishing path\. Minutes, questionnaires, and generated inputs follow this language\./g, 'Minutes, questionnaires, and generated inputs follow the refinement language.'],
  [/Read `CONTEXT\.md` for glossary terms when present\./g, 'Use any glossary terms provided by the PO or stored in the Knowledge Base.'],
  [/Operating mode is determined by `Mode:` in `docs\/agents\/refinement\.md`:[\s\S]*?(?=Refinement language is determined by)/g, ''],
  [/Refinement language is determined by `Language:` \(or `Idioma:`\) in `docs\/agents\/refinement\.md` \(`en-US` or `pt-BR`\), with `en-US` as default\./g, 'Refinement language is determined by the language requested by the PO, or the language of the input when none is requested (`en-US` or `pt-BR`), with `en-US` as default.'],
  [/from an input statement, `CONTEXT\.md`, or a verified fact/g, 'from an input statement, the glossary, or a verified fact'],
  [/use the domain role from `CONTEXT\.md` when available\./g, 'use the domain role from the glossary when available.'],
  [/ Mapping to external tracker labels lives in `docs\/agents\/triage-labels\.md` when present\./g, ''],
  [/the file exists at `\.scratch\/<project>-<YYYY-MM-DD>\/minutes\.md` \(or where configured in `docs\/agents\/refinement\.md`\), with final disclaimer\./g, 'the minutes were delivered in the response, with final disclaimer.'],
  [/spec and candidate stories exist at the path defined in `docs\/agents\/refinement\.md`, with final disclaimer\./g, 'spec and candidate stories were delivered in the response, with final disclaimer.'],
  [/file exists at path defined by `docs\/agents\/refinement\.md`, with `Status:` matching the verdict and final disclaimer present\./g, 'the refined US was delivered in the response, with `Status:` matching the verdict and final disclaimer present.'],
  [/file exists at path defined by `docs\/agents\/refinement\.md` with final disclaimer present\./g, 'the QA plan was delivered in the response, with final disclaimer present.'],
  [/If `\.scratch\/<slug>\/` already exists for this US, inspect its contents: a previous session may have resolved questions, which you must not repeat\. The slug follows conventions in `docs\/agents\/refinement\.md`\. If `docs\/adr\/` or `\.scratch\/` are absent, proceed without warning\./g, 'If the PO pasted a previous artifact for this US, read it: a previous session may have resolved questions, which you must not repeat.'],
  [/If `\.scratch\/<slug>\/spec\.md` exists from `\/refine-story`, start from it: decisions from that session already answer many questions\. Without this file, treat/g, 'If the PO pasted the refined US from `/refine-story`, start from it: decisions from that session already answer many questions. Without it, treat'],
  [/search workspace sources: glossary, previous stories in `\.scratch\/`, documents attached by the PO\. In code mode, dispatch a subagent to search the codebase for what the US asserts or assumes: does the rule exist\? is the limit implemented\? does the integration function\? A found fact becomes a recommended answer citing the source\./g, 'search available context (glossary, `product-overview.md`, ADRs, previous artifacts, and reference documents provided by the PO or stored in the Knowledge Base). A found fact becomes a recommended answer citing the source.'],
  [/Search workspace sources \(`CONTEXT\.md`, ADRs, previous stories in `\.scratch\/`, attached documents\)/g, 'Search available context (`CONTEXT.md`, `product-overview.md`, ADRs, previous artifacts, and documents provided by the PO or stored in the Knowledge Base)'],
  [/In code mode, dispatch a subagent to inspect the codebase for DEV questions \(is notification synchronous or asynchronous\? is there a lock on approval\? does a mock exist for the external system\?\) and for existing code behavior on open PO questions: code facts settle testing layers, observation points on outcomes stated in specifications, automation blockers, and regression impact, with source citation, while any outcome no specification states in words stays `\[UNDEFINED -> Question n\]` for PO with the code behavior cited as context or recommendation base in the question\. /g, ''],
  [/Check glossary, previous stories in `\.scratch\/`, workspace documents, and in code mode, the codebase: does the mentioned integration already exist\? Is the threshold already implemented\?/g, 'Check available context (glossary, `product-overview.md`, ADRs, previous artifacts, and documents provided by the PO or stored in the Knowledge Base): does the mentioned integration already exist? Is the threshold already implemented?'],
  [/Before asking, search for the answer in `CONTEXT\.md`, ADRs, previous stories in `\.scratch\/`, and workspace documents; in code mode, inspect the codebase via subagent\./g, 'Before asking, search for the answer in available context (`CONTEXT.md`, `product-overview.md`, ADRs, previous artifacts, and documents provided by the PO or stored in the Knowledge Base).'],
  [/In no-code mode, search is restricted to the workspace without subagents; if nothing is found/g, 'Search is restricted to what the PO provided or stored in the Knowledge Base; if nothing is found'],
  [/In no-code mode, search is restricted to workspace files without subagents; if nothing is found/g, 'Search is restricted to what the PO provided or stored in the Knowledge Base; if nothing is found'],
  [/verify in workspace artifacts and, in code mode, against source code\./g, 'verify against artifacts and documents provided by the PO or stored in the Knowledge Base.'],
  [/Re-read `CONTEXT\.md`, where the workspace has one, against two things:/g, 'Re-read the provided or Knowledge Base glossary, when present, against two things:'],
  [/A resolved domain term enters `CONTEXT\.md` immediately, in the format of the "Glossary format" section of this prompt; do not accumulate for the end\./g, 'Acknowledge a resolved domain term in one line during the round and hold it in the format of the "Glossary format" section of this prompt for the consolidated "Memory / Knowledge Base Updates" section at synthesis.'],
  [/glossary updated immediately\./g, 'glossary terms acknowledged briefly during rounds for synthesis updates.'],
  [/Domain terms resolved are added to `CONTEXT\.md` immediately\./g, 'Domain terms resolved are acknowledged briefly during the round and emitted in the consolidated "Memory / Knowledge Base Updates" section at synthesis.'],
  [/record in `CONTEXT\.md` only what the PO resolves/g, 'include in the "Memory / Knowledge Base Updates" section at synthesis only what the PO resolves'],
  [/Read any paths or text in the input, existing files in `docs\/reference\/` and `docs\/` \(excluding `docs\/agents\/`\), `CONTEXT\.md`, domain ADRs in `docs\/adr\/`, and existing `docs\/product-overview\.md` when present,/g, 'Read what the PO provided in this conversation or stored in the Knowledge Base (pasted notes, attached legacy documents, existing glossary, ADRs, or prior product overview),'],
  [/In code mode, dispatch a subagent to map implemented domain entities, user roles and permission checks, external integrations, and configured limits or SLAs in the codebase, citing source files\. In no-code mode, inspection is restricted to workspace files without subagents; if neither reference documents nor prior context files exist/g, 'Inspection is restricted to what the PO provided or stored in the Knowledge Base; if neither reference documents nor prior context were provided'],
  [/every technical gap in no-code mode is assigned to `DEV`\./g, 'every unresolved technical gap is assigned to `DEV`.'],
  [/\(and in no-code mode with `TACIT ONLY`, state in one line that no workspace reference documents were found\)/g, '(and with `TACIT ONLY`, state in one line that no reference documents were provided or found in the Knowledge Base)'],
  [/"no recommendation: no written source in workspace"/g, '"no recommendation: no written source provided"'],
  [/Write `docs\/product-overview\.md` following the "Template" section of this prompt, citing `\[INFERENCE: source\]` on document-derived or code-derived claims/g, 'Deliver `product-overview.md` (or updated sections when prior `product-overview.md` came partially from platform memory) following the "Template" section of this prompt, citing `[INFERENCE: source]` on document-derived claims'],
  [/Write an ADR in `docs\/adr\/` only when/g, 'Deliver an ADR block (`NNNN-<slug>.md`) only when'],
  [/`docs\/product-overview\.md` exists with `Status:` matching the verdict and final disclaimer present, and `CONTEXT\.md` holds every resolved domain term without silent rewrites or operational prose\./g, 'the product overview was delivered in the response with `Status:` matching the verdict and final disclaimer present, and the glossary holds every resolved domain term without silent rewrites or operational prose.'],
  [/alongside `docs\/product-overview\.md`, and link the file from the open questions section\./g, 'delivered in the response, and reference it from the open questions section.'],
  [/path to `docs\/product-overview\.md` \(and any ADRs or questionnaires created\),/g, 'which artifacts and memory update blocks were delivered in the response,'],
  [/Source: <paths in docs\/reference\/, codebase in with-code mode, or "tacit onboarding examination">, \/bootstrap-context session on <YYYY-MM-DD>/g, 'Source: <pasted, attached, or Knowledge Base reference documents, or "tacit onboarding examination">, bootstrap-context session on <YYYY-MM-DD>'],
  [/Single-turn, read-only Q&A and workspace diagnostic helper for the Refinement Skills package\. Answer operational questions directly and ground guidance in the current workspace state, keeping every file untouched and/g, 'Single-turn, read-only Q&A helper for the Refinement Skills package. Answer operational questions directly and ground guidance in whatever context the user provided,'],
  [/1\. \*\*Inspect workspace state silently\.\*\* Check which workspace files exist: `docs\/agents\/refinement\.md`[^\n]+\n   Completed when: response language \(`en-US` or `pt-BR`\) is selected and existing configuration, codebase paths, context files, open artifacts, decision-map items, and pending questionnaires are inventoried\./g, '1. **Inspect provided context silently.** Check whatever context the user pasted, attached, or configured in platform memory / knowledge base (`CONTEXT.md`, `product-overview.md`, ADRs, prior refinement artifacts, open decision-map items, or questionnaires) without claiming local disk access. Select the response language from the language requested by the user or the language of the user\'s question (`en-US` or `pt-BR`, default `en-US`).\n   Completed when: response language (`en-US` or `pt-BR`) is selected and any provided context, open artifacts, decision-map items, and pending questionnaires are inventoried.'],
  [/When the question concerns operating modes, codebase paths, markers,/g, 'When the question concerns markers,'],
  [/\(and read `ANTI-PATTERNS\.md` or `QUESTIONNAIRE\.md` in `requirements-rigor` when asked about anti-patterns or questionnaires\)/g, '(and consult the "Anti-patterns" or "Questionnaire" section of this prompt when asked about anti-patterns or questionnaires)'],
  [/invoke the Skill tool for `socratic-examination` \(and read `GLOSSARY\.md` or `ADR\.md` in `socratic-examination` when asked about glossary or ADR format\)/g, 'apply the "Socratic examination" section of this prompt (and consult the "Glossary format" or "ADR format" section of this prompt when asked about glossary or ADR format)'],
  [/### File responsibilities in a target workspace\n\n- `docs\/agents\/refinement\.md`:[^\n]+\n- `docs\/agents\/issue-tracker\.md`:[^\n]+\n- `CONTEXT\.md`: ([^\n]+)\n- `docs\/product-overview\.md`: ([^\n]+) Created and updated by `\/bootstrap-context`\.\n- `docs\/adr\/`: ([^\n]+)\n- `docs\/reference\/`:[^\n]+\n- `\.scratch\/<slug>\/`:[^\n]+/g, '### Context and artifact responsibilities in chat mode\n\n- `CONTEXT.md` (in platform memory / knowledge base): $1\n- `product-overview.md` (in platform memory / knowledge base): $2 Created and updated by `bootstrap-context.md`.\n- `NNNN-<slug>.md` ADRs (in platform memory / knowledge base): $3\n- Reference documents: existing manuals, business rules, specifications, or exported legacy User Stories pasted, attached, or stored in the Knowledge Base when running `bootstrap-context.md`.\n- Workflow artifacts, decision items, and questionnaires: delivered directly in chat responses (`minutes.md`, `discovery-input.md`, `spec.md`, candidate stories, pending decision blocks, refined User Stories, `qa-plan.md`, and `questionnaire-<recipient>.md` or `questionario-<destinatario>.md`) ready to copy into your tracker.'],
  [/- \*\*Unconfigured workspace \(`docs\/agents\/refinement\.md` missing\):\*\* run `\/configure-refinement` first\.\n- \*\*Ongoing \(brownfield\) product without `CONTEXT\.md` or `docs\/product-overview\.md`:\*\* drop any existing documentation into `docs\/reference\/` \(optional when none exists\) and run `\/bootstrap-context` before refining User Stories\. Because `requirements-rigor` forbids silent invention, jumping straight into `\/refine-story`/g, '- **Ongoing (brownfield) product without `CONTEXT.md` or `product-overview.md` in platform memory:** run `bootstrap-context.md` pasting, attaching, or referencing any existing documentation (or with no files for a short onboarding examination) before refining User Stories, then save the generated `CONTEXT.md` and `product-overview.md` blocks in your agent platform memory / knowledge base. Because `requirements-rigor` forbids silent invention, jumping straight into `refine-story.md`'],
  [/- \*\*Pipeline stages \(enter at any stage, or run `\/which-flow` to route an input\):\*\*\n  1\. `\/meeting-minutes`:/g, '- **Pipeline stages (enter at any stage, or use `which-flow.md` / `INSTRUCTIONS.md` to route an input):**\n  1. `meeting-minutes.md`:'],
  [/  2\. `\/requirements-discovery`:([^\n]+)\n  3\. `\/refine-story`:([^\n]+)\n  4\. `\/qa-plan`:/g, '  2. `requirements-discovery.md`:$1\n  3. `refine-story.md`:$2\n  4. `qa-plan.md`:'],
  [/re-run the originating workflow \(`\/refine-story`, `\/qa-plan`, `\/requirements-discovery`, or `\/bootstrap-context`\) passing the existing artifact path in `\.scratch\/` \(or `docs\/product-overview\.md`\)/g, 're-run the originating workflow (`refine-story.md`, `qa-plan.md`, `requirements-discovery.md`, or `bootstrap-context.md`) in a new conversation pasting the existing artifact (or `product-overview.md`) along with the answers'],
  [/re-run `\/requirements-discovery <path-to-spec\.md>` in a fresh session to examine and resolve one unblocked pending decision per session until the map clears\. A pending decision under `issues\/` is unblocked/g, 'start a new conversation with `requirements-discovery.md` and paste the spec plus decision blocks to examine and resolve one unblocked pending decision per session until the map clears. A pending decision is unblocked'],
  [/run `\/clear` between workflows so the next workflow reads the published markdown artifact cleanly;/g, 'start a new conversation between workflows (inside the same web workspace when using `prompts/project/`, so Knowledge Base files remain shared while chat history resets like `/clear`) and paste the published artifact from the previous step;'],
  [/If the item lives in the workspace, add `Status: not a US` \(or `Status: não é US`\) and the rationale below the title to leave a trail\./g, 'Tell the PO to mark the item with `Status: not a US` (or `Status: não é US`) and the rationale to leave a trail.'],
  [/\$ARGUMENTS/g, 'what the PO provides in this conversation'],
];

const ruleHits = new Array(RULES.length).fill(0);

function adapt(text) {
  let t = text;
  for (let i = 0; i < RULES.length; i++) {
    const [re, to] = RULES[i];
    const next = t.replace(re, to);
    if (next !== t) ruleHits[i]++;
    t = next;
  }
  const leftovers = t.match(/Skill tool|\]\([A-Z-]+\.md\)|\$ARGUMENTS|docs\/agents\/[a-z-]+\.md/g);
  if (leftovers) throw new Error(`unadapted skill reference: ${[...new Set(leftovers)].join(', ')}`);
  return t;
}

const PRIMITIVE_ENTRIES = [
  ['Socratic examination', 'socratic-examination/SKILL.md', true],
  ['Glossary format', 'socratic-examination/GLOSSARY.md', true],
  ['ADR format', 'socratic-examination/ADR.md', true],
  ['Requirements rigor', 'requirements-rigor/SKILL.md', false],
  ['Anti-patterns', 'requirements-rigor/ANTI-PATTERNS.md', false],
  ['Questionnaire', 'requirements-rigor/QUESTIONNAIRE.md', false],
];
const PRIMITIVE_SECTIONS = PRIMITIVE_ENTRIES.map(([title]) => title).join('|');
const WORKFLOW_SECTIONS = 'Template|Candidate story template|Test design|Synthesis rules';

function toProjectRefs(text, kind) {
  let t = text;
  if (kind === 'core') {
    t = replaceExact(
      t,
      /at the end of the "Template" section of this prompt/g,
      'at the end of each workflow file\'s "Template" section',
      'project/refinement-core.md template ref',
    );
  }
  t = t.replace(
    new RegExp(`("(?:${PRIMITIVE_SECTIONS})" section of) this prompt`, 'g'),
    '$1 `refinement-core.md`',
  );
  if (kind === 'workflow') {
    t = t.replace(
      new RegExp(`("(?:${WORKFLOW_SECTIONS})" section of) this prompt`, 'g'),
      '$1 this workflow file',
    );
  }
  if (/this prompt/i.test(t)) {
    throw new Error(`unadapted "this prompt" reference in project/${kind}`);
  }
  return t;
}

const WITHOUT_CODE_BULLET = '- The operating mode is always **without code**: there is no repository, subagent, or file tool. Ignore instructions regarding with-code mode or dispatching subagents.';
const INPUT_SOURCES_TEXT = 'Use `CONTEXT.md` (domain glossary), `product-overview.md`, `NNNN-<slug>.md` ADRs, previous artifacts, and reference documents from the Knowledge Base / platform memory or pasted in this conversation; without a glossary in an examination workflow, ask for product domain roles in round 1, and when no prior context is found, state this in one line at the top of round 1. A previous artifact pasted by the PO, such as a discovery spec with `Status: open map` or a refined US, is the starting point.';
const ARTIFACT_DELIVERY_BULLET = '- Where the workflow says to publish, write, or save a file, deliver the content directly in the response, each artifact in its own block titled with the filename it would have, ready for the PO to copy into the work item or Knowledge Base. Questionnaires also go in the response, one block per recipient. "Completed when: file exists" means "the artifact was delivered in the response".';
const AZURE_BULLET = '- The `Azure:` line receives the ID provided by the PO, or `none`. Slugs follow workflow conventions and serve only to label blocks.';
const SESSION_DATE_BULLET = '- The session date is the date provided by the PO; if omitted, leave `<date>` in the artifact.';

const MEMORY_UPDATES_BULLETS = [
  '- During examination rounds, acknowledge newly resolved glossary terms, ADRs, or product-overview updates in one brief line without emitting file blocks mid-round.',
  '- At final synthesis, whenever the session added or flagged `CONTEXT.md` terms, updated `product-overview.md` baseline facts, or recorded an ADR, append a dedicated "Memory / Knowledge Base Updates" section (in `pt-BR`: "Atualizações para a Memória / Base de Conhecimento") with copy-ready blocks, and remind the PO in the report step to update those files in their agent platform memory or knowledge base before the next session (omit both the section and reminder when nothing changed). Emit the complete file only when creating it from scratch or when the entire prior file was pasted inline in this conversation; when prior context came from platform memory or knowledge retrieval where unseen entries may exist, emit an append/delta block (`Append to CONTEXT.md` / `Adicionar ao CONTEXT.md`, or updated sections for `product-overview.md`) so pre-existing entries are never overwritten. In `bootstrap-context`, `product-overview.md` is already delivered as the primary synthesis artifact (delivering updated sections only on incremental platform-memory runs), so do not duplicate `product-overview.md` inside "Memory / Knowledge Base Updates". Emit each new ADR as its own complete `NNNN-<slug>.md` block.',
];

const common = () => PRIMITIVE_ENTRIES.map(([title, path]) => part(title, body(path)));
const rigorOnly = () => PRIMITIVE_ENTRIES.filter(([, , examOnly]) => !examOnly).map(([title, path]) => part(title, body(path)));

const FLOWS = {
  'bootstrap-context': {
    title: 'Bootstrap Context',
    lead: () => part('Workflow: Bootstrap Context', dropSection(body('bootstrap-context/SKILL.md'), 'Before starting')),
    tail: () => [part('Template', verbatim('bootstrap-context/TEMPLATE.md'))],
  },
  'refine-story': {
    title: 'Refine Story',
    lead: () => part('Workflow: Refine Story', dropSection(body('refine-story/SKILL.md'), 'Before starting')),
    tail: () => [part('Template', verbatim('refine-story/TEMPLATE.md'))],
  },
  'qa-plan': {
    title: 'QA Plan',
    lead: () => part('Workflow: QA Plan', dropSection(body('qa-plan/SKILL.md'), 'Before starting')),
    tail: () => [
      part('Test design', body('qa-plan/TEST-DESIGN.md')),
      part('Template', verbatim('qa-plan/TEMPLATE.md')),
    ],
  },
  'requirements-discovery': {
    title: 'Requirements Discovery',
    lead: () => part('Workflow: Requirements Discovery', dropSection(body('requirements-discovery/SKILL.md'), 'Before starting')),
    tail: () => [
      part('Template', verbatim('requirements-discovery/TEMPLATE.md')),
      part('Candidate story template', verbatim('refine-story/TEMPLATE.md')),
    ],
  },
  'meeting-minutes': {
    title: 'Meeting Minutes',
    examination: false,
    lead: () => part('Workflow: Meeting Minutes', body('meeting-minutes/SKILL.md')),
    tail: () => [
      part('Synthesis rules', body('meeting-minutes/RULES.md')),
      part('Template', verbatim('meeting-minutes/TEMPLATE.md')),
    ],
  },
};

const FLOW_NAMES = Object.keys(FLOWS);
const FLOW_FILES = FLOW_NAMES.map((f) => `\`${f}.md\``).join(', ');

const CHAT = (name, { title, examination = true }) => {
  const otherFlows = FLOW_NAMES.filter((f) => f !== name).map((f) => `\`/${f}\``).join(', ');
  const variant = examination
    ? {
        combines: 'socratic examination, requirements rigor, and templates',
        inputRest: INPUT_SOURCES_TEXT,
        glossaryAdr: MEMORY_UPDATES_BULLETS,
        closing: [
          SESSION_DATE_BULLET,
          '- Socratic examination happens within this conversation: run each round and wait for PO response. Do not invent answers or synthesize before the frontier empties or the PO requests closure.',
        ],
      }
    : {
        combines: 'requirements rigor, synthesis rules, and templates',
        inputRest: 'Use only the transcript, meeting metadata, and optional glossary provided by the PO or stored in the Knowledge Base.',
        glossaryAdr: [],
        closing: [],
      };
  return [
    '# Chat mode',
    '',
    `This prompt is the chat and instruction-based agent version of the **${title}** workflow from the Refinement Skills package. It combines the workflow, ${variant.combines} into a single document. The rules below take precedence over any local repository, tool, or mode instructions appearing in the rest of this prompt.`,
    '',
    WITHOUT_CODE_BULLET,
    `- Input combines what the PO provides in this conversation (pasted text or attached files) with any product context in platform memory / Knowledge Base. ${variant.inputRest}`,
    ARTIFACT_DELIVERY_BULLET,
    ...variant.glossaryAdr,
    AZURE_BULLET,
    `- The other referenced workflows (${otherFlows}) are separate prompts in this collection. When the workflow directs to one of them, inform the PO which one and what artifacts to carry over.`,
    ...variant.closing,
    '',
  ].join('\n');
};

function standaloneFlowParts(flow) {
  return [
    flow.lead(),
    ...(flow.examination === false ? rigorOnly() : common()),
    ...flow.tail(),
  ];
}

function projectFlowParts(flow) {
  return [flow.lead(), ...flow.tail()];
}

function askSection({ modular }) {
  let assistantBody = body('ask-refinement/SKILL.md');
  const nextTarget = modular
    ? `workflow (${FLOW_FILES}) and inputs to run next in a conversation within this workspace`
    : `standalone prompt (${FLOW_FILES}, or \`which-flow.md\`) or \`prompts/project/\` workflow and inputs to use next`;
  assistantBody = replaceExact(
    assistantBody,
    /3\. \*\*Answer directly and recommend the next command\.\*\* Resolve the user's question concisely in the selected language, citing the relevant files and statuses observed in step 1 \(when input is empty, deliver a concise diagnostic summary of what is configured, open, unblocked, or missing in the workspace\)\. End with the concrete command \(and file path, when applicable\) to run next\.\n   Completed when: the answer directly resolves the question \(or diagnoses the workspace when input is empty\), names relevant existing workspace files, leaves all files untouched, and states the exact next command when an action applies\./,
    `3. **Answer directly and recommend the next workflow.** Resolve the user's question concisely in the selected language, citing the relevant context and statuses observed in step 1 (when input is empty, summarize what context is present in this conversation or platform memory and recommend how to proceed). End with the concrete ${nextTarget}.\n   Completed when: the answer directly resolves the question (or summarizes provided context when input is empty), names relevant provided context or artifacts, and states the exact next workflow when an action applies.`,
    'ask-refinement step 3',
  );
  const webSetupAndMemory = modular
    ? [
        `- **Coexistence in this unified web workspace (\`prompts/project/\`):** \`INSTRUCTIONS.md\` sits in System Prompt / Custom Instructions while \`refinement-core.md\` and the five lean workflow files (${FLOW_FILES}) live in the Knowledge Base alongside \`CONTEXT.md\`, \`product-overview.md\`, and ADRs (six package files, zero duplicated rules); standalone \`prompts/*.md\` files at the root of \`prompts/\` are used only in ad-hoc chats without a shared Knowledge Base. Because web chat models cannot write back to Knowledge Base files directly, follow the "Memory / Knowledge Base Updates" rule in \`# Unified web workspace rules\` above when explaining how product context stays updated.`,
      ]
    : [
        `- **Unified web workspace (\`prompts/project/\`) vs. ad-hoc single chat (\`prompts/*.md\`):** on web platforms with persistent instructions and Knowledge Base files (Claude Projects, ChatGPT Projects, Custom GPTs, Gemini Gems, Copilot Studio), configure one shared workspace per product with \`prompts/project/INSTRUCTIONS.md\` as System Prompt / Custom Instructions and upload \`prompts/project/refinement-core.md\` plus the five lean workflow files (${FLOW_FILES}) to the Knowledge Base alongside \`CONTEXT.md\`, \`product-overview.md\`, and ADRs (six package files in the Knowledge Base, zero duplicated rules; opening a new conversation thread inside that same workspace between workflows resets chat history like \`/clear\` while keeping Knowledge Base files shared). Use the self-contained root files in \`prompts/*.md\` only for ad-hoc single chats without a shared Knowledge Base.`,
        '',
        '### Platform memory maintenance across examination prompts',
        '',
        `- Standalone prompts at the root of \`prompts/\`: \`which-flow.md\`, \`ask-refinement.md\`, ${FLOW_FILES}.`,
        '- Web chat models cannot write back to platform memory or Knowledge Base files automatically, so examination prompts follow these rules:',
        ...MEMORY_UPDATES_BULLETS.map((b) => `  ${b}`),
      ];
  assistantBody = replaceExact(
    assistantBody,
    /- \*\*Web chat platforms without a local repository:\*\* teammates on Claude Projects, ChatGPT Projects, Custom GPTs, Gemini Gems, or Copilot Studio set up a single shared web workspace with `prompts\/project\/` \(`INSTRUCTIONS\.md` as system instructions plus `refinement-core\.md` and the five workflow files in the Knowledge Base alongside `CONTEXT\.md` and `product-overview\.md`\), or paste self-contained `prompts\/\*\.md` files in ad-hoc chats\./,
    webSetupAndMemory.join('\n'),
    'ask-refinement web platforms bullet',
  );
  if (modular) {
    // In INSTRUCTIONS.md, `# Workflow router` right above already covers pipeline stages and brownfield bootstrap-context.
    assistantBody = dropSubSection(assistantBody, 'Workflow progression and entry points');
  }
  return part('Assistant: Ask Refinement', assistantBody.trim());
}

function askRefinement() {
  const head = [
    '# Chat mode',
    '',
    'This prompt is the chat and instruction-based agent version of **`/ask-refinement`** from the Refinement Skills package. It answers user questions about workflows, markers, verdicts, artifacts, questionnaires, unified web workspaces (`prompts/project/`), and platform memory maintenance in a single turn.',
    '',
    '- Operate strictly as a single-turn, read-only Q&A helper: there is no local repository, file tool, or subagent, and the operating mode in chat is always without code (omit operating mode tokens and local disk paths unless the user explicitly asks how the CLI workspace version differs).',
    '- Use only what the user provides in this conversation or configured in platform memory / knowledge base (`CONTEXT.md`, `product-overview.md`, ADRs, artifacts, or questionnaires).',
    `- Treat the "Socratic examination", "Glossary format", "ADR format", "Requirements rigor", "Anti-patterns", and "Questionnaire" sections below strictly as authoritative reference material for explaining rules, markers, verdicts, and formats. Answer the question directly without opening \`❓ Q<n>\` socratic examination rounds or synthesizing workflow artifacts here, and tell the user which workflow (${FLOW_FILES}, or \`which-flow.md\`) to run next.`,
    '',
  ].join('\n');
  const parts = [askSection({ modular: false }), ...common()];
  const adapted = replaceExact(
    adapt(parts.join('\n')),
    /at the end of the "Template" section of this prompt/g,
    'at the end of each workflow prompt\'s "Template" section',
    'ask-refinement template ref',
  );
  return head + '\n' + adapted;
}

function routerBody({ modular }) {
  let t = dropSection(dropSection(body('which-flow/SKILL.md'), 'Prerequisite'), 'Web agent platforms');
  t = replaceExact(
    t,
    /from `docs\/reference\/` \(or run with no files for a short onboarding examination; in code mode it also inspects the codebase\) to build `CONTEXT\.md` and `docs\/product-overview\.md`/,
    'pasted, attached, or stored in the Knowledge Base (or run with no files for a short onboarding examination) to generate `CONTEXT.md` and `product-overview.md` for your agent Knowledge Base (jumping straight into `refine-story.md` without product context turns missing facts into baseline questions because `requirements-rigor` forbids silent invention)',
    'which-flow bootstrap-context',
  );
  if (modular) {
    // In INSTRUCTIONS.md, operating mode, session context hygiene, questionnaire resumption, and Q&A live once in their owning sections.
    for (const heading of ['Two operating modes', 'When key stakeholders are outside the session', 'Questions and workspace status']) {
      t = dropSection(t, heading);
    }
    t = dropSubSection(t, 'Context hygiene');
    return t.trim();
  }
  t = replaceExact(
    t,
    /Between workflows, run `\/clear`: the subsequent step reads the published artifact, not the conversation history\. Within a workflow session, do not compact context before final synthesis: the examination and the resulting artifact require the same continuous reasoning\./,
    'Between workflows, start a new conversation and paste the previous artifact: the next stage reads the artifact rather than prior chat turns, and inside a unified web workspace (`prompts/project/`) opening a new conversation in the same workspace resets chat history like `/clear` while keeping Knowledge Base files shared. Within a workflow session, keep the same conversation until final synthesis.',
    'which-flow context hygiene',
  );
  t = replaceExact(
    t,
    /The workspace declares in `docs\/agents\/refinement\.md` whether it runs \*\*with code\*\*[\s\S]*?only who answers what changes\./,
    'In chat mode, the operating mode is always **without code**.',
    'which-flow operating modes',
  );
  t = replaceExact(
    t,
    /Workflows conclude by writing a questionnaire per recipient alongside the artifact, containing questions that examination could not resolve\. Send the file, paste responses into a new conversation, and run the workflow again against the artifact: it resumes from where it left off\./,
    'Workflows conclude by delivering one questionnaire per recipient in the response for questions that examination could not resolve. Send the questionnaire, paste responses into a new conversation along with the artifact, and rerun the workflow: it resumes from where it left off.',
    'which-flow questionnaires',
  );
  t = replaceExact(
    t,
    /Run \*\*`\/ask-refinement`\*\* whenever you have a question about how the package works, what a marker or verdict means, where files belong, how to resume after a questionnaire, or what state your workspace is in right now\./,
    'Use **`ask-refinement.md`** (or ask directly in any conversation inside a unified web workspace configured with `prompts/project/INSTRUCTIONS.md`) whenever you have a question about how the prompts work, what a marker or verdict means, how to resume after a questionnaire, or how to keep platform memory / Knowledge Base files updated.',
    'which-flow ask-refinement',
  );
  return t.trim();
}

function router() {
  const head = [
    '# Which workflow? (chat mode)',
    '',
    'Chat and instruction-based agent version of the Refinement Skills package router. Two prompt distributions are generated from `skills/`:',
    '',
    `- **Unified web workspace (\`prompts/project/\`):** paste \`prompts/project/INSTRUCTIONS.md\` into your platform's System Prompt / Custom Instructions field and upload \`prompts/project/refinement-core.md\` plus the five lean workflow files in \`prompts/project/\` (${FLOW_FILES}) to the Knowledge Base alongside your product's \`CONTEXT.md\` and \`product-overview.md\`. All workflows, routing, and Q&A coexist in one shared workspace without duplicating shared rules.`,
    `- **Ad-hoc single chat (\`prompts/*.md\`):** paste one self-contained prompt at the root of \`prompts/\` (${FLOW_FILES}, \`which-flow.md\`, or \`ask-refinement.md\`) directly into a standalone chat conversation.`,
    '',
  ].join('\n');
  return head + '\n' + adapt(routerBody({ modular: false })) + '\n';
}

function projectInstructions() {
  const head = [
    '# Unified Web Workspace Instructions',
    '',
    `System instructions for a shared Refinement Skills web workspace (\`prompts/project/\`) on Claude Projects, ChatGPT Projects, Custom GPTs, Gemini Gems, or Copilot Studio. Keep this text in the System Prompt / Custom Instructions field, with \`refinement-core.md\` and ${FLOW_FILES} uploaded to the Knowledge Base alongside your product's \`CONTEXT.md\`, \`product-overview.md\`, ADRs, and reference documents.`,
    '',
    '## Request dispatch',
    '',
    'Classify each user message into one of two modes before responding:',
    '',
    '1. **Workflow execution** (the user supplies legacy product material to bootstrap, a meeting transcript, raw discovery notes or an open decision map, a User Story to refine, or a User Story for QA planning, or asks to run or resume a workflow):',
    `   - Select the matching workflow file from \`# Workflow router\` below (${FLOW_FILES}; map \`/<name>\` to \`<name>.md\`).`,
    '   - Retrieve and read **`refinement-core.md`** and that **`<workflow>.md`** file from the Knowledge Base in full, together with any product context files in the Knowledge Base (`CONTEXT.md`, `product-overview.md`, `NNNN-<slug>.md` ADRs, and reference documents), before starting Step 1.',
    '   - Execute `<workflow>.md` step by step under `# Unified web workspace rules` below.',
    '   Completed when: `refinement-core.md`, the selected `<workflow>.md`, and available product Knowledge Base files are loaded, and Step 1 of `<workflow>.md` begins.',
    '',
    '2. **Single-turn Q&A, status check, or routing question** (the user asks how the workspace or workflows operate, whether workflows coexist in one shared workspace, how opening a new conversation relates to `/clear`, what a marker or verdict means, how Knowledge Base updates work, how to resume after a questionnaire, or which workflow to run next without supplying the artifact to process yet):',
    '   - Follow `# Assistant: Ask Refinement` below in a single response in the user\'s language (`en-US` or `pt-BR`).',
    '   Completed when: Steps 1 to 3 of `# Assistant: Ask Refinement` complete in one response.',
    '',
    '# Unified web workspace rules',
    '',
    'The rules below apply across every `<workflow>.md` execution in this workspace:',
    '',
    WITHOUT_CODE_BULLET,
    `- Input combines what the PO provides in this conversation (pasted text or attached files) with product context stored in the Knowledge Base. ${INPUT_SOURCES_TEXT}`,
    ARTIFACT_DELIVERY_BULLET,
    ...MEMORY_UPDATES_BULLETS,
    AZURE_BULLET,
    SESSION_DATE_BULLET,
    '- Socratic examination happens within the conversation (`bootstrap-context.md`, `requirements-discovery.md`, `refine-story.md`, and `qa-plan.md`): run each round and wait for PO response before advancing the frontier or synthesizing. `meeting-minutes.md` is synthesis without examination rounds.',
    '',
  ].join('\n');
  const tail = [
    part('Workflow router', routerBody({ modular: true })),
    askSection({ modular: true }),
  ].join('\n');
  return head + '\n' + toProjectRefs(adapt(tail), 'instructions');
}

function projectCore() {
  const head = [
    '# Refinement Core (Knowledge Base reference)',
    '',
    `Shared primitives for a Refinement Skills unified web workspace (\`prompts/project/\`). Upload this file once to your agent's Knowledge Base alongside ${FLOW_FILES}, with \`INSTRUCTIONS.md\` configured in the System Prompt / Custom Instructions field.`,
    '',
    '- Examination workflows (`bootstrap-context.md`, `requirements-discovery.md`, `refine-story.md`, and `qa-plan.md`) apply every section in this file; `meeting-minutes.md` applies "Requirements rigor", "Anti-patterns", and "Questionnaire".',
    '- Single-turn Q&A (`INSTRUCTIONS.md`) consults this file strictly as authoritative reference material without opening examination rounds.',
    '',
  ].join('\n');
  return head + '\n' + toProjectRefs(adapt(common().join('\n')), 'core');
}

function projectWorkflow(name, flow) {
  const sections = flow.examination === false
    ? '"Requirements rigor", "Anti-patterns", and "Questionnaire"'
    : '"Socratic examination", "Glossary format", "ADR format", "Requirements rigor", "Anti-patterns", and "Questionnaire"';
  const note = flow.examination === false
    ? ' This workflow is synthesis without socratic examination rounds.'
    : '';
  const head = [
    `# Knowledge Base Workflow: ${flow.title}`,
    '',
    `Modular workflow file for a unified web workspace (\`prompts/project/\`). Apply \`INSTRUCTIONS.md\` (System Prompt / Custom Instructions) and read \`refinement-core.md\` (${sections}) plus any product context in the Knowledge Base (\`CONTEXT.md\`, \`product-overview.md\`, ADRs, and reference documents) before executing Step 1 below.${note}`,
    '',
  ].join('\n');
  return head + '\n' + toProjectRefs(adapt(projectFlowParts(flow).join('\n')), 'workflow');
}

const check = process.argv.includes('--check');
const outputs = {};
const generatedHeader = `<!-- Generated by scripts/build-prompts.mjs from skills/. Do not edit manually: run node scripts/build-prompts.mjs -->\n\n`;
for (const [name, flow] of Object.entries(FLOWS)) {
  outputs[`${name}.md`] = generatedHeader + CHAT(name, flow) + '\n' + adapt(standaloneFlowParts(flow).join('\n'));
  outputs[`project/${name}.md`] = generatedHeader + projectWorkflow(name, flow);
}
outputs['ask-refinement.md'] = generatedHeader + askRefinement();
outputs['which-flow.md'] = generatedHeader + router();
outputs['project/INSTRUCTIONS.md'] = generatedHeader + projectInstructions();
outputs['project/refinement-core.md'] = generatedHeader + projectCore();

const deadRules = RULES
  .map(([re], idx) => (ruleHits[idx] === 0 ? `rule #${idx + 1} (${re})` : null))
  .filter(Boolean);
if (deadRules.length) {
  throw new Error(`dead adaptation rules in scripts/build-prompts.mjs: ${deadRules.join(', ')}`);
}

const stale = [];
for (const [file, text] of Object.entries(outputs)) {
  const p = join(outDir, file);
  if (check) {
    if (!existsSync(p) || readFileSync(p, 'utf8') !== text) stale.push(file);
  } else {
    mkdirSync(dirname(p), { recursive: true });
    writeFileSync(p, text);
    console.log(`generated: prompts/${file} (${text.split('\n').length} lines)`);
  }
}

for (const sub of ['', 'project']) {
  const dir = sub ? join(outDir, sub) : outDir;
  if (!existsSync(dir)) continue;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
    const rel = sub ? `${sub}/${entry.name}` : entry.name;
    if (!(rel in outputs)) stale.push(`${rel} (unexpected)`);
  }
}

if (check) {
  if (stale.length) { console.error(`outdated prompts: ${stale.join(', ')}. Run: node scripts/build-prompts.mjs`); process.exit(1); }
  console.log('ok: prompts/ in sync with skills/');
}
