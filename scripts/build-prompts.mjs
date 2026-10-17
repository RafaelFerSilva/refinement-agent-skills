#!/usr/bin/env node
// Gera prompts/<fluxo>.md: a versão autocontida de cada fluxo para chat e para agentes por instruções.
// Fonte única são as skills; este arquivo só compõe e adapta. Não edite prompts/ à mão.
// uso: node scripts/build-prompts.mjs [--check]
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
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

const RULES = [
  [/e chame a Skill tool para `requirements-rigor`/g, 'e aplique a seção "Rigor de requisitos" deste prompt'],
  [/chame a Skill tool para `requirements-rigor`/gi, 'aplique a seção "Rigor de requisitos" deste prompt'],
  [/Chame a Skill tool para `socratic-examination` e siga a disciplina dela:/g, 'Aplique a seção "Sabatina" deste prompt:'],
  [/Chame a Skill tool para `socratic-examination`\./g, 'Aplique a seção "Sabatina" deste prompt.'],
  [/Chame a Skill tool para `socratic-examination`/g, 'Aplique a seção "Sabatina" deste prompt'],
  [/Continue as rodadas de `socratic-examination`/g, 'Continue as rodadas da sabatina'],
  [/Resolva-a com `socratic-examination`/g, 'Resolva-a com a sabatina'],
  [/\(leia o `ANTI-PADROES\.md` dela à parte; a Skill tool não o carrega\)/g, '(seção "Anti-padrões" deste prompt)'],
  [/\(leia o `ANTI-PADROES\.md` de `requirements-rigor` à parte\)/g, '(seção "Anti-padrões" deste prompt)'],
  [/anti-padrão de \[ANTI-PADROES\.md\]\(ANTI-PADROES\.md\)/g, 'anti-padrão da seção "Anti-padrões" deste prompt'],
  [/estão em \[ANTI-PADROES\.md\]\(ANTI-PADROES\.md\)\. Leia ao varrer ou auditar um texto; a Skill tool carrega só este arquivo, o irmão precisa ser lido à parte\./g, 'estão na seção "Anti-padrões" deste prompt.'],
  [/no formato de `QUESTIONARIO\.md` de `requirements-rigor`/g, 'no formato da seção "Questionário" deste prompt'],
  [/no formato de \[QUESTIONARIO\.md\]\(QUESTIONARIO\.md\)/g, 'no formato da seção "Questionário" deste prompt'],
  [/no formato do fim de \[TEMPLATE\.md\]\(TEMPLATE\.md\)/g, 'no formato "Insumo para discovery" da seção "Template" deste prompt'],
  [/no formato de \[TEMPLATE\.md\]\(TEMPLATE\.md\)/g, 'no formato da seção "Template" deste prompt'],
  [/no formato de `skills\/refine-story\/TEMPLATE\.md`/g, 'no formato da seção "Template da história candidata" deste prompt'],
  [/as técnicas de TEST-DESIGN\.md/g, 'as técnicas da seção "Test design" deste prompt'],
  [/\[TEST-DESIGN\.md\]\(TEST-DESIGN\.md\)/g, 'a seção "Test design" deste prompt'],
  [/as regras de \[REGRAS\.md\]\(REGRAS\.md\)/g, 'as regras da seção "Regras de síntese" deste prompt'],
  [/no formato de \[GLOSSARIO\.md\]\(GLOSSARIO\.md\)/g, 'no formato da seção "Formato de glossário" deste prompt'],
  [/Formato em \[ADR\.md\]\(ADR\.md\)\./g, 'Formato na seção "Formato de ADR" deste prompt.'],
  [/o arquivo existe em `\.scratch\/<projeto>-<AAAA-MM-DD>\/ata\.md`, ou onde `docs\/agents\/refinement\.md` definir, com o aviso final\./g, 'a ata foi entregue na resposta, com o aviso final.'],
  [/spec e histórias existem no local que `docs\/agents\/refinement\.md` define, com o aviso final\./g, 'spec e histórias foram entregues na resposta, com o aviso final.'],
  [/o arquivo existe no local que `docs\/agents\/refinement\.md` define/g, 'o artefato foi entregue na resposta'],
  [/ O slug segue `docs\/agents\/refinement\.md`\./g, ''],
  [/Se já existe `\.scratch\/<slug>\/` para esta US, leia o que há: uma sessão anterior pode ter resolvido perguntas, e você não as refaz\. `docs\/adr\/` ou `\.scratch\/` ausentes: siga sem avisar\./g, 'Se o PO colou um artefato anterior desta US, leia-o: uma sessão anterior pode ter resolvido perguntas, e você não as refaz.'],
  [/Se há `\.scratch\/<slug>\/spec\.md` de um `\/refine-story`, parta dele: as decisões daquela sabatina já respondem parte das suas perguntas\. Sem esse arquivo, trate/g, 'Se o PO colou a US refinada de um `/refine-story`, parta dela: as decisões daquela sabatina já respondem parte das suas perguntas. Sem ela, trate'],
  [/procure a resposta nas fontes do workspace: glossário, histórias anteriores em `\.scratch\/`, documentos anexados pelo PO\. No modo com código, despache um subagente para procurar no código o que a US afirma ou pressupõe: a regra já existe\? o limite já está implementado\? a integração já funciona\?/g, 'procure a resposta no que o PO enviou: glossário, artefatos anteriores, documentos.'],
  [/No modo com código, despache um subagente para responder as de DEV lendo o código: a notificação é síncrona ou assíncrona\? há lock na aprovação\? existe mock do sistema externo\? /g, ''],
  [/Glossário, histórias anteriores em `\.scratch\/`, documentos do workspace e, no modo com código, o código: a integração mencionada já existe\? o limite já está implementado\?/g, 'Glossário, artefatos anteriores e documentos que o PO enviou: a integração mencionada já existe? o limite já está implementado?'],
  [/No modo sem código a busca se limita aos arquivos do workspace, sem subagente; se nada for encontrado/g, 'A busca se limita ao que o PO enviou; se nada for encontrado'],
  [/procure a resposta no `CONTEXT\.md`, nos ADRs, nas histórias anteriores em `\.scratch\/` e nos documentos do workspace; no modo com código, também no código, por subagente\./g, 'procure a resposta no glossário, nos artefatos anteriores e nos documentos que o PO enviou.'],
  [/No modo sem código a busca se limita ao workspace, sem subagente; se nada for encontrado/g, 'A busca se limita ao que o PO enviou; se nada for encontrado'],
  [/confira nos artefatos do workspace e, no modo com código, no código\./g, 'confira nos artefatos e documentos que o PO enviou.'],
  [/Termo resolvido entra no `CONTEXT\.md` na hora, (no formato da seção "Formato de glossário" deste prompt); não acumule para o fim\./g, 'Termo resolvido vira uma entrada proposta no bloco "Glossário" da resposta, $1, na mesma rodada em que se resolve.'],
  [/Termo do domínio resolvido entra no `CONTEXT\.md` na hora\./g, 'Termo do domínio resolvido vira entrada proposta no bloco "Glossário" da resposta.'],
  [/registre no `CONTEXT\.md` só o que o PO resolver/g, 'proponha no bloco "Glossário" só o que o PO resolver'],
  [/Arquivo `docs\/adr\/NNNN-<slug>\.md`, numerado a partir do maior existente mais um\. Crie a pasta quando o primeiro ADR for necessário\./g, 'Proposto num bloco "ADR" da resposta; o PO salva em `docs/adr/NNNN-<slug>.md` com o próximo número livre.'],
  [/Se o item vive no workspace, acrescente `Status: não é US` e o motivo abaixo do título, para deixar rastro\./g, 'Diga ao PO para marcar o item com `Status: não é US` e o motivo, para deixar rastro.'],
  [/ O mapeamento para rótulos de um tracker externo, quando houver, fica em `docs\/agents\/triage-labels\.md` do workspace\./g, ''],
  [/glossário, histórias anteriores, documentos do workspace e, no modo com código, o código\./g, 'glossário, artefatos anteriores e documentos que o PO enviou.'],
  [/; e no modo com código a pergunta 4 é respondida lendo o código, não perguntando\./g, '; e a pergunta 4 vai ao time de desenvolvimento por questionário, não ao PO.'],
  [/\$ARGUMENTS/g, 'o que o PO enviar nesta conversa'],
];

