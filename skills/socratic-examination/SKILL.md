---
name: socratic-examination
description: "Conduz uma sabatina: entrevista o PO em rodadas até a fronteira de decisões esvaziar, buscando fatos antes de perguntar e registrando termos e decisões no glossário. Use quando um fluxo mandar sabatinar, ou quando o usuário pedir para ser sabatinado sobre uma história, um escopo ou uma decisão."
---

# Sabatina

Entreviste o PO até chegar a um entendimento compartilhado, sem decisão silenciosa de nenhum dos lados. Trate o assunto como uma **árvore de decisões**: cada decisão abre as decisões que dependem dela.

## Rodadas e fronteira

A **fronteira** são as perguntas cujos pré-requisitos já estão resolvidos: as que podem ser feitas agora sem adivinhar respostas ainda não dadas. Trabalhe em **rodadas**: pergunte toda a fronteira de uma vez, numerada, cada pergunta com sua resposta recomendada, e espere as respostas antes da próxima rodada. Pergunta cuja resposta depende de outra ainda aberta nesta rodada pertence à próxima.

Formato de uma rodada em en-US (padrão):

```
❓ **Q1. <short title>** (blocking, when it blocks the verdict)
<body of the question; numbered options when applicable, with the implication of each>
**Recommendation:** <recommended answer> [INFERENCE: base]

❓ **Q2. <short title>**
<body>
**Recommendation:** no recommendation: <why>, options: <a>, <b>
```

Formato de uma rodada em pt-BR:

```
❓ **Q1. <título curto>** (bloqueante, quando trava o veredito)
<corpo da pergunta; opções enumeradas quando houver, com a implicação de cada uma>
**Recomendação:** <resposta recomendada> [INFERÊNCIA: base]

❓ **Q2. <título curto>**
<corpo>
**Recomendação:** sem recomendação: <por quê>, opções: <a>, <b>
```

Bloqueantes primeiro. A numeração continua entre rodadas: a rodada 2 começa onde a 1 parou, para que o artefato final referencie as perguntas sem ambiguidade.

Cada resposta reformula a árvore: decisões resolvidas empurram a fronteira e destravam perguntas que dependiam delas. Recalcule a fronteira e pergunte a próxima rodada. A sabatina termina quando a fronteira está vazia, ou quando o PO pede para fechar com o que há. Não sintetize antes disso.

## Fatos e decisões

Fatos são trabalho seu, nunca do PO. Antes de perguntar, procure a resposta no `CONTEXT.md`, nos ADRs, nas histórias anteriores em `.scratch/` e nos documentos do workspace; no modo com código, também no código, por subagente. Fato encontrado não vira pergunta: vira resposta recomendada com a fonte citada. No modo sem código a busca se limita ao workspace, sem subagente; se nada for encontrado, diga isso em uma linha no topo da rodada.

Decisões são do PO: escopo, valor, prioridade, comportamento esperado que nenhuma fonte define. Ponha cada uma para ele e espere. Sem base para recomendar, escreva "sem recomendação" (ou "no recommendation") e as opções com a implicação de cada uma; recomendar sem base é invenção. Quando duas fontes sustentam leituras diferentes, recomende a mais direta e exponha a outra como opção.

Resposta que o PO não sabe dar recebe `[A CONFIRMAR: quem]` (ou `[TO CONFIRM: whom]`) e sai da fronteira. O destinatário é quem o PO indicar; senão, o papel que o glossário associa ao assunto; senão, o próprio PO leva a pergunta. Essas perguntas vão para o questionário que o fluxo gera ao final.

## Glossário e decisões registradas

A sabatina afia a linguagem do produto enquanto acontece:

- **Desafie contra o glossário.** Termo do PO que conflita com o `CONTEXT.md`: aponte na hora. "O glossário define 'alerta' como X, mas você parece querer dizer Y. Qual dos dois?"
- **Afie o termo vago.** Palavra sobrecarregada ou imprecisa: proponha o termo canônico. "Quando diz 'conta', é o Usuário ou a Persona? São coisas diferentes."
- **Teste com cenários concretos.** Relação entre conceitos em discussão: invente um caso-limite que force a precisão da fronteira entre eles.
- **Confira com o que existe.** Afirmação do PO sobre como algo funciona: confira nos artefatos do workspace e, no modo com código, no código. Contradição entra na rodada como pergunta; você não a resolve.
- **Registre no momento em que resolver.** Termo resolvido entra no `CONTEXT.md` na hora, no formato de [GLOSSARIO.md](GLOSSARIO.md); não acumule para o fim. Só o que o PO resolveu: termo em discussão continua pergunta.
- **Ofereça um ADR com parcimônia.** Só quando a decisão é difícil de reverter, surpreenderia quem ler o artefato sem contexto, e resultou de uma escolha real entre alternativas. Formato em [ADR.md](ADR.md).

O `CONTEXT.md` é glossário e nada mais: sem detalhe de implementação, sem rascunho, sem decisão de escopo.
