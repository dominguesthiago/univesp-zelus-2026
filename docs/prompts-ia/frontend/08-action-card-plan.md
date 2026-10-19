# Registro de Rastreabilidade de Prompt de IA — Arquitetura do Componente ActionCard

**Documento:** Registro de Governança de Engenharia de Prompt  
**ID do Registro:** `08-action-card-plan`  
**Fase do Projeto:** Fase 2 — Frontend, Governança e Experiência do Usuário (ZELUS)  
**Etapa:** Componente 03 — Card de Ação da Tela Inicial  
**Data/Hora do Registro:** 19 de outubro de 2026 - 18:39 (UTC-03:00)  
**Status:** Executado e Arquivado  

---

## 1. Metadados do Registro

### 1.1 Identificador, Data/Hora e Contexto de Execução
* **Identificador Único:** `PROMPT-FE-ACTION-CARD-008`
* **Módulo:** Componentes Reutilizáveis de Frontend / Tela Inicial
* **Objetivo:** Projetar e implementar o `ActionCard`, componente reutilizado duas vezes na tela inicial (Cidadão e Prefeitura), com estilo "cartum", acessível por teclado e integrado ao Design System.
* **Ferramenta de IA:** Antigravity AI Assistant

### 1.2 Papel Assumido (*Persona*)
* **Papel Designado:** Engenheiro de Frontend Sênior
* **Responsabilidade:** Definir a API do componente (props), a semântica acessível, o visual e os assets provisórios.

---

## 2. Prompt Original Transcrito

### 2.1 Transcrição Integral do Prompt de Planejamento

```text
Atuando como Engenheiro de Frontend Sênior, nosso próximo passo é planejar o componente ActionCard, que será utilizado duas vezes na tela inicial (Cidadão e Prefeitura).

Sua Tarefa Agora:
NÃO gere o código final do componente ou os placeholders ainda. Elabore apenas um Plano de Ação detalhando a arquitetura.

Mapeamento para o Plano de Ação:

frontend/src/components/ActionCard.jsx: Detalhe o componente funcional que recebe as props: title, description, imageSrc, altText, colorClass (ex: 'card-citizen', 'card-admin') e onClick.

frontend/src/components/ActionCard.scss: Detalhe o visual com bordas grossas (estilo cartum) para delimitação de UI, uso de Flexbox (lado a lado no desktop, empilhado no mobile), preenchimento adaptativo e transição de elevação no estado de :hover.

Imagens Placeholders: Liste que precisaremos gerar por script frontend/src/assets/images/ilustracao-cidadao.png e frontend/src/assets/images/ilustracao-prefeitura.png com tamanhos de 600x450px.

docs/prompts-ia/frontend/08-action-card-plan.md: Confirme a criação deste arquivo para registro do planejamento.

Devolva estritamente o Plano de Ação. Termine perguntando se o plano está aprovado para a geração do código.
```

### 2.2 Transcrição do Prompt de Execução (Aprovação)

```text
O Plano de Ação do componente ActionCard está 100% aprovado. Pode prosseguir.

Sua Tarefa Agora:
Execute fisicamente as seguintes ações na ordem:

Gere os dois arquivos PNG placeholder (ilustracao-cidadao.png e ilustracao-prefeitura.png) via script e salve-os em frontend/src/assets/images/.

Crie o arquivo frontend/src/components/ActionCard.jsx aplicando a semântica de botão e as propriedades planejadas.

Crie o arquivo frontend/src/components/ActionCard.scss aplicando as bordas grossas (cartum), a sombra sólida e o layout interno empilhado (column).

Crie fisicamente o arquivo docs/prompts-ia/frontend/08-action-card-plan.md com o registro deste planejamento.

Gere os códigos completos e crie todos os arquivos. Me avise apenas quando a criação for concluída com sucesso.
```

---

## 3. Decisões Arquiteturais e Entregas Vinculadas

### 3.1 Artefatos Gerados
1. [ilustracao-cidadao.png](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/assets/images/ilustracao-cidadao.png) e [ilustracao-prefeitura.png](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/assets/images/ilustracao-prefeitura.png)
   * **PLACEHOLDERS TEMPORÁRIOS** (600×450 px, gerados por script PowerShell/System.Drawing, ~8 KB cada). Devem ser **substituídos pelas ilustrações oficiais do time de design, mantendo exatamente os mesmos nomes**.
2. [ActionCard.jsx](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/components/ActionCard.jsx)
   * Props: `title`, `description`, `imageSrc`, `altText`, `colorClass`, `onClick`.
   * O elemento interativo é um `<button>` nativo (foco e Enter/Espaço sem ARIA extra), com `aria-label="Acessar {title}"` para distinguir os dois cards em leitores de tela.
   * `altText` vazio torna a imagem decorativa (`alt=""` + `aria-hidden="true"`), conforme o `LEIA-ME-ASSETS.md`.
   * Título como `<h2>`: pressupõe um `<h1>` na página (a definir na `HomePage`).
   * `PropTypes` não está instalado; as props foram documentadas em JSDoc, sem nova dependência.
3. [ActionCard.scss](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/components/ActionCard.scss)
   * Borda de 4px, sombra sólida deslocada (6px 6px 0), conteúdo interno sempre empilhado (`flex-direction: column`).
   * Temas `.card-citizen` (verde) e `.card-admin` (azul) com fundos claros.
   * Elevação em `:hover` e `:focus-within`; sem deslocamento sob `prefers-reduced-motion`.
   * Override do anel de foco do botão (o global #0d47a1 teria baixo contraste sobre o botão azul).
4. [08-action-card-plan.md](file:///c:/Users/dfeni/univesp-zelus-2026/docs/prompts-ia/frontend/08-action-card-plan.md)
   * Este registro.

### 3.2 Decisão de Layout Confirmada
* Os dois cards ficam **lado a lado na Home** (grid a ser definido na `HomePage`); o **conteúdo de cada card é empilhado**.

### 3.3 Pendências Registradas
* Substituir as duas ilustrações pelos assets oficiais.
* `ActionCard` e `Header` ainda **não estão integrados** ao `App.js` / `HomePage`.
* Os contrastes citados no plano foram estimados a partir das cores dos tokens; **não foram medidos com ferramenta**, e o build não foi executado.

---

## 4. Referências e Padrões Aplicados

1. **W3C/WAI WCAG 2.1**: Critérios 1.1.1, 1.4.3, 1.4.11, 2.1.1, 2.3.3, 2.4.7 e 2.5.5.
2. [LEIA-ME-ASSETS.md](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/assets/images/LEIA-ME-ASSETS.md): contrato de nomenclatura e acessibilidade de imagens.
