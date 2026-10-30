# Painel de Solicitações (Kanban) — Arquitetura de UX/UI e Regras de Negócio

**Documento:** Especificação Técnica de Interface e Negócio do Back-office  
**Sistema:** ZELUS — Plataforma Municipal de Zeladoria Urbana  
**Módulo:** Painel Administrativo de Gestão e Triagem de Solicitações (Back-office Desktop)  
**Data:** 29 de outubro de 2026  
**Autoria:** Equipe de Desenvolvimento Frontend e Arquitetura de Produto ZELUS  

---

## 1. Visão Geral do Painel

O **Painel de Solicitações (Kanban)** é a interface de trabalho operacional dos servidores municipais e equipes de triagem urbana. Projetado para operação em telas de computador (desktop e notebooks em alta resolução), o painel viabiliza a visualização consolidada, o acompanhamento em tempo real e a movimentação auditada de todos os chamados abertos pelos munícipes.

A interface adota uma estética **Minimalista, Fluida e Funcional**, eliminando sobrecarga visual e qualquer ruído dispensável:
* **Barra de Totais Globais Centralizada:** Painel superior contínuo e centralizado exibindo as 6 métricas operacionais do sistema em ordem estrita (`TOTAL`, `PENDENTES`, `EM ANÁLISE`, `EM EXECUÇÃO`, `CONCLUÍDAS` e `DESCARTADAS`), concentrando com exclusividade a contagem do quadro;
* **Drag and Drop com Interceptação Auditada:** Mecânica interativa de arrastar e soltar (HTML5 DnD nativo) integrada à regra de governança pública que intercepta o movimento entre colunas diferentes para colher a justificativa obrigatória;
* **Cabeçalhos de Coluna Limpos:** Título de cada etapa perfeitamente centralizado, sem indicadores numéricos ou contadores secundários concorrendo com a barra superior;
* **Cartões com Color-Coding Pastel:** Fundo integral colorido por status conforme paleta categórica oficial (`#EDE194`, `#BCDCF4`, `#F9B188`, `#D4E4BC`, `#ECC4BC`), com tipografia escura de alto contraste;
* **Sem Redundâncias de Texto:** O status textual foi removido do corpo do cartão, já que o fundo colorido e a própria coluna identificam a etapa com clareza;
* **Rolagem Vertical Invisível:** A área de cartões de cada coluna rola suavemente sem exibir barras de rolagem nativas aparentes (`scrollbar-width: none` e `::-webkit-scrollbar { display: none }`);
* **Layout 100% Responsivo sem Rolagem Lateral:** Grid proporcional de 5 colunas (`repeat(5, minmax(0, 1fr))`) ocupando a largura total da janela;
* **Plena Acessibilidade Digital:** Padrões WCAG 2.1 Nível AA e eMAG com navegação completa via teclado e leitor de telas.

---

## 2. Estrutura do Kanban — As 5 Colunas Estritas

O fluxo de atendimento da zeladoria urbana é estruturado em **5 colunas sequenciais e estritas**, representando cada etapa do ciclo de vida da solicitação:

| Coluna | Identificador / Chave | Fundo Pastel do Cartão | Descrição Operacional |
| :--- | :--- | :--- | :--- |
| **1. Pendente** | `Pendente` | Pastel Amarelo (`#EDE194`) | Solicitação recém-aberta pelo cidadão no aplicativo/web. Aguarda triagem técnica inicial e validação de pertinência pela equipe municipal. |
| **2. Em análise** | `Em análise` | Pastel Azul (`#BCDCF4`) | Chamado sob avaliação técnica dos fiscais ou da secretaria responsável. Análise de gravidade, viabilidade e direcionamento orçamentário. |
| **3. Em execução** | `Em execução` | Pastel Laranja (`#F9B188`) | Ordem de serviço despachada. Equipe operacional ou empresa contratada em deslocamento ou executando as obras/reparos em campo. |
| **4. Concluída** | `Concluída` | Pastel Verde (`#D4E4BC`) | Reparo concluído em campo, evidências conferidas e atendimento encerrado com sucesso. Notificação enviada ao munícipe. |
| **5. Descartada** | `Descartada` | Pastel Coral (`#ECC4BC`) | Solicitação improcedente, duplicada, com informações insuficientes ou referente a competência externa ao município. |

