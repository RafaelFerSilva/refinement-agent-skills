# Test design

Referência de `/qa-plan`: as técnicas que geram condições, os ângulos que USs nunca escrevem, e as réguas de risco, camada e automatizabilidade que priorizam o plano.

## Técnicas de derivação

Para cada critério, avalie quais se aplicam e derive. Técnica não aplicável não é forçada.

- **Particionamento de equivalência**: classes de entrada ou estado com o mesmo comportamento esperado. Uma condição por classe válida e por classe inválida.
- **Análise de valor limite**: para toda faixa, limite ou tamanho especificado, o valor no limite, imediatamente abaixo e imediatamente acima. Limite não especificado: a existência do limite é `[INDEFINIDO → Pergunta]`.
- **Tabela de decisão**: quando o comportamento depende de combinações (regras com E ou OU, perfil × estado). Combinação cujo resultado a especificação não define: `[INDEFINIDO]`.
- **Transição de estados**: entidade com ciclo de vida (status, fluxo de aprovação). Mapeie estados e transições válidas e derive testes para as transições inválidas, onde bugs de estado vivem. Transição não mencionada: `[INDEFINIDO]`.
- **Pairwise**: três ou mais variáveis independentes com vários valores e combinação completa inviável. Proponha o conjunto pairwise e declare o que fica de fora.
- **Casos negativos**: para cada ação especificada, ação sem permissão, sobre recurso inexistente, duplicada (idempotência), com entrada malformada. Resultado não especificado: `[INDEFINIDO]`.

## Ângulos silenciosos

Verifique todos; reporte só os aplicáveis. Ângulo irrelevante listado é ruído que ensina o time a ignorar a seção. Cada ângulo aplicável gera condição `[DERIVADO: ângulo silencioso]` ou pergunta `[INDEFINIDO]`.

- **Autorização**: quem não pode executar esta ação? O acesso negado está coberto?
- **Dados sensíveis**: os dados desta US aparecem em logs, mensagens de erro, URLs ou exports? Há regulação aplicável no contexto?
- **Concorrência**: dois atores sobre o mesmo recurso ao mesmo tempo. Qual ganha? Há lost update?
- **Idempotência**: a mesma ação duas vezes (duplo clique, retry de rede) produz efeito duplicado?
- **Falha parcial**: operação com mais de um passo ou sistema que falha no meio. Qual o estado resultante? É recuperável?
- **Fuso e tempo**: datas, prazos, agendamento. Virada de dia, fuso do usuário contra o do servidor, horário de verão.
- **Encoding**: acentos, emojis, caracteres especiais, quando há texto livre.

## Risco e prioridade

Para cada condição, probabilidade de falha (Alta, Média, Baixa: complexidade da lógica, histórico da área se o contexto o traz, integrações envolvidas) e impacto (Alto, Médio, Baixo: consequência para o negócio conforme o que a US e o contexto declaram, sem cenários catastróficos inventados).

- **P1**: automatizar e rodar em toda execução.
- **P2**: automatizar; pode rodar em ciclo mais espaçado.
- **P3**: candidato a exploratório ou verificação pontual.

Justifique em meia linha por condição, numa lista na análise de risco. Impacto que depende de informação de negócio ausente: INDETERMINADO mais pergunta.

## Camada

A camada mais barata que verifica a condição com confiança:

- **UNIDADE**: lógica pura, cálculo, validação isolada.
- **INTEGRAÇÃO/API**: contrato entre componentes, persistência, regra que atravessa módulos.
- **E2E/UI**: só onde a jornada do usuário é o objeto do teste: o happy path da jornada principal e condições em que o fluxo visual é o próprio requisito.

Empurrar tudo para E2E é o anti-padrão a combater. Condição verificável em camada mais baixa vai para lá, com o porquê. Camada que depende de arquitetura desconhecida: `[CAMADA A VALIDAR COM DEV]` com as opções.

## Automatizabilidade

Gherkin impecável pode ser inautomatizável. Para cada cenário P1 e P2, os quatro bloqueadores:

