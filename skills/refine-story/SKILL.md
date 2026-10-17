---
name: refine-story
description: Sabatina uma User Story escrita pelo PO até ela estar pronta para planning, e publica a versão refinada no tracker com veredito.
disable-model-invocation: true
argument-hint: "[caminho, ID ou texto da US]"
---

# Refinar US

Refine uma User Story por **sabatina**: entrevista o PO em rodadas até a fronteira de decisões esvaziar, depois sintetiza. Uma boa sessão transforma um refinamento de 40 minutos em um de 10, porque o time chega à cerimônia com as decisões tomadas e as lacunas nomeadas.

A história pertence ao PO. Você audita, propõe e pergunta; toda alteração preserva o objetivo de negócio original, e uma reescrita que exigiria decisão de escopo vira pergunta, não decisão sua. O risco de invenção é alto aqui: uma US existente parece "quase pronta" e a tentação de completar é forte. Uma US com lacuna marcada vale mais para o refinamento do que uma "completa" com regras que o PO nunca escreveu.

US: $ARGUMENTS

## Antes de começar

Leia `docs/agents/refinement.md` do workspace: ele diz o **modo** (com código ou sem código), o **idioma** (`en-US` ou `pt-BR`, padrão `en-US`), os slugs e onde cada fluxo publica. Faltando, peça ao usuário para rodar `/configure-refinement` e pare. Toda a condução da sabatina, perguntas e o artefato sintetizado seguem o idioma configurado.

## Passos

1. **Carregar.** Leia a US (caminho, ID no tracker ou texto colado), o `CONTEXT.md`, os ADRs da área, e chame a Skill tool para `requirements-rigor`. Se já existe `.scratch/<slug>/` para esta US, leia o que há: uma sessão anterior pode ter resolvido perguntas, e você não as refaz. O slug segue `docs/agents/refinement.md`. `docs/adr/` ou `.scratch/` ausentes: siga sem avisar.
   Concluído quando: você consegue classificar a US em uma linha: ANALISÁVEL (tem narrativa e algum critério, mesmo ruim), ESQUELETO (só título, ou narrativa sem critério) ou NÃO É US (épico disfarçado, task técnica, requisito não funcional solto).

2. **Triar.** NÃO É US: diga qual artefato é, por quê em duas ou três linhas, e o tratamento que corresponde ao artefato: épico disfarçado, decompor com `/requirements-discovery`; task técnica, reclassificar como task; requisito não funcional solto, mover para a lista de requisitos não funcionais. Se o item vive no workspace, acrescente `Status: não é US` e o motivo abaixo do título, para deixar rastro. Pare aqui. ESQUELETO: siga, e a primeira rodada pergunta os cenários que faltam em vez de inventá-los.
   Concluído quando: a classificação foi dita em uma linha e, no caso NÃO É US, o motivo e o tratamento também.

3. **Auditar em silêncio.** Aplique as réguas de `requirements-rigor` à narrativa e a cada critério: INVEST, Gherkin, anti-padrões (leia o `ANTI-PADROES.md` dela à parte; a Skill tool não o carrega), termos que sempre viram pergunta. Cada achado vira uma pergunta candidata, ou uma correção que preserva exatamente o comportamento descrito: conversão de prosa para Gherkin, DoD removida dos critérios, task movida para as notas.
   Concluído quando: cada critério tem um destino (mantém, converte, move, pergunta) e cada termo ambíguo tem uma pergunta candidata.

4. **Buscar fatos antes de perguntar.** Fatos são trabalho seu, nunca do PO. Para cada pergunta candidata, procure a resposta nas fontes do workspace: glossário, histórias anteriores em `.scratch/`, documentos anexados pelo PO. No modo com código, despache um subagente para procurar no código o que a US afirma ou pressupõe: a regra já existe? o limite já está implementado? a integração já funciona? Fato encontrado vira resposta recomendada com a fonte. No modo sem código a busca se limita aos arquivos do workspace, sem subagente; se nada for encontrado, diga isso em uma linha no topo da rodada 1.
   Concluído quando: cada pergunta candidata está marcada como respondida por fonte (com a citação) ou aberta para o PO.

