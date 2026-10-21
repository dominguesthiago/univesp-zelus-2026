# Relatório de Testes Automatizados — Recuperação de Senha do Cidadão

**Arquivo de Teste:** [`frontend/src/tests/RecuperarSenhaCidadao.test.js`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/tests/RecuperarSenhaCidadao.test.js)  
**Componente Alvo:** [`frontend/src/pages/RecuperarSenhaCidadao.jsx`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/pages/RecuperarSenhaCidadao.jsx)  
**Data da Execução:** 21 de outubro de 2026  
**Status Geral:** ✅ APROVADO (100% de sucesso)  
**Total de Testes:** 13 executados / 13 aprovados  

---

## 1. Escopo e Objetivos do Teste

O objetivo desta suíte é assegurar a integridade visual, semântica e funcional da tela de Recuperação de Senha do Cidadão, incluindo:
1. Renderização da landmark `<main id="conteudo-principal">` e do título semântico `<h1>`.
2. Presença do **Aviso Acadêmico** amigável com `role="note"`, informando a redefinição segura sem envio real de e-mails.
3. Encapsulamento dos 3 campos no formulário semântico `<form>` com associação acessível `aria-labelledby="recuperar-heading"`.
4. Associação unívoca entre `<label>` e `<input>` (via `htmlFor` e `id`) para todos os 3 campos: CPF, E-mail e Nova Senha.
5. Aplicação de máscara automática no campo de CPF (`000.000.000-00`).
6. Alternância de visibilidade da nova senha com atualização dos atributos ARIA (`aria-controls`, `aria-pressed`, `aria-label`).
7. Validação estrita das **Regras de Negócio de Frontend**:
   - **CPF:** Exatamente 14 caracteres com máscara (11 dígitos).
   - **E-mail:** Formato válido contendo `@` e domínio.
   - **Nova Senha:** Mínimo de 8 caracteres, contendo pelo menos uma letra e um número.
8. Tratamento de mensagens de erro assistivas (`role="alert"` e `aria-live="polite"`).
9. **Integração com a Service Layer (`api.js`):**
   - Sanitização de CPF removendo pontuação.
   - Montagem e envio do payload JSON `{ cpf, email, nova_senha }` para `redefinirSenhaCidadao` (`PUT /api/auth/cidadao/nova-senha`).
   - Gerenciamento de ciclo de vida assíncrono: desabilitação do botão e exibição de "Redefinindo..." com `aria-busy="true"`.
   - Redirecionamento bem-sucedido para `/login/cidadao` transmitindo mensagem de confirmação no route state.
   - Captura e exibição acessível de erros de API com `role="alert"`.
10. Links semânticos de retorno para a rota de login.

---

## 2. Relação Detalhada dos Casos de Teste

| # | Comportamento / Regra Validada | Requisito de Acessibilidade (WCAG) | Status |
|---|---|---|:---:|
| 1 | Renderização da landmark `<main id="conteudo-principal">` e título `<h1>` | WCAG 1.3.1 / WCAG 2.4.1 (Skip-Link Target) | ✅ Aprovado |
| 2 | Renderização do aviso acadêmico amigável com `role="note"` | WCAG 1.3.1 (Info and Relationships) | ✅ Aprovado |
| 3 | Renderização do `<form>` semântico associado ao título via `aria-labelledby` | WCAG 4.1.2 (Name, Role, Value) | ✅ Aprovado |
| 4 | Presença e associação dos 3 campos (CPF, E-mail, Nova Senha) aos seus `<label>` | WCAG 1.3.1 / WCAG 3.3.2 (Rotulagem Explícita) | ✅ Aprovado |
| 5 | Aplicação correta de máscara de digitação no campo de CPF | WCAG 3.3.2 (Auxílio na Entrada de Dados) | ✅ Aprovado |
| 6 | Alternância de visibilidade da nova senha atualizando `type`, `aria-label` e `aria-pressed` | WCAG 4.1.2 / WCAG 2.1.1 (Acessibilidade de Controles) | ✅ Aprovado |
| 7 | Validação de CPF: exige exatamente 14 caracteres com a máscara (11 dígitos) | WCAG 3.3.1 / Regra de Negócio ZELUS | ✅ Aprovado |
| 8 | Validação de E-mail: exige estrutura formal com `@` e domínio válido | WCAG 3.3.1 / Requisito Crítico de Segurança | ✅ Aprovado |
| 9 | Validação de Nova Senha: exige $\ge 8$ caracteres com combinação de pelo menos 1 letra e 1 número | WCAG 3.3.1 / Segurança e Integridade | ✅ Aprovado |
| 10 | Submissão com sucesso: envia payload sanitizado à API e redireciona para `/login/cidadao` | Interoperabilidade / Service Layer | ✅ Aprovado |
| 11 | Estado de carregamento: desabilita botão e exibe "Redefinindo..." com `aria-busy="true"` | WCAG 4.1.2 / WCAG 3.2.2 (Feedback de Ação) | ✅ Aprovado |
| 12 | Tratamento de erro da API: renderiza mensagem de erro acessível com `role="alert"` e reabilita botão | WCAG 3.3.1 / WCAG 4.1.3 (Mensagens de Status) | ✅ Aprovado |
| 13 | Presença de links acessíveis no topo e no rodapé apontando para `/login/cidadao` | WCAG 2.4.4 (Propósito do Link) | ✅ Aprovado |

---

## 3. Conformidade Técnica e Acessibilidade

* **Regra de Ouro (`100dvh`):** Layout otimizado com `min-height: 100dvh` no container `.recuperar-senha-wrapper`, eliminando quebras em dispositivos móveis.
* **Transparência Acadêmica (`role="note"`):** O aviso contextualiza a ausência de disparador SMTP em ambiente de desenvolvimento/TCC, garantindo previsibilidade ao usuário avaliador.
* **Mensagens Assistivas:** Notificações de erro com `role="alert"` e `aria-live="polite"` garantem comunicação em tempo real para tecnologias assistivas.
