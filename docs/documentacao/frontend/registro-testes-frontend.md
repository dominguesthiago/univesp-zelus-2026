# Registro Oficial de Testes Automatizados de Frontend — Sistema ZELUS

**Documento:** Matriz de Qualidade, Governança de Testes e Cobertura de Componentes  
**Módulo:** `frontend/src/tests/`  
**Fase:** Fase 3 — Integração de Dados (Front-end <-> Back-end)  
**Versão:** 1.1  
**Data:** 26 de outubro de 2026  
**Responsabilidade:** Engenharia de Qualidade (QA) e Arquitetura de Software  
**Status:** Vigente e Validado  

---

## 1. Visão Geral da Estratégia de Qualidade

A garantia da qualidade no frontend do sistema **ZELUS** segue a pirâmide de testes orientada pelo comportamento do usuário (*user-centric testing*), garantindo que os componentes visuais não apenas atendam aos requisitos funcionais, mas também respeitem os critérios de acessibilidade digital (WCAG 2.1 AA / eMAG) e privacidade (LGPD).

A abordagem prioriza testar os componentes como os usuários reais e as tecnologias assistivas os utilizam (buscando elementos por *role*, rótulos acessíveis e textos descritivos, em vez de IDs arbitrários ou seletores CSS voláteis).

---

## 2. Stack de Testes e Ferramentas

| Ferramenta / Biblioteca | Versão / Contexto | Papel na Arquitetura de QA |
| :--- | :--- | :--- |
| **Jest** | Integrado via `react-scripts 5.0.1` | *Test runner*, asserções (`expect`), mocks de funções (`jest.fn`) e espionagem de ambiente (`jest.spyOn`). |
| **React Testing Library** | `@testing-library/react` | Renderização isolada de componentes React, consultas semânticas no DOM virtual e despacho de eventos de usuário. |
| **jest-dom** | `@testing-library/jest-dom` | Matchers customizados para asserções no DOM (`toBeInTheDocument`, `toHaveAttribute`, `toHaveClass`). |
| **MemoryRouter** | `react-router-dom` | Provedor de contexto em memória para testes de componentes que contenham `<Link>` ou navegação SPA. |

---

## 3. Guia de Execução

Para rodar a suíte de testes localmente ou em pipelines de integração contínua (CI/CD):

```bash
# Executa todos os testes do frontend uma única vez (modo CI)
npm test -- --watchAll=false

# Executa os testes em modo interativo de desenvolvimento
npm test

# Executa testes com relatório de cobertura de código
npm test -- --coverage --watchAll=false
```

---

## 4. Matriz de Cobertura da Primeira Bateria (Tela Inicial)

### 4.1 Suíte 01: `CookieBanner.test.js`
* **Arquivo Testado:** `frontend/src/components/CookieBanner.jsx`
* **Cenários Cobertos:**
  1. **Renderização Inicial e Semântica LGPD:** Confirma a exibição da região acessível (`role="region"` com nome semântico), mensagem explicativa sobre uso de armazenamento essencial e link para a Política de Privacidade.
  2. **Persistência de Consentimento no `localStorage`:** Simula o clique no botão "Entendido e Concordar", valida a chamada de `localStorage.setItem('zelus_termo_aceito', 'true')` e atesta o desmonte imediato do banner no DOM.
  3. **Comportamento quando Pré-Aceito:** Configura o `localStorage` com a chave já gravada e garante que o componente retorne `null`, preservando a tela limpa para o munícipe recorrente.

### 4.2 Suíte 02: `ActionCard.test.js`
* **Arquivo Testado:** `frontend/src/components/ActionCard.jsx`
* **Cenários Cobertos:**
  1. **Exibição de Dados via Props:** Validação estrita do título renderizado no elemento de cabeçalho `<h2>` e da descrição de apoio do card.
  2. **Acessibilidade de Mídia:** Validação do comportamento de imagem decorativa quando `altText=""`, conferindo se os atributos `alt=""` e `aria-hidden="true"` são aplicados para evitar redundância em leitores de tela.
  3. **Disparador Interativo por Teclado e Clique:** Validação de que a tag nativa `<button>` possui o rótulo acessível composto (`aria-label="Acessar {title}"`) e dispara a função mockada `onClick` exatamente 1 vez.
  4. **Modificadores de Tema:** Confirmação da aplicação das classes `.card-citizen` e `.card-admin` no elemento raiz `<article>`.

