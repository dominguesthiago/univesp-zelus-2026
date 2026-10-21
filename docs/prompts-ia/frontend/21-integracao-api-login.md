# Registro de Rastreabilidade de Prompt de IA — Integração do Login do Cidadão com a API e Armazenamento de JWT

**Documento:** Registro de Governança de Engenharia de Prompt  
**ID do Registro:** `21-integracao-api-login`  
**Fase do Projeto:** Fase 2 — Frontend, Governança e Experiência do Usuário (ZELUS)  
**Etapa:** Integração da Tela de Login do Cidadão à API Real, Armazenamento de Token JWT e Redirecionamento ao Painel  
**Data/Hora do Registro:** 21 de outubro de 2026 - 11:35 (UTC-03:00)  
**Status:** Executado e Validado  

---

## 1. Metadados do Registro

* **Identificador Único:** `PROMPT-FE-API-LOGIN-021`
* **Módulo:** Service Layer (API), Autenticação de Usuário, Login do Cidadão e Painel do Munícipe
* **Objetivo:**
  1. Estender o serviço `frontend/src/services/api.js` com a função `loginCidadao(credenciais)` para autenticação real no endpoint `/api/auth/cidadao/login`.
  2. Eliminar mocks provisórios e disparos de `alert()` no formulário de login (`LoginCidadao.jsx`).
  3. Sanitizar o CPF removendo formatação (`replace(/\D/g, '')`) antes da transmissão à API.
  4. Implementar ciclo de vida assíncrono completo: estados `carregando` e `erroApi`, botão desabilitado com "Entrando..." e `aria-busy="true"`.
  5. Salvar o token JWT retornado pelo backend no `localStorage` (`zelus_token`) e os dados do usuário (`zelus_cidadao`).
  6. Redirecionar o cidadão autenticado para a rota `/cidadao/painel` criando o componente provisório `PainelCidadao.jsx`.
  7. Atualizar a suíte de testes automatizados (`LoginCidadao.test.js`) para validar o fluxo de autenticação, armazenamento do JWT e tratamento de credenciais inválidas.
* **Ferramenta de IA:** Antigravity AI Assistant
* **Persona:** Engenheiro de Software Sênior e Especialista em Arquitetura Frontend

---

## 2. Prompt Original Transcrito

```text
Atuando como Engenheiro de Software Sênior, a tua tarefa é finalizar a integração de Autenticação, conectando o ecrã de Login do Cidadão à API real do Backend e removendo os comportamentos provisórios (mocks/alerts).

Diretrizes de Implementação:

1. Atualização do Serviço de API (frontend/src/services/api.js):
   - Adiciona e exporta a função loginCidadao(credenciais) que faça um POST para /api/auth/cidadao/login. O payload deve conter { cpf, senha }.

2. Integração no LoginCidadao.jsx:
   - Remove imediatamente qualquer alert() ou comportamento provisório no handleSubmit.
   - Adiciona os estados carregando (boolean) e erroApi (string).
   - No handleSubmit:
     * Altera carregando para true.
     * Sanitização: Remove a formatação do CPF (deixa só números) antes de enviar.
     * Chama a função loginCidadao({ cpf, senha }).
   - Sucesso: 
     * O backend devolverá um token JWT e os dados do usuário. 
     * Salva o token no localStorage (ex: localStorage.setItem('zelus_token', resposta.token)).
     * Redireciona o utilizador para o futuro painel do cidadão (ex: navigate('/cidadao/painel')). *Nota: Se a rota não existir, cria um componente provisório simples.*
   - Erro: 
     * Exibe o erro devolvido pela API (ex: "Credenciais inválidas") numa mensagem de erro semântica (role="alert") na tela, substituindo o banner de sucesso verde, se houver.
   - O botão "Entrar" deve mudar para "Entrando..." e receber disabled={carregando}.

3. Atualização dos Testes (LoginCidadao.test.js):
   - Atualiza os testes para validar que a função da API é chamada corretamente.
   - Valida que o token é guardado no localStorage após sucesso.
   - Garante que a suite continua a passar a 100%.

4. Governança:
   - Regista este prompt em docs/prompts-ia/frontend/21-integracao-api-login.md.

5. Commit:
   - Executa os testes e o build. Faz o commit com a mensagem: feat(frontend): integracao do login de cidadao com a API e armazenamento de JWT.
   - Faz o git push origin main e avisa o utilizador.
```

