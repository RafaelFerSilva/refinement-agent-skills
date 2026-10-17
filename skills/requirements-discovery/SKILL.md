---
name: requirements-discovery
description: Sabatina um input bruto de stakeholders (transcrição, briefing, e-mail, ideia de feature) até virar épicos e User Stories candidatas publicadas no tracker; quando o escopo não cabe numa sessão, abre um mapa de decisões e o resolve uma decisão por sessão.
disable-model-invocation: true
argument-hint: "[caminho do input ou cole o texto; ou caminho de uma spec com mapa aberto]"
---

# Discovery

Converta input não estruturado de stakeholders em requisitos rastreáveis por **sabatina**. Você não é um transcritor: captura o que foi dito e o que foi implicado, sinaliza o que ficou ambíguo, e devolve histórias candidatas que `/refine-story` leva até o planning. O que o input não sustenta não entra; o que ele sugere entra como inferência com base; o que ele deixa aberto vira pergunta.

Input: $ARGUMENTS

## Antes de começar

Leia `docs/agents/refinement.md` do workspace: ele define o modo, o idioma (`en-US` ou `pt-BR`, padrão `en-US`) e onde publicar. Faltando, peça `/configure-refinement` e pare. Se o argumento é uma spec com `Status: mapa aberto` (ou `Status: open map`), vá direto para "Retomar o mapa". Se o input veio de `/meeting-minutes`, ele já separa o que foi dito do que foi presumido: trate os acordos presumidos como não confirmados. A sabatina e as specs geradas seguem o idioma configurado.

## Passos

1. **Carregar e triar.** Leia o input, o `CONTEXT.md`, e chame a Skill tool para `requirements-rigor`. Varra os anti-padrões (leia o `ANTI-PADROES.md` de `requirements-rigor` à parte) e os termos que sempre viram pergunta: é essa varredura que fundamenta a triagem. Classifique contando trechos, não volume: UTILIZÁVEL (todo trecho estrutura requisito), PARCIALMENTE UTILIZÁVEL (ao menos um trecho estrutura e ao menos um não), INUTILIZÁVEL (nenhum trecho estrutura). INUTILIZÁVEL: diga isso com o motivo trecho a trecho, liste as três a cinco perguntas mínimas com destinatário (quem trouxe o input, salvo papel identificável no glossário), escreva o questionário no formato de `QUESTIONARIO.md` de `requirements-rigor`, diga que `/requirements-discovery` roda de novo com as respostas, e pare sem publicar mais nada; histórias de enchimento não ajudam ninguém. PARCIAL: siga, e o artefato final abre com a lista dos trechos que não geraram nada e o que falta em cada um.
   Concluído quando: a classificação foi dita em uma linha, seguida do motivo trecho a trecho quando não é UTILIZÁVEL.

2. **Mapear em largura.** Antes de qualquer história, varra o input inteiro: domínios de negócio com confiança (Alta, Média, Baixa; Baixa marca onde o discovery precisa de outra conversa), stakeholders com tipo (negócio, técnico, usuário final) e o que cada um defende, épicos com complexidade P, M, G ou GG justificada em uma linha; trecho sem lista fechada ou sem critério mensurável não vira épico ainda, fica no processamento parcial até a sabatina dimensioná-lo. Quando o input é de segunda mão, quem o anotou entra na tabela de stakeholders com tipo "fonte". Duas vozes em posições opostas sobre o mesmo requisito: `[CONFLITO]`, as duas posições registradas, sem resolver. Requisito dito por uma voz só recebe `[VALIDAR COM EQUIPE]` onde a confirmação importa: necessidade de um papel que não foi ouvido, decisão de escopo de quem não decide; com duas vozes em assuntos disjuntos, não marque tudo. Requisito de negócio e restrição técnica vêm de stakeholders diferentes e têm pesos diferentes: distinga.
   Concluído quando: cada trecho do input está atribuído a um domínio e a um épico, ou listado como não aproveitado.

3. **Buscar fatos antes de perguntar.** Glossário, histórias anteriores em `.scratch/`, documentos do workspace e, no modo com código, o código: a integração mencionada já existe? o limite já está implementado? Fato encontrado vira resposta recomendada com a fonte. No modo sem código a busca se limita aos arquivos do workspace, sem subagente; se nada for encontrado, diga isso em uma linha no topo da rodada 1.
   Concluído quando: cada pergunta candidata está marcada como respondida por fonte ou aberta.

