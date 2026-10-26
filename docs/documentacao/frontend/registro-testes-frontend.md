# Registro Oficial de Testes Automatizados de Frontend — Sistema ZELUS

**Documento:** Matriz de Qualidade, Governança de Testes e Cobertura de Componentes  
**Módulo:** `frontend/src/tests/`  
**Fase:** Fase 3 — Integração de Dados (Front-end <-> Back-end)  
**Versão:** 1.4  
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

### 4.4 Suíte 04: `PrivateRoute.test.js` (Blindagem de Rotas e Redirecionamento Seguro)
* **Arquivo Testado:** `frontend/src/components/PrivateRoute.jsx`
* **Módulo:** Camada de Segurança e Roteamento SPA (Passo 2 da Integração Front-Back)
* **Data de Homologação:** 26 de outubro de 2026
* **Status:** ✅ 100% APROVADO (4/4 testes unitários)
* **Cenários Cobertos:**
  1. **CT-SEC.1 (Acesso Autorizado):** Valida que a presença do `zelus_token` no `localStorage` resulta na montagem e renderização imediata do componente filho protegido (`children`).
  2. **CT-SEC.2 (Acesso Anônimo Barrado):** Garante que usuários sem o token JWT no storage são estritamente impedidos de visualizar o conteúdo privado e sofrem redirecionamento compulsório para `/login/cidadao`.
  3. **CT-SEC.3 (Preservação de Deep Linking):** Confirma que o componente `<Navigate>` encapsula a rota de origem no objeto de estado (`state: { from: location }`), viabilizando o retorno dinâmico do munícipe após autenticação.
  4. **CT-SEC.4 (Reatividade e Deslogamento Dinâmico):** Comprova que a invalidação ou remoção do token resulta no bloqueio instantâneo do acesso a rotas privadas.

### 4.5 Suíte 05: `NovaSolicitacaoStep1.test.js` (Categorias Dinâmicas, Skeletons e Resiliência)
* **Arquivo Testado:** `frontend/src/pages/NovaSolicitacaoStep1.jsx`
* **Módulo:** Fluxo de Nova Solicitação - Etapa 1 (Passo 3 da Integração Front-Back)
* **Data de Homologação:** 26 de outubro de 2026
* **Status:** ✅ 100% APROVADO (9/9 testes unitários)
* **Cenários Cobertos:**
  1. **CT-CAT.1 (Sucesso no Carregamento Dinâmico):** Valida o consumo de `listarCategorias()` (`GET /api/categorias`), atestando a renderização dos dados vindos da API com associação correta de ilustrações neobrutalistas e badges "EM CONSTRUÇÃO".
  2. **CT-CAT.2 (Estados de Carregamento e Skeletons):** Valida a renderização de elementos Skeleton Neobrutalistas com atributos semânticos de acessibilidade (`role="status"`, `aria-label`) enquanto a promessa de rede permanece pendente.
  3. **CT-CAT.3 (Tratamento de Falha e Retry):** Simula falhas na comunicação com a API, atesta a exibição do card de alerta com `role="alert"` e confirma o funcionamento do botão "TENTAR NOVAMENTE", restabelecendo o fluxo normal pós-recuperação.
  4. **CT-CAT.4 (Persistência e Tráfego do UUID Real):** Confirma que o clique na categoria grava o UUID real do Supabase em `zelus_rascunho_solicitacao` no `localStorage` e repassa o objeto completo para a Etapa 2 via state de navegação.
  5. **Semântica e Acessibilidade:** Validação de cabeçalho ZELUS institucional, ausência de estilos inline de cor, link de retorno ao Painel e integração com o botão "+ NOVA SOLICITAÇÃO 📱".

### 4.6 Suíte 06: `NovaSolicitacaoStep2.test.js` (Subcategorias Dinâmicas e Propagação de UUIDs)
* **Arquivo Testado:** `frontend/src/pages/NovaSolicitacaoStep2.jsx`
* **Módulo:** Fluxo de Nova Solicitação - Etapa 2 (Passo 3 da Integração Front-Back)
* **Data de Homologação:** 26 de outubro de 2026
* **Status:** ✅ 100% APROVADO (8/8 testes unitários)
* **Cenários Cobertos:**
  1. **Renderização Dinâmica por Categoria:** Exibição das subcategorias específicas para "Asfalto" e "Bueiro / Boca-de-lobo" com layout neobrutalista mobile.
  2. **Associação de UUIDs Reais:** Mapeamento de subcategorias do banco aos botões visuais, injetando o `id` real (`b1b2c3d4-0001-...` para Buraco, etc.).
  3. **Persistência de `subcategoria_id`:** Ao clicar em subcategoria funcional, grava `subcategoria_id` no `localStorage` e navega para `/solicitacao/etapa-3`.
  4. **Bloqueio de Subcategorias em Construção:** Salva o rascunho com flag `emConstrucao: true` e impede avanço prematuro para etapas posteriores.
  5. **Fallback Resiliente:** Recuperação graciosa do rascunho anterior no storage em caso de atualização direta ou navegação sem state explícito.

