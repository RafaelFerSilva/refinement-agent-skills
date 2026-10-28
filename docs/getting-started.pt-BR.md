# Guia de Início Rápido (Getting Started)

> Read in English: [docs/getting-started.md](getting-started.md)

Guia prático para adotar o **Refinement Skills** no dia a dia de produto, engenharia e QA em **projetos novos (*greenfield*)**, **projetos já em andamento (*brownfield*)** e **plataformas de chat com Memória / Base de Conhecimento**.

---

## 1. Anatomia do Workspace Alvo

Quando você instala este pacote no repositório do produto (ou em um repositório dedicado só para análise no modo `without-code`), os fluxos leem e gravam em uma estrutura previsível para acumular memória entre sessões:

```text
meu-produto/
├── CONTEXT.md                     # APENAS glossário do domínio (papéis, entidades, eventos e sinônimos em _Avoid_)
├── docs/
│   ├── agents/
│   │   ├── refinement.md          # Modo (with-code | without-code), idioma (en-US | pt-BR) e fontes de fatos
│   │   └── issue-tracker.md       # Convenção de IDs de work items e publicação local
│   ├── adr/                       # Decisões arquiteturais e de produto difíceis de reverter
│   ├── product-overview.md        # Panorama consolidado do sistema atual (criado pelo /bootstrap-context)
│   └── reference/                 # Pasta para soltar manuais, regras, especificações e USs antigas
└── .scratch/                      # Artefatos gerados (atas, specs de discovery, USs refinadas, planos de QA)
```

Antes de fazer qualquer pergunta factual ao PO, todas as skills consultam estas fontes na seguinte ordem de prioridade:
1. `CONTEXT.md` (vocabulário canônico e papéis do domínio)
2. `docs/adr/` (decisões estruturais já tomadas)
3. `docs/product-overview.md` (propósito, módulos em produção, permissões, integrações ativas e regras/SLAs vigentes)
4. `.scratch/` (histórias, specs, atas e planos de QA de sessões anteriores)
5. `docs/reference/` e `docs/` (manuais brutos, regulamentos, wireframes, planilhas de regras)
6. Código-fonte do produto via subagente somente-leitura (quando `Mode: with-code`)

---

## 2. Projetos Novos (*Greenfield*)

Em projetos que estão nascendo do zero, o contexto é construído organicamente junto com as primeiras definições:

1. **Configure uma única vez:** rode `/configure-refinement`, escolha `with-code` ou `without-code`, selecione `pt-BR` (ou `en-US`) e informe a URL/prefixo do seu tracker. Não precisa criar `CONTEXT.md` manualmente.
2. **Comece pelo material bruto:**
   - Tem transcrição de reunião? Rode `/meeting-minutes` para separar decisões verbalizadas de acordos presumidos, gerar questionários e criar o `discovery-input.md`.
   - Tem briefing, notas ou `discovery-input.md`? Rode `/requirements-discovery` para mapear domínios, dimensionar épicos e gerar histórias candidatas.
3. **Refine e gere a base de testes:** rode `/refine-story` para cada história e `/qa-plan` sobre a história refinada.
4. **Crescimento contínuo:** assim que o PO define o primeiro papel ou entidade na sabatina, o agente cria o `CONTEXT.md` automaticamente e passa a usar esses termos como recomendações nas próximas sessões.

---

## 3. Projetos já em Andamento (*Brownfield*)

Entrar em um projeto já avançado é o cenário mais crítico do dia a dia, especialmente no modo `without-code`, quando chega uma nova US avulsa sem histórico no workspace.

### Por que a falta de contexto gera perguntas (e não alucinação)

Prompts comuns tentam parecer prestativos inventando regras, perfis genéricos ("usuário") e números de SLA plausíveis. No Refinement Skills, `requirements-rigor` e `socratic-examination` bloqueiam invenções silenciosas por construção:

- **Fronteira entre inferência e invenção:** o modelo só pode afirmar algo com `[INFERÊNCIA: base]` se puder citar a frase da US ou o arquivo do workspace de onde tirou aquilo. Qualquer regra, limite ou comportamento "padrão de mercado" sem fonte escrita é tratado como **invenção** e proibido.
- **Proibição de chutar recomendações:** sem base documental no workspace, o agente é obrigado a escrever **`sem recomendação`** e apresentar opções com suas implicações.
- **Lacunas explícitas e roteamento:** se o PO não souber um detalhe técnico do sistema atual durante a sabatina, o item recebe `[A CONFIRMAR: quem]` (ex.: `[A CONFIRMAR: DEV]`) e vira um questionário separado (`questionario-dev.md`), em vez de ser mascarado no texto.

