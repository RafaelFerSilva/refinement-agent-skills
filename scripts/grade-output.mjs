#!/usr/bin/env node
// Mechanical assertions over an artifact produced by a workflow. Serves as the grader in evals.
// Grades en-US and pt-BR artifacts from a single language table: section names, verdicts, markers,
// and Gherkin keywords are looked up by language. A section found in neither language fails the run
// instead of silently passing the checks that depend on it.
// usage: node scripts/grade-output.mjs <artifact.md> --skill <refine-story|qa-plan|requirements-discovery|meeting-minutes> [--lang <en-US|pt-BR>] [--json]
import { readFileSync } from 'node:fs';

const SKILLS = ['refine-story', 'qa-plan', 'requirements-discovery', 'meeting-minutes'];
const LANGS = ['en-US', 'pt-BR'];
const VALUED = ['--skill', '--lang'];

const argv = process.argv.slice(2);
const flag = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? null : argv[i + 1] ?? null;
};
const file = argv.find((a, i) => !a.startsWith('--') && !(i > 0 && VALUED.includes(argv[i - 1])));
const skill = flag('skill');
const langFlag = flag('lang');
const asJson = argv.includes('--json');

if (!file || !SKILLS.includes(skill) || (langFlag !== null && !LANGS.includes(langFlag))) {
  console.error(`usage: node scripts/grade-output.mjs <artifact.md> --skill <${SKILLS.join('|')}> [--lang <${LANGS.join('|')}>] [--json]`);
  process.exit(2);
}

const text = readFileSync(file, 'utf8');

