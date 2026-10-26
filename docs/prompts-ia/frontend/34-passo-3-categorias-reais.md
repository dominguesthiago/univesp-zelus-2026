# Registro de Rastreabilidade de Prompt de IA — Passo 3: Categorias e Subcategorias Reais da API

**Documento:** Registro de Governança de Engenharia de Prompt  
**ID do Registro:** `34-passo-3-categorias-reais`  
**Fase do Projeto:** Fase 3 — Integração de Dados (Front-end <-> Back-end)  
**Etapa:** Integração Dinâmica de Categorias e Subcategorias, Preservação Neobrutalista e Propagação de UUIDs:
- Refatoração da Etapa 1 (`NovaSolicitacaoStep1.jsx`) para consumir `listarCategorias()` (`GET /api/categorias`) via `useEffect` e `useCallback`.
- Implementação de estados visuais neobrutalistas para carregamento assíncrono (Skeletons com animação pulsante suave e atributo semântico `role="status"` / `aria-busy`) e tratamento de erros de rede (Container Neobrutalista com ícone de alerta, `role="alert"` e botão de retry funcional "TENTAR NOVAMENTE").
- Criação de dicionário de metadados visuais (`MAPA_VISUAL_CATEGORIAS` e função `resolverMetadadosVisuais`) que mapeia as categorias vindas da base de dados (PostgreSQL/Supabase) aos seus respectivos ícones cartum e ilustrações sem quebrar a estética neobrutalista validada.
- Persistência e propagação dos UUIDs verdadeiros da categoria e subcategorias no estado local (`zelus_rascunho_solicitacao` no `localStorage`) e no objeto de transição (`navigate(..., { state })`).
- Refatoração da Etapa 2 (`NovaSolicitacaoStep2.jsx`) para consumir as subcategorias reais da categoria selecionada através de `location.state` (com fallback resiliente para `localStorage`), associando os UUIDs reais do Supabase aos botões de subcategoria e persistindo `subcategoria_id` (UUID) para a Etapa 3.
- Cobertura de Testes Automatizados (TDD): Implementação e refatoração completa de `NovaSolicitacaoStep1.test.js` e `NovaSolicitacaoStep2.test.js`, cobrindo 100% dos cenários propostos (CT-CAT.1 ao CT-CAT.4) com 17/17 testes aprovados.
- Validação de não-regressão global no front-end: 15/15 suítes de teste e 113/113 testes unitários aprovados com sucesso.  
**Data/Hora do Registro:** 26 de outubro de 2026 - 13:30 (UTC-03:00)  
**Status:** Implementado, 100% Aprovado nos Testes Unitários e Integrado à Governança.

---

## 1. Metadados do Registro

* **Identificador Único:** `PROMPT-FE-INTEGRACAO-PASSO3-034`
* **Módulo:** Formulário de Solicitação (`NovaSolicitacaoStep1.jsx`, `NovaSolicitacaoStep2.jsx`), Estilos (`NovaSolicitacaoStep1.scss`), Testes Unitários (`NovaSolicitacaoStep1.test.js`, `NovaSolicitacaoStep2.test.js`), Governança (`docs/documentacao/frontend/registro-testes-frontend.md`)
* **Objetivo:**
  1. **Integridade Relacional:** Garantir que o frontend trafegue os UUIDs reais de categorias e subcategorias cadastrados no Supabase (`public.categorias` e `public.subcategorias`), preparando a base para o payload da Etapa 4 (`POST /api/solicitacoes`).
  2. **Preservação Visual Neobrutalista:** Assegurar que os nomes e estruturas vindos da API REST sejam acoplados sem distorções visuais aos cards neobrutalistas, mantendo ilustrações, SVGs customizados, sombras duras e bordas grossas.
  3. **Resiliência e UX Assíncrona:** Exibir esqueletos de carregamento (Skeletons) durante a requisição e fornecer mecanismo de recuperação (Retry) em caso de falha de conexão.
  4. **Fallback e Continuidade:** Permitir que o cidadão continue o fluxo mesmo após atualização de página (F5) na Etapa 2 graças ao fallback sincronizado no `localStorage`.