### 4.7 Suíte 07: `NovaSolicitacaoStep4.test.js` (Revisão de Local, Envio Transacional e Protocolo Real)
* **Arquivo Testado:** `frontend/src/pages/NovaSolicitacaoStep4.jsx`
* **Módulo:** Fluxo de Nova Solicitação - Etapa 4 (Passo 4 da Integração Front-Back)
* **Data de Homologação:** 26 de outubro de 2026
* **Status:** ✅ 100% APROVADO (11/11 testes unitários)
* **Cenários Cobertos:**
  1. **CT-ENV.1 (Envio com Sucesso e Protocolo Oficial):** Valida a montagem do payload transacional com coordenadas geodésicas numéricas, UUID da subcategoria, foto Base64 e endereço, confirmando chamada a `criarSolicitacao()`, limpeza do rascunho e navegação para a Etapa 5 com o protocolo emitido pelo servidor.
  2. **CT-ENV.2 (Anti-Double Submit):** Valida a desabilitação imediata dos botões, inclusão da classe de loading, alternância textual para "ENVIANDO..." e garantia de que cliques adicionais não disparam chamadas duplicadas à API.
  3. **CT-ENV.3 (Tratamento de Erro HTTP 409 Anti-Spam Haversine):** Valida a interceptação do erro de proximidade espacial (< 10 metros), atestando a renderização de alerta acessível com `role="alert"` e a manutenção do munícipe na Etapa 4 para ajustes.
  4. **CT-ENV.4 (Tratamento de Falha de Conexão):** Valida a conversão de falha de rede em mensagem amigável em português e reabilitação dos botões para nova tentativa.
  5. **CT-ENV.5 (Cancelamento de Solicitação):** Valida que o cancelamento via `window.confirm` descarta o rascunho no storage e redireciona para o Painel do Cidadão sem despachar requisições para a API.
  6. **Acessibilidade e Usabilidade:** Confirma miniatura de foto, busca reversa de CEP/Nominatim e foco em campos controlados.

---

## 5. Critérios de Aceite e Métricas de QA

* **Taxa de Sucesso:** 100% dos testes da suíte passando sem regressões (15 suítes / 115 testes).
* **Acessibilidade Automatizada:** Preservação de landmarks semânticos e ausência de nós órfãos de acessibilidade.
* **Conformidade Legal:** Isolamento rigoroso da chave `zelus_termo_aceito` na Web Storage API.
* **Segurança e Camada de Rede:** Injeção transparente de credenciais via padrão RFC 6750 (`Bearer`), mantendo chaves sensíveis de produção fora do código do cliente.
* **Blindagem de Fronteira:** Bloqueio síncrono e sem FOUC (*Flash of Unauthenticated Content*) para todas as rotas restritas do cidadão (`/cidadao/*` e `/solicitacao/*`).
* **Integridade Relacional de Entidades:** Tráfego e persistência de identificadores universais únicos (UUIDs) do Supabase para foreign keys (`categoria_id`, `subcategoria_id`).
* **Robustez Transacional:** Blindagem anti-duplo clique e tratamento gracioso de restrições geodésicas de negócio (filtro espacial 10 metros).

---

## 6. Registro de Decisão Arquitetural (ADR) — Interceptação Centralizada de Autenticação

* **Contexto:** Com a ativação da autenticação no backend (rotas `/api/solicitacoes` e `/api/categorias` protegidas pelo middleware `verificarToken`), o front-end precisava garantir que todas as chamadas a endpoints privados carregassem o token JWT obtido durante o login.
* **Decisão:** Implementou-se um *Interceptor Nativo* dentro do wrapper `request()` no arquivo [frontend/src/services/api.js](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/services/api.js), que inspeciona o `localStorage` e anexa condicionalmente o cabeçalho `Authorization: Bearer <token>`.
* **Justificativa:**
  1. **DRY & Desacoplamento:** Evita repetição da lógica de extração de token em componentes e páginas.
  2. **Zero Dependências:** Mantém o bundle leve e performático ao dispensar bibliotecas externas pesadas (como Axios), utilizando a Fetch API nativa do navegador.
  3. **Segurança e Blindagem:** Previne o envio de tokens nulos ou strings indefinidas nas rotas públicas.