**O efeito prático:** se você puxar direto `/refine-story` em um projeto avançado com o workspace vazio, o modelo não vai alucinar, **mas fará muito mais perguntas na Rodada 1** sobre papéis, módulos e regras atuais que o time já sabe de cabeça.

### Como eliminar o atrito inicial em 3 passos

1. **Rode `/configure-refinement` indicando "produto em andamento":**
   A skill prepara o `docs/agents/refinement.md` e, quando você confirmar que possui material de referência, cria a pasta `docs/reference/`.
2. **Coloque a documentação que já existir em `docs/reference/` (15 min, opcional):**
   Não precisa reformatar nada: solte ali manuais de operação, páginas exportadas do Confluence/Wiki, documentos de regras, contratos de API ou 3 a 5 USs antigas bem detalhadas.
3. **Rode `/bootstrap-context` antes da primeira US:**
   A skill cobre os três cenários reais de produtos em andamento:
   - **Com documentação (`docs/reference/`):** lê os arquivos, identifica sinônimos conflitantes nos documentos legados (ex.: "Cliente" vs. "Conta" vs. "Garagem") e regras potencialmente defasadas, faz 1 rodada curta de curadoria com o PO e grava `CONTEXT.md` + `docs/product-overview.md` (mais questionários para engenharia se sobrarem lacunas técnicas).
   - **Com código (`Mode: with-code`):** despacha um subagente para ler entidades, perfis de acesso, limiares e integrações direto no código, trazendo recomendações com citação de arquivo e apontando divergências entre documentação antiga e código em produção.
   - **Sem documentação e sem código (`APENAS TÁCITO`):** conduz uma sabatina rápida e guiada (10 minutos) com o PO para registrar propósito do produto, perfis ativos, as 5 a 10 entidades centrais, módulos em produção e integrações externas antes de refinar histórias.

### Boas práticas no dia a dia de projetos avançados

- **Agrupe as primeiras 2 ou 3 USs no mesmo módulo:** como cada sessão atualiza o `CONTEXT.md` na hora e publica em `.scratch/`, refinar histórias da mesma área cria memória acumulada rapidamente.
- **Mantenha cada documento no seu papel:** `CONTEXT.md` guarda exclusivamente definições de vocabulário e `_Avoid_`; estado atual do produto, módulos, integrações e regras transversais ficam em `docs/product-overview.md`.
- **Rode `/bootstrap-context` novamente ao entrar em um módulo legado novo:** basta adicionar os documentos daquele módulo em `docs/reference/` e rodar o comando; termos já existentes no `CONTEXT.md` são protegidos contra reescrita silenciosa.
- **Limpe a sessão entre fluxos:** use `/clear` ao passar de `/bootstrap-context` para `/refine-story` e depois para `/qa-plan`. O próximo fluxo sempre lê o artefato salvo no workspace, sem carregar ruído de conversa anterior.
- **Tire dúvidas com `/ask-refinement`:** rode `/ask-refinement` (com uma pergunta ou sem argumentos) para diagnosticar o estado atual do seu workspace, entender o significado de marcadores e vereditos ou saber como retomar uma User Story após receber respostas de questionário.

---

## 4. Agentes Web sem Repositório Local (`prompts/project/` vs. `prompts/*.md`)

Times que usam agentes web sem repositório Git local contam com duas distribuições geradas em [`prompts/`](../prompts/) a partir da mesma fonte em `skills/`:

### Opção A (Recomendada): Workspace Web Unificado (`prompts/project/`)

Ideal para **Claude Projects, ChatGPT Projects, Custom GPTs, Gemini Gems e Copilot Studio**, onde todas as 5 etapas, o roteador, o tira-dúvidas e o contexto vivo do produto coexistem em **um único workspace web compartilhado** (sem duplicar regras na Base de Conhecimento):

