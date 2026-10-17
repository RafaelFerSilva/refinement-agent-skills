---
name: requirements-rigor
description: "Vocabulário e regras de rigor para artefatos de requisitos. Use ao auditar ou escrever uma User Story, critério de aceite, condição de teste ou ata de reunião, e sempre que precisar decidir se algo é inferência ou invenção, marcar uma lacuna, avaliar INVEST, converter critério para Gherkin ou dar veredito de prontidão."
---

# Rigor de requisitos

Referência compartilhada pelos fluxos `/refine-story`, `/qa-plan`, `/requirements-discovery` e `/meeting-minutes`. Define a fronteira entre o que pode ser afirmado e o que precisa ser perguntado, os marcadores que tornam essa fronteira visível, e as réguas de narrativa, critério de aceite e veredito. É a única fonte dessas regras: um fluxo aponta para cá em vez de repeti-las.

## Fronteira: inferência ou invenção

**Inferência** é a conclusão que decorre diretamente de uma frase do input, do `CONTEXT.md` ou de um fato verificado, e à qual outra pessoa lendo o mesmo material chegaria. Toda inferência carrega a base: a frase ou a fonte que a sustenta.

**Invenção** é qualquer valor, nome, sistema, regra ou comportamento sem base no material, mesmo quando é "boa prática" ou "o óbvio para esse tipo de feature". Os casos frequentes: números de SLA, limites, volumes, percentuais, mensagens de erro, políticas de retry, nomes de ferramentas e protocolos.

Teste rápido: "consigo apontar a frase ou a fonte que sustenta isto?" Sim: inferência, cite a base. Não: pergunta, ou placeholder quando não há a quem perguntar.

A fronteira muda de forma conforme o momento:

| Momento | Inferência vira | Invenção vira |
| --- | --- | --- |
| Sabatina (rodada de perguntas) | A resposta recomendada da pergunta, com a base | A própria pergunta, sem recomendação |
| Síntese (artefato final) | Afirmação com `[INFERÊNCIA: base]` | `[A CONFIRMAR: quem]` com pergunta registrada |

Na sabatina, fatos são trabalho do agente: glossário, histórias anteriores, documentos do workspace e, no modo com código, o código. Fato encontrado não vira pergunta; vira resposta recomendada com a fonte. Decisões são do PO. Sem base para recomendar, a resposta recomendada é "sem recomendação" e, quando houver, as opções com a implicação de cada uma.

O idioma do refinamento é determinado por `Idioma:` em `docs/agents/refinement.md` do workspace (`en-US` ou `pt-BR`), com `en-US` como padrão. Quando o idioma for `pt-BR`, sabatina, marcadores, narrativa, Gherkin e vereditos assumem a forma em português.

## Marcadores

Uma lacuna marcada vale mais que um artefato "limpo" com lacunas escondidas. Os marcadores ficam visíveis no artefato final e valem em todo artefato; `/meeting-minutes` acrescenta os de proveniência e `/qa-plan` os de origem.

| Marcador (pt-BR) | Marcador (en-US) | Significa | Exige |
| --- | --- | --- | --- |
| `[INFERÊNCIA: base]` | `[INFERENCE: base]` | Conclusão derivada do material | Citar a frase ou fonte |
| `[A CONFIRMAR: quem]` | `[TO CONFIRM: whom]` | Valor ou regra que ninguém na sessão pôde dar | Pergunta numerada na seção de perguntas, com o destinatário |
| `[AMBIGUIDADE]` | `[AMBIGUITY]` | Termo com mais de uma leitura | Pergunta; em alto impacto, duas interpretações com implicações distintas |
| `[ANTI-PADRÃO: tipo]` | `[ANTI-PATTERN: type]` | Ocorrência de um anti-padrão de [ANTI-PADROES.md](ANTI-PADROES.md) | Pergunta, ou correção que preserva o comportamento |
| `[INVEST-FAIL: letra]` | `[INVEST-FAIL: letter]` | Critério INVEST reprovado | Motivo em uma linha e o que resolveria |
| `[DECOMPOR]` | `[DECOMPOSE]` | História grande demais para um sprint | Proposta de divisão |
| `[DIVERGÊNCIA]` | `[DIVERGENCE]` | Narrativa promete X, critérios testam Y | Listar os dois lados; reconciliação é do PO |
| `[ÓRFÃO]` | `[ORPHAN]` | Critério sem correspondência na narrativa | Perguntar a que história pertence |
| `[CONFLITO]` | `[CONFLICT]` | Dois stakeholders em posições opostas | Registrar as duas sem resolver |
| `[VALIDAR COM EQUIPE]` | `[VALIDATE WITH TEAM]` | Requisito dito por uma voz só, onde a confirmação importa: papel não ouvido, decisão de escopo de quem não decide | Confirmação antes de entrar no backlog |
| `[DEPENDÊNCIA NÃO MAPEADA]` | `[UNMAPPED DEPENDENCY]` | Integração ou sistema cuja disponibilidade não foi confirmada | Ação para confirmar; a história não entra em sprint sem isso |
| `[MANUAL-ONLY]` | `[MANUAL-ONLY]` | Critério não automatizável | Por quê |
| `[ESTIMATIVA EM RISCO]` | `[ESTIMATE AT RISK]` | Pontos existentes provavelmente invalidados por uma lacuna | Qual lacuna |
| `[A CALIBRAR NO PLANNING]` | `[CALIBRATE IN PLANNING]` | Campo de story points | Uma linha de contexto para a discussão do time |