* **Consequências Positivas:** Todas as telas presentes e futuras do sistema ZELUS comunicam-se de forma autenticada com a API automaticamente ao invocar qualquer método exportado por `api.js`.

---

## 7. Registro de Decisão Arquitetural (ADR) — Guarda de Rotas Declarativo e Deep Linking

* **Contexto:** Os fluxos de acompanhamento de chamados e de abertura de nova solicitação municipal carecem de identidade garantida do cidadão para registro no banco de dados. Usuários anônimos navegando diretamente por URL poderiam acessar etapas avançadas e sofrer erros transacionais no momento da submissão.
* **Decisão:** Criação do componente `PrivateRoute.jsx` atuando como guardião declarativo no `App.js` e aprimoramento da página `LoginCidadao.jsx` para priorizar `location.state?.from?.pathname` no redirecionamento pós-login.
* **Justificativa:**
  1. **Zero FOUC:** O componente filho não é montado no DOM virtual enquanto o token não for atestado.
  2. **Histórico Limpo:** Uso de `replace: true` impede que o usuário caia em loops no histórico de navegação ao tentar retornar pelo navegador.
  3. **Continuidade de Tarefa (UX):** Munícipes com links diretos não perdem seu fluxo de trabalho, sendo devolvidos à etapa pretendida imediatamente após autenticar.

---

## 8. Registro de Decisão Arquitetural (ADR) — Mapeamento Visual Desacoplado e Integridade Relacional de UUIDs

* **Contexto:** A API REST (`GET /api/categorias`) retorna os registros normalizados do banco relacional com nomes textuais e UUIDs, porém sem metadados visuais de interface (ícones, vetores SVG neobrutalistas, ilustrações ricas). Sobrescrever cegamente o layout quebraria o design neobrutalista aprovado; por outro lado, manter dados mockados geraria erros de integridade referencial (`foreign key constraint`) na gravação de solicitações.
* **Decisão:** Criou-se uma camada de resolução e mapeamento tolerante nos componentes `NovaSolicitacaoStep1.jsx` e `NovaSolicitacaoStep2.jsx`, na qual os nomes da base de dados são normalizados e enriquecidos com assets gráficos locais, ao mesmo tempo em que os UUIDs reais do PostgreSQL são incorporados e repassados no rascunho `zelus_rascunho_solicitacao` e nos estados de navegação SPA.
* **Justificativa:**
  1. **Integridade de Chaves Estrangeiras:** O backend recebe exatamente os UUIDs válidos cadastrados em `public.subcategorias(id)`.
  2. **Preservação Visual 100% Neobrutalista:** Mantém-se o contraste, cores institucionais, SVGs e ilustrações sem dependência de campos binários no banco de dados.
  3. **Resiliência de Estado:** O rascunho persistido permite recuperação do estado em caso de refresh ou perda transitória de rede.

---

## 9. Registro de Decisão Arquitetural (ADR) — Envio Transacional e Tratamento de Exceções de Domínio (Anti-Spam Haversine)

* **Contexto:** A criação de chamados submete dados espaciais e arquivos fotográficos que, se mal controlados pelo cliente, podem gerar chamados fantasmas duplicados ou falhas silenciosas decorrentes de validações geodésicas de retaguarda (como a regra municipal anti-duplicidade em raio de 10 metros).
* **Decisão:** A Etapa 4 centralizou a construção de um payload sanitizado e tipado para `POST /api/solicitacoes`, implementou bloqueio visual anti-duplo clique (`enviando`), interceptação explícita de erros HTTP 409 (Haversine) com alertas acessíveis, e transição para a tela de conclusão com o protocolo oficial emitido pelo banco.
* **Justificativa:**
  1. **Idempotência no Cliente:** O estado de loading bloqueia novas submissões enquanto a primeira promessa estiver em trânsito.
  2. **Clareza ao Munícipe:** O erro 409 não é mascarado como falha de sistema; em vez disso, orienta o munícipe que aquele mesmo problema físico já foi registrado por outro cidadão no mesmo local geográfico.
  3. **Conclusão Transacional Segura:** A exclusão do rascunho ocorre estritamente após o retorno de sucesso com HTTP 201 e persistência no banco.