function adapt(text) {
  let t = text;
  for (const [re, to] of RULES) t = t.replace(re, to);
  const leftovers = t.match(/Skill tool|\]\([A-Z-]+\.md\)|\$ARGUMENTS/g);
  if (leftovers) throw new Error(`referência de skill não adaptada: ${[...new Set(leftovers)].join(', ')}`);
  return t;
}

const CHAT = (flow) => `# Modo chat

Este prompt é a versão para chat e para agentes por instruções do fluxo **${flow}** do pacote Refinement Skills. Ele reúne num texto só o fluxo, a sabatina, o rigor de requisitos e os templates. As regras abaixo prevalecem sobre qualquer instrução de arquivo, ferramenta ou modo que apareça no restante.

- O modo é sempre **sem código**: não há repositório, subagente nem ferramenta de arquivo. Ignore instruções sobre modo com código ou sobre despachar subagentes.
- O input é o que o PO enviar nesta conversa: texto colado ou arquivo anexado. Onde o fluxo diz "leia o \`CONTEXT.md\`", use o glossário que o PO colou, anexou ou colocou na base de conhecimento; sem glossário, pergunte os papéis do produto na primeira rodada. Onde diz "histórias anteriores em \`.scratch/\`", "ADRs" ou "documentos em \`docs/\`", use só o que o PO enviou; nada encontrado, diga isso em uma linha no topo da rodada 1.
- Onde o fluxo diz publicar, escrever ou salvar um arquivo, entregue o conteúdo na resposta, cada artefato num bloco próprio encabeçado pelo nome que o arquivo teria, pronto para o PO copiar para o work item. Questionários também vão na resposta, um bloco por destinatário. "Concluído quando: o arquivo existe" significa "o artefato foi entregue na resposta".
- Onde o fluxo diz registrar um termo no glossário ou um ADR, proponha a entrada pronta num bloco "Glossário" ou "ADR" ao final da resposta, para o PO copiar.
- A linha \`Azure:\` recebe o ID que o PO informar, ou \`nenhum\`. Slugs seguem a convenção do fluxo e servem só para nomear os blocos.
- Os outros fluxos citados (\`/meeting-minutes\`, \`/requirements-discovery\`, \`/refine-story\`, \`/qa-plan\`) são prompts separados desta coleção. Quando o fluxo mandar seguir para um deles, diga ao PO qual e o que levar. Um artefato anterior que o PO colar, como uma spec com \`Status: mapa aberto\` ou uma US refinada, é o ponto de partida.
- A data da sessão é a que o PO informar; sem ela, deixe \`<data>\` no artefato.
- A sabatina acontece nesta conversa: faça a rodada e espere a resposta do PO. Não invente respostas nem sintetize antes de a fronteira esvaziar ou de o PO pedir para fechar.
`;

