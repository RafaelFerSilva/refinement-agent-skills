# 245: Como operador de despacho, quero silenciar alertas de velocidade

Status: REFINAR
Azure: 245
Fonte: .scratch/245-silenciar-alertas/us.md, sessão /refine-story em 2026-04-20

## Narrativa

Como operador de despacho, quero silenciar alertas de velocidade de um veículo, para que alertas repetidos de uma rota de manutenção conhecida parem de esconder eventos novos.

## Scorecard INVEST

| Critério | Resultado | Motivo (quando não PASS) |
| --- | --- | --- |
| Independent | PASS | |
| Negotiable | PASS | |
| Valuable | PASS | |
| Estimable | INDETERMINADO | depende da pergunta 1 |
| Small | PASS | |
| Testable | INDETERMINADO | janela de silenciamento indefinida |

## Critérios de aceite

Cenário: operador silencia alertas de um veículo
  Dado que o veículo PLT-1023 tem um alerta de velocidade ativo
  Quando o operador confirma o silenciamento do veículo
  Então o veículo para de produzir alertas de velocidade durante a janela de silenciamento
  E o painel de alertas mostra o veículo como silenciado

Cenário: janela de silenciamento expira
  Dado que o veículo PLT-1023 está silenciado
  Quando a janela de silenciamento chega ao fim
  Então o veículo volta a produzir alertas de velocidade

## Auditoria do texto original

- AC1: ANTES "o botão deve funcionar adequadamente" -> DEPOIS cenário acima (resultado não verificável corrigido)
- Movido: "criar serviço de silenciamento no backend" -> tasks técnicas sugeridas
- Anti-padrões: [ANTI-PADRÃO: resultado não verificável] em "de forma simples"

## Decisões da sabatina

- Quem silencia? -> operador de despacho (PO, 2026-04-20)

## Perguntas em aberto

1. [PO] Qual é a janela máxima de silenciamento em minutos? -> sem isso a janela não é testável (questionário: nenhum)
2. [DEV] Um alerta que chega durante a janela é descartado ou enfileirado? -> define o estado esperado após a expiração (questionário: questionario-dev.md)

## Notas

- Story points: [A CALIBRAR NO PLANNING] regras da janela ainda abertas
- Dependências: ingestão de telemetria [INFERÊNCIA: alertas derivam de telemetria conforme CONTEXT.md]

## Veredito

🔶 REFINAR, destrava com as perguntas 1, 2

> ⚠️ Esta saída é preparação para o refinamento, não substituto dele. Decisões de escopo, valor e prioridade são estritamente do PO e do time.