### 2.1. Regras de Transição e Cabeçalhos de Coluna
* O operador pode transicionar uma solicitação ativa entre as colunas operacionais, desde que registre o respectivo motivo de auditoria. Cartões em estados terminais ("Concluída" ou "Descartada") possuem status imutável e são bloqueados contra novas movimentações.
* Os cabeçalhos das colunas exibem exclusivamente o título da etapa (ex: "PENDENTE", "EM ANÁLISE") de forma limpa e rigorosamente centralizada. Toda e qualquer contagem numérica fica centralizada na barra superior.

### 2.2. Mecânica de Drag and Drop e Zonas de Soltura (Drop Zones)
1. **Custom Drag Layer (100% Sólido) e Slot Original Vazio:** Todo cartão possui o atributo `draggable={true}`. No evento `onDragStart`, a ghost image nativa (transparente por padrão nos navegadores) é anulada com um pixel transparente 1x1. Simultaneamente, ativa-se o **Custom Drag Layer** no container principal: um clone flutuante fixo (`position: fixed; z-index: 99999; pointer-events: none`) que rastreia continuamente o cursor do mouse com 100% de opacidade e rotação tátil. No local de origem, a classe `.cartao-kanban--dragging` transforma o cartão em uma moldura oca pontilhada vazia (`border: 2px dashed #94a3b8; background-color: transparent`) com todo o conteúdo interno oculto (`* { opacity: 0; visibility: hidden; }`).
2. **Colunas como Zonas de Soltura:** As 5 colunas operam como alvos receptores de soltura (`onDragOver`, `onDragEnter`, `onDragLeave` e `onDrop`).
3. **Feedback Visual de Drop Zone:** Ao passar um cartão sobre uma coluna, a classe `.kanban-coluna--drag-over` altera suavemente a tonalidade de fundo (`#e2e8f0`) e introduz uma moldura interna destacada (`inset 0 0 0 2px #94a3b8`).

---

## 3. Barra Superior de Totais Globais

Para garantir visibilidade operacional instantânea sem poluir os cabeçalhos individuais de cada coluna, a barra superior de métricas centraliza todos os indicadores do painel:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  [TOTAL 50]  [PENDENTES 10]  [EM ANÁLISE 10]  [EM EXECUÇÃO 10]  [CONCLUÍDAS 10]  [DESCARTADAS 10]  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

* **Alinhamento:** `display: flex; justify-content: center; gap: 1rem;`
* **Ordem Estrita dos Indicadores:**
  1. `TOTAL`: Quantidade agregada de todas as solicitações registradas;
  2. `PENDENTES`: Solicitações na etapa de aguardo inicial;
  3. `EM ANÁLISE`: Chamados sob validação e triagem das equipes técnicas;
  4. `EM EXECUÇÃO`: Ordens ativas em andamento nas vias públicas;
  5. `CONCLUÍDAS`: Demandas resolvidas e finalizadas;
  6. `DESCARTADAS`: Casos cancelados ou invalidados com justificativa documentada.

---

## 4. Regra de Negócio: Auditoria Obrigatória e Transição Interceptada

A gestão pública requer rastreabilidade integral de todas as ações operacionais. Para evitar alterações arbitrárias ou sem justificativa, estabelece-se a seguinte regra de governança:

### 4.1. Interceptação da Soltura (Drag and Drop)
* Ao soltar um cartão sobre uma coluna diferente do seu status atual, a movimentação **NÃO** é aplicada imediatamente.
* O sistema intercepta o evento, armazena temporariamente a intenção de movimento (`movimentoPendente = { solicitacao, novoStatus, statusAnterior }`) e aciona um modal focado de justificativa (`ModalTransicaoAuditoria`).
* Se o cartão for solto sobre a mesma coluna em que já se encontra, a operação é neutralizada sem disparar qualquer modal ou ação redundante.

### 4.2. Modal Focado de Auditoria (`ModalTransicaoAuditoria`)
O popup focado apresenta:
1. **Identificação da Ocorrência:** Protocolo, subcategoria e endereço resumido;
2. **Visualização do Fluxo de Transição:** Badges lado a lado exibindo `Status Anterior` ➔ `Novo Status` com suas respectivas cores pastéis correspondentes;
3. **Campo Textual Obrigatório:** `<textarea>` obrigatório com validação mínima de 5 caracteres para a justificativa formal;
4. **Identificação do Servidor:** Nome completo e matrícula funcional do servidor autenticado na sessão ativa;
5. **Ações:**
   * **"Confirmar e Mover":** Valida a justificativa, gera o carimbo imutável na lista `historico_auditoria`, atualiza o estado reativo das solicitações (fazendo o cartão migrar para a nova coluna com a nova cor pastel) e recalcula os totais globais da barra superior.
   * **"Cancelar" / Tecla ESC:** Anula a intenção de movimento e mantém o cartão na coluna original sem quaisquer alterações.

