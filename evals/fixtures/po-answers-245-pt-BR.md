# Respostas roteirizadas do Product Owner: US-245, pt-BR

Carlos, diretor de operações da RouteWise e PO de `us-245-silenciar-alertas.md`, respondendo a uma sessão de refinamento. Material fictício, escrito para que uma execução chegue até a síntese.

## Como uma execução usa este arquivo

- Case cada pergunta da rodada com os assuntos abaixo **pelo que ela pergunta, nunca pelo número**. A numeração varia entre execuções, e a `Q2` de uma é a `Q4` da seguinte.
- Responda com as linhas do assunto correspondente e nada além disso. Nenhum valor, papel ou regra que nenhum assunto abaixo enuncie.
- Um assunto pode responder duas perguntas da mesma rodada, e uma pergunta pode tocar dois assuntos: responda com as linhas de cada um.
- Uma rodada posterior que reabra um assunto já respondido recebe as mesmas linhas, sem alteração.
- Pergunta que nenhum assunto cobre: use **Qualquer outro assunto**, no fim.

## Assunto: quem silencia

Casa com pergunta sobre o papel, sobre o "usuário" da narrativa, ou sobre quem tem permissão de silenciar.

> O operador de despacho. É ele que está olhando o painel quando o alerta dispara e é ele que liga para o motorista. Mais ninguém precisa disso: o diretor de operações não fica na frente do painel, e o técnico de dispositivos não tem o que fazer ali.

## Assunto: a janela de silenciamento

Casa com pergunta sobre "por um tempo", sobre duração, sobre quem define a duração, ou sobre o que significa "voltam sozinhos" no fim da janela.

> O operador escolhe a duração na hora de silenciar, entre 15 minutos, 30 minutos ou 1 hora, com 30 minutos já marcado. Nada de digitar um número livre de minutos.
>
> Quando o tempo escolhido acaba, o veículo volta a alertar sem ninguém fazer nada, e o operador não é avisado de que voltou. É isso que "voltam sozinhos" quer dizer.

## Assunto: o que a janela suprime

Casa com pergunta sobre o que acontece com um alerta que chega durante o silenciamento, sobre a tabela de alertas do AC2 pelo lado do negócio, ou sobre o relatório operacional.

> Suprime o alerta no painel de despacho: o pop-up e o som daquele veículo. O alerta continua registrado, e continua aparecendo no relatório operacional no fim do dia, com a marca de que o veículo estava silenciado naquele momento. Uma hora silenciada não pode parecer uma hora sem excesso de velocidade.
>
> Isso vale só para o alerta de velocidade. Qualquer outro alerta daquele mesmo veículo continua disparando no painel.

## Assunto: por operador ou compartilhado

Casa com pergunta sobre o silenciamento valer para quem silenciou ou para todos.

> Compartilhado. Um operador silencia e o time de despacho inteiro para de ver aquele veículo, com o painel mostrando quem silenciou e até quando. Dois operadores ligando para o mesmo motorista é exatamente o que eu quero acabar.

## Assunto: reativação antecipada

Casa com pergunta sobre desfazer o silenciamento, sobre reativar antes do fim da janela, ou sobre quem pode reativar.

> Pode: qualquer operador de plantão traz o veículo de volta antes de o tempo acabar, não só quem silenciou. O turno vira no meio de uma hora, e amarrar isso a uma pessoa deixaria um veículo silenciado sem ninguém poder desfazer.

## Assunto: leituras retroativas

Casa com pergunta sobre leitura que chega depois de o rastreador recuperar sinal, sobre leitura mais antiga que o silenciamento, ou sobre qual horário a verificação usa.

> Não sei, e não vou chutar. Pergunte ao time de engenharia. Quem avalia a leitura sabe se a verificação usa o horário em que a leitura foi feita ou o horário em que ela chegou, e enquanto eu não souber disso não consigo dizer o que deve acontecer com uma leitura anterior ao silenciamento que cai no meio dele. Não decido comportamento que eu não consigo descrever.

## Assunto: "de forma simples"

Casa com pergunta sobre o AC1, sobre o que é "simples", ou sobre onde no produto o silenciamento é acionado.

> Pela linha do veículo no painel de despacho, sem abrir a página do veículo e sem sair do painel. Simples para mim é isso: o operador está tratando uma ocorrência e não pode ir para outro lugar fazer isso.

## Assunto: o critério de armazenamento e o critério de homologação

Casa com pergunta sobre o AC2 ou o AC4, e com a resposta a uma nota de auditoria dizendo que foram movidos.

> Como o silenciamento é guardado é o time que resolve, não aceito nem recuso isso. E testar em homologação é como a gente trabalha em toda história, não é critério desta. Tire os dois dos critérios, desde que fiquem visíveis em algum lugar.

## Qualquer outro assunto

- Decisão que nenhum assunto acima cobre: "Isso eu não tenho definido. Registre como aberto e siga, não preencha por mim."
- Algo que está no glossário, no texto da história ou em uma história anterior: "Essa é você quem procura, não eu quem responde."
- Pergunta sobre quantidade de alertas por dia, sobre modelos de rastreador ou sobre SLA em segundos: "Número de mim não sai. Quem tem os números é o time de engenharia."
