# Registro de Rastreabilidade de Prompt de IA — Refatoração Semântica e Acessibilidade do Login do Cidadão

**Documento:** Registro de Governança de Engenharia de Prompt  
**ID do Registro:** `10-refatoracao-logincidadao`  
**Fase do Projeto:** Fase 2 — Frontend, Governança e Experiência do Usuário (ZELUS)  
**Etapa:** Refatoração Semântica HTML5, Acessibilidade WCAG 2.1 AA / ARIA e Aplicação da Regra de Ouro `dvh` (`LoginCidadao.jsx`, `LoginCidadao.scss`, `LoginCidadao.test.js`)  
**Data/Hora do Registro:** 21 de outubro de 2026 - 09:30 (UTC-03:00)  
**Status:** Executado e Validado  

---

## 1. Metadados do Registro

* **Identificador Único:** `PROMPT-FE-LOGIN-CIDADAO-SEMANTIC-A11Y-010`
* **Módulo:** Autenticação do Cidadão (Mobile-First / Opção B)
* **Objetivo:** Refatorar o componente de Login do Cidadão (`LoginCidadao.jsx`) e seu estilo (`LoginCidadao.scss`), garantindo rigor semântico HTML5 (`<main>`, `<form>`, `<label>`, `<input>`, `<button type="submit">`), conformidade estrita com as diretrizes de acessibilidade digital WCAG 2.1 AA / eMAG v3.1 (atributos ARIA, rotulagem explícita com `id` e `htmlFor`, suporte a skip-link `#conteudo-principal`), aplicação da Regra de Ouro do ZELUS com `min-height: 100dvh` (eliminando o problema de scroll nativo em dispositivos móveis) e criação de suíte de testes unitários automatizados em `LoginCidadao.test.js`.
* **Ferramenta de IA:** Antigravity AI Assistant
* **Persona:** Engenheiro de Frontend Sênior Especialista em Acessibilidade

---

## 2. Prompt Original Transcrito

```text
Atuando como Engenheiro de Frontend Sênior Especialista em Acessibilidade, precisamos refatorar o componente de Login do Cidadão (LoginCidadao.jsx) e o seu estilo (LoginCidadao.scss) para alinhar com os padrões do projeto ZELUS.

O visual já está muito próximo do esperado, mas precisamos garantir o rigor semântico e a adaptação mobile perfeita.

A tua tarefa agora:
1. Em LoginCidadao.jsx, transforma a estrutura central de campos num formulário semântico (<form>). Substitui as divs genéricas por <label> associadas aos seus respetivos <input> (utilizando id e htmlFor).
2. Adiciona os atributos de acessibilidade (ARIA) necessários para o formulário. O botão de "Entrar" deve ser um <button type="submit">.
3. Em LoginCidadao.scss, garante que o contentor principal respeita a nossa Regra de Ouro do ZELUS, usando min-height: 100dvh (em vez de vh) para evitar problemas de scroll nativo em dispositivos móveis.
4. Cria o arquivo de teste LoginCidadao.test.js (se não existir) para garantir que o formulário renderiza e que os campos de CPF e Senha estão acessíveis.
5. Regista este prompt no arquivo docs/prompts-ia/frontend/10-refatoracao-logincidadao.md.
6. Roda os testes, e se tudo passar, faz o commit com a mensagem: refactor(frontend): semantica e acessibilidade no formulário de Login do Cidadão e aplicacao de dvh.
7. Avisa-me quando o commit estiver concluído.
```

---

## 3. Decisões Arquiteturais e Entregas Vinculadas

### 3.1 Marcação Semântica e Acessibilidade em `LoginCidadao.jsx`

1. **Landmark `<main>` com Destino do Skip-Link:**
   * O contêiner de conteúdo principal foi convertido de `<div>` para `<main className="login-main-container" id="conteudo-principal">`.
   * Permite que o skip-link nativo da aplicação (`App.js`) aponte e focalize diretamente a área útil da tela sem passar pelo cabeçalho (WCAG 2.4.1).

