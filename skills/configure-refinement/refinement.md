# Refinamento

Modo: <com-codigo | sem-codigo>
Idioma: <en-US | pt-BR>

Como os fluxos `/refine-story`, `/qa-plan`, `/requirements-discovery` e `/meeting-minutes` operam neste workspace.

## Modo

- **sem-codigo**: o PO é a fonte das respostas. Fatos vêm de `CONTEXT.md`, das histórias em `.scratch/` e dos documentos em `docs/`. Perguntas de arquitetura, observabilidade e camada de teste vão para o time de desenvolvimento por questionário; nunca são respondidas por suposição.
- **com-codigo**: antes de perguntar, o agente procura no código. Perguntas de arquitetura são respondidas lendo o código, com a fonte citada. O PO só recebe perguntas de comportamento esperado.

## Idioma

- **en-US** (padrão): sabatina e perguntas em inglês. Narrativas no formato "As a [role], I want [capability], so that [outcome]". Critérios em Gherkin com `Scenario:`, `Given`, `When`, `Then`, `And`. Vereditos `READY`, `REFINE`, `BLOCKED` (QA: `EXECUTABLE`, `PARTIAL`, `BLOCKED`). Marcadores em inglês: `[INFERENCE: base]`, `[TO CONFIRM: whom]`, `[AMBIGUITY]`, `[DECOMPOSE]`.
- **pt-BR**: sabatina e perguntas em português. Narrativas no formato "Como [papel], quero [capacidade], para que [resultado]". Critérios em Gherkin com `Cenário:`, `Dado`, `Quando`, `Então`, `E`. Vereditos `PRONTA`, `REFINAR`, `BLOQUEADA` (QA: `EXECUTÁVEL`, `PARCIAL`, `BLOQUEADO`). Marcadores em português: `[INFERÊNCIA: base]`, `[A CONFIRMAR: quem]`, `[AMBIGUIDADE]`, `[DECOMPOR]`.


## Fontes de fatos

Em ordem: `CONTEXT.md` (glossário do produto), `docs/adr/`, histórias anteriores em `.scratch/`, documentos em `docs/` (regulamentos, telas, planilhas de requisitos que o PO trouxer vão para lá).

## Work items

Toda US nasce como work item em `<URL base, ex.: https://dev.azure.com/<org>/<projeto>/_workitems/edit/>`. Cada artefato leva `Azure: <ID>` logo abaixo de `Status:`, ou `Azure: nenhum`.

## Slugs

Pastas em `.scratch/` usam kebab-case: reunião `<projeto>-<AAAA-MM-DD>`, com o nome do projeto como aparece no título da reunião; discovery `<tema>`; US `<ID>-<titulo-curto>`, com o ID como aparece na US. Se o tracker definir outra convenção, ela prevalece.

## Onde cada fluxo publica

| Fluxo | Artefato |
| --- | --- |
| `/meeting-minutes` | `.scratch/<projeto>-<data>/ata.md` e `discovery-input.md` |
| `/requirements-discovery` | `.scratch/<tema>/spec.md`, `issues/NN-<slug>.md` (candidatas) e `issues/NN-decisao-<slug>.md` (mapa) |
| `/refine-story` | `.scratch/<ID>-<titulo>/spec.md` |
| `/qa-plan` | `.scratch/<ID>-<titulo>/qa-plan.md` |
| questionários | ao lado do artefato que os gerou, `questionario-<destinatario>.md` |

## Vereditos

PRONTA, REFINAR e BLOQUEADA são a linha `Status:` do artefato de `/refine-story`; EXECUTÁVEL, PARCIAL e BLOQUEADO, a de `/qa-plan`; `candidata`, a das histórias que `/requirements-discovery` gera; `mapa aberto`, `em andamento` e `concluído`, a da spec de discovery.