5. **Sabatinar.** Chame a Skill tool para `socratic-examination` e siga a disciplina dela: rodadas, fronteira, resposta recomendada com base ou "sem recomendação", fatos seus e decisões do PO, glossário atualizado na hora. A rodada 1 abre com a triagem em uma linha, marca quais perguntas bloqueiam o veredito, e fecha com uma nota dos critérios movidos sem pergunta e das perguntas que foram para o time de desenvolvimento. Perguntas de arquitetura não entram na rodada com o PO: vão direto para as perguntas em aberto com destinatário time de desenvolvimento. Pergunta que o PO não sabe responder recebe `[A CONFIRMAR: quem]` e sai da fronteira.
   Concluído quando: a fronteira está vazia, ou o PO pediu para fechar com o que há.

6. **Sintetizar.** Escreva a US refinada no formato de [TEMPLATE.md](TEMPLATE.md), com as lacunas que sobraram visíveis como marcadores. Execute a autoauditoria Gherkin. Dê o veredito: PRONTA, REFINAR com os números das perguntas que destravam, ou BLOQUEADA com o motivo. Havendo `[DECOMPOR]`, inclua a proposta de divisão: narrativa de cada parte e qual critério original vai para qual.
   Concluído quando: o arquivo existe no local que `docs/agents/refinement.md` define, com a linha `Status:` igual ao veredito e o aviso final presente.

7. **Encaminhar o que ficou aberto.** Para cada destinatário fora da sessão com `[A CONFIRMAR]`, escreva um questionário no formato de `QUESTIONARIO.md` de `requirements-rigor`, ao lado da US refinada, e aponte o arquivo a partir da seção de perguntas em aberto.
   Concluído quando: nenhum `[A CONFIRMAR]` ficou sem destinatário ou sem questionário.

8. **Reportar.** Diga ao usuário em poucas linhas: veredito, onde a US foi publicada, quais perguntas destravam, e os questionários gerados.

## Exemplo de rodada

Para a US "Como usuário, quero exportar os relatórios em PDF para facilitar o compartilhamento. AC1: o botão de exportar deve funcionar corretamente. AC2: criar o serviço de geração de PDF no backend. AC3: o PDF deve abrir rápido. AC4: código revisado e testes passando.", num workspace sem código cujo glossário lista analista de operações e gestor de contas como quem consome relatórios, a primeira rodada se parece com:

❓ **Q1. Quem exporta?** (bloqueante)
A narrativa diz "usuário". O glossário lista analista de operações e gestor de contas como quem consome relatórios. Qual papel exporta, ou os dois?
**Recomendação:** analista de operações [INFERÊNCIA: é o papel que o glossário associa a "relatório operacional"]. Sem isso, permissões ficam indefinidas e a narrativa reprova no INVEST.

❓ **Q2. O que é "abrir rápido"?** (bloqueante)
AC3 não é testável e admite duas leituras: o tempo entre acionar a exportação e o download iniciar, ou o tempo para o arquivo abrir no leitor. Qual das duas, e qual o número máximo em segundos?
**Recomendação:** sem recomendação: o texto não dá base para a leitura nem para o número. Se não houver expectativa definida, registro `[A CONFIRMAR: PO]`, porque esse glossário não indica quem define SLA, e sigo.

❓ **Q3. Edge cases**
O texto sugere relatório vazio e relatório de grande volume [INFERÊNCIA: relatórios têm volume variável]. Quais importam para esta entrega?
**Recomendação:** os dois entram como cenários [INFERÊNCIA: decorrem do próprio texto]. O comportamento de cada um é decisão sua: sem recomendação. O volume máximo depende da resposta da Q2.

AC2 e AC4 não geram pergunta: AC2 é task de implementação cujo comportamento habilitado é o próprio AC1, e vai para as notas; AC4 é Definition of Done do time e sai dos critérios. Os dois aparecem na auditoria do artefato final, movidos, não apagados.

## Aviso final

Todo artefato publicado termina com:

> ⚠️ Este output é preparação para o refinamento, não o substitui. A decisão sobre escopo, valor e prioridade é do PO e do time.
