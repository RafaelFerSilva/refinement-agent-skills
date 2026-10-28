# Panorama do produto: RouteWise Frota

Status: PARCIAL
Fonte: evals/fixtures/manual-legado-frota.md, sessão /bootstrap-context em 2026-10-28

## Triagem

FONTES PARCIAIS: manual legado de operações cobre papéis, ingestão de telemetria e alertas de velocidade, enquanto limites de retentativa da sincronização com ERP não possuem especificação escrita.

## Propósito do produto

O RouteWise monitora a telemetria de frotas comerciais para detectar violações de velocidade e coordenar respostas de despacho em rotas ativas [INFERÊNCIA: evals/fixtures/manual-legado-frota.md].

## Papéis e permissões

| Papel | Responsabilidade | Acesso ou restrição | Proveniência |
| --- | --- | --- | --- |
| Operador de despacho | Monitora alertas em tempo real e aciona motoristas em rotas ativas | Visualiza e reconhece alertas apenas da garagem regional atribuída | Decisão do PO (2026-10-28) |
| Gestor de frota | Configura tolerâncias de velocidade por rota e revisa relatórios operacionais | Leitura e escrita completas sobre limiares em todas as garagens | [INFERÊNCIA: evals/fixtures/manual-legado-frota.md] |

## Módulos em produção

| Módulo ou capacidade | Comportamento atual | Proveniência |
| --- | --- | --- |
| Ingestão de telemetria | Recebe leituras de posição e velocidade a cada 30 segundos, incluindo leituras retroativas após perda de sinal | [INFERÊNCIA: evals/fixtures/manual-legado-frota.md] |
| Avaliação de alerta de velocidade | Cria alerta quando uma leitura excede o limite da via somado à tolerância configurada | [INFERÊNCIA: evals/fixtures/manual-legado-frota.md] |
| Relatório operacional | Exporta resumos diários de leituras por garagem em formato CSV | Decisão do PO (2026-10-28) |

## Integrações ativas

| Sistema externo | Direção e finalidade | SLA ou restrição conhecida | Proveniência |
| --- | --- | --- | --- |
| Gateway TeleTrack | Recebimento de GPS e velocidade via webhook HTTPS | Reenvio em lote na reconexão; tamanho máximo do lote [A CONFIRMAR: DEV] | [INFERÊNCIA: evals/fixtures/manual-legado-frota.md] |
| Sincronização de faturamento ERP | Envio diário do resumo de quilometragem | Disponibilidade e política de retentativa [A CONFIRMAR: DEV] | [DEPENDÊNCIA NÃO MAPEADA] |

## Regras transversais e SLAs

- A retenção de telemetria ativa é de 90 dias [INFERÊNCIA: evals/fixtures/manual-legado-frota.md].
- Leituras retroativas preservam o horário original de captura no veículo, não o horário de chegada no servidor (Decisão do PO, 2026-10-28).
- O tamanho máximo de lote na reconexão do TeleTrack e a janela de retentativa do ERP permanecem [A CONFIRMAR: DEV].

## Conflitos de fonte resolvidos

- "Conta" vs. "Garagem" no manual legado -> termo canônico definido como Garagem regional (`CONTEXT.md`); "Conta" listado em `_Avoid_` (PO, 2026-10-28).
- "Alerta ao motorista" vs. "Alerta de velocidade" -> alertas notificam o operador de despacho, nunca a cabine do veículo diretamente (PO, 2026-10-28).

## Decisões da sabatina

- Quem recebe alertas de velocidade hoje em produção? -> Apenas o operador de despacho; gestores de frota consultam relatórios operacionais de forma assíncrona (PO, 2026-10-28).
- A sincronização com ERP está ativa em todas as garagens? -> Ativa apenas para rotas de frete contratado, comportamento técnico de retentativa direcionado para engenharia (PO, 2026-10-28).

## Perguntas em aberto

1. [DEV] Qual é o tamanho máximo de lote aceito nos webhooks de reconexão do TeleTrack? -> dimensiona casos de borda para histórias de enxurrada de alertas (questionário: questionario-dev.md)
2. [DEV] A sincronização de faturamento com o ERP reprocessa falhas diárias automaticamente ou exige disparo manual? -> define tratamento de falha em histórias de quilometragem (questionário: questionario-dev.md)

## Veredito

🔶 PARCIAL, destrava com as perguntas 1, 2

> ⚠️ Este output é uma base analítica do contexto do produto, não substitui a validação do time. A decisão sobre vocabulário de domínio, regras vigentes e escopo é do PO e do time.