4. **Decidir o tamanho.** Chame a Skill tool para `socratic-examination` e sabatine primeiro em largura: o destino (o que este discovery entrega), o escopo, os conflitos e o que muda o tamanho de um épico. SLA, canal e edge cases são profundidade e ficam para o passo 5. Se ao fim dessa rodada a fronteira cabe numa sessão, siga para o passo 5. Se sobra **névoa** (decisões que você vê vindo mas não consegue formular ainda, porque dependem de perguntas abertas), abra o mapa: publique a spec no formato de [TEMPLATE.md](TEMPLATE.md) com `Status: mapa aberto`, uma decisão pendente por arquivo em `issues/NN-decisao-<slug>.md` para cada pergunta já formulável, com `Bloqueada por:` quando depende de outra, e a névoa ainda não formulável na seção "Ainda não especificado". O teste entre decisão e névoa é conseguir formular a pergunta com precisão agora, não conseguir respondê-la. Traçar o mapa é o trabalho de uma sessão: pare e diga ao usuário que `/requirements-discovery <caminho da spec>` resolve uma decisão por sessão.
   Concluído quando: ou a fronteira cabe numa sessão, ou a spec com mapa aberto e suas decisões pendentes existem.

5. **Sabatinar.** Continue as rodadas de `socratic-examination` em profundidade, épico a épico: papéis, capacidades, resultados, edge cases que o input sugere, dependências. Termo do domínio resolvido entra no `CONTEXT.md` na hora. Fato que nenhum presente sabe recebe `[A CONFIRMAR: quem]` e sai da fronteira.
   Concluído quando: a fronteira está vazia, ou o usuário pediu para fechar.

6. **Sintetizar.** Escreva a spec de discovery no formato de [TEMPLATE.md](TEMPLATE.md) e uma história candidata por arquivo, no formato de `skills/refine-story/TEMPLATE.md`, com `Status: candidata` e scorecard INVEST preliminar. História que reprova no INVEST não vira card limpo: fica como candidata com `[INVEST-FAIL]` e o que resolveria. Inclua as dependências não declaradas: integrações, serviços e decisões técnicas que precisam existir para as histórias serem implementáveis, cada uma com a história que bloqueia e a ação necessária. Toda linha das histórias tem correspondência no input ou um `[INFERÊNCIA]` válido; o que não tem nenhum dos dois é gold plating e sai.
   Concluído quando: spec e histórias existem no local que `docs/agents/refinement.md` define, com o aviso final.

7. **Encaminhar.** `[A CONFIRMAR]` com destinatário fora da sessão: um questionário por destinatário, no formato de `QUESTIONARIO.md` de `requirements-rigor`, ao lado da spec.
   Concluído quando: nada aberto ficou sem destinatário ou sem questionário.

8. **Reportar.** Épicos, quantas histórias candidatas, conflitos em aberto, e o próximo passo: `/refine-story` por história, ou `/requirements-discovery <caminho da spec>` se o mapa está aberto.

## Retomar o mapa

Quando o argumento é uma spec com `Status: mapa aberto`:

1. Leia a spec inteira e as decisões pendentes em `issues/`. Uma decisão está **livre** quando está aberta e toda decisão em `Bloqueada por:` está resolvida.
   Concluído quando: você sabe quais decisões estão livres.
2. Escolha a decisão: a que o usuário nomeou, senão a primeira livre pelo número. Marque `Status: em sabatina` no arquivo antes de começar, para que outra sessão não a pegue.
   Concluído quando: o arquivo está marcado.
3. Resolva-a com `socratic-examination`, uma decisão por sessão. Tipo pesquisa resolve-se lendo a fonte externa, com citação, sem sabatina. Registre a resposta no próprio arquivo sob `## Resposta`, marque `Status: resolvida`, e acrescente uma linha com o resumo e o caminho na seção "Decisões da sabatina" da spec.
   Concluído quando: a decisão está resolvida e a spec aponta para ela.
4. A resposta pode clarear a névoa: o que ficou formulável sai de "Ainda não especificado" e vira nova decisão pendente; o que ficou fora do destino vai para "Fora de escopo". Decisão que a resposta invalida é fechada com uma linha de motivo.
   Concluído quando: nenhuma decisão pendente contradiz a resposta e a névoa foi relida.
5. Sem decisão pendente aberta: mude a spec para `Status: em andamento` e siga para o passo 5 dos passos principais, na mesma sessão se couber, senão na próxima com o mesmo comando.
   Concluído quando: a spec saiu de mapa aberto, ou você disse ao usuário quantas decisões ainda faltam.

Decisão pendente, formato:

```md
# Decisão NN: <pergunta em uma frase>

Status: <aberta | em sabatina | resolvida | fechada>
Bloqueada por: <NN, NN ou nenhuma>
Tipo: <sabatina | pesquisa>

## Pergunta

<o que precisa ser decidido e por que trava o resto>

## Resposta

<ao resolver: a decisão, quem decidiu, a data>
```

## Aviso final

> ⚠️ Este output é um rascunho analítico. Requer revisão humana antes de entrar em sprint. Valide: viabilidade técnica, compliance e dependências não mapeadas.