// Language table. Everything localized by `Language:` in docs/agents/refinement.md lives here;
// terms canonical in both languages (Status, Azure, PO, DEV, INVEST letters, priority scale) do not.
const TABLE = {
  'en-US': {
    sections: {
      openQuestions: ['Open Questions'],
      triage: ['Testability Triage', 'Triage'],
      invest: ['INVEST Scorecard'],
      verdict: ['Verdict'],
      matrix: ['Test Conditions Matrix'],
      domains: ['Domains'],
      epics: ['Epics'],
      candidates: ['Candidate Stories'],
      actionsTable: ['Action Items Table'],
      decisions: ['Recorded Decisions'],
      selfAudit: ['Self-Audit'],
      summary: ['Executive Summary'],
    },
    verdicts: {
      'refine-story': ['READY', 'REFINE', 'BLOCKED'],
      'qa-plan': ['EXECUTABLE', 'PARTIAL', 'BLOCKED'],
      'requirements-discovery': ['open map', 'in progress', 'completed', 'candidate'],
      'meeting-minutes': ['draft'],
    },
    refine: 'REFINE',
    triageLabels: {
      'refine-story': ['ANALYZABLE', 'SKELETON', 'NOT A US'],
      'qa-plan': ['TESTABLE', 'TESTABLE WITH RESERVATIONS', 'NOT TESTABLE'],
      'requirements-discovery': ['USABLE', 'PARTIALLY USABLE', 'UNUSABLE'],
      'meeting-minutes': ['INTACT', 'DEGRADED', 'INSUFFICIENT'],
    },
    tokens: ['[INFERENCE:', '[TO CONFIRM', '[STATED:', '[ASSUMED', '[SPECIFIED', '[DERIVED', '[UNDEFINED', '[TRACKING]', '[TO BE DEFINED', '[AMBIGUITY', '[DECOMPOSE', '[DIVERGENCE', '[ORPHAN', '[CONFLICT'],
    gherkin: /^\s*(?:Given|When|Then)\b/gim,
    legacyToConfirm: /\[TO CONFIRM WITH [^\]]+\]/,
    toConfirm: /\[TO CONFIRM:[^\]]*\]/g,
    toConfirmLabel: '[TO CONFIRM: whom]',
    subjective: /^[ \t]*(?:Then|And)\s.*\b(?:correctly|properly|fast|quickly|friendly|intuitive|seamless|smooth)\b.*$/gim,
    givenAction: /^[ \t]*Given\s+(?:that\s+)?(?:the|a|an)?\s*\w+\s+(?:clicks|triggers|sends|opens|selects|fills|submits|requests|exports)\b.*$/gim,
    effort: /\b\d+\s*(?:to\s*\d+\s*)?(?:h|hours?|days?)\s+of\s+(?:development|effort|work)\b/i,
    undefinedQuestion: /\[UNDEFINED\s*(?:->|-->|\u2192)\s*Question\s*(\d+)\]/g,
    derivedNoTechnique: /\[DERIVED\s*:?\s*\]/g,
    origin: /\[(?:SPECIFIED|DERIVED|UNDEFINED)/,
    tracking: '[TRACKING]',
    stated: '[STATED:',
    assumed: '[ASSUMED',
    pending: /^PENDING/,
    confidence: /\b(?:High|Medium|Low)\b/,
    complexity: /\|\s*(?:S|M|L|XL)\s*\|/,
    selfAuditLabel: /Self-Audit:/i,
  },
  'pt-BR': {
    sections: {
      openQuestions: ['Perguntas em aberto'],
      triage: ['Triagem de testabilidade', 'Triagem'],
      invest: ['Scorecard INVEST'],
      verdict: ['Veredito'],
      matrix: ['Matriz de condições de teste'],
      domains: ['Domínios'],
      epics: ['Épicos'],
      candidates: ['Histórias candidatas'],
      actionsTable: ['Tabela de ações'],
      decisions: ['Decisões registradas'],
      selfAudit: ['Autoverificação'],
      summary: ['Resumo executivo'],
    },
    verdicts: {
      'refine-story': ['PRONTA', 'REFINAR', 'BLOQUEADA'],
      'qa-plan': ['EXECUTÁVEL', 'PARCIAL', 'BLOQUEADO'],
      'requirements-discovery': ['mapa aberto', 'em andamento', 'concluído', 'candidata'],
      'meeting-minutes': ['rascunho'],
    },
    refine: 'REFINAR',
    triageLabels: {
      'refine-story': ['ANALISÁVEL', 'ESQUELETO', 'NÃO É US'],
      'qa-plan': ['TESTÁVEL', 'TESTÁVEL COM RESSALVAS', 'NÃO TESTÁVEL'],
      'requirements-discovery': ['UTILIZÁVEL', 'PARCIALMENTE UTILIZÁVEL', 'INUTILIZÁVEL'],
      'meeting-minutes': ['ÍNTEGRA', 'DEGRADADA', 'INSUFICIENTE'],
    },
    tokens: ['[INFERÊNCIA:', '[A CONFIRMAR', '[DITO:', '[PRESUMIDO', '[ESPECIFICADO', '[DERIVADO', '[INDEFINIDO', '[ACOMPANHAMENTO]', '[A DEFINIR', '[AMBIGUIDADE', '[DECOMPOR', '[DIVERGÊNCIA', '[ÓRFÃO', '[CONFLITO'],
    gherkin: /^\s*(?:Dado|Quando|Então)\b/gim,
    legacyToConfirm: /\[A CONFIRMAR COM [^\]]+\]/,
    toConfirm: /\[A CONFIRMAR:[^\]]*\]/g,
    toConfirmLabel: '[A CONFIRMAR: quem]',
    subjective: /^[ \t]*(?:Então|E)\s.*\b(?:corretamente|adequadamente|rápid[oa]|rapidamente|amigável|intuitiv[oa]|fluid[oa])\b.*$/gim,
    givenAction: /^[ \t]*Dado\s+(?:que\s+)?(?:o|a|os|as|um|uma)?\s*\w+\s+(?:clica|aciona|envia|abre|seleciona|preenche|submete|exporta)\b.*$/gim,
    effort: /\b\d+\s*(?:a\s*\d+\s*)?(?:h|horas?|dias?)\s+de\s+(?:desenvolvimento|esforço|trabalho)\b/i,
    undefinedQuestion: /\[INDEFINIDO\s*(?:->|-->|\u2192)\s*Pergunta\s*(\d+)\]/g,
    derivedNoTechnique: /\[DERIVADO\s*:?\s*\]/g,
    origin: /\[(?:ESPECIFICADO|DERIVADO|INDEFINIDO)/,
    tracking: '[ACOMPANHAMENTO]',
    stated: '[DITO:',
    assumed: '[PRESUMIDO',
    pending: /^PENDENTE/,
    confidence: /\b(?:Alta|Média|Baixa)\b/,
    complexity: /\|\s*(?:P|M|G|GG)\s*\|/,
    selfAuditLabel: /Autoverificação:/i,
  },
};

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const count = (needle) => text.split(needle).length - 1;

// Content of a section (## to ####, optionally numbered) up to the next heading.
function findSection(headings) {
  for (const h of headings) {
    const re = new RegExp(`^#{2,4}\\s+(?:\\d+\\.\\s+)?${escape(h)}[^\\n]*\\n([\\s\\S]*?)(?=^#{1,4}\\s|(?![\\s\\S]))`, 'im');
    const m = text.match(re);
    if (m) return m[1];
  }
  return null;
}

function detect() {
  const scores = {};
  for (const l of LANGS) {
    const t = TABLE[l];
    let n = 0;
    for (const headings of Object.values(t.sections)) {
      for (const h of headings) if (new RegExp(`^#{1,4}\\s+(?:\\d+\\.\\s+)?${escape(h)}\\b`, 'im').test(text)) n += 2;
    }
    for (const v of Object.values(t.verdicts).flat()) if (new RegExp(`^Status:\\s*${escape(v)}\\b`, 'im').test(text)) n += 3;
    n += (text.match(t.gherkin) || []).length;
    for (const tok of t.tokens) n += count(tok);
    scores[l] = n;
  }
  const best = scores['pt-BR'] > scores['en-US'] ? 'pt-BR' : 'en-US';
  return { lang: best, scores, certain: scores[best] > 0 && scores['pt-BR'] !== scores['en-US'] };
}

