#!/usr/bin/env node
// Asserções mecânicas sobre um artefato gerado por um fluxo. Serve de grader nos evals.
// uso: node scripts/grade-output.mjs <artefato.md> --skill <refine-story|qa-plan|requirements-discovery|meeting-minutes> [--json]
import { readFileSync } from 'node:fs';

const argv = process.argv.slice(2);
const file = argv.find((a) => !a.startsWith('--') && argv[argv.indexOf(a) - 1] !== '--skill');
const skill = argv[argv.indexOf('--skill') + 1];
const asJson = argv.includes('--json');
const SKILLS = ['refine-story', 'qa-plan', 'requirements-discovery', 'meeting-minutes', 'refinar-us', 'plano-qa', 'discovery-requisitos', 'ata-reuniao'];
if (!file || !SKILLS.includes(skill)) {
  console.error(`uso: node scripts/grade-output.mjs <artefato.md> --skill <${SKILLS.join('|')}> [--json]`);
  process.exit(2);
}
const text = readFileSync(file, 'utf8');
const results = [];
const check = (name, passed, evidence = '') => results.push({ text: name, passed: Boolean(passed), evidence });

// Conteúdo de uma seção (## ou ###) até o próximo heading de nível 1 a 3.
function section(title) {
  const re = new RegExp(`^#{2,3}\\s+(?:\\d+\\.\\s+)?${title}[^\\n]*\\n([\\s\\S]*?)(?=^#{1,3}\\s|(?![\\s\\S]))`, 'im');
  const m = text.match(re);
  return m ? m[1] : '';
}
const status = (text.match(/^Status:\s*(.+)$/m) || [])[1]?.trim() ?? '';

check('aviso final presente', /⚠️/.test(text));
check('linha Status presente', status !== '', status);
const spNum = text.match(/story points?\s*:?\s*\**\s*\d+/i);
check('sem story points numéricos', !spNum, spNum?.[0] ?? '');
const effort = text.match(/\b\d+\s*(a\s*\d+\s*)?(h|horas?|dias?)\s+de\s+(desenvolvimento|esforço|trabalho)/i);
check('sem estimativa de esforço em horas ou dias', !effort, effort?.[0] ?? '');
const legacy = text.match(/\[A CONFIRMAR COM [^\]]+\]/);
check('marcador [A CONFIRMAR: quem] no formato atual', !legacy, legacy?.[0] ?? '');
check('sem travessão', !text.includes('\u2014'));
const subjective = text.match(/^\s*(Então|E)\s.*\b(corretamente|adequadamente|rápid[oa]|rapidamente|amigável|intuitiv[oa]|fluid[oa])\b.*$/gim) || [];
check('Então sem termos subjetivos', subjective.length === 0, subjective.join('\n'));

const openQuestions = () => section('Perguntas em aberto').match(/^\s*\d+\.\s+.*$/gm) || [];
const withoutRecipient = (qs) => qs.filter((q) => !/^\s*\d+\.\s+\[[^\]]+\]/.test(q));

