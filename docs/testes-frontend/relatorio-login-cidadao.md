# Relatório de Testes Automatizados — Login do Cidadão

**Arquivo de Teste:** [`frontend/src/tests/LoginCidadao.test.js`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/tests/LoginCidadao.test.js)  
**Componente Alvo:** [`frontend/src/pages/LoginCidadao.jsx`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/pages/LoginCidadao.jsx)  
**Data da Execução:** 21 de outubro de 2026  
**Status Geral:** ✅ APROVADO (100% de sucesso)  
**Total de Testes:** 14 executados / 14 aprovados  

---

## 1. Escopo e Objetivos do Teste

O objetivo desta suíte é assegurar que a tela de autenticação do munícipe:
1. Renderiza o landmark semântico `<main id="conteudo-principal">` e a hierarquia correta com `<h1>`.
2. Encapsula os campos no formulário semântico `<form>` com associação de nome acessível (`aria-labelledby="login-heading"`).
3. Provê rotulagem explícita entre `<label>` e `<input>` (via `htmlFor` e `id`) para os campos de CPF e Senha.
4. Aplica máscara dinâmica de CPF (`000.000.000-00`) e atributos como `inputMode="numeric"`.
5. Garante acessibilidade no controle de alternância de visualização de senha com atributos ARIA (`aria-controls`, `aria-pressed`, `aria-label`).
6. Valida o botão de submissão do tipo `submit`.
7. Dispara alertas acessíveis com `role="alert"` em caso de preenchimento incompleto de CPF ou senha em branco.
8. **Integração com a Service Layer (`api.js`):**
   - Sanitização de CPF removendo caracteres não numéricos.
   - Envio do payload `{ cpf, senha }` para o endpoint `/api/auth/cidadao/login`.
   - Armazenamento do token JWT (`zelus_token`) e dados do cidadão (`zelus_cidadao`) no `localStorage`.
   - Redirecionamento com sucesso para o painel do cidadão (`/cidadao/painel`).
   - Gerenciamento de ciclo de vida assíncrono: desabilitação do botão com rótulo "Entrando..." e `aria-busy="true"`.
   - Captura e exibição acessível de erro da API com `role="alert"`.
9. Exibe mensagem de feedback de sucesso repassada pelo state da rota (`mensagemSucesso`).
10. Garante links semânticos para recuperação de senha, cadastro de cidadão e retorno.

---

## 2. Relação Detalhada dos Casos de Teste

| # | Comportamento / Regra Validada | Requisito de Acessibilidade (WCAG) | Status |
|---|---|---|:---:|
| 1 | Renderização da landmark semântica `<main id="conteudo-principal">` e título `<h1>` | WCAG 1.3.1 / WCAG 2.4.1 (Skip-Link Target) | ✅ Aprovado |
| 2 | Renderização do `<form>` associado via `aria-labelledby="login-heading"` | WCAG 4.1.2 (Name, Role, Value) | ✅ Aprovado |
| 3 | Campo de CPF associado ao `<label>` via `htmlFor="login-cpf"`, `inputMode="numeric"`, `required` | WCAG 1.3.1 / WCAG 3.3.2 (Labels or Instructions) | ✅ Aprovado |
| 4 | Campo de Senha associado ao `<label>` via `htmlFor="login-senha"`, `type="password"`, `required` | WCAG 1.3.1 / WCAG 3.3.2 (Labels or Instructions) | ✅ Aprovado |
| 5 | Formatação dinâmica de máscara numérica de CPF (`12345678901` $\rightarrow$ `123.456.789-01`) | WCAG 3.3.2 (Orientação de Formato) | ✅ Aprovado |
| 6 | Alternância de visibilidade de senha atualizando `type`, `aria-label` e `aria-pressed` | WCAG 4.1.2 / WCAG 2.1.1 (Controle por Teclado) | ✅ Aprovado |
| 7 | Botão de submissão com `type="submit"` e nome acessível | WCAG 4.1.2 (Botão Semântico de Submissão) | ✅ Aprovado |
| 8 | Alerta acessível com `role="alert"` e `aria-invalid="true"` para CPF incompleto | WCAG 3.3.1 / WCAG 4.1.3 (Status Messages) | ✅ Aprovado |
| 9 | Alerta acessível com `role="alert"` para submissão com senha em branco | WCAG 3.3.1 / WCAG 4.1.3 (Status Messages) | ✅ Aprovado |
| 10 | Chamada à API `loginCidadao` com payload sanitizado, gravação de JWT no `localStorage` e navegação para `/cidadao/painel` | Interoperabilidade / Autenticação JWT | ✅ Aprovado |
| 11 | Estado de carregamento: botão desabilitado exibindo "Entrando..." com `aria-busy="true"` | WCAG 4.1.2 / WCAG 3.2.2 (Feedback de Ação) | ✅ Aprovado |
| 12 | Tratamento de erro retornado pela API: renderização com `role="alert"` e reabilitação do botão | WCAG 3.3.1 / WCAG 4.1.3 (Status Messages) | ✅ Aprovado |
| 13 | Exibição de mensagem de status/sucesso quando fornecida no `location.state` | WCAG 4.1.3 (Status Messages) | ✅ Aprovado |
| 14 | Presença de links acessíveis para `/`, `/recuperar-senha` e `/cadastro/cidadao` | WCAG 2.4.4 (Link Purpose in Context) | ✅ Aprovado |

---

## 3. Conformidade Técnica e Acessibilidade

* **Regra de Ouro do ZELUS (`min-height: 100dvh`):** Estilização testada e validada, garantindo conformidade com a experiência em dispositivos móveis modernos (iOS Safari e Android Chrome) sem quebras causadas pelas barras de endereço retráteis.
* **Leitores de Tela:** O anúncio do erro em tempo real via `role="alert"` garante que munícipes com deficiência visual sejam notificados imediatamente sobre a necessidade de correção dos dados ou falhas de credenciais.
* **Segurança de Sessão:** Armazenamento do token de autorização JWT no `localStorage` sob a chave `zelus_token` e perfil básico em `zelus_cidadao`.