const detected = detect();
const lang = langFlag ?? detected.lang;
const other = lang === 'en-US' ? 'pt-BR' : 'en-US';
const T = TABLE[lang];
const O = TABLE[other];

const results = [];
const check = (name, passed, evidence = '') => results.push({ text: name, passed: Boolean(passed), evidence });

// A section requested by a check must exist in the graded language. Missing in both languages, or
// present only in the other one, is recorded here and reported as its own failing check.
const sectionProblems = [];
function section(key) {
  const mine = findSection(T.sections[key]);
  if (mine !== null) return mine;
  const fallback = findSection(O.sections[key]);
  sectionProblems.push(fallback !== null
    ? `"${T.sections[key][0]}" found only as "${O.sections[key][0]}" (${other})`
    : `"${T.sections[key][0]}" not found`);
  return fallback ?? '';
}

const status = (text.match(/^Status:\s*(.+)$/m) || [])[1]?.trim() ?? '';
const numbered = (body) => body.match(/^\s*\d+\.\s+.*$/gm) || [];
const withoutRecipient = (qs) => qs.filter((q) => !/^\s*\d+\.\s+\[[^\]]+\]/.test(q));
// Triage label of the graded language, in the triage section the template defines for this workflow.
function checkTriage() {
  const labels = T.triageLabels[skill];
  const body = section('triage');
  const found = labels.filter((l) => body.includes(l));
  const foreignLabels = O.triageLabels[skill].filter((l) => body.includes(l) && !found.some((f) => f.includes(l)));
  check(`triage declares one of ${labels.join(', ')}`, found.length > 0,
    found.length ? found.join(', ') : (foreignLabels.length ? `${other} label present: ${foreignLabels.join(', ')}` : body.trim().split('\n')[0]));
}

// Global checks
check('final disclaimer present', /⚠️/.test(text));
check('Status line present', status !== '', status);
const spNum = text.match(/story points?\s*:?\s*\**\s*\d+/i);
check('no numeric story points', !spNum, spNum?.[0] ?? '');
const effort = text.match(T.effort);
check('no effort estimate in hours or days', !effort, effort?.[0] ?? '');
const legacy = text.match(T.legacyToConfirm);
check(`${T.toConfirmLabel} marker in current format`, !legacy, legacy?.[0] ?? '');
check('no em-dash', !text.includes('\u2014'));
const subjective = text.match(T.subjective) || [];
check('verifiable outcome without subjective terms', subjective.length === 0, subjective.join('\n'));
const foreign = O.tokens.filter((tok) => count(tok) > 0);
check(`markers consistent with ${lang}`, foreign.length === 0, foreign.length ? `${other} markers present: ${foreign.join(', ')}` : '');

const verdicts = T.verdicts[skill];
const verdictOk = verdicts.some((v) => new RegExp(`^${escape(v)}\\b`, 'i').test(status));
// Minutes carry a draft marker rather than a verdict; the other workflows carry a verdict.
const statusLabel = skill === 'meeting-minutes' ? 'Status is' : 'verdict is';
check(`${statusLabel} ${verdicts.join(', ')}`, verdictOk, status);