const common = () => [ 
  part('Sabatina', body('socratic-examination/SKILL.md')),
  part('Formato de glossário', body('socratic-examination/GLOSSARIO.md')),
  part('Formato de ADR', body('socratic-examination/ADR.md')),
  part('Rigor de requisitos', body('requirements-rigor/SKILL.md')),
  part('Anti-padrões', body('requirements-rigor/ANTI-PADROES.md')),
  part('Questionário', body('requirements-rigor/QUESTIONARIO.md')),
];
const rigorOnly = () => [
  part('Rigor de requisitos', body('requirements-rigor/SKILL.md')),
  part('Anti-padrões', body('requirements-rigor/ANTI-PADROES.md')),
  part('Questionário', body('requirements-rigor/QUESTIONARIO.md')),
];

const FLOWS = {
  'refine-story': {
    title: 'Refine Story',
    parts: () => [
      part('Fluxo: Refine Story', dropSection(body('refine-story/SKILL.md'), 'Antes de começar')),
      ...common(),
      part('Template', verbatim('refine-story/TEMPLATE.md')),
    ],
  },
  'qa-plan': {
    title: 'QA Plan',
    parts: () => [
      part('Fluxo: QA Plan', dropSection(body('qa-plan/SKILL.md'), 'Antes de começar')),
      ...common(),
      part('Test design', body('qa-plan/TEST-DESIGN.md')),
      part('Template', verbatim('qa-plan/TEMPLATE.md')),
    ],
  },
  'requirements-discovery': {
    title: 'Requirements Discovery',
    parts: () => [
      part('Fluxo: Requirements Discovery', dropSection(body('requirements-discovery/SKILL.md'), 'Antes de começar')),
      ...common(),
      part('Template', verbatim('requirements-discovery/TEMPLATE.md')),
      part('Template da história candidata', verbatim('refine-story/TEMPLATE.md')),
    ],
  },
  'meeting-minutes': {
    title: 'Meeting Minutes',
    parts: () => [
      part('Fluxo: Meeting Minutes', body('meeting-minutes/SKILL.md')),
      ...rigorOnly(),
      part('Regras de síntese', body('meeting-minutes/REGRAS.md')),
      part('Template', verbatim('meeting-minutes/TEMPLATE.md')),
    ],
  },
};

