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
* O operador pode transicionar uma solicitação para qualquer uma das colunas, desde que registre o respectivo motivo de auditoria.
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

## 7. Modal de Detalhes da Solicitação e Auditoria Completa

Ao clicar em qualquer cartão do Kanban, um modal centralizado de grandes dimensões é acionado, sobrepondo-se à tela com um backdrop escuro e foco acessível.

### 7.1. Layout Superior: Foto e Mapa Lado a Lado
* **Painel da Foto (Esquerda):**
  * Exibição em escala ampliada da foto original capturada pelo munícipe no local.
  * Legenda com data de captura e opção de ampliação/visualização detalhada.
* **Painel do Mapa (Direita):**
  * Renderização visual estilizada da localização geográfica da ocorrência com coordenadas de latitude e longitude.
  * Botão de Ação Direta: **"Abrir no Google Maps ↗"**, com atributo estrito `target="_blank"` e `rel="noopener noreferrer"`, abrindo a rota de navegação direta nas coordenadas exatas registradas via GPS:
    `https://www.google.com/maps?q=${latitude},${longitude}`.

### 7.2. Layout Central: Dados Completos da Ocorrência
* **Endereço e Localização Detalhada:** Logradouro, Número, Bairro, Cidade, CEP e Ponto de Referência cadastrado.
* **Dados do Cidadão Solicitante:** Nome completo do munícipe, CPF formatado, telefone / WhatsApp e e-mail.
* **Informações do Chamado:** Protocolo gerado, data/hora da abertura, categoria, subcategoria e descrição detalhada.

### 7.3. Seção de Auditoria e Alteração de Status no Modal
1. Dropdown seletor com os 5 status operacionais;
2. Campo `textarea` obrigatório para preenchimento de justificativa ao selecionar status divergente do atual;
3. Histórico cronológico reversível (*timeline*) de todas as movimentações anteriores registradas no chamado.

---

## 8. Critérios de Acessibilidade (WCAG 2.1 AA / eMAG)

* **Teclado:** Fechamento de modais via tecla `Escape` (ESC), foco automático no primeiro campo de digitação ao abrir e armadilha de foco (*focus trap*).
* **Leitores de Tela:** Utilização dos atributos `role="dialog"`, `aria-modal="true"`, `aria-labelledby` e `aria-describedby`.
* **Cores e Contrastes:** Todos os textos e badges atendem à proporção mínima de contraste de 4.5:1 (texto normal) e 3:1 (componentes de interface) conforme o padrão WCAG AA.