Story points são calibração do time. Nunca atribua número, horas ou dias; quando a história já tem pontos, use `[ESTIMATIVA EM RISCO]` (ou `[ESTIMATE AT RISK]`) em vez de contestar o número.

## Narrativa

Formato (pt-BR): "Como [papel específico], quero [uma capacidade, um verbo], para que [resultado verificável]."
Formato (en-US): "As a [specific role], I want [a capability, one verb], so that [verifiable outcome]."

- Papel específico. "Usuário" genérico reprova; use o papel do `CONTEXT.md` quando existir.
- Uma capacidade por história. Duas capacidades ligadas por "e" são requisito duplo: decompor.
- O "para que" declara valor de negócio. Repetir o "quero" com outras palavras reprova.
- Campo que não pode ser inferido do texto recebe `[A CONFIRMAR: PO]` (ou `[TO CONFIRM: PO]`).

## Scorecard INVEST

Avalie cada critério como PASS, FAIL ou INDETERMINADO. INDETERMINADO significa que o texto não permite avaliar, e vira pergunta, não chute.

- **Independent**: desenvolvível sem bloquear ou ser bloqueada por outra.
- **Negotiable**: descreve o problema, não a solução. Solução prescrita no lugar do problema reprova; a solução sugerida pelo PO vai para as notas, preservada como referência.
- **Valuable**: o valor para o papel nomeado está declarado e é real.
- **Estimable**: o time consegue estimar com o que está escrito.
- **Small**: cabe em um sprint. Aparenta não caber: `[DECOMPOR]` (ou `[DECOMPOSE]`).
- **Testable**: QA consegue automatizar a partir dos critérios escritos.

## Critérios de aceite em Gherkin

Formato (pt-BR): `Cenário:` nome descritivo, `Dado` estado inicial, `Quando` um evento, `Então` resultado verificável, `E` resultado adicional.
Formato (en-US): `Scenario:` descriptive name, `Given` initial state, `When` an event, `Then` verifiable outcome, `And` additional outcome.

- `Dado` / `Given` descreve estado, nunca uma ação.
- `Quando` / `When` é exatamente um evento ou ação.
- `Então` / `Then` é verificável por automação: número, estado ou condição. "Corretamente", "adequadamente", "rápido" e qualquer termo subjetivo reprovam.
- Número ausente que tornaria o `Então` / `Then` verificável: `[A CONFIRMAR: quem]` (ou `[TO CONFIRM: whom]`) no lugar do número.
- Converter critério em prosa para Gherkin preserva exatamente o comportamento descrito, sem adicionar comportamento.
- Edge case ausente é pergunta ao PO. O texto costuma sugerir quais existem: ofereça-os na pergunta como `[INFERÊNCIA]` (ou `[INFERENCE]`).

**Autoauditoria**: antes de entregar qualquer cenário, releia cada um contra as quatro primeiras regras e corrija. Em outputs longos estas são as regras mais violadas.

## Termos que sempre viram pergunta

| Categoria | Termos | O que perguntar |
| --- | --- | --- |
| Desempenho | rápido, em tempo real, responsivo, performático | SLA em segundos ou requisições por segundo |
| Escala | muitos, grande volume, alta demanda | Ordem de magnitude: centenas, milhares, milhões |
| Segurança | seguro, protegido, com controle de acesso | Padrão ou perfil: LGPD, OWASP, permissão específica |
| Integração | integrar com X, importar do Y, sincronizar com Z | API disponível, autenticação, formato, SLA do sistema externo |
| Aprovação | aprovado por, validado pelo gestor, mediante autorização | Quem aprova, prazo, o que acontece se expirar |
| Escopo aberto | todos os formatos, qualquer dispositivo | Lista fechada |

Os anti-padrões completos, com exemplo, problema e ação para cada um, estão em [ANTI-PADROES.md](ANTI-PADROES.md). Leia ao varrer ou auditar um texto; a Skill tool carrega só este arquivo, o irmão precisa ser lido à parte.

## Vereditos

Uma de três conclusões, sem meio-termo:

- **PRONTA** (en-US: **READY**): INVEST completo, critérios testáveis, sem pendência bloqueante. Pendências cosméticas ficam listadas.
- **REFINAR** (en-US: **REFINE**): utilizável depois que as perguntas listadas forem respondidas. Diga quais números destravam.
- **BLOQUEADA** (en-US: **BLOCKED**): não entra em planning. Motivo objetivo: dependência externa não confirmada, escopo indeterminado, não é uma User Story.

O veredito é a linha `Status:` do artefato. Para planos de QA, os vereditos correspondentes são `EXECUTÁVEL`, `PARCIAL` ou `BLOQUEADO` (em en-US: `EXECUTABLE`, `PARTIAL` ou `BLOCKED`). Para discovery, `candidata`, `mapa aberto`, `em andamento` ou `concluído` (em en-US: `candidate`, `open map`, `in progress` ou `completed`). O mapeamento para rótulos de um tracker externo, quando houver, fica em `docs/agents/triage-labels.md` do workspace.

## Questionário

Pergunta aberta com destinatário fora da sessão vira questionário, um por destinatário, escrito pelo próprio fluxo ao lado do artefato, no formato de [QUESTIONARIO.md](QUESTIONARIO.md).

## Aviso final

Todo artefato publicado termina com um aviso de que é preparação gerada por IA e de que a decisão sobre escopo, valor e prioridade é do PO e do time. Cada fluxo traz o texto do seu aviso.