### 4.3. Histórico de Movimentações (Audit Log)
* O histórico completo de movimentações anteriores de cada solicitação é renderizado em formato de linha do tempo (*timeline*) cronológica reversa (da mais recente para a mais antiga) no interior do modal de detalhes (`SolicitacaoModal`).
* Esse histórico garante transparência administrativa interna e suporte a fiscalizações dos órgãos de controle.

### 4.4. Regra de Integridade: Bloqueio de Estados Terminais
* **Imutabilidade de Demandas Encerradas:** Solicitações que atingem as colunas **"Concluída"** ou **"Descartada"** alcançam um **Estado Terminal**. Por motivos de conformidade legal, auditoria pública e consistência do fluxo operacional, o ciclo de vida dessas demandas é considerado finalizado, tornando o status estritamente imutável.
* **Interceptação no Drop:** Caso o operador tente arrastar e soltar um cartão de status "Concluída" ou "Descartada" para qualquer outra coluna, a ação é imediatamente abortada no evento de soltura antes de registrar a intenção de movimento (`movimentoPendente`) e sem abrir o `ModalTransicaoAuditoria`.
* **Feedback Visual Obrigatório via Modal Estilizado (`ModalAvisoBloqueio`):** O sistema aciona um modal dedicado e estilizado com backdrop suave e cabeçalho de aviso exibindo a mensagem: `"Ação bloqueada: Esta solicitação já consta como [Concluída / Descartada] (Estado terminal) e não pode ser movimentada para outra etapa."`, contendo botão único centralizado "Entendi" para fechamento e retorno suave do cartão à sua coluna de origem.
* **Retorno Suave e Preservação de Consulta:** O cartão é restituído suavemente à sua coluna de origem. A funcionalidade de clique simples no cartão para abertura do `SolicitacaoModal` permanece 100% ativa, permitindo a livre consulta aos detalhes e ao histórico auditável da demanda.

---

## 5. Componente do Cartão com Color-Coding Pastel (Zero Ruído Visual)

Em alinhamento com a diretriz de design funcional e minimalista, o cartão de cada ocorrência prioriza clareza visual, identificação cromática instantânea e contraste acessível:
* **Fundo Color-Coded Pastel:** O fundo de cada cartão reflete diretamente sua etapa (`#EDE194`, `#BCDCF4`, `#F9B188`, `#D4E4BC`, `#ECC4BC`).
* **Fundo Neutro da Coluna:** A coluna preserva fundo cinza neutro (`#f1f3f4`), proporcionando contraste suave e separação visual nítida.
* **Sem Redundâncias de Texto:** Remoção de tags ou palavras indicando o status no cartão, pois o fundo colorido e a coluna já o comunicam imediatamente.
* **Duplo Acionamento Independente:**
  * **Arrastar:** Inicia o fluxo de transição com interceptação de auditoria;
  * **Clicar / Teclado (`Enter`/`Espaço`):** Abre a janela de detalhes completos (`SolicitacaoModal`), garantindo que o término de um arraste não acione falsos cliques.

```
┌─────────────────────────────────────────────────────────┐
│ ZEL-2026-0842                                           │
│ Iluminação Pública                                      │
│ Av. Brigadeiro Faria Lima, 1200 • Pinheiros             │
│                                              28/10/2026 │
└─────────────────────────────────────────────────────────┘
  [Fundo Pastel Dinâmico: #EDE194 / Texto Escuro #0F172A]
```

### 5.1. Elementos Visuais do Cartão
1. **Superfície e Elevação:** Fundo pastel dinâmico conforme o status, `border-radius: 6px`, borda sutil de 1px e sombra leve `0 1px 3px rgba(0,0,0,0.08)`.
2. **Protocolo:** Tipografia monoespaçada em negrito escuro (`0.72rem`) no canto superior esquerdo.
3. **Subcategoria e Endereço:** Texto escuro de alto contraste (`#0f172a` e `#1e293b`), com truncamento elegante.
4. **Data:** Carimbo temporal no canto inferior direito (`0.68rem`).
5. **Acessibilidade:** Elemento focável com `tabIndex={0}`, anel de foco visível e leitura de tela descritiva via `aria-label`.