switch (skill) {
  case 'refine-story':
  case 'refinar-us': {
    check('veredito é PRONTA, REFINAR ou BLOQUEADA', /^(PRONTA|REFINAR|BLOQUEADA)\b/.test(status), status);
    const qs = openQuestions();
    const semDest = withoutRecipient(qs);
    check('toda pergunta em aberto tem destinatário [quem]', semDest.length === 0, semDest.join('\n'));
    const confirmar = (text.match(/\[A CONFIRMAR: [^\]]+\]/g) || []).length;
    check('lacunas [A CONFIRMAR] têm pergunta em aberto', confirmar === 0 || qs.length > 0, `${confirmar} marcadores, ${qs.length} perguntas`);
    const dadoAcao = text.match(/^\s*Dado\s+(que\s+)?(o|a|os|as|um|uma)?\s*\w+\s+(clica|aciona|envia|abre|seleciona|preenche|submete)\b.*$/gim) || [];
    check('Dado descreve estado, não ação', dadoAcao.length === 0, dadoAcao.join('\n'));
    const invest = section('Scorecard INVEST');
    check('scorecard INVEST com os seis critérios', ['Independent', 'Negotiable', 'Valuable', 'Estimable', 'Small', 'Testable'].every((c) => invest.includes(c)));
    if (/^REFINAR/.test(status)) check('REFINAR aponta as perguntas que destravam', /REFINAR[^\n]*\d/.test(section('Veredito')), section('Veredito').trim());
    break;
  }
  case 'qa-plan':
  case 'plano-qa': {
    check('veredito é EXECUTÁVEL, PARCIAL ou BLOQUEADO', /^(EXECUTÁVEL|PARCIAL|BLOQUEADO)\b/.test(status), status);
    const indef = [...text.matchAll(/\[INDEFINIDO\s*→\s*Pergunta\s*(\d+)\]/g)].map((m) => m[1]);
    const numbered = new Set([...section('Perguntas em aberto').matchAll(/^\s*(\d+)\.\s+\[(PO|DEV)\]/gm)].map((m) => m[1]));
    const missing = [...new Set(indef)].filter((n) => !numbered.has(n));
    check('todo [INDEFINIDO] tem pergunta numerada com destinatário PO ou DEV', missing.length === 0, missing.length ? `faltam: ${missing.join(', ')}` : `${indef.length} indefinidos`);
    const semTecnica = text.match(/\[DERIVADO\s*(:\s*)?\]/g) || [];
    check('toda condição derivada nomeia a técnica', semTecnica.length === 0, semTecnica.join(', '));
    const matriz = section('Matriz de condições de teste');
    const rows = matriz.match(/^\|\s*\d+\s*\|.*$/gm) || [];
    check('matriz tem condições', rows.length > 0, `${rows.length} condições`);
    const semOrigem = rows.filter((r) => !/\[(ESPECIFICADO|DERIVADO|INDEFINIDO)/.test(r));
    check('toda condição declara origem', semOrigem.length === 0, semOrigem.join('\n'));
    break;
  }
  case 'requirements-discovery':
  case 'discovery-requisitos': {
    check('domínios com confiança', /\b(Alta|Média|Baixa)\b/.test(section('Domínios')));
    check('épicos com complexidade', /\|\s*(P|M|G|GG)\s*\|/.test(section('Épicos')));
    check('histórias candidatas listadas', /issues\/\d{2}-/.test(section('Histórias candidatas')));
    const semDest = withoutRecipient(openQuestions());
    check('toda pergunta em aberto tem destinatário [quem]', semDest.length === 0, semDest.join('\n'));
    break;
  }
  case 'meeting-minutes':
  case 'ata-reuniao': {
    const block = text.match(/```json\s*([\s\S]*?)```/);
    let actions = null;
    try { actions = JSON.parse(block?.[1] ?? ''); } catch { actions = null; }
    check('JSON de ações válido', Array.isArray(actions));
    const tabela = section('Tabela de ações');
    const tableRows = tabela.match(/^\|\s*A\d+\s*\|.*$/gm) || [];
    const realRows = tableRows.filter((r) => !r.includes('[ACOMPANHAMENTO]'));
    if (Array.isArray(actions)) {
      check('uma ação real da tabela por objeto do JSON', realRows.length === actions.length, `${realRows.length} linhas reais, ${actions.length} objetos`);
      check('dueDate em ISO 8601 ou null', actions.every((a) => a.dueDate === null || /^\d{4}-\d{2}-\d{2}$/.test(a.dueDate)));
      check('priority na escala Highest/High/Medium/Low', actions.every((a) => ['Highest', 'High', 'Medium', 'Low'].includes(a.priority)));
      check('assignee null tem PENDENTE na description', actions.every((a) => a.assignee !== null || /^PENDENTE/.test(a.description ?? '')));
      const tablePrios = realRows.map((r) => (r.match(/\b(Highest|High|Medium|Low)\b/) || [])[1]);
      const jsonPrios = actions.map((a) => a.priority);
      check('prioridades idênticas entre tabela e JSON', JSON.stringify(tablePrios) === JSON.stringify(jsonPrios), `tabela ${tablePrios.join(',')} | json ${jsonPrios.join(',')}`);
      check('nenhum PRESUMIDO no JSON', !(block?.[1] ?? '').includes('PRESUMIDO'));
    }
    const semDito = tableRows.filter((r) => !r.includes('[DITO:'));
    check('toda linha da tabela tem proveniência DITO', semDito.length === 0, semDito.join('\n'));
    const decisoes = section('Decisões registradas');
    check('decisões registradas só com DITO', !decisoes.includes('[PRESUMIDO') && (decisoes.trim() === '' || decisoes.includes('[DITO:')));
    check('nenhum PRESUMIDO na tabela', !tabela.includes('[PRESUMIDO'));
    check('autoverificação reportada', /Autoverificação:/i.test(section('Autoverificação')));
    break;
  }
}

const passed = results.filter((r) => r.passed).length;
if (asJson) {
  console.log(JSON.stringify({ file, skill, pass_rate: passed / results.length, expectations: results }, null, 2));
} else {
  for (const r of results) console.log(`${r.passed ? 'PASS' : 'FAIL'}  ${r.text}${r.evidence ? `  (${r.evidence})` : ''}`);
  console.log(`\n${passed}/${results.length}`);
}
process.exit(passed === results.length ? 0 : 1);
