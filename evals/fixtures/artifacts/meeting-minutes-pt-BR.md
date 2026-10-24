# Ata: alinhamento do Projeto Frota

Status: rascunho
Azure: nenhum
Data: 2026-04-14 | Duração: 52 | Participantes: Marcus: consultor, Carlos: diretor de operações, Priya: TI
Projeto: MVP de telemetria da frota

### 0. Triagem

ÍNTEGRA. [POSSÍVEL ERRO DE TRANSCRIÇÃO: "telimetria" -> "telemetria", conforme glossário, 2 ocorrências]. Glossário aplicado: telemetria.

### 1. Resumo executivo

- Alertas de velocidade confirmados no escopo do MVP.
- A coleta de requisitos de telemetria passou de Marcus para Priya, que tem contato com o fornecedor.
- Pendente de confirmação: integração SAP fora do MVP.
- Treinamento de motoristas levantado como intenção, sem responsável.

### 2. Decisões registradas (apenas DITO)

- **Decisão:** alertas de velocidade entram no MVP
  **Proveniência:** [DITO: Carlos, "tem que estar no MVP, sem isso não apresento ao board"] (confirmado por Marcus, "fechado")
  **Contexto:** a apresentação ao board depende da demo de alertas
  **Impacto:** detecção e notificação entram no backlog do MVP

### 3. Tabela de ações

| ID | Ação | Responsável | Prazo | Prioridade | Proveniência | Observações |
| --- | --- | --- | --- | --- | --- | --- |
| A01 | Levantar requisitos de telemetria com o fornecedor | Priya | 2026-04-20 | Medium [EST] | [DITO: Priya, "consigo, mas só na semana que vem"] | [substitui: Marcus, ~12min, "até quinta"]. Reunião 2026-04-14 + "semana que vem" = semana de 04-20, dentro do ciclo atual |
| A02 | Confirmar contrato e SLA do fornecedor | [A DEFINIR] | [A DEFINIR] | Low [EST] | [DITO: Marcus, "alguém tem que ver o contrato"] | Sem responsável falado |
| A03 | Avaliar formato do treinamento de motoristas | [A DEFINIR] | [A DEFINIR] | n/a | [DITO: Carlos, "a gente devia pensar em treinamento em algum momento"] | [ACOMPANHAMENTO] |

### 4. Acordos presumidos, a confirmar

- **Acordo presumido:** integração SAP fora do MVP
  **Base:** [PRESUMIDO: proposta de Priya em ~18min seguida de mudança de assunto sem objeção]
  **Confirmar com:** Carlos e Marcus
  **Se confirmado, torna-se:** decisão de escopo do MVP

### 5. Ações presumidas

- Escrever a regra de limiar do alerta -> decorre de: decisão 1 -> sem candidato

### 6. Perguntas em aberto

- Quem é responsável pela revisão do contrato do fornecedor? + proveniência [DITO: Marcus] | destinatário [A DEFINIR] | bloqueia a ação A02

### 7. Ações em JSON

```json
[
  {
    "title": "Levantar requisitos de telemetria com o fornecedor",
    "assignee": "Priya",
    "priority": "Medium",
    "dueDate": "2026-04-20",
    "epicLink": null,
    "labels": ["meeting-action"],
    "description": "O contato com o fornecedor é da Priya (dito em ~30min). Substitui o compromisso assumido por Marcus em ~12min."
  },
  {
    "title": "Confirmar contrato e SLA do fornecedor",
    "assignee": null,
    "priority": "Low",
    "dueDate": null,
    "epicLink": null,
    "labels": ["meeting-action"],
    "description": "PENDENTE: definir responsável antes de mover para Em andamento. Levantado por Marcus em ~40min."
  }
]
```

### 8. Autoverificação

Autoverificação: OK. 2 ações reais na tabela, 2 objetos no JSON, acompanhamento excluído, prioridades idênticas.

> ⚠️ Esta ata é um rascunho gerado por IA a partir de uma transcrição. Exige validação dos participantes antes de circular como registro oficial, em especial os Acordos Presumidos, que não foram verbalizados explicitamente e precisam de confirmação.
