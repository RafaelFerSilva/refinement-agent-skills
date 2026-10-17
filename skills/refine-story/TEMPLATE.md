# <ID ou título curto>: Como <papel>, quero <capacidade>

Status: <PRONTA | REFINAR | BLOQUEADA>
Azure: <ID do work item ou nenhum>
Origem: <caminho, ID ou "texto colado">, sessão de /refine-story em <AAAA-MM-DD>

## Narrativa

Como <papel>, quero <capacidade>, para que <resultado verificável>.

## Scorecard INVEST

| Critério | Resultado | Motivo (quando não PASS) |
| --- | --- | --- |
| Independent | PASS | |
| Negotiable | | |
| Valuable | | |
| Estimable | | |
| Small | | |
| Testable | | |

## Critérios de aceite

Cenário: <happy path>
  Dado <estado>
  Quando <evento>
  Então <resultado verificável>

Cenário: <edge case>
  Dado <estado>
  Quando <evento>
  Então <resultado verificável>

## Auditoria do texto original

- Narrativa: <original> → <problema> → <versão proposta>
- AC1: ANTES <texto> → DEPOIS <cenário> (<violação corrigida>)
- Movidos: <critério que era task, DoD ou órfão> → <destino>
- Anti-padrões: <tipo> em <trecho>

## Decisões da sabatina

- <pergunta> → <resposta do PO> (<quem>, <data>)

## Perguntas em aberto

1. [<quem>] <pergunta> → <impacto se não respondida> (questionário: <caminho ou nenhum>)

## Notas

- Soluções sugeridas pelo PO, preservadas como referência: <...>
- Tasks sugeridas, movidas dos critérios: <...>
- Story points: <os do time, se houver> [ESTIMATIVA EM RISCO: <lacuna>] | [A CALIBRAR NO PLANNING] <contexto para o time>
- Dependências: <declaradas> + <detectadas [INFERÊNCIA: base]>

## Proposta de decomposição

<só quando houver [DECOMPOR] ou requisito duplo: narrativa de cada parte, qual critério original vai para qual, qual parte carrega a dependência>

## Veredito

<✅ PRONTA | 🔶 REFINAR, destrava com as perguntas <n>, <m> | ⛔ BLOQUEADA: <motivo>>

⚠️ Este output é preparação para o refinamento, não o substitui. A decisão sobre escopo, valor e prioridade é do PO e do time.
