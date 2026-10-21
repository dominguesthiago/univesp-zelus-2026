# Relatório de Testes Automatizados — Componente ActionCard

**Arquivo de Teste:** [`frontend/src/tests/ActionCard.test.js`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/tests/ActionCard.test.js)  
**Componente Alvo:** [`frontend/src/components/ActionCard.jsx`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/components/ActionCard.jsx)  
**Data da Execução:** 21 de outubro de 2026  
**Status Geral:** ✅ APROVADO (100% de sucesso)  
**Total de Testes:** 4 executados / 4 aprovados  

---

## 1. Escopo e Objetivos do Teste

O objetivo desta suíte é assegurar que o componente reutilizável `ActionCard`:
1. Renderiza o título no nível semântico `<h2>` e a descrição textual correspondente.
2. Trata imagens decorativas de forma acessível (aplicando `alt=""` e `aria-hidden="true"` quando nenhum texto alternativo for explicitado).
3. Provê um botão nativo `<button type="button">` acessível via teclado e aciona corretamente o callback `onClick`.
4. Aplica as classes CSS temáticas de cores cartum (`card-citizen`, `card-admin`, etc.) no elemento envoltório semântico `<article>`.

---

## 2. Relação Detalhada dos Casos de Teste

| # | Comportamento / Regra Validada | Requisito de Acessibilidade (WCAG) | Status |
|---|---|---|:---:|
| 1 | Renderização do título em `<h2>` e da descrição em `<p>` | WCAG 1.3.1 (Hierarquia e Estrutura) | ✅ Aprovado |
| 2 | Tratamento de imagem decorativa com `alt=""` e `aria-hidden="true"` | WCAG 1.1.1 (Conteúdo Não Textual Decorativo) | ✅ Aprovado |
| 3 | Disparo do evento `onClick` mockado ao clicar no `<button>` com nome acessível | WCAG 2.1.1 (Acessível por Teclado) / WCAG 4.1.2 | ✅ Aprovado |
| 4 | Aplicação da classe de cor temática no elemento semântico `<article>` | Design System ZELUS / Tokens de Estilo | ✅ Aprovado |

---

## 3. Conformidade Técnica e Acessibilidade

* **Botões Nativos vs Divs Clicáveis:** O componente adota estritamente a tag `<button>`, dispensando hacks de `tabIndex` ou listeners artificiais de `onKeyDown` e garantindo foco visível nativo de alta visibilidade.
* **Semântica HTML5:** O invólucro em `<article>` confere autonomia ao bloco de conteúdo na árvore de acessibilidade.