* **Ferramenta de IA:** Antigravity AI Assistant
* **Persona:** Arquiteto de Software e Tech Lead Full Stack

---

## 2. Decisões Técnicas e Arquitetura

### 2.1 Camada de Mapeamento Visual Inteligente
A base de dados armazena entidades normalizadas (`nome: "Asfalto"`, `nome: "Bueiro / Boca de lobo"`), enquanto o frontend possui uma rica identidade visual composta por imagens em bitmap e componentes vetoriais SVG customizados.
Para manter a separação de responsabilidades (SoC):
* O componente `NovaSolicitacaoStep1` utiliza um mapa declarativo `MAPA_VISUAL_CATEGORIAS` e uma função normalizadora `resolverMetadadosVisuais(cat)`.
* O matching é tolerante a acentos e variações de caixa alta/baixa (`normalize('NFD')`), garantindo que tanto dados de seed quanto novas categorias cadastradas pela prefeitura herdem layouts elegantes.
* Categorias em desenvolvimento são mantidas sinalizadas com a badge acessível `EM CONSTRUÇÃO` e preservam a capacidade de scroll isolado do container.

### 2.2 Associação de Subcategorias Reais em Step 2
* A função `associarSubcategoriasReais(subcategoriasConfig, subcategoriasDb)` cruza as definições visuais locais com a lista de subcategorias trazida pela API (seja pelo `location.state` transmitido da Etapa 1 ou resgatado do `localStorage`).
* O UUID da chave estrangeira (`b1b2c3d4-0001-4000-8000-000000000001` para Buraco, `b1b2c3d4-0002-4000-8000-000000000002` para Entupido, etc.) é injetado diretamente nas propriedades `id` e `subcategoria_id` do objeto selecionado.
* Ao selecionar a subcategoria, o rascunho `zelus_rascunho_solicitacao` é atualizado com a chave `subcategoria_id`, chave obrigatória exigida pelo controller `solicitacaoController.js` no backend.

---

## 3. Validação de Testes Automatizados (TDD)

A suíte foi validada no terminal executando Jest pontualmente e depois em conjunto com todo o frontend:
* **Comando:** `npm test -- --watchAll=false src/tests/NovaSolicitacaoStep1.test.js src/tests/NovaSolicitacaoStep2.test.js`
* **Resultado:** 2 suítes aprovadas, 17 testes aprovados (100% de sucesso).
* **Cenários Validados:**
  1. `CT-CAT.1`: Carregamento com sucesso e renderização das categorias dinâmicas vindas da API com assets visuais e badges de construção.
  2. `CT-CAT.2`: Exibição de Skeletons Neobrutalistas com atributos de acessibilidade (`role="status"`, `aria-label`) durante requisição pendente.
  3. `CT-CAT.3`: Tratamento de falha de conexão na API, renderização de alerta com `role="alert"` e fluxo de recuperação com botão de Retry disparando nova requisição com sucesso.
  4. `CT-CAT.4`: Seleção de categoria, persistência de UUID real e subcategorias no `localStorage` e tráfego para a Etapa 2 via state de navegação.
  5. `Etapa 2 - Subcategorias`: Renderização de subcategorias para Asfalto e Bueiro com injeção dos UUIDs do Supabase, persistência de `subcategoria_id` e navegação para a Etapa 3.
  6. `Etapa 2 - Resiliência e Fallback`: Fallback transparente para `localStorage` em recarregamentos diretos de URL e bloqueio de navegação para itens "EM CONSTRUÇÃO".

* **Validação Global de Regressão:**
  * **Comando:** `npm test -- --watchAll=false`
  * **Resultado:** 15 suítes aprovadas, 113 testes aprovados, 0 falhas.

---

## 4. Próximos Passos (Passo 4 da Integração)
Com as categorias e subcategorias trafegando UUIDs reais até a Etapa 3, o próximo passo consistirá em:
1. Validar a captura de localização geográfica e foto da ocorrência na Etapa 3.
2. Na Etapa 4 (Revisão e Envio), consumir `criarSolicitacao()` (`POST /api/solicitacoes`) passando o payload validado com `subcategoria_id`, coordenadas GPS, endereço e foto.
