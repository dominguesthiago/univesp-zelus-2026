# Relatório de Testes Automatizados — Cabeçalho Global (Header)

**Arquivo de Teste:** [`frontend/src/tests/Header.test.js`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/tests/Header.test.js)  
**Componente Alvo:** [`frontend/src/components/Header.jsx`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/components/Header.jsx)  
**Data da Execução:** 22 de outubro de 2026  
**Status Geral:** ✅ APROVADO (100% de sucesso)  
**Total de Testes:** 3 executados / 3 aprovados  

---

## 1. Escopo e Objetivos do Teste

O objetivo desta suíte (criada na refatoração do Painel do Cidadão) é assegurar que o `<Header>` global do ZELUS:
1. Não exibe o link "Sair" por padrão, preservando o cabeçalho institucional nas rotas públicas.
2. Exibe o link "Sair 🚪" no canto superior esquerdo, com o modificador `.header--com-sair`, quando a prop `mostrarSair` é verdadeira (área logada do cidadão).
3. Encerra a sessão local (remove `zelus_token` e `zelus_cidadao` do `localStorage`) e redireciona o usuário para `/login/cidadao` ao acionar o link.

---

## 2. Relação Detalhada dos Casos de Teste

| # | Comportamento / Regra Validada | Requisito de Acessibilidade (WCAG) | Status |
|---|---|---|:---:|
| 1 | Link "Sair" ausente por padrão (sem a prop `mostrarSair`), mantendo a marca "ZELUS" visível | WCAG 3.2.3 (Navegação Consistente) / Identidade ZELUS | ✅ Aprovado |
| 2 | Link "Sair" renderizado com `mostrarSair`, com rótulo acessível "Sair da conta e encerrar sessão", classe `.header__sair` e modificador `.header--com-sair` no `<header>` | WCAG 4.1.2 (Name, Role, Value) / WCAG 2.4.4 (Propósito do Link) | ✅ Aprovado |
| 3 | Clique em "Sair" remove `zelus_token` e `zelus_cidadao` do `localStorage` e navega para `/login/cidadao` | Segurança de Sessão / Fluxo de Autenticação SPA | ✅ Aprovado |

---

## 3. Conformidade Técnica e Acessibilidade

* **Rótulo Acessível:** o link "Sair" possui `aria-label="Sair da conta e encerrar sessão"` e o emoji 🚪 é marcado com `aria-hidden="true"`, evitando leitura redundante por leitores de tela.
* **Navegação por Teclado:** o item é um `<Link>` nativo (`<a>`), com suporte a `Tab` e `Enter` e anel de foco visível (`:focus-visible`).
* **Componente Retrocompatível:** a prop `mostrarSair` é opcional (padrão `false`); as demais rotas que usam o Header não sofrem alteração visual ou funcional.
* **Compactação Mobile:** no mobile o link ocupa uma linha fina (`font-size: 0.78rem`, padding reduzido) para não inflar a altura do cabeçalho; em telas ≥ 768 px ele permanece inline à esquerda.
