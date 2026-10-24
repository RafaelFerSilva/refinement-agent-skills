# Plano de QA: 318 encerrar alerta de velocidade

Status: PARCIAL
Azure: 318
Fonte: .scratch/318-encerrar-alerta/spec.md, sessão /qa-plan em 2026-04-21

## Triagem de testabilidade

TESTÁVEL COM RESSALVAS: os resultados têm ponto de observação, a entrega da notificação depende de arquitetura não confirmada.

## Matriz de condições de teste

| # | Condição | Origem | Resultado esperado | Prioridade | Camada |
| --- | --- | --- | --- | --- | --- |
| 1 | Encerrar alerta ativo com justificativa | [ESPECIFICADO: AC1] | Status passa a 'encerrado' e a justificativa é persistida | P1 | INTEGRAÇÃO/API |
| 2 | Encerrar alerta com justificativa vazia | [DERIVADO: particionamento de equivalência] | Ação bloqueada com mensagem de validação [ESPECIFICADO: AC2] | P1 | INTEGRAÇÃO/API |
| 3 | Encerrar alerta já encerrado | [DERIVADO: transição de estado] | [INDEFINIDO → Pergunta 1] | P1 | INTEGRAÇÃO/API |
| 4 | Operador sem papel de despacho encerra alerta | [DERIVADO: ângulo silencioso, autorização] | [INDEFINIDO → Pergunta 2] | P1 | INTEGRAÇÃO/API |
| 5 | Dois operadores encerram o mesmo alerta ao mesmo tempo | [DERIVADO: ângulo silencioso, concorrência] | [INDEFINIDO → Pergunta 3] | P2 | INTEGRAÇÃO/API |

## Análise de risco

P1: 4, P2: 1, P3: 0. O risco maior está nas condições 3 e 5: ambas corrompem o estado do alerta.

Motivos por condição: `#1`: jornada principal. `#3`: risco de encerramento duplicado. `#5`: risco de lost update.

## Cenários P1 em Gherkin

Cenário: operador encerra um alerta ativo
  Dado que o alerta AL-77 está ativo para o veículo PLT-1023
  Quando o operador o encerra com a justificativa "rota de manutenção"
  Então o status do alerta passa a 'encerrado'
  E a justificativa é gravada com o identificador do operador

## Auditoria de automatizabilidade

A condição 5 exige controle de requisições concorrentes: [BLOQUEADOR: provisionamento de massa de teste] até existir uma fixture de alerta. Ação: pedir ao DEV um endpoint de fixture.

## Impacto de regressão

A listagem do painel de alertas filtra por status, então o encerramento afeta os contadores do painel. Verificação: condição 1 mais a suíte existente de listagem.

## Decisões da sabatina

- A justificativa é obrigatória? -> sim, texto livre, mínimo de um caractere (PO, 2026-04-21)

## Perguntas em aberto

1. [PO] O que acontece ao encerrar um alerta já encerrado? -> define o resultado esperado da condição 3 (questionário: nenhum)
2. [PO] Quais papéis além do operador de despacho podem encerrar um alerta? -> define a condição 4 (questionário: nenhum)
3. [DEV] Existe lock no encerramento do alerta? -> define a condição 5 e sua camada (questionário: questionario-dev.md)

## Veredito de cobertura

🔶 PARCIALMENTE EXECUTÁVEL: condições P1 1 e 2 executáveis; condições 3 e 4 aguardam as perguntas 1 e 2 e a condição 5 aguarda remoção de bloqueador.

> ⚠️ Esta saída é a base analítica de um plano de testes, não o plano final. Decisões de cobertura, priorização e esforço são do time de QA, com validação do PO (comportamentos indefinidos) e do Dev (arquitetura e camadas).
