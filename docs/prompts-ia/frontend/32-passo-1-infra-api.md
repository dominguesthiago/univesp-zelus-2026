# Registro de Rastreabilidade de Prompt de IA — Passo 1: Infraestrutura & Serviço de API (Integração Front-Back)

**Documento:** Registro de Governança de Engenharia de Prompt  
**ID do Registro:** `32-passo-1-infra-api`  
**Fase do Projeto:** Fase 3 — Integração de Dados (Front-end <-> Back-end)  
**Etapa:** Infraestrutura de Ambiente, Interceptação de Autenticação JWT e Contratos da API:
- Criação do arquivo `.env` no front-end (`REACT_APP_API_URL=http://localhost:3001`), desacoplando as URLs de desenvolvimento e produção conforme o padrão *12-Factor App*.
- Garantia de segurança através do `.gitignore` para impedir o versionamento acidental do arquivo `.env`.
- Refatoração do wrapper `request()` no serviço `frontend/src/services/api.js`, implementando um interceptor nativo que resgata `zelus_token` do `localStorage` e anexa o cabeçalho `Authorization: Bearer <token>` nas requisições autenticadas.
- Omissão graciosa do header `Authorization` em requisições de usuários anônimos (evitando envio de valores nulos ou indefinidos em rotas públicas).
- Tratamento amigável de erros de conectividade de rede (`Failed to fetch` -> mensagem amigável em português com `status: 0`).
- Adição dos novos contratos de serviço: `listarCategorias()`, `criarSolicitacao(dados)` e `listarMinhasSolicitacoes()`.
- Criação da suíte de testes unitários automatizados em `frontend/src/tests/api.test.js`, com 100% de aprovação (6/6 testes unitários cobrindo os cenários CT-API.1 a CT-API.6).
- Verificação de não-regressão nas suítes de autenticação (`LoginCidadao`, `CadastroCidadao`, `RecuperarSenhaCidadao` com 41/41 testes aprovados).
- Atualização do documento de governança `docs/documentacao/frontend/registro-testes-frontend.md` com o registro da Suíte 03 e a Decisão Arquitetural (ADR).  
**Data/Hora do Registro:** 26 de outubro de 2026 - 12:15 (UTC-03:00)  
**Status:** Implementado, 100% Aprovado nos Testes Unitários e Integrado à Governança.

---

## 1. Metadados do Registro

* **Identificador Único:** `PROMPT-FE-INTEGRACAO-PASSO1-032`
* **Módulo:** Infraestrutura (`frontend/.env`), Camada de Rede (`frontend/src/services/api.js`), Testes Unitários (`frontend/src/tests/api.test.js`), Governança (`docs/documentacao/frontend/registro-testes-frontend.md`)
* **Objetivo:**
  1. **Isolamento de Ambientes:** Garantir que o front-end aponte dinamicamente para o backend Express local (`http://localhost:3001`) sem *hardcode* de URLs.
  2. **Autenticação Transparente:** Injetar automaticamente o token JWT nas chamadas HTTP para rotas privadas do backend (`/api/solicitacoes` e `/api/categorias`), respeitando a proteção por middleware `verificarToken`.
  3. **Manutenibilidade e DRY:** Centralizar a lógica de autorização na camada utilitária `api.js`, evitando duplicação de chamadas ao `localStorage` nos componentes.
  4. **Contratos da Nova Solicitação:** Estruturar as assinaturas das funções de consumo de categorias e envio de chamados em conformidade com o backend auditado.
  5. **Garantia de Qualidade (TDD):** Validar a camada de rede através de testes unitários sem dependência visual, assegurando blindagem contra regressões.
* **Ferramenta de IA:** Antigravity AI Assistant
* **Persona:** Arquiteto de Software e Tech Lead Full Stack

---

## 2. Decisões Técnicas e Arquitetura

### 2.1 Desacoplamento via Variáveis de Ambiente (12-Factor App)
* O Create React App expõe variáveis prefixadas com `REACT_APP_` em tempo de compilação.
* A criação de `frontend/.env` define `REACT_APP_API_URL=http://localhost:3001`.
* O `.gitignore` do frontend já continha as regras `.env*`, impedindo o envio de variáveis locais ao repositório git.

### 2.2 Interceptor Nativo de JWT na Camada de Rede
* Em vez de introduzir a biblioteca Axios, manteve-se o wrapper leve sobre a Fetch API nativa do navegador.
* O interceptor lê com segurança `localStorage.getItem('zelus_token')` antes do despacho da requisição.
* A inclusão do cabeçalho `Authorization: Bearer ${token}` é condicional: apenas quando o token é estritamente válido e presente.

### 2.3 Resiliência e UX em Falhas de Rede
* Quando o backend está indisponível ou a conexão cai, a Fetch API dispara `TypeError: Failed to fetch`.
* O wrapper intercepta a exceção e retorna um erro padronizado:
  `"Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente."` (`status: 0`), proporcionando clareza de diagnóstico para o cidadão.

### 2.4 Novos Contratos Exportados
* `listarCategorias()`: Invoca `GET /api/categorias`.
* `criarSolicitacao(dados)`: Invoca `POST /api/solicitacoes` com o corpo formatado em JSON.
* `listarMinhasSolicitacoes()`: Invoca `GET /api/solicitacoes/minhas`.

---

## 3. Validação de Testes Automatizados

A suíte `frontend/src/tests/api.test.js` foi executada no terminal com `npm test -- --watchAll=false api.test.js`:
* **Suíte Testada:** `api.test.js` (6/6 testes aprovados - 100%).
* **Cenários Cobertos:**
  1. `CT-API.1`: Injeção automática de `Authorization: Bearer <token>` quando `zelus_token` está presente.
  2. `CT-API.2`: Omissão do header `Authorization` quando o usuário é anônimo.
  3. `CT-API.3`: Mesclagem correta de headers customizados com `'Content-Type': 'application/json'`.
  4. `CT-API.4`: Rejeição de erro com propagação de código HTTP e mensagem da API.
  5. `CT-API.5`: Tratamento amigável de falha de conexão com status 0.
  6. `CT-API.6`: Chamada correta de endpoints e verbos HTTP para os novos métodos.

Também foram executadas as suítes de autenticação existentes (`LoginCidadao.test.js`, `CadastroCidadao.test.js`, `RecuperarSenhaCidadao.test.js`) com 41/41 testes aprovados, comprovando zero regressão.

---

## 4. Mensagem de Commit Aplicada

```text
chore(frontend): configura env e interceptor JWT na camada de api

- Criacao do arquivo frontend/.env com REACT_APP_API_URL apontando para o backend local
- Refatoracao de request() em api.js com interceptor nativo para injecao automatica do token JWT
- Tratamento amigavel de falha de conexao de rede com status 0
- Adicao dos contratos listarCategorias, criarSolicitacao e listarMinhasSolicitacoes em api.js
- Criacao da suite de testes unitarios api.test.js com 6 cenarios aprovados (CT-API.1 a CT-API.6)
- Atualizacao do registro oficial de testes em docs/documentacao/frontend/registro-testes-frontend.md
- Registro de governanca de IA em docs/prompts-ia/frontend/32-passo-1-infra-api.md
```
