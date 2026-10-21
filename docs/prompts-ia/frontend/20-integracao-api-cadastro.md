# Registro de Rastreabilidade de Prompt de IA — Camada de Serviço (Service Layer) e Integração da Tela de Cadastro à API do Backend

**Documento:** Registro de Governança de Engenharia de Prompt  
**ID do Registro:** `20-integracao-api-cadastro`  
**Fase do Projeto:** Fase 2 — Frontend, Governança e Experiência do Usuário (ZELUS)  
**Etapa:** Criação da Camada de Integração (Service Layer) e Conexão da Tela de Cadastro do Cidadão à API Real do Backend  
**Data/Hora do Registro:** 21 de outubro de 2026 - 11:00 (UTC-03:00)  
**Status:** Executado e Validado  

---

## 1. Metadados do Registro

* **Identificador Único:** `PROMPT-FE-API-CADASTRO-020`
* **Módulo:** Service Layer (API), Integração Frontend-Backend, Cadastro do Cidadão e Login do Cidadão
* **Objetivo:**
  1. Centralizar as chamadas HTTP para o backend através de uma camada de serviço isolada e desacoplada em `frontend/src/services/api.js`.
  2. Conectar a tela de Cadastro do Cidadão (`CadastroCidadao.jsx`) ao endpoint real `/api/auth/cidadao/registro` do Backend Node.js/Express.
  3. Higienizar os dados do formulário (remoção de formatação de CPF e WhatsApp), submetendo o payload JSON esperado `{ nome_completo, cpf, email, whatsapp, senha }`.
  4. Gerenciar o ciclo de vida da requisição assíncrona (estados `carregando` e `erroApi`, bloqueio de clique duplicado no botão com "Cadastrando...", acessibilidade `aria-busy`).
  5. Redirecionar com sucesso para `/login/cidadao` transmitindo mensagem de boas-vindas pelo state da rota (`useNavigate` / `useLocation`).
  6. Atualizar a suíte de testes unitários e de integração (`CadastroCidadao.test.js`) com mocks e asserções de sanitização, loading e tratamento de erros.
* **Ferramenta de IA:** Antigravity AI Assistant
* **Persona:** Engenheiro de Software Sênior e Especialista em Arquitetura Frontend

---

## 2. Prompt Original Transcrito

```text
Atuando como Engenheiro de Software Sênior, a tua tarefa agora é criar a camada de integração (Service Layer) do Frontend e conectar a tela de Cadastro do Cidadão à nossa API real do Backend.

Diretrizes de Implementação:

1. Criação do Serviço de API (frontend/src/services/api.js):
   - Cria este ficheiro para centralizar as chamadas ao backend.
   - Configura uma instância base (usando fetch ou axios, o que já estiver disponível no projeto).
   - A URL base deve apontar para /api (aproveitando o proxy/monorepo da Vercel) ou utilizar uma variável de ambiente (ex: process.env.REACT_APP_API_URL).
   - Exporta uma função registrarCidadao(dados) que faça um POST para /api/auth/cidadao/registro.

2. Integração no CadastroCidadao.jsx:
   - Adiciona um estado carregando (boolean) e um estado erroApi (string) para gerir o ciclo de vida da requisição.
   - No handleSubmit, após as validações locais passarem:
     * Altera o carregando para true.
     * Sanitização: Remove todos os caracteres não numéricos do CPF e do Telefone (whatsapp) antes de enviar.
     * Monta o payload JSON exigido pelo backend: { nome_completo, cpf, email, whatsapp, senha }.
     * Chama a função registrarCidadao.
   - Sucesso: Redireciona o utilizador para /login/cidadao (usando useNavigate do react-router-dom), idealmente passando uma mensagem de sucesso no state da rota.
   - Erro: Captura o erro do backend (ex: conflito de CPF/Email) e exibe-o no estado erroApi (renderizado de forma acessível no topo ou abaixo do botão).
   - O botão "Cadastrar" deve ter o texto alterado para "Cadastrando..." e estar desabilitado (disabled={carregando}) enquanto a requisição ocorre.

3. Atualização dos Testes (CadastroCidadao.test.js):
   - Faz o mock da função registrarCidadao e adiciona um teste para garantir que:
     a) O payload sanitizado é enviado corretamente.
     b) O botão fica desabilitado durante o carregamento.
     c) Erros da API são renderizados na tela.

4. Governança e Rastreabilidade:
   - Regista este prompt e as decisões de integração no ficheiro docs/prompts-ia/frontend/20-integracao-api-cadastro.md.

5. Commit:
   - Executa os testes. Se tudo estiver verde e a compilação funcionar, faz o commit com a mensagem: feat(frontend): integracao da tela de cadastro de cidadao com a API do backend.
   - Faz o git push origin main e avisa o utilizador para testar a criação de conta real na Vercel.
```

