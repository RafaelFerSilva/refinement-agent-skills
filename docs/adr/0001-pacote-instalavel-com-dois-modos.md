# Pacote de skills instalável, com dois modos de operação

O refinement-skills nasceu como quatro prompts de chat e quatro skills locais que só funcionavam dentro deste repositório. Decidimos transformá-lo num **pacote** de skills, autocontido, instalado no workspace onde as USs são analisadas, e nunca o contrário.

O pacote opera em dois **modos**, escolhidos por workspace em `docs/agents/refinement.md`:

- **Sem código**: o workspace só tem análise. O PO é a fonte dos fatos; o glossário, as histórias anteriores e os documentos do PO são a memória; perguntas de arquitetura vão por questionário ao time de desenvolvimento. É o cenário do primeiro workspace, criado só para analisar USs dos POs.
- **Com código**: o pacote é instalado no repositório do produto. Antes de perguntar, o agente lê o código; perguntas de arquitetura são respondidas por subagente, com a fonte citada.

Os fluxos são os mesmos nos dois modos; muda quem responde o quê. Consideramos e rejeitamos três alternativas: um workspace único que também vendorizasse o código dos produtos (acopla análise a um produto e multiplica repositórios por produto), dois pacotes distintos por modo (duplica toda regra de rigor em dois lugares que iriam divergir), e depender de um pacote de skills de terceiros para a entrevista e o glossário (cria acoplamento de versão e de vocabulário com algo que não controlamos; o pacote carrega suas próprias primitivas).

Consequência: as skills nunca pressupõem acesso a código. O ramo "com código" é sempre um adicional sobre o ramo "sem código", e um workspace sem `refinement.md` opera como sem código.
