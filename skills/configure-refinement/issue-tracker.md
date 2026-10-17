# Tracker: markdown local

Os artefatos de refinamento deste workspace vivem em `.scratch/`, versionados com o repositório.

- Uma pasta por assunto: `.scratch/<slug>/`, slug conforme `refinement.md`.
- Todo artefato tem `Status:` logo abaixo do título e, quando o workspace usa work items, a linha de ID do work item. Questionários são a exceção: seguem o formato próprio, sem `Status:`.
- Histórias candidatas e decisões pendentes de um discovery ficam em `.scratch/<slug>/issues/NN-<slug>.md`, numeradas a partir de 01.
- Comentários e histórico ficam ao fim do arquivo sob `## Comentários`.

Quando um fluxo diz "publique": escreva o arquivo em `.scratch/<slug>/`, criando a pasta. Quando diz "leia a US": o usuário passa o caminho ou o ID; um ID resolve para `.scratch/*/` por busca no título.
