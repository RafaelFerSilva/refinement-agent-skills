---
name: configure-refinement
description: Configura um workspace para os fluxos de refinamento: o modo (com código ou sem código), o tracker em markdown local, as convenções de publicação e o bloco de instruções em AGENTS.md ou CLAUDE.md. Rode uma vez por workspace.
disable-model-invocation: true
---

# Configurar o workspace

Escreva a configuração por workspace que `/refine-story`, `/qa-plan`, `/requirements-discovery` e `/meeting-minutes` assumem. É uma skill guiada por conversa, não um script: explore, apresente o que encontrou, confirme, e só então escreva.

## Passos

1. **Explorar.** Leia o que existe antes de assumir: `AGENTS.md` e `CLAUDE.md` na raiz, `CONTEXT.md`, `docs/agents/refinement.md` e `docs/agents/issue-tracker.md` (saídas anteriores desta skill), `.scratch/`, e sinais de código-fonte: `package.json`, `pyproject.toml`, `src/`, `go.mod`, qualquer coisa que um time compile ou execute.
   Se `docs/agents/issue-tracker.md` já existe por outra convenção, ele é mantido: confira só que diz onde publicar. Se `CLAUDE.md` é só uma ponte com `@AGENTS.md`, o arquivo de instruções é o `AGENTS.md`.
   Concluído quando: você sabe se o workspace já foi configurado, qual o modo provável, qual o idioma provável (`en-US` ou `pt-BR`), se há glossário, se o tracker já existe e qual é o arquivo de instruções.

2. **Perguntar, uma seção por vez, com a resposta recomendada na frente.**

   **Modo.** Recomende pelo que encontrou: há código, `com-codigo`; não há, `sem-codigo`. Explique em uma linha: com código o agente lê o código antes de perguntar; sem código o PO é a fonte e perguntas de arquitetura vão por questionário ao time.

   **Idioma.** Recomende pelo que encontrou nos arquivos ou `en-US` por padrão: `en-US` ou `pt-BR`. Explique em uma linha: define a língua da sabatina, das perguntas da rodada, das narrativas, dos critérios em Gherkin e dos vereditos.

   **Work items.** As USs nascem num tracker externo? Se sim, qual a URL base e o nome do campo (por exemplo `Azure: <ID>` para work items do Azure DevOps). Toda US nasce lá e cada artefato leva a linha com o ID.

   **Glossário do produto.** Já existe `CONTEXT.md`? Se não, nada a fazer agora: a primeira sabatina em que um termo se resolver o cria. Diga isso.

   Concluído quando: modo, idioma, convenção de work item e URL base estão confirmados.

3. **Confirmar e escrever.** Mostre o rascunho de `docs/agents/refinement.md` a partir de [refinement.md](refinement.md), de `docs/agents/issue-tracker.md` a partir de [issue-tracker.md](issue-tracker.md) só quando ele não existe, e o bloco `## Refinamento` para o arquivo de instruções. Deixe editar. Depois escreva. Para o arquivo de instruções: se `CLAUDE.md` existe e importa `AGENTS.md` (uma linha `@AGENTS.md`), edite `AGENTS.md`; senão edite `CLAUDE.md` se existir; senão `AGENTS.md` se existir; se nenhum existe, pergunte qual criar. Se o bloco `## Refinamento` já existe, atualize no lugar, sem tocar no resto.

   O bloco:

   ```markdown
   ## Refinamento

   Fluxos de refinamento por sabatina: `/which-flow` diz qual usar. Modo e convenções em `docs/agents/refinement.md`; tracker em `docs/agents/issue-tracker.md`. Artefatos em `.scratch/<slug>/` com `Status:` e o ID do work item.
   ```

   Concluído quando: `refinement.md`, o tracker (novo ou mantido) e o bloco existem com o conteúdo confirmado.

4. **Encerrar.** Diga que o workspace está configurado, quais fluxos leem `docs/agents/refinement.md`, e que os arquivos podem ser editados à mão depois; rodar esta skill de novo só é necessário para trocar o modo, o idioma ou o tracker.
