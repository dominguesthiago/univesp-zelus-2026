# Relatório de Testes Automatizados — Banner de Privacidade e Cookies

**Arquivo de Teste:** [`frontend/src/tests/CookieBanner.test.js`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/tests/CookieBanner.test.js)  
**Componente Alvo:** [`frontend/src/components/CookieBanner.jsx`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/components/CookieBanner.jsx)  
**Data da Execução:** 21 de outubro de 2026  
**Status Geral:** ✅ APROVADO (100% de sucesso)  
**Total de Testes:** 4 executados / 4 aprovados  

---

## 1. Escopo e Objetivos do Teste

O objetivo desta suíte é assegurar a conformidade com a LGPD (Lei Geral de Proteção de Dados) e acessibilidade do banner flutuante:
1. Renderização do aviso de privacidade e cookies quando o termo não tiver sido previamente aceito no `localStorage`.
2. Ocultação automática do componente quando a chave `zelus_cookies_accepted = 'true'` já estiver gravada.
3. Gravação da concordância do usuário no `localStorage` e encerramento visual do banner ao acionar o botão de aceite.
4. Presença de link semântico acessível apontando para a página de Política de Privacidade (`/politica-privacidade`).

---

## 2. Relação Detalhada dos Casos de Teste

| # | Comportamento / Regra Validada | Requisito de Acessibilidade (WCAG) | Status |
|---|---|---|:---:|
| 1 | Renderização do aviso de privacidade com landmark de diálogo acessível | WCAG 4.1.2 / LGPD Art. 7º e 9º | ✅ Aprovado |
| 2 | Não renderização caso o usuário já tenha aceito anteriormente os termos | UX / Persistência Local | ✅ Aprovado |
| 3 | Persistência de `zelus_cookies_accepted: true` no `localStorage` e fechamento do banner | LGPD / Ciclo de Vida React | ✅ Aprovado |
| 4 | Presença de link semântico para a Política de Privacidade | WCAG 2.4.4 (Propósito do Link em Contexto) | ✅ Aprovado |

---

## 3. Conformidade Técnica e Acessibilidade

* **Landmark e Diálogo:** O banner é estruturado para não bloquear o foco do usuário indevidamente, permitindo navegação via teclado com foco perceptível e encerramento sem dependência exclusiva de mouse.