---

## 6. Rolagem Vertical Invisível nas Colunas

Para manter uma interface esteticamente limpa e sem poluição de trilhos de rolagem de diferentes navegadores, as colunas do Kanban aplicam rolagem invisível:
* **CSS Cross-browser:**
  * Firefox: `scrollbar-width: none;`
  * IE / Edge legados: `-ms-overflow-style: none;`
  * Chrome, Safari e novos Edge: `&::-webkit-scrollbar { display: none; }`
* **Comportamento Funcional:** A rolagem vertical permanece 100% ativa e acessível através de scroll do mouse, trackpad, gestos touch ou teclas de navegação do teclado.

---

## 7. Modal de Detalhes da Solicitação e Auditoria Operacional (`SolicitacaoModal`)

Ao clicar em qualquer cartão do Kanban, um modal de consulta e auditoria é acionado, sobrepondo-se à tela com backdrop suave e foco acessível. Em alinhamento com a revisão de UX/UI, o modal foi enxugado para eliminar redundâncias, aplicar a paleta pastel oficial e compactar os elementos, garantindo visualização direta em telas padrão sem barra de rolagem vertical no seu corpo.

### 7.1. Cabeçalho Leve e Harmonização Cromática Pastel
* **Fundo Claro e Tipografia Escura:** O fundo pesado azul marinho foi substituído por uma superfície leve (branco/cinza claro `#ffffff` / `#f8fafc`) com textos escuros (`#0f172a`), garantindo leveza estética e alto contraste.
* **Padronização das Etiquetas de Status com Paleta Pastel:** A etiqueta de status do chamado no cabeçalho e as tags de transição na linha do tempo utilizam estritamente as cores da paleta pastel categórica do Kanban com texto escuro `#0f172a`:
  * **Pendente:** `#EDE194`
  * **Em análise:** `#BCDCF4`
  * **Em execução:** `#F9B188`
  * **Concluída:** `#D4E4BC`
  * **Descartada:** `#ECC4BC`

### 7.2. Layout Superior: Mídia Compacta Lado a Lado (140px a 160px)
* **Containers de Mídia Otimizados:** Tanto a foto da solicitação (identificada de forma direta e sem textos excedentes) quanto o container cartográfico georreferenciado possuem alturas reduzidas para cerca de `145px` (faixa de `140px` a `160px`), prevenindo a expansão excessiva do modal.
* **Mapa Georreferenciado:** Mantém o botão de navegação direta **"Abrir no Maps ↗"** apontando para as coordenadas GPS no Google Maps em nova aba com segurança (`target="_blank"`, `rel="noopener noreferrer"`).

### 7.3. Layout Central: Refinamento Semântico e Compactação do Solicitante
Para despoluir o layout, aplicar uma linguagem menos agressiva e otimizar o espaço vertical, a seção central é composta por:
1. **Endereço da Solicitação (Coluna 1):** Ajuste semântico no título (substituição de "Ocorrência" por "Solicitação"), preservando estritamente a disposição dos campos de Logradouro e Bairro/Cidade/CEP;
2. **Nome do Solicitante (Coluna 2 - Layout em 3 Linhas Limpas):** Disposição em 3 linhas aproveitando 100% da largura do bloco:
   - *Linha 1 (Inline):* Rótulo "Solicitante:" e o nome completo do munícipe alinhados horizontalmente na mesma linha;
   - *Linha 2 (50/50):* "CPF Registrado" na esquerda e "WhatsApp/Telefone" na direita, alinhados na mesma linha horizontal;
   - *Linha 3 (Centralizada):* "Abertura da Solicitação" centralizada perfeitamente em relação ao bloco todo;
3. **Limpeza de Redundâncias:** Exclusão definitiva dos campos "Ponto de Referência", "Categoria Geral", "E-mail de Contato", "Relato do Munícipe" e da frase explicativa do cabeçalho de auditoria, exibindo apenas o título limpo e a linha do tempo abaixo.