1. **Configure as instruções fixas (0 vagas de arquivo):** copie o conteúdo de [`prompts/project/INSTRUCTIONS.md`](../prompts/project/INSTRUCTIONS.md) para o campo *System Prompt / Custom Instructions* na plataforma (Project, GPT, Gem ou agente). Ele mantém o roteador (`which-flow`), o tira-dúvidas de turno único (`ask-refinement`) e as regras de memória sempre ativos.
2. **Suba os 6 arquivos modulares na Base de Conhecimento (*Knowledge Base*):**
   - [`prompts/project/refinement-core.md`](../prompts/project/refinement-core.md) (cópia única de `socratic-examination` e `requirements-rigor`, reduzindo em mais de 50% o volume de instruções e evitando trechos repetidos na busca por RAG)
   - [`prompts/project/bootstrap-context.md`](../prompts/project/bootstrap-context.md)
   - [`prompts/project/meeting-minutes.md`](../prompts/project/meeting-minutes.md)
   - [`prompts/project/requirements-discovery.md`](../prompts/project/requirements-discovery.md)
   - [`prompts/project/refine-story.md`](../prompts/project/refine-story.md)
   - [`prompts/project/qa-plan.md`](../prompts/project/qa-plan.md)
   *(Ocupa apenas 6 arquivos, cabendo com folga no limite de 10 arquivos do Gemini Gems e de 20 arquivos dos Custom GPTs, deixando espaço livre para os documentos do produto.)*
3. **Inicialize o contexto do produto:** abra a primeira conversa dentro desse workspace web, rode o `bootstrap-context` (colando/anexando manuais atuais ou respondendo à sabatina curta) e adicione os arquivos `CONTEXT.md` e `product-overview.md` gerados à mesma Base de Conhecimento.
4. **Use novas conversas dentro do mesmo workspace web como equivalente ao `/clear`:**
   - Todos os fluxos coexistem ali: basta enviar uma transcrição, briefing, User Story, User Story refinada ou dúvida de uso e o `INSTRUCTIONS.md` aciona automaticamente o fluxo certo (ou responde em turno único sem abrir sabatina quando for dúvida).
   - Mantenha a mesma conversa até concluir a síntese de um fluxo.
   - Ao avançar de etapa (por exemplo, de `refine-story` para `qa-plan`, ou para uma nova User Story), **abra uma nova conversa dentro do mesmo Project / Gem / GPT** e cole apenas o artefato final da etapa anterior: o histórico de mensagens zera como no `/clear` (sem ruído de perguntas intermediárias), enquanto `CONTEXT.md`, `product-overview.md` e ADRs seguem compartilhados na Base de Conhecimento.

### Opção B: Chat Avulso sem Base de Conhecimento (`prompts/*.md`)

Para chats web comuns sem instruções persistentes nem arquivos compartilhados, cole diretamente no início da conversa um dos prompts autocontidos da raiz de [`prompts/`](../prompts/) (`bootstrap-context.md`, `meeting-minutes.md`, `requirements-discovery.md`, `refine-story.md`, `qa-plan.md`, `which-flow.md` ou `ask-refinement.md`) junto com o insumo e o trecho atual do seu `CONTEXT.md`.

### Como atualizar o contexto na Memória / Base de Conhecimento da plataforma

Como modelos em plataformas web não conseguem sobrescrever sozinhos os arquivos salvos na Base de Conhecimento do projeto/agente, todos os fluxos com sabatina seguem um protocolo automático de atualização:

1. **Rodadas limpas durante a sabatina:** enquanto examina uma User Story com o PO, o agente apenas confirma em uma linha curta quando um termo novo é fechado, sem despejar blocos de arquivo no meio da conversa.
2. **Entrega consolidada na síntese final:** sempre que a sessão criar ou alterar dados de contexto (`CONTEXT.md`, `product-overview.md` ou novo ADR), o agente entrega ao final da resposta, logo abaixo do artefato principal, a seção **`Atualizações para a Memória / Base de Conhecimento`** com blocos prontos para copiar e avisa no fechamento o que atualizar na plataforma antes da próxima conversa:
   - **Arquivo completo para substituição:** gerado quando o documento está sendo criado do zero ou quando você colou o arquivo anterior inteiro naquela conversa.
   - **Bloco incremental seguro (`Adicionar ao CONTEXT.md`):** gerado quando o contexto veio da Memória / Base de Conhecimento da plataforma (onde buscas por RAG podem mostrar apenas trechos parciais ao modelo). Assim, você apenas adiciona as novas entradas ao final do arquivo na plataforma, sem risco de sobrescrever e apagar termos antigos.