switch (skill) {
  case 'refine-story': {
    const qs = numbered(section('openQuestions'));
    const noRecipient = withoutRecipient(qs);
    check('every open question has a recipient [whom]', noRecipient.length === 0, noRecipient.join('\n'));
    const toConfirm = (text.match(T.toConfirm) || []).length;
    check('gaps marked to confirm have an open question', toConfirm === 0 || qs.length > 0, `${toConfirm} markers, ${qs.length} questions`);
    const givenAction = text.match(T.givenAction) || [];
    check('Given describes state, not action', givenAction.length === 0, givenAction.join('\n'));
    const invest = section('invest');
    const criteria = ['Independent', 'Negotiable', 'Valuable', 'Estimable', 'Small', 'Testable'];
    const missingCriteria = criteria.filter((c) => !invest.includes(c));
    check('INVEST scorecard lists the six criteria', missingCriteria.length === 0, missingCriteria.join(', '));
    if (new RegExp(`^${escape(T.refine)}`, 'i').test(status)) {
      const verdict = section('verdict');
      check('refine verdict points to the questions that unblock it', new RegExp(`${escape(T.refine)}[^\\n]*\\d`, 'i').test(verdict), verdict.trim().split('\n')[0]);
    }
    break;
  }
  case 'qa-plan': {
    checkTriage();
    const undef = [...text.matchAll(T.undefinedQuestion)].map((m) => m[1]);
    const assigned = new Set([...numbered(section('openQuestions')).join('\n').matchAll(/^\s*(\d+)\.\s+\[(?:PO|DEV)\]/gm)].map((m) => m[1]));
    const missing = [...new Set(undef)].filter((n) => !assigned.has(n));
    check('every undefined result has a numbered question for PO or DEV', missing.length === 0, missing.length ? `missing: ${missing.join(', ')}` : `${undef.length} undefined`);
    const noTechnique = text.match(T.derivedNoTechnique) || [];
    check('every derived condition names the technique', noTechnique.length === 0, noTechnique.join(', '));
    const rows = section('matrix').match(/^\|\s*\d+\s*\|.*$/gm) || [];
    check('matrix has conditions', rows.length > 0, `${rows.length} conditions`);
    const noOrigin = rows.filter((r) => !T.origin.test(r));
    check('every condition declares its origin', noOrigin.length === 0, noOrigin.join('\n'));
    break;
  }
  case 'requirements-discovery': {
    check('domains carry a confidence rating', T.confidence.test(section('domains')));
    check('epics carry a complexity rating', T.complexity.test(section('epics')));
    check('candidate stories listed', /issues\/\d{2}-/.test(section('candidates')));
    const noRecipient = withoutRecipient(numbered(section('openQuestions')));
    check('every open question has a recipient [whom]', noRecipient.length === 0, noRecipient.join('\n'));
    break;
  }
  case 'meeting-minutes': {
    // "actions mode" writes sections 0, 3, 6, 7 and 8: the narrative sections are the ones it
    // drops, so only the check that reads recorded decisions does not apply there.
    const actionsMode = findSection(T.sections.summary) === null && findSection(O.sections.summary) === null
      && findSection(T.sections.decisions) === null && findSection(O.sections.decisions) === null;
    checkTriage();
    const block = text.match(/```json\s*([\s\S]*?)```/);
    let actions = null;
    try { actions = JSON.parse(block?.[1] ?? ''); } catch { actions = null; }
    check('action items JSON is valid', Array.isArray(actions));
    const table = section('actionsTable');
    const tableRows = table.match(/^\|\s*A\d+\s*\|.*$/gm) || [];
    const realRows = tableRows.filter((r) => !r.includes(T.tracking));
    if (Array.isArray(actions)) {
      check('one real table action per JSON object', realRows.length === actions.length, `${realRows.length} real rows, ${actions.length} objects`);
      check('dueDate in ISO 8601 or null', actions.every((a) => a.dueDate === null || /^\d{4}-\d{2}-\d{2}$/.test(a.dueDate)));
      check('priority on the Highest/High/Medium/Low scale', actions.every((a) => ['Highest', 'High', 'Medium', 'Low'].includes(a.priority)));
      check('null assignee flagged as pending in the description', actions.every((a) => a.assignee !== null || T.pending.test(a.description ?? '')));
      const tablePriorities = realRows.map((r) => (r.match(/\b(Highest|High|Medium|Low)\b/) || [])[1]);
      const jsonPriorities = actions.map((a) => a.priority);
      check('priorities identical between table and JSON', JSON.stringify(tablePriorities) === JSON.stringify(jsonPriorities), `table ${tablePriorities.join(',')} | json ${jsonPriorities.join(',')}`);
      check('no presumed item inside the JSON', !(block?.[1] ?? '').includes(T.assumed));
    }
    const noProvenance = tableRows.filter((r) => !r.includes(T.stated));
    check('every table row carries stated provenance', noProvenance.length === 0, noProvenance.join('\n'));
    check('no presumed item inside the table', !table.includes(T.assumed));
    if (!actionsMode) {
      const decisions = section('decisions');
      check('recorded decisions carry stated provenance only', !decisions.includes(T.assumed) && (decisions.trim() === '' || decisions.includes(T.stated)));
    }
    check('self-audit reported', T.selfAuditLabel.test(section('selfAudit')));
    break;
  }
}

check(`sections present in ${lang}`, sectionProblems.length === 0, sectionProblems.join('; '));

const passed = results.filter((r) => r.passed).length;
const languageNote = langFlag ? `${lang} (from --lang)` : `${lang} (detected${detected.certain ? '' : ', weak signal'})`;
if (asJson) {
  console.log(JSON.stringify({ file, skill, language: lang, language_source: langFlag ? 'flag' : 'detected', pass_rate: passed / results.length, expectations: results }, null, 2));
} else {
  console.log(`language: ${languageNote}\n`);
  for (const r of results) console.log(`${r.passed ? 'PASS' : 'FAIL'}  ${r.text}${r.evidence ? `  (${r.evidence})` : ''}`);
  console.log(`\n${passed}/${results.length}`);
}
process.exit(passed === results.length ? 0 : 1);
