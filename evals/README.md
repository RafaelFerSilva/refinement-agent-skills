# Evals

Casos de teste no formato do `skill-creator` da Anthropic: um arquivo por skill, com prompts realistas, resultado esperado e asserções. As fixtures em `fixtures/` são todas fictícias (RouteWise, Projeto Frota); material de cliente nunca entra aqui.

## Como rodar

Com o `skill-creator` instalado: `/skill-creator` e peça para rodar os evals de `evals/<skill>.json`. Ele dispara uma execução com a skill e uma sem, grava os outputs em `<skill>-workspace/iteration-N/` (ignorado pelo git) e abre o visualizador.

Sem ele, um subagente por caso: dê a ele o prompt, os arquivos listados em `files` e o caminho da skill, e grave o output. Para artefatos de síntese, rode o grader mecânico:

```bash
node scripts/grade-output.mjs <artefato.md> --skill <refine-story|qa-plan|requirements-discovery|meeting-minutes> --json
```

O `--json` sai no formato de `grading.json` que o visualizador do `skill-creator` espera (`text`, `passed`, `evidence`).

## O que se avalia

- **Fluxos de sabatina** (`refine-story`, `qa-plan`, `requirements-discovery`): a **primeira rodada**, no formato que `socratic-examination` define. Sem um PO respondendo, a sessão não avança, e é na primeira rodada que a triagem, a busca de fatos e a forma das perguntas aparecem. As asserções checam que a triagem foi dita, que as perguntas têm resposta recomendada com base, que nada foi inventado, e que o agente esperou o PO em vez de sintetizar.
- **Síntese** (`meeting-minutes`, e os artefatos finais dos fluxos quando um eval simula as respostas do PO): o artefato publicado, pelo grader mecânico mais as asserções do caso.

## Otimizar o acionamento

Só `requirements-rigor` e `socratic-examination` são invocadas pelo modelo; as demais são invocadas pelo usuário e não dependem da `description` para disparar. O loop de otimização de descrição do `skill-creator` se aplica às duas: gere 20 consultas, metade que deve disparar e metade que quase dispara mas não deve (pedidos de code review, de ata sem requisito, de teste unitário de uma função), e rode `scripts/run_loop.py` do `skill-creator`.
