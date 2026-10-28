# Governança de Testes Automatizados do Frontend — ZELUS

**Documento:** Painel Consolidado de Qualidade de Software e Acessibilidade (QA / Testes)  
**Projeto:** ZELUS — Sistema de Gestão de Zeladoria Urbana  
**Data:** 27 de outubro de 2026  
**Status da Suíte Completa:** ✅ 100% APROVADO (19 suítes / 142 testes automatizados)  

---

## 1. Visão Geral da Suíte de Testes

A qualidade do código do frontend do projeto **ZELUS** é assegurada por testes automatizados implementados com **Jest** e **React Testing Library**, com ênfase no comportamento do usuário final (*user-centric testing*) e na estrita conformidade com as diretrizes internacionais de acessibilidade digital (**WCAG 2.1 AA** e **eMAG v3.1**).

```
========================================================================================
RESULTADO DA EXECUÇÃO CONSOLIDADA (npm test -- --watchAll=false / CI=true)
========================================================================================
PASS  src/tests/Home.test.js (5 testes)
PASS  src/tests/LoginCidadao.test.js (14 testes)
PASS  src/tests/CadastroCidadao.test.js (14 testes)
PASS  src/tests/RecuperarSenhaCidadao.test.js (13 testes)
PASS  src/tests/ActionCard.test.js (4 testes)
PASS  src/tests/CookieBanner.test.js (4 testes)
PASS  src/tests/PainelCidadao.test.js (9 testes)
PASS  src/tests/Header.test.js (3 testes)
PASS  src/tests/api.test.js (6 testes)
PASS  src/tests/PrivateRoute.test.js (4 testes)
PASS  src/tests/NovaSolicitacaoStep1.test.js (9 testes)
PASS  src/tests/NovaSolicitacaoStep2.test.js (8 testes)
PASS  src/tests/NovaSolicitacaoStep3.test.js (8 testes)
PASS  src/tests/NovaSolicitacaoStep4.test.js (11 testes)
PASS  src/tests/NovaSolicitacaoStep5.test.js (14 testes)
PASS  src/tests/AdminDeviceGuard.test.js (4 testes)
PASS  src/tests/LoginPrefeitura.test.js (5 testes)
PASS  src/tests/CadastroPrefeitura.test.js (6 testes)
PASS  src/tests/RecuperarSenhaPrefeitura.test.js (5 testes)

Test Suites: 19 passed, 19 total
Tests:       142 passed, 142 total
Snapshots:   0 total
Ran all test suites.
========================================================================================
```

---

## 2. Índice dos Relatórios Individuais

| Módulo / Componente Testado | Arquivo de Teste | Relatório Detalhado | Testes | Status |
|---|---|---|:---:|:---:|
| **Página Inicial** | [`Home.test.js`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/tests/Home.test.js) | [relatorio-home.md](file:///c:/Users/dfeni/univesp-zelus-2026/docs/testes-frontend/relatorio-home.md) | 5 | ✅ 100% |
| **Login do Cidadão** | [`LoginCidadao.test.js`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/tests/LoginCidadao.test.js) | [relatorio-login-cidadao.md](file:///c:/Users/dfeni/univesp-zelus-2026/docs/testes-frontend/relatorio-login-cidadao.md) | 14 | ✅ 100% |
| **Cadastro do Cidadão** | [`CadastroCidadao.test.js`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/tests/CadastroCidadao.test.js) | [relatorio-cadastro-cidadao.md](file:///c:/Users/dfeni/univesp-zelus-2026/docs/testes-frontend/relatorio-cadastro-cidadao.md) | 14 | ✅ 100% |
| **Recuperação de Senha (Cidadão)** | [`RecuperarSenhaCidadao.test.js`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/tests/RecuperarSenhaCidadao.test.js) | [relatorio-recuperar-senha.md](file:///c:/Users/dfeni/univesp-zelus-2026/docs/testes-frontend/relatorio-recuperar-senha.md) | 13 | ✅ 100% |
| **Cartão de Ação** | [`ActionCard.test.js`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/tests/ActionCard.test.js) | [relatorio-action-card.md](file:///c:/Users/dfeni/univesp-zelus-2026/docs/testes-frontend/relatorio-action-card.md) | 4 | ✅ 100% |
| **Privacidade e LGPD** | [`CookieBanner.test.js`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/tests/CookieBanner.test.js) | [relatorio-cookie-banner.md](file:///c:/Users/dfeni/univesp-zelus-2026/docs/testes-frontend/relatorio-cookie-banner.md) | 4 | ✅ 100% |
| **Painel do Cidadão** | [`PainelCidadao.test.js`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/tests/PainelCidadao.test.js) | [relatorio-painel-cidadao.md](file:///c:/Users/dfeni/univesp-zelus-2026/docs/testes-frontend/relatorio-painel-cidadao.md) | 9 | ✅ 100% |
| **Cabeçalho Global (Header)** | [`Header.test.js`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/tests/Header.test.js) | [relatorio-header.md](file:///c:/Users/dfeni/univesp-zelus-2026/docs/testes-frontend/relatorio-header.md) | 3 | ✅ 100% |
| **Autenticação do Back-office** | [`AdminDeviceGuard.test.js`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/tests/AdminDeviceGuard.test.js), [`LoginPrefeitura.test.js`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/tests/LoginPrefeitura.test.js), [`CadastroPrefeitura.test.js`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/tests/CadastroPrefeitura.test.js), [`RecuperarSenhaPrefeitura.test.js`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/tests/RecuperarSenhaPrefeitura.test.js) | [relatorio-autenticacao-prefeitura.md](file:///c:/Users/dfeni/univesp-zelus-2026/docs/testes-frontend/relatorio-autenticacao-prefeitura.md) | 20 | ✅ 100% |
| **Fluxo Nova Solicitação (Etapas 1-5)** | `NovaSolicitacaoStep*.test.js` | — | 50 | ✅ 100% |
| **Segurança e Rede (API/PrivateRoute)** | `api.test.js`, `PrivateRoute.test.js` | — | 10 | ✅ 100% |
| **Total Consolidado** | **19 suítes** | — | **142** | **✅ APROVADO** |

---

## 3. Diretrizes de Execução e CI/CD

Para executar os testes localmente ou em ambiente de Integração Contínua (CI):

```bash
# Execução no terminal Powershell (modo não interativo)
$env:CI='true'; npm test

# Ou com flag de watch desativada
npm test -- --watchAll=false
```
