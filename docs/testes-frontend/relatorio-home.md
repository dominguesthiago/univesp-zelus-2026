# Relatório de Testes Automatizados — Página Inicial (Home)

**Arquivo de Teste:** [`frontend/src/tests/Home.test.js`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/tests/Home.test.js)  
**Componente Alvo:** [`frontend/src/pages/Home.jsx`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/pages/Home.jsx)  
**Data da Execução:** 21 de outubro de 2026  
**Status Geral:** ✅ APROVADO (100% de sucesso)  
**Total de Testes:** 5 executados / 5 aprovados  

---

## 1. Escopo e Objetivos do Teste

O objetivo desta suíte é assegurar que a tela inicial da aplicação ZELUS:
1. Renderiza a estrutura semântica rigorosa com o elemento `<main>` configurado como destino do skip-link acessível.
2. Apresenta a hierarquia correta de títulos (`<h1>` dentro do `<header>`).
3. Instancia os cartões de ação (`ActionCard`) semânticos com papéis interativos de botão (`<button>`) para munícipes e servidores municipais.
4. Garante o correto direcionamento de fluxo navegacional ao acionar o cartão do cidadão (`/login/cidadao`).
5. Renderiza a mensagem institucional inclusiva no rodapé semântico da página.

---

## 2. Relação Detalhada dos Casos de Teste

| # | Comportamento / Regra Validada | Requisito de Acessibilidade (WCAG) | Status |
|---|---|---|:---:|
| 1 | Renderização da landmark semântica `<main id="conteudo-principal">` com classe `.home` | WCAG 1.3.1 (Info and Relationships) / WCAG 2.4.1 (Bypass Blocks) | ✅ Aprovado |
| 2 | Renderização do título de nível 1 `<h1>` dentro de `<header>` ("Como deseja acessar o ZELUS?") | WCAG 1.3.1 (Hierarquia de Cabeçalhos) / WCAG 2.4.6 (Headings and Labels) | ✅ Aprovado |
| 3 | Renderização de botões acessíveis para os cartões "SOU CIDADÃO" e "ACESSO PREFEITURA" | WCAG 4.1.2 (Name, Role, Value) / Navegação por Teclado (WCAG 2.1.1) | ✅ Aprovado |
| 4 | Navegação assistida para `/login/cidadao` ao disparar o evento `onClick` do cartão cidadão | Fluxo de Autenticação / Interoperabilidade SPA | ✅ Aprovado |
| 5 | Presença da tagline institucional inclusiva no rodapé (`<footer>`) | WCAG 1.3.1 (Landmark Footer) / Identidade ZELUS | ✅ Aprovado |

---

## 3. Conformidade Técnica e Acessibilidade

* **Foco e Skip-Link:** O identificador `id="conteudo-principal"` garante que usuários navegando exclusivamente por teclado possam saltar o cabeçalho global institucional através do link de atalho e aterrissar diretamente no conteúdo da página Home.
* **Navegação por Teclado:** Os cartões utilizam tags nativas `<button>`, conferindo suporte automático às teclas `Tab`, `Enter` e `Espaço`.
