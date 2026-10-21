# Registro de Rastreabilidade de Prompt de IA — Refatoração Semântica da Tela Inicial

**Documento:** Registro de Governança de Engenharia de Prompt  
**ID do Registro:** `16-home-refatoracao-semantica`  
**Fase do Projeto:** Fase 2 — Frontend, Governança e Experiência do Usuário (ZELUS)  
**Etapa:** Refatoração Semântica HTML5 e Padronização de Design Tokens da Home (`Home.jsx`, `Home.scss`, `ActionCard.jsx`, `ActionCard.scss`)  
**Data/Hora do Registro:** 20 de outubro de 2026 - 18:25 (UTC-03:00)  
**Status:** Executado e Validado  

---

## 1. Metadados do Registro

* **Identificador Único:** `PROMPT-FE-HOME-SEMANTIC-REFACTOR-015`
* **Módulo:** Tela Inicial e Componente ActionCard
* **Objetivo:** Eliminar o excesso de tags genéricas (`<div>`), reestruturando a página Home e os cartões de ação sob o padrão semântico estrito do HTML5 (`<main>`, `<header>`, `<section>`, `<article>`, `<footer>` e `<button>`), garantindo o uso rigoroso das variáveis globais de estilo (`_variables.scss`), total conformidade WCAG 2.1 AA e fidelidade absoluta aos mockups (`Gemini_Generated_Image_2.jpeg` para desktop e `1_2.jfif` para mobile).
* **Ferramenta de IA:** Antigravity AI Assistant
* **Persona:** Engenheiro de Frontend Sênior

---

## 2. Prompt Original Transcrito

```text
Atuando como Engenheiro de Frontend Sênior, vamos refatorar a Tela Inicial (Home.jsx e Home.scss) do projeto ZELUS. O objetivo é manter o visual 100% idêntico aos mockups (Gemini_Generated_Image_2.jpeg para Desktop e 1_2.jfif para Mobile), mas corrigindo a estrutura técnica para que seja totalmente semântica, limpa e de nível de produção (sem excesso de divs genéricas).

A tua tarefa agora:

Refatora a marcação HTML da Home.jsx utilizando tags semânticas corretas (<main>, <section>, <header>, <footer>, <article> para os cartões de ação).

Ajusta o Home.scss e ActionCard.scss garantindo o uso estrito das variáveis globais (_variables.scss) para cores, fontes e bordas cartum.

Assegura a responsividade perfeita: cartões lado a lado em telas largas (Desktop) e empilhados fluidamente em ecrãs móveis, sem barras de rolagem vertical desnecessárias e com os espaçamentos perfeitamente harmonizados em relação ao cabeçalho.

Cria ou atualiza o documento de rastreabilidade em docs/prompts-ia/frontend/15-home-refatoracao-semantica.md.

Realiza as alterações, compila o projeto com sucesso e avisa-me para validarmos no navegador.
```

---

## 3. Decisões Arquiteturais e Entregas Vinculadas

### 3.1 Marcação Semântica HTML5 de Produção

1. **[`Home.jsx`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/pages/Home.jsx):**
   * `<main className="home container" id="conteudo-principal">`: Ponto focal principal de conteúdo da rota inicial, destino do skip-link acessível.
   * `<header className="home__header">`: Cabeçalho contextual contendo o título primário `<h1 className="home__title">Como deseja acessar o ZELUS?</h1>`.
   * `<section className="home__cards" aria-label="Opções de acesso ao sistema ZELUS">`: Seção semântica delimitando o agrupamento de cartões de acesso.
   * `<footer className="home__footer">`: Rodapé interno da Home exibindo a tagline `<p className="home__tagline">ZELUS • Acessível e inclusivo para todos</p>`.

2. **[`ActionCard.jsx`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/components/ActionCard.jsx):**
   * `<article className="action-card ...">`: Elemento autônomo e semântico representando a unidade de ação/serviço.
   * `<button type="button" className="action-card__button" ...>`: Botão interativo nativo contido no `<article>`, viabilizando navegação e foco de teclado por padrão (WCAG 2.1.1 / 2.4.7).
   * `<img className="action-card__image" ...>`: Ilustração temática posicionada na metade esquerda do card.
   * `<div className="action-card__body">`: Bloco de texto contendo o título em `<h2 className="action-card__title">` e a descrição em `<p className="action-card__description">`.

3. **[`App.js`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/App.js):**
   * Desacoplamento da casca `<main>` externa para evitar aninhamento inválido de `<main>` dentro de `<main>`, conferindo a cada rota seu próprio elemento de landmark semântico.
   * Condicionamento do `<Footer />` global para não duplicar a tagline nas rotas que já a possuem de forma nativa (`/` e `/login/...`).

### 3.2 Uso Estrito de Design Tokens (`_variables.scss`)

