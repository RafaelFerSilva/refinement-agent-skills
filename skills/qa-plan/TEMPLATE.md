# Plano de QA: <ID ou título da US>

Status: <EXECUTÁVEL | PARCIAL | BLOQUEADO>
Azure: <ID do work item ou nenhum>
Origem: <caminho da US refinada>, sessão de /qa-plan em <AAAA-MM-DD>

## Triagem de testabilidade

<TESTÁVEL | TESTÁVEL COM RESSALVAS | NÃO TESTÁVEL> + motivo em meia linha. Nota sobre refinamento prévio, se aplicável.

## Matriz de condições de teste

Agrupada por critério ou comportamento de origem.

| # | Condição | Origem | Resultado esperado | Prio | Camada |
| --- | --- | --- | --- | --- | --- |

## Análise de risco

Quantas P1, P2 e P3. As três condições de maior risco e por quê. Onde o esforço de automação se concentra. Impactos INDETERMINADOS com a pergunta associada.

Justificativa por condição: `#n`: meia linha.

## Cenários P1 em Gherkin

Só as condições P1; as demais vivem na matriz. Cada cenário indica a camada-alvo e os pré-requisitos de massa.

Cenário: <nome>
  Dado <estado>
  Quando <evento>
  Então <resultado verificável>

## Auditoria de automatizabilidade

Por cenário P1 e P2: os quatro bloqueadores verificados, `[BLOQUEADOR: tipo]` onde houver, e a ação ou pergunta que o remove. Fechamento: lista consolidada de pré-requisitos de automação (mocks, massa, controles de ambiente).

## Impacto de regressão

Fluxos existentes que a US toca, o que pode quebrar em silêncio, qual verificação cobre. Sem contexto sobre o sistema: só as perguntas de impacto para DEV.

## Decisões da sabatina

- <pergunta> → <resposta do PO> (<quem>, <data>)

## Perguntas em aberto

1. [PO|DEV] <pergunta> → <o que destrava no plano> (questionário: <caminho ou nenhum>)

## Veredito de cobertura

<✅ PLANO EXECUTÁVEL | 🔶 EXECUTÁVEL PARCIALMENTE: P1 executáveis; <n> condições aguardam as perguntas <lista> e <m> aguardam remoção de bloqueadores <lista> | ⛔ PLANO BLOQUEADO: <motivo>. Recomendação: <voltar ao refinamento | resolver bloqueadores de infraestrutura primeiro>>

⚠️ Este output é a base analítica do plano de teste, não o plano final. A decisão de cobertura, priorização e esforço é do time de QA, com validação de PO (comportamentos indefinidos) e Dev (arquitetura e camadas).
