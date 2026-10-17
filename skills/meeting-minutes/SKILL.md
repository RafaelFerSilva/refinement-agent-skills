---
name: meeting-minutes
description: Transforma uma transcrição de reunião em ata auditável: decisões e ações com proveniência, acordos presumidos para confirmar por questionário, ações em JSON e insumo para o discovery.
disable-model-invocation: true
argument-hint: "[caminho da transcrição ou cole o texto; 'modo ações' para só a tabela]"
---

# Ata de reunião

Processe uma transcrição e gere um registro estruturado e **auditável**. Ata vira fato: três semanas depois alguém vai citar este documento como prova do que ficou combinado. Por isso tudo que você registra é rastreável à transcrição, e tudo que você presume fica visivelmente separado do que foi dito. Registrar é atestar; sua análise nunca se disfarça de fala dos participantes.

Este fluxo é síntese, sem entrevista: a reunião já aconteceu. O que ele deixa aberto vai para quem pode responder, por questionário, e o que tem conteúdo de requisito vai para `/requirements-discovery`.

Transcrição: $ARGUMENTS

## Fronteira de proveniência

A base é `requirements-rigor`; aqui ela assume três formas:

- `[DITO: falante, "paráfrase curta"]` (en-US: `[STATED: speaker, "short paraphrase"]`): consta na transcrição. Toda ação, decisão e prioridade carrega quem disse e uma paráfrase de 5 a 15 palavras. Paráfrase honesta basta para auditoria.
- `[PRESUMIDO: base]` (en-US: `[ASSUMED: base]`): sua análise inferiu de um padrão da conversa: silêncio após proposta, "ok" ambíguo, tarefa que decorre de uma decisão mas ninguém assumiu. Presumido nunca entra em Decisões, Tabela de Ações ou JSON; vive nas seções de presunção, com o trecho e quem deve confirmar.
- `[A DEFINIR]` (en-US: `[TO BE DEFINED]`): responsável ou prazo não mencionado nem presumível. O placeholder é a resposta correta.

Teste rápido: "se o participante ler esta linha e disser 'eu nunca falei isso', consigo apontar o trecho?" Sim: DITO. "Não falou, mas deu a entender": PRESUMIDO. Nem isso: A DEFINIR, ou fora da ata. Os demais marcadores de `requirements-rigor`, como `[INFERÊNCIA: base]` (ou `[INFERENCE: base]`), continuam válidos.

## Passos

1. **Metadados.** Leia `docs/agents/refinement.md` do workspace para identificar o idioma configurado (`en-US` ou `pt-BR`, padrão `en-US`) e onde publicar. Ata, questionários e insumos gerados seguem esse idioma. Título, data, duração, participantes com papéis, projeto, glossário de termos que a transcrição automática distorce. A data é obrigatória: a aritmética de prazos depende dela. Se faltar, pergunte em uma linha antes de seguir. Leia `CONTEXT.md` para o glossário quando houver.
   Concluído quando: data e participantes estão conhecidos.

2. **Triar.** ÍNTEGRA (contínua, falantes identificáveis), DEGRADADA (trechos inaudíveis, falantes trocados, cortes), INSUFICIENTE (fragmento curto demais, ou não é a reunião dos metadados). INSUFICIENTE: diga e pare; ata de fachada circula como registro oficial. DEGRADADA: cada lacuna que possa ter contido ação ou decisão vira pergunta em aberto ("trecho inaudível aos ~12min logo após proposta de X"); a lacuna nunca é reconstruída. Termo distorcido: use a forma do glossário e marque `[POSSÍVEL ERRO DE TRANSCRIÇÃO: original → adotada]` na seção 0 e use só a forma adotada no corpo. Conteúdo pessoal, saúde, família, comentários sobre ausentes: fora da ata em qualquer seção; um compromisso de projeto embutido em contexto pessoal entra sem a circunstância. Falante não identificado com compromisso: responsável `[A DEFINIR: falante não identificado aos ~Xmin]` e pergunta em aberto. Uma nota de que um trecho pessoal foi omitido pode ficar na triagem, sem o conteúdo; prazo que só existe dentro do trecho pessoal entra em palavras, sem a circunstância.
   Concluído quando: a triagem está escrita na seção 0 com os erros de transcrição detectados.

3. **Extrair.** Aplique as regras de [REGRAS.md](REGRAS.md): retratação e supersedência, granularidade de ações, prioridade com proveniência, o que conta como decisão.
   Concluído quando: cada decisão e cada ação tem proveniência DITO, e cada presunção está nas seções 4 ou 5.

4. **Escrever a ata** no formato de [TEMPLATE.md](TEMPLATE.md). Em "modo ações", só as seções 3, 6 e 7.
   Concluído quando: o arquivo existe em `.scratch/<projeto>-<AAAA-MM-DD>/ata.md`, ou onde `docs/agents/refinement.md` definir, com o aviso final.

5. **Autoverificar** e reportar em uma linha na seção 8: toda ação real da tabela tem objeto no JSON e nenhum objeto do JSON está fora da tabela; toda linha e decisão tem DITO; nenhum PRESUMIDO vazou; prioridades idênticas entre tabela e JSON; datas do JSON em ISO ou null.
   Concluído quando: a seção 8 diz "OK" ou o que foi corrigido.

6. **Encaminhar.** Acordos presumidos e perguntas em aberto com destinatário fora da sessão: escreva um questionário por destinatário no formato de `QUESTIONARIO.md` de `requirements-rigor`, ao lado da ata, e aponte cada um a partir da seção que o gerou. Trechos com conteúdo de requisito (necessidades, capacidades, restrições verbalizadas): escreva `discovery-input.md` ao lado da ata, no formato do fim de [TEMPLATE.md](TEMPLATE.md), e diga ao usuário que `/requirements-discovery` parte dele.
   Concluído quando: cada acordo presumido tem destinatário e questionário, e o insumo para discovery existe quando a reunião tinha conteúdo de requisito.

## Aviso final

> ⚠️ Esta ata é um rascunho gerado por IA a partir da transcrição. Requer validação dos participantes antes de circular como registro oficial, em especial os Acordos Presumidos, que não foram verbalizados e precisam de confirmação explícita.