Foram consolidados os seguintes tokens de identidade visual em [`_variables.scss`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/styles/_variables.scss):
* **Cores Institucionais:** `$color-primary` (`#1a3458`), `$color-secondary` (`#aaebd3`), `$color-accent` (`#fbd362`), `$color-surface` (`#ffffff`), `$color-text-primary` (`#1a1a24`).
* **Bordas Cartum:** `$border-cartoon` (`3px solid $color-text-primary`), `$border-cartoon-lg` (`3.5px solid $color-text-primary`).
* **Arredondamento Cartum:** `$border-radius-cartoon` (`20px`), `$border-radius-cartoon-lg` (`28px`).
* **Sombras Cartum:** `$shadow-cartoon` (`4px 4px 0 $color-text-primary`), `$shadow-cartoon-lg` (`6px 6px 0 $color-text-primary`), `$shadow-cartoon-hover` (`9px 9px 0 $color-text-primary`).

### 3.3 Responsividade e Zero Scroll

* **Desktop (`≥ 768px`):** Grid de duas colunas amplas (`max-width: 1020px; gap: 32px`) com cartões em diagramação horizontal de `220px` de altura.
* **Mobile (`< 768px`):** Layout empilhado (`max-width: 375px; gap: 14px`) com cartões de `135px` mantendo a diagramação horizontal interna, título compacto e espaçamentos equilibrados, garantindo visualização completa em telas de 600px a 700px sem qualquer rolagem vertical.

---

## 4. Verificação Técnica

- **Compilação Contínua:** Webpack Dev Server compilou com sucesso (`Compiled successfully`).
- **Suíte de Testes Automatizados:** 100% de aprovação em todos os testes unitários (`npm test` — 8 testes aprovados).
- **Build de Produção:** Concluído com êxito via `npm run build`.

---

## 5. Calibração de Espaçamentos Verticais e Ajuste Fino Mobile

Em atendimento aos testes visuais:
1. **Eliminação do Espaço Vazio Excessivo Abaixo do Rodapé:**
   - Adicionada a classe `.app-layout--home` em [`App.js`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/App.js) com fundo unificado `$color-surface` (`#ffffff`) em [`global.scss`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/styles/global.scss), eliminando quaisquer faixas cinzas residuais.
   - Substituída a restrição rígida de altura (`min-height: calc(100vh - 120px)`) por `min-height: calc(100vh - 56px)` / `calc(100dvh - 56px)`, garantindo preenchimento fluido e contínuo da viewport.
2. **Harmonização de Proporções:**
   - No contêiner [`Home.scss`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/pages/Home.scss), a distribuição vertical das seções foi calibrada com `justify-content: center` e margens fluidas (`clamp`), mantendo o título, os cartões e o rodapé agrupados de forma coesa e elegante tanto em mobile quanto em desktop.
   - Em [`ActionCard.scss`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/components/ActionCard.scss), a altura dos cartões no mobile foi ajustada fluidamente (`clamp(138px, 18vh, 168px)`), escalando proporcionalmente com telas mais altas sem forçar barras de rolagem.

---

## 6. Eliminação Definitiva do Scroll Vertical e Ancoragem do Rodapé

Em atendimento aos testes visuais (`image_349c00.png` e `image_34a022.png`):
1. **Eliminação do Scroll Vertical em Todas as Resoluções:**
   * Em [`global.scss`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/styles/global.scss), a classe `.app-layout--home` recebeu `height: 100vh; height: 100dvh; overflow: hidden;` e `.app-main` recebeu `min-height: 0;`.
   * No [`Home.scss`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/pages/Home.scss), o contêiner `.home` foi ajustado com `height: 100%; min-height: 0; padding: vars.$spacing-xs vars.$spacing-md;` (mobile) e `padding: vars.$spacing-sm vars.$spacing-lg;` (desktop).
   * No [`ActionCard.scss`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/components/ActionCard.scss), a altura no desktop foi flexibilizada com `clamp(170px, 25vh, 220px)`, evitando que telas de menor altura (ex: 1024x600) gerem rolagem vertical.
2. **Ancoragem Perfeita do Rodapé (`home__footer`):**
   * Configurado `margin-top: auto; margin-bottom: 0; padding: vars.$spacing-xs 0; flex-shrink: 0;` no elemento `.home__footer`.
   * Configurado `margin-top: auto;` no `.home__header`, garantindo que o bloco central (Título + Cartões de Ação) fique perfeitamente centralizado verticalmente no espaço útil, enquanto o rodapé permanece ancorado rente à borda inferior da tela, sem flutuar no meio e sem transbordar.
3. **Validação Visual e Automatizada:**
   * Testado em Desktop (1280x800 e 1024x600) e Mobile (375x667 e 390x844): `scrollHeight === clientHeight === innerHeight` em todas as resoluções (zero barras de rolagem vertical ou lateral).
   * 100% dos testes unitários aprovados (`npm test` — 8/8) e build de produção concluído com êxito (`npm run build`).
