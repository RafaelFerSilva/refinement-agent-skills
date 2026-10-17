# Ata: <título da reunião>

Status: rascunho
Azure: <ID ou nenhum>
Data: <AAAA-MM-DD> | Duração: <minutos> | Participantes: <nome: papel, ...>
Projeto: <uma linha>

### 0. Triagem

<ÍNTEGRA | DEGRADADA com resumo das lacunas | INSUFICIENTE>. Erros de transcrição detectados. Glossário aplicado: <termos dos metadados usados na ata>. Nota de trecho pessoal omitido, se houver, sem o conteúdo.

### 1. Resumo executivo

4 a 6 bullets, cada um uma decisão, alinhamento ou blocker, compreensível por quem não estava. Acordos presumidos entram só como "pendente de confirmação: ...".

### 2. Decisões registradas (DITO apenas)

- **Decisão:** <o que foi decidido>
  **Proveniência:** [DITO: falante, "paráfrase"] (+ nota de reversão, se houve)
  **Contexto:** <por quê>
  **Impacto:** <o que muda>

### 3. Tabela de ações

| ID | Ação | Responsável | Prazo | Prioridade | Proveniência | Observação |
| --- | --- | --- | --- | --- | --- | --- |

Responsável: nome dito ou [A DEFINIR]. Prazo: data dita em ISO; implícito, em palavras mais a data calculada quando a aritmética for possível; ausente, [A DEFINIR]. Prioridade: escala Jira mais [CTX] ou [EST], aritmética na observação quando [EST]. [ACOMPANHAMENTO] para intenção sem dono ou verbo executável: Responsável e Prazo `[A DEFINIR]`, Prioridade `n/a`.

### 4. Acordos presumidos, confirmar

- **Acordo presumido:** <o que parece acordado>
  **Base:** [PRESUMIDO: padrão, com minuto]
  **Confirmar com:** <participantes>
  **Se confirmado, vira:** <decisão | ação, para quem>

Seção vazia: "Nenhum acordo presumido detectado."

### 5. Ações presumidas

- <tarefa> → decorre de: decisão <n> → <candidato natural, se o papel nos metadados indicar; senão "sem candidato">

### 6. Perguntas em aberto

- <pergunta ou incerteza> + proveniência [DITO: falante] | quem responde (ou [A DEFINIR]) | bloqueia a ação <ID>?

Inclui lacunas de transcrição com possível conteúdo, retratações ambíguas, falantes não identificados com compromisso.

### 7. Ações em JSON

Só ações reais da tabela, sem [ACOMPANHAMENTO] e sem presumidas.

```json
[
  {
    "title": "descrição clara e específica da ação",
    "assignee": "nome falado ou null",
    "priority": "Highest | High | Medium | Low",
    "dueDate": "YYYY-MM-DD ou null",
    "epicLink": null,
    "labels": ["meeting-action"],
    "description": "contexto para o executor + proveniência (falante, ~minuto) + pendências"
  }
]
```

dueDate só ISO 8601 ou null; prazo implícito sem data calculável vai em palavras na description. assignee [A DEFINIR] vira null com a primeira linha da description "PENDENTE: definir responsável antes de mover para In Progress". priority igual à tabela, sem remapeamento.

Notas de importação: (1) assignee usa o nome falado; mapear para as contas do tracker antes de importar; (2) epicLink: vincular manualmente ao épico após a importação.

### 8. Autoverificação

"Autoverificação: OK" ou o que foi corrigido.

⚠️ Esta ata é um rascunho gerado por IA a partir da transcrição. Requer validação dos participantes antes de circular como registro oficial, em especial os Acordos Presumidos, que não foram verbalizados e precisam de confirmação explícita.

### Insumo para discovery

Arquivo `discovery-input.md` ao lado da ata:

```md
# Insumo para discovery: <título da reunião>

Status: rascunho
Azure: <ID ou nenhum>
Origem: ata em <caminho>

## <Falante, papel>

- <trecho com conteúdo de requisito: necessidade, capacidade ou restrição verbalizada, com ~minuto>

## Acordos presumidos (não confirmados)

- <acordo> [PRESUMIDO: base]

## Lacunas que o discovery precisa fechar

- <o que ninguém disse e uma história vai precisar>

⚠️ <o mesmo aviso final da ata>
```