function router() {
  let t = dropSection(body('which-flow/SKILL.md'), 'Pré-condição');
  t = t.replace(/Entre fluxos, `\/clear`: a etapa seguinte lê o artefato, não a conversa\. Dentro de um fluxo, não compacte antes da síntese: a sabatina e o artefato precisam do mesmo raciocínio\./,
    'Entre fluxos, comece uma conversa nova e cole o artefato anterior: a etapa seguinte lê o artefato, não a conversa.');
  t = t.replace(/O workspace declara em `docs\/agents\/refinement\.md` se roda \*\*com código\*\* ou \*\*sem código\*\*\./, 'Em chat o modo é sempre **sem código**.');
  t = t.replace(/Os fluxos terminam escrevendo um questionário por destinatário, ao lado do artefato, com as perguntas que a sabatina não pôde fechar\. Mande o arquivo, cole as respostas na conversa e rode o fluxo de novo sobre o artefato: ele retoma de onde parou\./,
    'Os fluxos terminam entregando um questionário por destinatário na resposta, com as perguntas que a sabatina não pôde fechar. Mande o questionário, cole as respostas numa conversa nova junto com o artefato e rode o fluxo de novo: ele retoma de onde parou.');
  const head = `# Qual fluxo? (modo chat)

Versão para chat e para agentes por instruções do roteador do pacote Refinement Skills. Cada fluxo é um prompt próprio desta coleção: \`refine-story.md\`, \`qa-plan.md\`, \`requirements-discovery.md\`, \`meeting-minutes.md\`. Num projeto ou agente que aceite arquivos de conhecimento, use este texto como instrução e os quatro prompts como arquivos; quando o PO pedir um fluxo, leia o arquivo correspondente e siga-o como se fosse a instrução. Num chat simples, cole o prompt do fluxo diretamente.

`;
  return head + t + '\n';
}

const check = process.argv.includes('--check');
const outputs = {};
for (const [name, flow] of Object.entries(FLOWS)) {
  const header = `<!-- Gerado por scripts/build-prompts.mjs a partir de skills/. Não edite à mão: rode node scripts/build-prompts.mjs -->\n\n`;
  outputs[`${name}.md`] = header + CHAT(flow.title) + '\n' + adapt(flow.parts().join('\n'));
}
outputs['which-flow.md'] = `<!-- Gerado por scripts/build-prompts.mjs a partir de skills/. Não edite à mão: rode node scripts/build-prompts.mjs -->\n\n` + adapt(router());

let stale = [];
for (const [file, text] of Object.entries(outputs)) {
  const p = join(outDir, file);
  if (check) {
    if (!existsSync(p) || readFileSync(p, 'utf8') !== text) stale.push(file);
  } else {
    mkdirSync(outDir, { recursive: true });
    writeFileSync(p, text);
    console.log(`gerado: prompts/${file} (${text.split('\n').length} linhas)`);
  }
}
if (check) {
  if (stale.length) { console.error(`prompts desatualizados: ${stale.join(', ')}. Rode: node scripts/build-prompts.mjs`); process.exit(1); }
  console.log('ok: prompts/ em dia com skills/');
}
