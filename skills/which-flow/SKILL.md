---
name: which-flow
description: Pergunte qual fluxo de refinamento usar. Um roteador sobre as skills deste pacote.
disable-model-invocation: true
---

# Qual fluxo?

Você não precisa lembrar de cada skill; pergunte.

Um **fluxo** é um caminho pelas skills. O caminho principal vai da reunião ao plano de teste; cada etapa publica um artefato no tracker que a seguinte lê. Por baixo rodam duas primitivas que todas consultam.

## O fluxo principal: reunião → planning

1. **`/meeting-minutes`** quando o ponto de partida é uma transcrição. Produz a ata com proveniência, questionários para confirmar acordos presumidos, e um insumo de discovery.
2. **`/requirements-discovery`** quando o ponto de partida é input bruto: o insumo da ata, um briefing, um e-mail, uma ideia de feature. Sabatina em largura e publica épicos e histórias candidatas. Quando o escopo não cabe numa sessão, abre um **mapa de decisões** e o mesmo comando, apontado para a spec, resolve uma decisão por sessão até o mapa clarear.
3. **`/refine-story`** por história, candidata ou escrita pelo PO. Sabatina até a fronteira esvaziar e publica a história refinada com veredito: PRONTA, REFINAR ou BLOQUEADA.
4. **`/qa-plan`** sobre a história refinada. Deriva condições com técnica declarada, sabatina o PO sobre o indefinido, e manda para o time de desenvolvimento o que depende de arquitetura.

Entre em qualquer etapa. Uma US escrita pelo PO entra direto em `/refine-story`; uma US refinada por outro meio entra direto em `/qa-plan`.

### Higiene de contexto

Cada fluxo cabe numa sessão e publica no tracker. Entre fluxos, `/clear`: a etapa seguinte lê o artefato, não a conversa. Dentro de um fluxo, não compacte antes da síntese: a sabatina e o artefato precisam do mesmo raciocínio.

## Dois modos

O workspace declara em `docs/agents/refinement.md` se roda **com código** ou **sem código**. Com código, os fluxos buscam fatos no código antes de perguntar e respondem sozinhos as perguntas de arquitetura. Sem código, o PO é a fonte, o glossário e as histórias anteriores são a memória, e perguntas de arquitetura viram questionário para o time. Os fluxos são os mesmos; muda quem responde o quê.

## Primitivas por baixo

- **`socratic-examination`**: a sabatina em si: rodadas, fronteira, resposta recomendada com base, fatos do agente e decisões do PO, glossário e ADRs atualizados na hora. Todo fluxo de sabatina a chama; chame direto quando quiser ser sabatinado sobre qualquer coisa sem o vocabulário de requisitos por cima.
- **`requirements-rigor`**: a fronteira inferência ou invenção, os marcadores, INVEST, Gherkin, anti-padrões, vereditos e o formato do questionário. Todo fluxo a chama.

## Quando quem sabe não está na sessão

Os fluxos terminam escrevendo um questionário por destinatário, ao lado do artefato, com as perguntas que a sabatina não pôde fechar. Mande o arquivo, cole as respostas na conversa e rode o fluxo de novo sobre o artefato: ele retoma de onde parou.

## Pré-condição

**`/configure-refinement`**, uma vez por workspace: configura o modo, o tracker e as convenções de publicação.
