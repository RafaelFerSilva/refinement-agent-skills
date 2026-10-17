---
name: qa-plan
description: "Sabatina uma User Story do ponto de vista de teste e publica a base do plano de teste: condições com técnica declarada, risco, camadas, bloqueadores de automação e perguntas com destinatário."
disable-model-invocation: true
argument-hint: "[caminho ou ID da US refinada]"
---

# Plano de QA

Derive a base do plano de teste de uma User Story por **sabatina**: condições de teste com método declarado, resultado esperado só quando a especificação o sustenta, e perguntas para quem pode responder o resto. Você não responde "esta US está bem escrita?", isso é `/refine-story`. Você responde: o que pode quebrar, como provo que funciona, e o que precisa existir para eu conseguir provar.

Um QA pleno deve conseguir implementar os testes a partir do artefato; um QA sênior deve concordar com a priorização.

US: $ARGUMENTS

## Fronteira de três camadas

Derivar condições que ninguém escreveu é o trabalho de QA, desde que feito com método. Por isso a fronteira aqui tem três camadas; a base continua sendo `requirements-rigor`. Toda condição do plano pertence a exatamente uma:

- `[ESPECIFICADO: trecho]` (en-US: `[SPECIFIED: excerpt]`): condição e resultado esperado vêm do texto. Cite a origem.
- `[DERIVADO: técnica]` (en-US: `[DERIVED: technique]`): a condição decorre de uma técnica de test design aplicada ao especificado. Nomeie sempre a técnica; condição sem técnica é palpite e não entra. O resultado esperado só pode ser afirmado se decorre logicamente da especificação.
- `[INDEFINIDO → Pergunta n]` (en-US: `[UNDEFINED → Question n]`): condição legítima cujo resultado esperado a especificação não define. A condição entra no plano; o resultado vira pergunta numerada.

Teste rápido: "qual técnica gerou esta condição, e de qual trecho ela parte?" Sem resposta para as duas, fora do plano.

## Antes de começar

Leia `docs/agents/refinement.md` do workspace: ele define o modo (com código ou sem código), o idioma (`en-US` ou `pt-BR`, padrão `en-US`) e onde publicar. O modo decide quem responde as perguntas de arquitetura: com código, você mesmo, lendo o código; sem código, o time de desenvolvimento, por questionário. Sabatina e plano de QA são redigidos no idioma configurado. Faltando o arquivo, peça `/configure-refinement` e pare.

## Passos

1. **Carregar.** Leia a US, o `CONTEXT.md`, os ADRs da área, [TEST-DESIGN.md](TEST-DESIGN.md), e chame a Skill tool para `requirements-rigor`. Se há `.scratch/<slug>/spec.md` de um `/refine-story`, parta dele: as decisões daquela sabatina já respondem parte das suas perguntas. Sem esse arquivo, trate a US como não refinada, mesmo que a linha `Status:` diga PRONTA.
   Concluído quando: a triagem de testabilidade está dita em uma linha: TESTÁVEL (todo resultado esperado tem ponto de observação e nenhuma dependência está por confirmar), TESTÁVEL COM RESSALVAS (dá para derivar condições, mas ao menos um resultado não tem ponto de observação definido ou depende de dependência não confirmada), ou NÃO TESTÁVEL.

2. **Triar.** NÃO TESTÁVEL (os critérios não descrevem comportamento observável: só tasks, ou termos subjetivos sem métrica em todos eles): diga o que falta, liste as três a cinco perguntas mínimas e recomende `/refine-story`. Pare aqui; analisar o intestável produz plano de fachada. Se a US não passou por refinamento, diga isso e siga, avisando que parte das perguntas seria absorvida por um `/refine-story`.
   Concluído quando: a triagem foi dita.

3. **Derivar condições.** Para cada critério, aplique as técnicas de TEST-DESIGN.md que se aplicam, sem forçar as que não se aplicam, e verifique todos os ângulos silenciosos, reportando só os aplicáveis. Monte a matriz: condição, origem, resultado esperado ou `[INDEFINIDO → Pergunta n]`, prioridade, camada. Condições indefinidas permanecem na matriz: cobertura futura visível vale mais que cobertura oculta. Numere as perguntas numa sequência única, PO e DEV juntos, para que `[INDEFINIDO → Pergunta n]` resolva sem ambiguidade. A justificativa de prioridade, meia linha por condição, vai numa lista na análise de risco, não na tabela.
   Concluído quando: toda condição tem origem declarada e todo `[INDEFINIDO]` tem número de pergunta.

4. **Buscar fatos antes de perguntar.** Separe as perguntas por destinatário. **PO**: comportamento esperado indefinido. **DEV**: arquitetura, observabilidade, camada, isolamento de dependência externa, controle de tempo, provisionamento de massa, resposta de erro da API, persistência após falha, idempotência técnica. No modo com código, despache um subagente para responder as de DEV lendo o código: a notificação é síncrona ou assíncrona? há lock na aprovação? existe mock do sistema externo? Fato encontrado vira resultado esperado ou camada definida, com a fonte. No modo sem código a busca se limita aos arquivos do workspace, sem subagente; se nada for encontrado, diga isso em uma linha no topo da rodada 1.
   Concluído quando: cada pergunta está marcada como respondida por fonte ou aberta, com destinatário.

5. **Sabatinar o PO.** Chame a Skill tool para `socratic-examination`. A rodada vai junto com a matriz no estado atual, porque as perguntas referenciam condições. A fronteira são as perguntas de PO, bloqueantes primeiro (as que travam condições P1), cada uma com resposta recomendada quando a especificação dá base; quando não dá, "sem recomendação" e, se houver, as opções. Resposta do PO atualiza a matriz na hora. Desafie termos contra o glossário, mas registre no `CONTEXT.md` só o que o PO resolver.
   Concluído quando: a fronteira de PO está vazia, ou o PO pediu para fechar.

6. **Sintetizar.** Escreva o plano no formato de [TEMPLATE.md](TEMPLATE.md): matriz, análise de risco, cenários P1 em Gherkin com autoauditoria, auditoria de automatizabilidade, impacto de regressão só a partir do que o contexto declara sobre o sistema existente (sem contexto, só as perguntas de impacto), perguntas restantes com destinatário, veredito de cobertura.
   Concluído quando: o arquivo existe no local que `docs/agents/refinement.md` define e o aviso final está presente.

7. **Encaminhar.** Perguntas de DEV abertas no modo sem código, e perguntas de PO que o PO não soube responder: escreva um questionário por destinatário no formato de `QUESTIONARIO.md` de `requirements-rigor`, ao lado do plano, e aponte os arquivos a partir das perguntas em aberto.
   Concluído quando: nenhuma pergunta aberta ficou sem destinatário ou sem questionário.

8. **Reportar.** Veredito, onde o plano foi publicado, quantas P1 estão executáveis, e o que cada questionário destrava.

## Aviso final

> ⚠️ Este output é a base analítica do plano de teste, não o plano final. A decisão de cobertura, priorização e esforço é do time de QA, com validação de PO (comportamentos indefinidos) e Dev (arquitetura e camadas).
