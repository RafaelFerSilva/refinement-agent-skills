# Anti-padrões de requisito

Varra o texto em busca de cada um. Ocorrência recebe `[ANTI-PADRÃO: tipo]` inline e gera uma pergunta ou uma correção que preserva o comportamento descrito. Os cinco primeiros aparecem em qualquer input; os cinco últimos são típicos de histórias já escritas.

## Em qualquer input

**Voz passiva sem sujeito**
Exemplo: "o sistema deve ser validado", "os dados precisam ser processados".
Problema: não há ator; sem ator não há história.
Ação: perguntar quem faz o quê.

**Resultado não verificável**
Exemplo: "boa experiência", "intuitivo", "fluido".
Problema: QA não consegue escrever teste.
Ação: pedir critério mensurável: tempo, taxa de erro, estado observável.

**Escopo implicitamente infinito**
Exemplo: "suportar todos os tipos de arquivo", "funcionar em qualquer dispositivo".
Problema: impossível estimar; qualquer implementação pode ser contestada.
Ação: pedir a lista fechada de casos suportados.

**Requisito duplo**
Exemplo: "monitorar velocidade e gerar relatórios mensais".
Problema: duas capacidades numa história; reprova o I do INVEST.
Ação: propor decomposição em duas histórias independentes.

**Dependência circular**
Exemplo: A depende de B estar pronta; B depende de A.
Problema: nenhuma entra em sprint.
Ação: identificar o pré-requisito real e o que pode ser simulado.

## Em histórias já escritas

**Solução no lugar de problema**
Exemplo: "quero um dropdown com os últimos 10 itens" quando o problema é "encontrar itens recentes rapidamente".
Problema: mata o N do INVEST; o time não pode propor solução melhor.
Ação: reescrever a capacidade como necessidade e mover a solução sugerida para as notas, preservada como referência do PO.

**Critério de aceite que é task**
Exemplo: "AC: criar tabela no banco", "AC: atualizar o endpoint".
Problema: descreve implementação, não comportamento observável.
Ação: mover para tasks sugeridas; se o comportamento que a task habilita não está em outro critério, perguntar qual é.

**Narrativa e critérios divergentes**
Exemplo: a narrativa promete exportar relatórios; os critérios testam filtros de busca.
Problema: o escopo real é ambíguo; cada leitor entende um.
Ação: `[DIVERGÊNCIA]` listando o que a narrativa cobre e os critérios não, e vice-versa. A reconciliação é do PO.

**Critério órfão**
Exemplo: critério que testa comportamento que nenhuma parte da narrativa menciona.
Problema: escopo escondido ou sobra de copy-paste.
Ação: `[ÓRFÃO]` e perguntar se pertence a esta história ou a outra.

**Definition of Done disfarçada de critério**
Exemplo: "AC: código revisado", "AC: testes passando", "AC: deploy em homologação".
Problema: vale para todas as histórias; é DoD do time, não critério desta.
Ação: remover dos critérios e sinalizar. Se o time não tem DoD formal, apontar como observação.