---

## 3. Decisões Arquiteturais e Entregas Vinculadas

### 3.1 Camada de Serviço Centralizada (`frontend/src/services/api.js`)
* **Padrão Service Layer:** Isolamento de chamadas HTTP da camada de apresentação (React components).
* **Resolução de URL Base:** Utiliza `process.env.REACT_APP_API_URL || '/api'`, suportando tanto deploys monorepo na Vercel (onde requisições para `/api/*` são roteadas automaticamente para as Serverless Functions do backend Express) quanto execução local ou ambientes com domínios desacoplados.
* **Cliente HTTP Nativo (`fetch`):** Aproveitamento da API nativa do navegador sem adicionar dependências externas desnecessárias ao bundle do frontend.
* **Tratamento Robusto de Resposta e Erro:** Função utilitária `request(endpoint, options)` que verifica `response.ok`, analisa corpos JSON de erro (propriedades `mensagem` ou `erro` padronizadas pelo backend ZELUS) e lança instâncias explícitas de `Error`.
* **Função Especializada:** Exportação de `registrarCidadao(dados)` realizando requisição `POST` com cabeçalhos `Content-Type: application/json` para o endpoint `/auth/cidadao/registro` (resultando em `/api/auth/cidadao/registro`).

### 3.2 Integração no Componente (`CadastroCidadao.jsx`)
* **Sanitização de Dados:** Aplicação de regex `replace(/\D/g, '')` nos campos CPF e WhatsApp, transformando máscaras visuais (`000.000.000-00` e `(00) 90000-0000`) em sequências numéricas puras (11 e 10-11 dígitos), satisfazendo os validadores estritos do Backend Express.
* **Payload Contratual:** Envio do objeto `{ nome_completo, cpf, email, whatsapp, senha }`.
* **Gerenciamento de Estados Assíncronos:**
  - `carregando`: Controla o bloqueio do botão (`disabled={carregando}`), o rótulo ("Cadastrando..." vs "CADASTRAR") e o atributo ARIA `aria-busy={carregando}`.
  - `erroApi`: Armazena mensagens de erro retornadas pelo servidor (ex: "CPF já cadastrado.", "E-mail já cadastrado."), exibidas em alerta visual e semântico no topo do formulário com `role="alert"` e `aria-live="assertive"`.
* **Navegação Declarativa com State:** Em caso de sucesso, invocação de `navigate('/login/cidadao', { state: { mensagemSucesso: 'Cadastro realizado com sucesso! Faça login para continuar.' } })`.

### 3.3 Experiência de Login do Cidadão (`LoginCidadao.jsx` e `LoginCidadao.scss`)
* **Recepção de Feedback:** Adição do hook `useLocation` para recuperar `location.state?.mensagemSucesso`.
* **Alerta Visual Verde:** Estilização da classe `.login-alert--success` com fundo verde suave (`#e8f5e9`), borda `#2e7d32` e ícone de confirmação, garantindo feedback imediato e claro ao cidadão recém-cadastrado.

### 3.4 Qualidade de Software e Testes Automatizados (`CadastroCidadao.test.js`)
* **Mock da Service Layer:** Mocking via `jest.mock('../services/api')` para desacoplar a suíte do tráfego real de rede.
* **Novos Casos de Teste Criados:**
  1. *Payload Sanitizado & Redirecionamento:* Validação de envio de números sem máscara e disparo de `navigate` com mensagem de sucesso.
  2. *Estado de Carregamento:* Validação do botão desabilitado, rótulo "Cadastrando..." e atributo `aria-busy="true"` enquanto a promise está pendente.
  3. *Tratamento de Erros da API:* Validação de exibição de mensagem rejeitada (`role="alert"` com "CPF já cadastrado.") e reabilitação do botão de submissão.
* **Cobertura Consolidada:** 14/14 testes aprovados na suíte de Cadastro do Cidadão e 37/37 testes aprovados no total do frontend.

---

## 4. Evidências de Execução dos Testes

```
PASS  src/tests/Home.test.js
PASS  src/tests/LoginCidadao.test.js
PASS  src/tests/CadastroCidadao.test.js
PASS  src/tests/ActionCard.test.js
PASS  src/tests/CookieBanner.test.js

Test Suites: 5 passed, 5 total
Tests:       37 passed, 37 total
Snapshots:   0 total
```