---

## 3. Decisões Arquiteturais e Entregas Vinculadas

### 3.1 Camada de Serviço (`frontend/src/services/api.js`)
* Implementada a função `loginCidadao(credenciais)` disparando requisição HTTP `POST` para `/api/auth/cidadao/login` com cabeçalho `Content-Type: application/json`.
* Adicionada exportação nomeada e inclusão no objeto `api` como export padrão.

### 3.2 Integração no Componente (`LoginCidadao.jsx`)
* **Remoção de Mock:** Eliminados `setTimeout` e `alert()` que simulavam a autenticação.
* **Sanitização de CPF:** Extração dos 11 dígitos numéricos (`cpf.replace(/\D/g, '')`) antes da montagem do payload.
* **Persistência de Sessão (JWT):** No sucesso da resposta, o token é armazenado no `localStorage.setItem('zelus_token', resposta.token)` e o perfil do usuário em `localStorage.setItem('zelus_cidadao', JSON.stringify(resposta.dados))`.
* **Tratamento de Erros Semântico:** Adicionado estado `erroApi`, renderizado dinamicamente em `<div id="login-erro" className="login-alert" role="alert" aria-live="polite">`, com sobreposição clara de eventuais banners de sucesso.
* **Acessibilidade do Botão:** Atualização do texto para `"Entrando..."`, bloqueio contra duplo clique via `disabled={carregando}` e indicação a tecnologias assistivas via `aria-busy={carregando}`.

### 3.3 Componente Provisório de Destino (`PainelCidadao.jsx` e `PainelCidadao.scss`)
* Criada a página de destino pós-autenticação [`frontend/src/pages/PainelCidadao.jsx`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/pages/PainelCidadao.jsx).
* Landmark acessível `<main id="conteudo-principal">`, saudação personalizada recuperando o primeiro nome do munícipe gravado no `localStorage`, badge de pontos de cidadania, cartões de serviços municipais e botão semântico de encerramento de sessão (*Logout*).
* Rota `/cidadao/painel` registrada no roteador principal [`App.js`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/App.js).

### 3.4 Qualidade de Software e Testes Automatizados (`LoginCidadao.test.js`)
* **Mocks Realistas:** `jest.mock('../services/api')` configurado para simular respostas bem-sucedidas com JWT e falhas com `Error('Credenciais inválidas.')`.
* **Casos de Teste Criados:**
  1. *Sanitização, Armazenamento de JWT & Redirecionamento:* Valida chamada da API com CPF sem formatação, presença do token e perfil no `localStorage` e disparo de `navigate('/cidadao/painel')`.
  2. *Estado de Carregamento:* Valida botão desabilitado com `"Entrando..."` e `aria-busy="true"`.
  3. *Tratamento de Credenciais Inválidas:* Valida renderização da mensagem de erro com `role="alert"`, reabilitação do botão e ausência de gravação indevida no `localStorage`.
  4. *Exibição de Mensagem de Sucesso:* Valida recebimento de mensagem pelo route state (`location.state?.mensagemSucesso`).
* **Cobertura Total:** 14 testes aprovados na suíte de Login e 41 testes aprovados no frontend completo.

---

## 4. Evidências de Execução dos Testes e Compilação

```
PASS  src/tests/Home.test.js
PASS  src/tests/ActionCard.test.js
PASS  src/tests/CookieBanner.test.js
PASS  src/tests/CadastroCidadao.test.js
PASS  src/tests/LoginCidadao.test.js

Test Suites: 5 passed, 5 total
Tests:       41 passed, 41 total
Snapshots:   0 total
Ran all test suites.

Creating an optimized production build...
Compiled successfully.
```
