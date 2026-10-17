# Configuração de idioma por workspace

O pacote nasceu operando em português (pt-BR). Para permitir o refinamento em times multinacionais ou produtos com documentação em inglês, decidimos adicionar suporte a idiomas configurável por workspace.

O idioma é escolhido em `docs/agents/refinement.md` do workspace, na linha `Idioma: <en-US | pt-BR>`, com `en-US` como padrão global e `pt-BR` como opção. O valor é definido interativamente por `/configure-refinement`.

Quando `en-US` é escolhido:

- A sabatina e as rodadas de perguntas ocorrem em inglês.
- Narrativas seguem o padrão "As a [role], I want [capability], so that [outcome]".
- Critérios de aceite em Gherkin usam as palavras-chave `Scenario:`, `Given`, `When`, `Then`, `And`.
- Marcadores de rigor e proveniência usam equivalentes em inglês: `[INFERENCE: base]`, `[TO CONFIRM: whom]`, `[AMBIGUITY]`, `[DECOMPOSE]`, `[STATED: speaker, "paraphrase"]`, `[ASSUMED: base]`, `[SPECIFIED: excerpt]`, `[DERIVED: technique]`.
- Vereditos na linha `Status:` usam termos em inglês: `READY`, `REFINE`, `BLOCKED` para USs; `EXECUTABLE`, `PARTIAL`, `BLOCKED` para planos de QA; `candidate`, `open map`, `in progress`, `completed` para discovery.

Consideramos e rejeitamos duplicar a árvore de skills e prompts em inglês: criaria dois pacotes paralelos com regras de rigor idênticas que divergiram rapidamente. As skills mantêm suas instruções canônicas em português, mas instruem o modelo a dialogar e gerar os artefatos no idioma configurado.

Consequência: o pacote permanece autocontido e com fonte única de regras, enquanto workspaces individuais podem operar em português ou inglês conforme a equipe do produto.