- **Dependência externa**: sistema de terceiro sem mock, stub ou sandbox confirmado no contexto: `[BLOQUEADOR: dependência externa sem estratégia de isolamento]`.
- **Massa de dados**: estado inicial do `Dado` que só existe em produção ou nasce à mão: `[BLOQUEADOR: provisionamento de massa]`.
- **Observabilidade**: resultado do `Então` invisível externamente: `[BLOQUEADOR: resultado não observável]`.
- **Controle de tempo**: cenário que depende de passagem de tempo, agendamento ou expiração sem relógio controlável: `[BLOQUEADOR: relógio não controlável]`.

Cenário com bloqueador não vira teste manual por padrão: primeiro a pergunta ou ação que remove o bloqueador; `[MANUAL-ONLY]` é o último recurso, justificado.

## Impacto de regressão

Só a partir do que a US e o contexto declaram sobre o sistema existente: fluxos que a US toca, o que pode quebrar em silêncio em cada um, e qual verificação cobre. Sem contexto sobre o sistema existente, diga isso e formule as perguntas de impacto para DEV; arquitetura que você não conhece gera pergunta, não dedução.

## Exemplo de matriz

US já refinada: "Como analista financeiro, quero aprovar solicitações de reembolso de até R$ 500,00, para que reembolsos de baixo valor não dependam do gestor. AC1: Dado uma solicitação de valor menor ou igual a R$ 500,00 em estado 'pendente', Quando o analista aprova, Então o estado muda para 'aprovada' e o solicitante é notificado. AC2: Dado uma solicitação acima de R$ 500,00, Quando o analista tenta aprovar, Então o sistema bloqueia a ação e informa que a aprovação requer gestor."

| # | Condição | Origem | Resultado esperado | Prio | Camada |
| --- | --- | --- | --- | --- | --- |
| 1 | Aprovar solicitação de R$ 499,99 pendente | [ESPECIFICADO: AC1] | Estado 'aprovada' e notificação enviada | P1 | INTEGRAÇÃO/API |
| 2 | Aprovar solicitação de exatamente R$ 500,00 | [DERIVADO: valor limite] | Estado 'aprovada' (AC1 diz "até", inclusivo) | P1 | INTEGRAÇÃO/API |
| 3 | Tentar aprovar R$ 500,01 | [DERIVADO: valor limite] | Bloqueio e mensagem de gestor [ESPECIFICADO: AC2] | P1 | INTEGRAÇÃO/API |
| 4 | Aprovar solicitação de R$ 0,00 | [DERIVADO: valor limite] | [INDEFINIDO → Pergunta 1] | P2 | INTEGRAÇÃO/API |
| 5 | Tentar aprovar solicitação já 'aprovada' | [DERIVADO: transição de estados] | [INDEFINIDO → Pergunta 2] | P1 | INTEGRAÇÃO/API |
| 6 | Usuário sem papel de analista tenta aprovar | [DERIVADO: ângulo silencioso, autorização] | [INDEFINIDO → Pergunta 3] | P1 | INTEGRAÇÃO/API |
| 7 | Falha no envio da notificação após mudança de estado | [DERIVADO: ângulo silencioso, falha parcial] | [INDEFINIDO → Pergunta 4] | P2 | [CAMADA A VALIDAR COM DEV: síncrona ou assíncrona] |
| 8 | Jornada completa: analista localiza, aprova e vê confirmação | [ESPECIFICADO: narrativa] | Fluxo conclui com estado e notificação do AC1 | P1 | E2E |

Perguntas: 1. [PO] Solicitação de R$ 0,00 ou valor negativo pode existir e ser aprovada? 2. [PO] O que acontece ao tentar aprovar solicitação que não está 'pendente'? A condição 5 é P1 por risco de pagamento duplicado. 3. [PO] Algum outro papel aprova até R$ 500? 4. [DEV] A notificação é síncrona ou assíncrona? Se falhar, a aprovação persiste?

Repare: toda condição derivada nomeia a técnica; nenhum resultado foi inventado; a regra central (o limite exato) concentra a prioridade; só a jornada justifica E2E; e no modo com código a pergunta 4 é respondida lendo o código, não perguntando.