### 7.4. Exclusividade do Drag and Drop e Remoção do Dropdown de Status
* **Eliminação de Conflito de Fluxo:** A seção "Alterar Status da Solicitação" (elemento `<select>`, aviso condicional e botão de confirmação) foi completamente removida de dentro do `SolicitacaoModal`.
* **Fluxo Unificado via Drag and Drop:** A movimentação de status no sistema passa a ser **100% exclusiva via arrastar e soltar (Drag and Drop)** no quadro Kanban, garantindo que toda e qualquer transição passe obrigatoriamente pela validação e justificativa auditada do modal focado `ModalTransicaoAuditoria`.
* **Histórico Imutável de Auditoria:** O `SolicitacaoModal` preserva com exclusividade a consulta ao histórico cronológico (*audit log*) das transições anteriores, exibindo data/hora, responsável, justificativa documentada e as tags `status anterior ➔ novo status` coloridas segundo a paleta pastel correspondente.

---

## 8. Critérios de Acessibilidade (WCAG 2.1 AA / eMAG)

* **Teclado:** Fechamento de modais via tecla `Escape` (ESC), foco automático no primeiro campo de digitação ao abrir e armadilha de foco (*focus trap*).
* **Leitores de Tela:** Utilização dos atributos `role="dialog"`, `aria-modal="true"`, `aria-labelledby` e `aria-describedby`.
* **Cores e Contrastes:** Todos os textos e badges atendem à proporção mínima de contraste de 4.5:1 (texto normal) e 3:1 (componentes de interface) conforme o padrão WCAG AA.

---

## 9. Integração com a API Real e Normalizador de Status (`statusMapper.js`)

O Painel Kanban concluiu a transição dos dados simulados (*mocks*) para a integração em tempo real com a API REST Node.js/Express e o banco de dados Supabase/PostgreSQL.

### 9.1. Rotas Consumidas via `api.js`
* **Leitura Geral de Solicitações:** `GET /api/solicitacoes/admin`
  * Rota autenticada consumida pelo método `listarSolicitacoesAdmin()` ou `api.get()`.
  * Retorna todas as solicitações com relacionamentos (*joins*) de cidadão (`nome_completo`, `cpf`, `whatsapp`, `email`) e subcategoria (`nome`).
* **Atualização Auditada de Status:** `PATCH /api/solicitacoes/:id/status`
  * Rota acionada pelo método `atualizarStatusSolicitacao(id, payload)` ou `api.patch()`.
  * Recebe `{ status, justificativa_status, justificativa }`, atualiza a tabela `solicitacoes` e insere o carimbo imutável na tabela `audit_logs`.

### 9.2. Normalizador de Dados (Escudo do Frontend)
Para blindar o quadro Kanban contra inconsistências textuais ou legadas provenientes do banco, o módulo `statusMapper.js` aplica sanitização e mapeamento automático:
* Mapeia variações (`"Em Andamento"`, `"ANDAMENTO"`, `"em analise"`, `"PENDENTE"`, `"CONCLUIDO"`, `"DESCARTADO"`) estritamente nos 5 status oficiais:
  * `"Pendente"`
  * `"Em análise"`
  * `"Em execução"`
  * `"Concluída"`
  * `"Descartada"`
* Status desconhecidos adotam fallback automático para `"Pendente"`.
* A função `normalizarSolicitacao` formata os campos de endereço, solicitante, coordenadas e histórico de auditoria para compatibilidade imediata com os cartões e modais.

### 9.3. Estados de Carregamento e Tratamento de Erros
* **Estado de Carregamento (`loading`):** Indicador visual acessível com spinner animado e mensagem para leitores de tela durante a consulta inicial à API.
* **Banner de Erro (`erroCarregamento`):** Em caso de falha de conexão com o servidor, exibe aviso amigável na interface com botão de ação rápida "Tentar novamente" (`carregarSolicitacoes`).

---

## 10. Cobertura de Testes Automatizados para Fluxos Assíncronos

A integridade do Painel Kanban é garantida por uma suíte completa de testes automatizados no arquivo `PainelKanban.test.js`:
* **Simulação de API (Jest Mocks):** Interceptação das funções `listarSolicitacoesAdmin` e `atualizarStatusSolicitacao` do serviço `api.js`.
* **Cenários Cobertos:**
  1. Renderização do indicador de carregamento inicial (*loading state*);
  2. Tratamento e exibição do banner de erro com opção de nova tentativa;
  3. Renderização completa das 5 colunas e contadores da barra superior após carregamento assíncrono;
  4. Interceptação e bloqueio de drop para estados terminais ("Concluída" e "Descartada") acionando o modal estilizado `ModalAvisoBloqueio`;
  5. Liberação de drop para etapas ativas, validação de justificativa obrigatória e envio da requisição `PATCH` à API ao confirmar;
  6. Abertura e consulta de detalhes via clique no cartão através do `SolicitacaoModal`.
