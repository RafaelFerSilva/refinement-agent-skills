# Formato do questionário

Para perguntas que ficaram abertas com destinatário fora da sessão. Um arquivo por destinatário, ao lado do artefato que o gerou: `questionario-<destinatario>.md`. As perguntas miram o que o destinatário sabe e o PO não.

```md
# Questionário: <assunto>

**Para:** <destinatário e papel> | **De:** <quem conduz a sessão; sem nome conhecido, `[A DEFINIR: nome]`> | **Prazo sugerido:** <data ou "quando puder">
**Por quê:** <a decisão que depende das respostas e o que trava enquanto não vêm>
**Como responder:** <esforço em minutos>. Resposta parcial e "não sei" ajudam; sinalize dúvida em vez de pular.

## Contexto

<Um parágrafo que situa quem não esteve na sessão. O suficiente para responder bem, não mais.>

## <Tema>

### <Pergunta, uma ideia só>

_Por que importa: <uma linha, só quando a pergunta puder ser mal lida ou receber resposta rasa>_

>

## Algo mais?

Algo que não perguntamos e deveríamos saber?
```

Ordem: a mais importante primeiro, porque uma resposta assíncrona pode vir em uma passada só. Uma pergunta por item; agrupe em temas a partir de cinco perguntas. Ao gerar, aponte o arquivo a partir da seção de perguntas em aberto do artefato. O questionário vai para fora da sessão, muitas vezes para fora do time: não leva `Status:` nem o aviso final dos artefatos.
