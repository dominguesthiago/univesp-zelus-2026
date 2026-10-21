# Relatório de Testes Automatizados — Cadastro do Cidadão

**Arquivo de Teste:** [`frontend/src/tests/CadastroCidadao.test.js`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/tests/CadastroCidadao.test.js)  
**Componente Alvo:** [`frontend/src/pages/CadastroCidadao.jsx`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/pages/CadastroCidadao.jsx)  
**Data da Execução:** 21 de outubro de 2026  
**Status Geral:** ✅ APROVADO (100% de sucesso)  
**Total de Testes:** 14 executados / 14 aprovados  

---

## 1. Escopo e Objetivos do Teste

O objetivo desta suíte é assegurar a integridade visual, semântica e funcional da tela de Cadastro do Cidadão, incluindo:
1. Renderização da landmark `<main id="conteudo-principal">` e do título semântico `<h1>`.
2. Encapsulamento dos 5 campos obrigatórios no `<form>` semântico com associação acessível `aria-labelledby="cadastro-heading"`.
3. Associação unívoca entre `<label>` e `<input>` (via `htmlFor` e `id`) para todos os 5 campos: Nome Completo, CPF, E-mail, Telefone e Senha.
4. Aplicação de máscaras automáticas nos campos de CPF (`000.000.000-00`) e Telefone (`(00) 90000-0000`).
5. Alternância de visibilidade da senha com atualização dos atributos ARIA (`aria-controls`, `aria-pressed`, `aria-label`).
6. Validação estrita das **Regras de Negócio de Frontend**:
   - **Nome Completo:** Deve conter pelo menos duas palavras e apenas letras.
   - **CPF:** Exatamente 14 caracteres com máscara.
   - **E-mail:** Formato válido contendo `@` e domínio.
   - **Telefone:** Exatamente 15 caracteres com máscara.
   - **Senha:** Mínimo de 8 caracteres, contendo pelo menos uma letra e um número.
7. Tratamento de mensagens de erro assistivas (`role="alert"` e `aria-live="polite"`).
8. **Integração com a Service Layer (`api.js`):**
   - Sanitização de CPF e Telefone (remoção de caracteres não numéricos).
   - Montagem e envio do payload JSON `{ nome_completo, cpf, email, whatsapp, senha }` para `registrarCidadao`.
   - Gerenciamento de ciclo de vida: desabilitação do botão e exibição de "Cadastrando..." com `aria-busy="true"`.
   - Redirecionamento bem-sucedido para `/login/cidadao` transmitindo a mensagem de sucesso no route state.
   - Captura e exibição acessível de erros de API (ex: conflito de CPF ou E-mail).
9. Links semânticos de navegação para a rota de login.

---

## 2. Relação Detalhada dos Casos de Teste

| # | Comportamento / Regra Validada | Requisito de Acessibilidade (WCAG) | Status |
|---|---|---|:---:|
| 1 | Renderização da landmark `<main id="conteudo-principal">` e título `<h1>` | WCAG 1.3.1 / WCAG 2.4.1 (Skip-Link Target) | ✅ Aprovado |
| 2 | Renderização do `<form>` semântico associado ao título via `aria-labelledby` | WCAG 4.1.2 (Name, Role, Value) | ✅ Aprovado |
| 3 | Presença e associação dos 5 campos (Nome, CPF, E-mail, Telefone, Senha) aos seus `<label>` | WCAG 1.3.1 / WCAG 3.3.2 (Rotulagem Explícita) | ✅ Aprovado |
| 4 | Aplicação correta de máscaras de digitação em CPF e Telefone | WCAG 3.3.2 (Auxílio na Entrada de Dados) | ✅ Aprovado |
| 5 | Alternância de visibilidade da senha atualizando `type`, `aria-label` e `aria-pressed` | WCAG 4.1.2 / WCAG 2.1.1 (Acessibilidade de Controles) | ✅ Aprovado |
| 6 | Validação de Nome Completo: rejeita vazio, palavra única ou caracteres numéricos/símbolos | WCAG 3.3.1 / Regra de Negócio ZELUS | ✅ Aprovado |
| 7 | Validação de CPF: exige exatamente 14 caracteres com a máscara (11 dígitos) | WCAG 3.3.1 / Regra de Negócio ZELUS | ✅ Aprovado |
| 8 | Validação de E-mail: exige estrutura formal com `@` e domínio válido | WCAG 3.3.1 / Requisito Crítico de Backend | ✅ Aprovado |
| 9 | Validação de Telefone: exige exatamente 15 caracteres com a máscara (DDD + 9 dígitos) | WCAG 3.3.1 / Regra de Negócio ZELUS | ✅ Aprovado |
| 10 | Validação de Senha: exige $\ge 8$ caracteres com combinação de pelo menos 1 letra e 1 número | WCAG 3.3.1 / Segurança e Integridade | ✅ Aprovado |
| 11 | Submissão com sucesso: envia payload sanitizado à API e redireciona para `/login/cidadao` | Interoperabilidade / Service Layer | ✅ Aprovado |
| 12 | Estado de carregamento: desabilita botão e exibe "Cadastrando..." com `aria-busy="true"` | WCAG 4.1.2 / WCAG 3.2.2 (Feedback de Ação) | ✅ Aprovado |
| 13 | Tratamento de erro da API: renderiza mensagem de erro acessível no topo e reabilita botão | WCAG 3.3.1 / WCAG 4.1.3 (Mensagens de Status) | ✅ Aprovado |
| 14 | Presença de links acessíveis para `/login/cidadao` (Voltar e Entrar aqui) | WCAG 2.4.4 (Propósito do Link) | ✅ Aprovado |

---

## 3. Conformidade Técnica e Acessibilidade

* **Regra de Ouro (`100dvh`):** Layout otimizado com `min-height: 100dvh` e `flex-grow: 1`, evitando overflow em telas de smartphones.
* **Mensagens de Erro Assistivas:** Notificações em texto vermelho acessível posicionadas diretamente abaixo de cada campo, vinculadas por `aria-describedby` e dotadas de `role="alert"` e `aria-live="polite"`.
* **Alerta de API Integrado:** Bloco de feedback global com `role="alert"` e ícone de advertência para erros retornados pelo servidor backend.
