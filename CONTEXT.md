# Refinement Skills

Pacote de skills que leva requisitos de software, em pt-BR e en-US, da conversa ao plano de teste por sabatina. Este glossário define o vocabulário do pacote; o vocabulário do produto analisado vive no `CONTEXT.md` do workspace onde o pacote é instalado.

## Language

### Artefatos

**User Story**:
A unidade de requisito que o PO escreve e o time leva ao planning: narrativa mais critérios de aceite. Abreviada US em identificadores e nomes de skill.
_Avoid_: card, item, demanda, história (sozinha)

**Narrativa**:
A frase "Como [papel], quero [capacidade], para que [resultado]" que abre uma User Story.
_Avoid_: título, descrição, user story (para só esta frase)

**Critério de aceite**:
Um comportamento observável que prova a User Story entregue, escrito em Gherkin. Abreviado AC em identificadores.
_Avoid_: requisito, regra, teste, cenário (o cenário é a forma Gherkin de um critério)

**Candidata**:
Uma User Story produzida por `/requirements-discovery` a partir de input bruto, ainda não sabatinada com o PO.
_Avoid_: rascunho, draft, proposta

**Spec de discovery**:
O artefato de `/requirements-discovery`: domínios, stakeholders, épicos, decisões, dependências e as candidatas que ele gerou.
_Avoid_: PRD, documento de requisitos, levantamento

**Plano de QA**:
O artefato de `/qa-plan`: matriz de condições de teste com origem, risco, camada e bloqueadores. É a base do plano de teste, não o plano final.
_Avoid_: plano de teste (reservado ao artefato final do time de QA), casos de teste

**Ata**:
O artefato de `/meeting-minutes`: decisões e ações com proveniência, acordos presumidos separados do que foi dito.
_Avoid_: resumo, minutes, digest (fora do nome da skill)

### Sabatina

**Sabatina**:
A entrevista em rodadas que um fluxo conduz com o PO até a fronteira esvaziar. A skill `socratic-examination` é a primitiva que a conduz.
_Avoid_: entrevista, questionário (é outra coisa), interrogatório

**Rodada**:
Um conjunto de perguntas feitas de uma vez: toda a fronteira, numerada, cada uma com resposta recomendada. O PO responde, a fronteira se recalcula, vem a próxima rodada.
_Avoid_: turno, iteração

**Fronteira**:
As perguntas cujos pré-requisitos já estão resolvidos e que podem ser feitas agora sem adivinhar respostas ainda não dadas. A sabatina termina quando a fronteira está vazia.
_Avoid_: backlog de perguntas, pendências

**Fato**:
O que pode ser verificado numa fonte: glossário, história anterior, documento, código. Buscar fatos é trabalho do agente, nunca do PO.
_Avoid_: informação, dado

**Decisão**:
O que só o PO ou o time pode resolver: escopo, valor, prioridade, comportamento esperado não especificado. Nunca é tomada pelo agente.
_Avoid_: escolha, definição

**Resposta recomendada**:
A sugestão que acompanha cada pergunta da rodada, com a base que a sustenta. É a forma que uma inferência assume durante a sabatina.
_Avoid_: sugestão, palpite, default

**Questionário**:
O documento que um fluxo gera para quem não está na sessão responder depois. Recebe as perguntas que a sabatina não pôde fechar.
_Avoid_: formulário, lista de perguntas

### Rigor

**Inferência**:
Conclusão que decorre diretamente de uma frase do input ou de um fato, à qual outra pessoa chegaria lendo o mesmo material. Carrega sempre a base.
_Avoid_: suposição, dedução, assunção

**Invenção**:
Valor, regra ou comportamento sem base no material, mesmo que seja boa prática. Proibida; vira pergunta ou placeholder.
_Avoid_: alucinação, chute, gold plating (é o caso específico de escopo além do pedido)

**Marcador**:
Uma etiqueta entre colchetes no artefato que torna uma inferência ou uma lacuna visível: `[INFERÊNCIA: base]`, `[A CONFIRMAR: quem]` e os demais de `requirements-rigor`.
_Avoid_: tag, flag, anotação

**Lacuna**:
O que o material não diz e o artefato precisa dizer. Fica visível como marcador; um artefato limpo com lacunas escondidas é pior do que um com lacunas explícitas.
_Avoid_: gap, pendência, TBD

**Veredito**:
A conclusão de um fluxo sobre o artefato, sem meio-termo: PRONTA, REFINAR ou BLOQUEADA para uma User Story; EXECUTÁVEL, PARCIAL ou BLOQUEADO para um plano de QA. É a linha `Status:` do artefato.
_Avoid_: status (como palavra solta), nota, score

### Operação

**Fluxo**:
Uma skill invocada pelo usuário que conduz uma sabatina e publica um artefato: `/meeting-minutes`, `/requirements-discovery`, `/refine-story`, `/qa-plan`. Por baixo dos fluxos rodam as primitivas `sabatina` e `requirements-rigor`, invocadas pelo modelo.
_Avoid_: copilot, prompt, comando, agente

**Workspace**:
O repositório onde o pacote é instalado e as USs são analisadas. Tem `CONTEXT.md` do produto, `docs/agents/refinement.md` com o modo, e `.scratch/` com os artefatos.
_Avoid_: projeto (ambíguo com o produto), repo de análise

**Modo**:
Como o workspace responde perguntas de fato. **Com código**: o agente lê o código do produto. **Sem código**: o PO é a fonte e perguntas de arquitetura vão para o time por questionário.
_Avoid_: cenário, perfil, ambiente

**Idioma**:
A língua em que a sabatina acontece e os artefatos são gerados, definida por `Idioma:` em `docs/agents/refinement.md` do workspace: **en-US** (padrão) ou **pt-BR**.
_Avoid_: locale, linguagem (reservado para linguagem de programação ou termos do negócio)

**Tracker**:
Onde os artefatos são publicados, conforme `docs/agents/refinement.md` do workspace: arquivos em `.scratch/` com o ID do work item do Azure DevOps.
_Avoid_: backlog, Jira (o tracker é configurável), board

