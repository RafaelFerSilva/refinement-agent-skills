# Regras de síntese

## Retratação e supersedência

Transcrições reais mudam de ideia.

- O último compromisso ou decisão sobre um tema prevalece.
- O superado não desaparece: a linha vigente leva a nota `[substitui: versão anterior, falante, ~minuto]`. Ação assumida por Carlos aos 12min e transferida para Priya aos 30min é uma linha, responsável Priya, com a nota. Nunca duas linhas para o mesmo compromisso.
- Decisão revertida na própria reunião: só a final, com a nota de reversão no Contexto.
- Aceite condicional sem réplica ("consigo, mas só na semana que vem"): a versão condicional vigora, com a condição registrada na linha, e o aceite do novo prazo pelos demais vira pergunta em aberto.
- Retratação ambígua, a transcrição termina sem resolver qual versão vale: pergunta em aberto, nunca escolha silenciosa.

## Granularidade de ações

- Um compromisso individual é uma linha. Dois participantes assumindo ações sobre o mesmo tema são duas linhas. Responsáveis diferentes nunca se agrupam.
- "Vamos pensar nisso", "seria bom olhar", sem dono nem verbo executável: `[ACOMPANHAMENTO]` na tabela, sem objeto no JSON.
- Ação que decorre de uma decisão mas ninguém assumiu verbalmente: seção 5 (Ações Presumidas), com a base. Não entra na tabela.

## Prioridade

Uma escala só, nas duas saídas: Highest, High, Medium, Low.

- `[CTX]` quando a urgência foi verbalizada ("isso trava a sprint", "antes do dia 20"); cite na observação.
- `[EST]` quando você inferiu de prazo ou contexto, pela régua: Highest bloqueia entrega ou sprint, dito ou evidente pela cadeia de dependência declarada na reunião; High tem prazo dito a menos de 48h da data da reunião; Medium tem prazo dentro do ciclo corrente mencionado; Low não tem urgência mencionada.
- Aritmética de datas sempre exposta na observação: "reunião 14/04 + 'até quinta' = 16/04, menos de 48h, High [EST]".
- Sem prazo e sem urgência verbalizada: Low `[EST: nenhuma urgência mencionada]`.

## Decisões

- A seção Decisões Registradas aceita apenas DITO: alguém verbalizou a decisão ou a concordância ("fechado", "vamos por esse caminho", "aprovado").
- Silêncio após proposta, "uhum", mudança de assunto sem objeção: acordo presumido (seção 4), com o trecho e quem confirma. Detectar o padrão é sua análise legítima; registrá-lo como decisão seria atestar o que não aconteceu.

## Exemplo

Metadados: reunião de alinhamento, Projeto Frota, 14/04/2026. Marcus (consultor), Carlos (diretor de operações), Priya (TI). Glossário: "telemetria", que a transcrição grafa "telimetria".

Transcrição: aos ~05min Carlos diz "os alertas de velocidade têm que entrar no MVP, sem isso não apresento pro board" e Marcus responde "fechado, alertas no MVP então". Aos ~12min Marcus: "eu levanto os requisitos de telimetria com o fornecedor até quinta". Aos ~18min Priya: "sugiro deixarmos a integração SAP fora do MVP, vira projeto separado", ninguém responde e a conversa muda para o cronograma. Aos ~30min Marcus: "pensando melhor, quem tem o contato do fornecedor é a Priya, você consegue levantar a telimetria?" e Priya: "consigo, mas só na semana que vem". Carlos: "a gente devia pensar em algum treinamento pros motoristas, em algum momento".

O que sai:

- Triagem: ÍNTEGRA. `[POSSÍVEL ERRO DE TRANSCRIÇÃO: "telimetria" → "telemetria", conforme glossário, 2 ocorrências]`.
- Decisão: alertas de velocidade entram no MVP. `[DITO: Carlos, "têm que entrar no MVP, sem isso não apresento pro board"; confirmado por Marcus, "fechado"]`.
- A01: levantar requisitos de telemetria com o fornecedor. Responsável Priya. Prazo: semana de 2026-04-20. Medium [EST]. `[DITO: Priya, "consigo, mas só na semana que vem"] [substitui: Marcus, ~12min, "até quinta"]`. Observação: "semana que vem" a partir de 14/04 é a semana de 20/04, dentro do ciclo corrente, Medium [EST].
- A02: avaliar formato de treinamento para motoristas. `[ACOMPANHAMENTO]`. `[DITO: Carlos, "a gente devia pensar em treinamento, em algum momento"]`. Sem dono nem prazo, sem objeto no JSON.
- Acordo presumido: integração SAP fica fora do MVP. `[PRESUMIDO: proposta de Priya aos ~18min seguida de mudança de assunto sem objeção nem confirmação]`. Confirmar com Carlos e Marcus. Se confirmado, vira decisão de escopo do MVP.
- JSON: um objeto, A01, assignee "Priya", priority "Medium", dueDate null (semana sem dia fixo, descrição em palavras na description).
- Autoverificação: OK, 1 ação real na tabela, 1 objeto no JSON, acompanhamento e presumido fora do JSON, prioridades idênticas.

Repare: a retratação virou uma linha com nota e aritmética exposta; o silêncio sobre o SAP não virou decisão; a intenção vaga não gerou card; o termo distorcido foi corrigido com sinalização; a semana sem dia fixo virou dueDate null.