### 4.3 Suíte 03: `api.test.js` (Camada de Serviços HTTP e Interceptação JWT)
* **Arquivo Testado:** `frontend/src/services/api.js`
* **Módulo:** Infraestrutura e Camada de Rede (Passo 1 da Integração Front-Back)
* **Data de Homologação:** 26 de outubro de 2026
* **Status:** ✅ 100% APROVADO (6/6 testes unitários)
* **Cenários Cobertos:**
  1. **CT-API.1 (Injeção Automática de JWT):** Valida que a presença da chave `'zelus_token'` no `localStorage` resulta na inclusão compulsória do cabeçalho `Authorization: Bearer <token>` nas requisições autenticadas.
  2. **CT-API.2 (Omissão de Header para Anônimos):** Garante que usuários não autenticados (ausência de token) executam requisições públicas (ex: login e registro) sem cabeçalhos corrompidos (`Bearer null` ou `Bearer undefined`).
  3. **CT-API.3 (Mesclagem de Headers Customizados):** Confirma a preservação e coexistência de headers arbitrários informados pelo chamador (`options.headers`) em conjunto com `'Content-Type': 'application/json'`.
  4. **CT-API.4 (Tratamento de Erros de Negócio da API):** Valida a rejeição por Promise com propagação do código HTTP (ex: 400, 401, 409) e da mensagem retornada pelo servidor Node.js/Express.
  5. **CT-API.5 (Tratamento Amigável de Falha de Rede):** Simula a queda do servidor/conexão e atesta a conversão do erro cru (`Failed to fetch`) em um erro com status `0` e mensagem amigável em português para o cidadão.
  6. **CT-API.6 (Contratos e Verbos dos Novos Métodos):** Valida que `listarCategorias()` despacha `GET /api/categorias`, `listarMinhasSolicitacoes()` despacha `GET /api/solicitacoes/minhas` e `criarSolicitacao(dados)` despacha `POST /api/solicitacoes` com corpo serializado em JSON.

---

## 5. Critérios de Aceite e Métricas de QA

* **Taxa de Sucesso:** 100% dos testes da suíte passando sem regressões.
* **Acessibilidade Automatizada:** Preservação de landmarks semânticos e ausência de nós órfãos de acessibilidade.
* **Conformidade Legal:** Isolamento rigoroso da chave `zelus_termo_aceito` na Web Storage API.
* **Segurança e Camada de Rede:** Injeção transparente de credenciais via padrão RFC 6750 (`Bearer`), mantendo chaves sensíveis de produção fora do código do cliente.

---

## 6. Registro de Decisão Arquitetural (ADR) — Interceptação Centralizada de Autenticação

* **Contexto:** Com a ativação da autenticação no backend (rotas `/api/solicitacoes` e `/api/categorias` protegidas pelo middleware `verificarToken`), o front-end precisava garantir que todas as chamadas a endpoints privados carregassem o token JWT obtido durante o login.
* **Decisão:** Implementou-se um *Interceptor Nativo* dentro do wrapper `request()` no arquivo [frontend/src/services/api.js](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/services/api.js), que inspeciona o `localStorage` e anexa condicionalmente o cabeçalho `Authorization: Bearer <token>`.
* **Justificativa:**
  1. **DRY & Desacoplamento:** Evita repetição da lógica de extração de token em componentes e páginas.
  2. **Zero Dependências:** Mantém o bundle leve e performático ao dispensar bibliotecas externas pesadas (como Axios), utilizando a Fetch API nativa do navegador.
  3. **Segurança e Blindagem:** Previne o envio de tokens nulos ou strings indefinidas nas rotas públicas.
* **Consequências Positivas:** Todas as telas presentes e futuras do sistema ZELUS comunicam-se de forma autenticada com a API automaticamente ao invocar qualquer método exportado por `api.js`.