2. **Formulário Semântico (`<form>`):**
   * A estrutura central foi encapsulada no elemento `<form className="login-form" onSubmit={handleSubmit} noValidate aria-labelledby="login-heading">`.
   * O título da seção recebeu `id="login-heading"` para conferir nome acessível inequívoco ao formulário para leitores de tela.

3. **Associação Explícita de Rótulos (`<label htmlFor="..."` / `<input id="..."`):**
   * **Campo CPF:** `<label htmlFor="login-cpf">` com input `id="login-cpf"`, `name="cpf"`, `type="text"`, `inputMode="numeric"`, `maxLength={14}`, `required`, `aria-required="true"`, `aria-invalid` dinâmico e `aria-describedby="login-erro"`.
   * **Campo Senha:** `<label htmlFor="login-senha">` com input `id="login-senha"`, `name="senha"`, `type={mostrarSenha ? 'text' : 'password'}`, `autoComplete="current-password"`, `required`, `aria-required="true"`, `aria-invalid` dinâmico e `aria-describedby="login-erro"`.

4. **Botão de Alternância de Senha:**
   * Botão `<button type="button">` com atributos ARIA: `aria-label={mostrarSenha ? 'Ocultar senha' : 'Exibir senha'}`, `aria-controls="login-senha"` e `aria-pressed={mostrarSenha}`.
   * Ícones `Eye` e `EyeOff` mantidos com `aria-hidden="true"` para evitar poluição da árvore de acessibilidade.

5. **Botão de Submissão:**
   * Botão nativo `<button type="submit">` com `aria-label="Entrar na conta do cidadão"` e `aria-busy={carregando}`.

6. **Notificação de Erros (`aria-live="polite"`):**
   * Elemento de alerta com `id="login-erro"`, `role="alert"` e `aria-live="polite"`, permitindo que leitores de tela anunciem mensagens de validação imediatamente.

---

### 3.2 Regra de Ouro do ZELUS em `LoginCidadao.scss` (`100dvh`)

1. **Eliminação de Scroll Nativo no Mobile:**
   * No seletor `.login-cidadao-wrapper`, foi garantida a regra `min-height: 100dvh` (com fallback `min-height: 100vh`), prevenindo transbordamento e rolagem desnecessária causada pela barra de endereço dinâmica do navegador mobile.
   * No contêiner de moldura `.login-card-mobile`, foram aplicadas as propriedades `min-height: 100dvh` e `height: 100dvh` (com fallbacks `100vh`), assegurando enquadramento pixel-perfect em telas de smartphones.

---

### 3.3 Testes Automatizados em `LoginCidadao.test.js`

Foi criada a suíte completa de testes unitários e de acessibilidade em `frontend/src/tests/LoginCidadao.test.js`, cobrindo:
1. Renderização da landmark `<main id="conteudo-principal">` e título `<h1>`.
2. Associação de acessibilidade do formulário `<form aria-labelledby="login-heading">`.
3. Associação entre `<label htmlFor="login-cpf">` e `<input id="login-cpf">` com validação de tipo, modo numérico e obrigatoriedade.
4. Associação entre `<label htmlFor="login-senha">` e `<input id="login-senha">` com validação de atributos obrigatórios.
5. Formatação da máscara de CPF durante a digitação (`000.000.000-00`).
6. Alternância de visibilidade da senha (mudança de `type="password"` para `type="text"`, atualização de `aria-label` e `aria-pressed`).
7. Existência e acessibilidade do botão `<button type="submit">`.
8. Disparo de mensagem de erro com `role="alert"` ao submeter CPF inválido/incompleto e marcação `aria-invalid="true"`.
9. Disparo de mensagem de erro ao submeter senha em branco.
10. Presença e rotas corretas dos links de navegação (`/`, `/recuperar-senha` e `/cadastro/cidadao`).

---

## 4. Verificação Técnica

- **Suíte de Testes Automatizados:** 100% de aprovação em todos os testes unitários (`npm test` — 3 suites, 18 testes aprovados).
- **Build de Produção:** Concluído com êxito via `npm run build`.
- **Governança de Código:** Commit registrado conforme convenção `refactor(frontend): semantica e acessibilidade no formulário de Login do Cidadão e aplicacao de dvh`.
