# Sabatina no lugar de oráculo de uma rodada

Os copilots originais recebiam um input e devolviam nove seções de uma vez. A seção "Perguntas em Aberto" era a fronteira de uma entrevista entregue como documento, porque o prompt não podia perguntar; cada `[A CONFIRMAR COM PO]` era uma pergunta nunca feita. Os outputs reais mostravam o custo: aviso final ausente em três de quatro artefatos, estimativa de esforço proibida, marcadores inventados fora do vocabulário.

Decidimos que todo fluxo **entrevista antes de sintetizar**, usando a skill `socratic-examination` como primitiva: a fronteira inteira por rodada, numerada, com resposta recomendada e base; fatos são trabalho do agente, decisões são do PO; a síntese só acontece com a fronteira vazia ou por pedido do PO. A inferência documentada vira a resposta recomendada; a lacuna vira pergunta; só o que ninguém pôde responder permanece como marcador no artefato final, e vai por questionário a quem pode.

A exceção é `/meeting-minutes`, que continua síntese sem entrevista porque a reunião já aconteceu; seus acordos presumidos vão por questionário aos participantes.

Consideramos o formato de uma pergunta por vez e rejeitamos: para sabatina com PO, rodadas com toda a fronteira e resposta recomendada vencem, porque o PO aceita a recomendação em uma palavra e vê de uma vez o que ainda falta decidir.

Consequência: as regras de rigor que os quatro prompts duplicavam vivem uma vez em `requirements-rigor`, invocada pelo modelo, e os fluxos apontam para ela. Um fluxo cabe numa sessão e publica no tracker; o seguinte lê o artefato, não a conversa.
