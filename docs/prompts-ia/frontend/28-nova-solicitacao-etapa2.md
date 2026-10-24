# Registro de Rastreabilidade de Prompt de IA — Nova Solicitação: Etapa 2 (Subcategorias)

**Documento:** Registro de Governança de Engenharia de Prompt  
**ID do Registro:** `28-nova-solicitacao-etapa2`  
**Fase do Projeto:** Fase 2 — Frontend, Governança e Experiência do Usuário (ZELUS)  
**Etapa:** Construção, Renderização Dinâmica (DRY), Isolamento de CSS e Testes Automatizados da tela "Nova Solicitação - Etapa 2 (Subcategorias)":
- Criação dos componentes `NovaSolicitacaoStep2.jsx` e `NovaSolicitacaoStep2.scss`.
- Adoção da metodologia Frontend-First e DRY (*Don't Repeat Yourself*), reaproveitando a mesma casca de tela para todas as categorias através do consumo do `location.state.categoria`.
- Renderização dinâmica do título e das listas de subcategorias:
  - **Asfalto / Rua:** Título "Qual serviço de Asfalto / Rua deseja solicitar?", 1 botão funcional ("Buraco na via") e 3 botões em construção ("Recapeamento", "Pintura de Faixa", "Lombada").
  - **Bueiro / Boca-de-lobo:** Título "Qual serviço de Bueiro / Boca-de-lobo deseja solicitar?", 2 botões funcionais ("Entupido / Transbordando", "Sem Tampa / Quebrado") e 3 botões em construção ("Limpeza Preventiva", "Desinsetização", "Reparo Estrutural").
- Resiliência de rotas com fallback padrão para "asfalto" caso o estado da rota seja nulo ou indefinido.
- Resolução de vazamento global de CSS através da classe modificadora BEM `.categoria-card--step2` com fundo `#F4ECDC`, preservando o fundo `#eff0da` da Etapa 1.
- Suíte completa de testes unitários criada em `NovaSolicitacaoStep2.test.js` com 100% de aprovação.  
**Data/Hora do Registro:** 24 de outubro de 2026 - 15:56 (UTC-03:00)  
**Status:** Implementado, Validado Visualmente, Aprovado na Suíte de Testes (10/10 suítes, 81/81 testes) e Publicado em Produção.

---

## 1. Metadados do Registro

* **Identificador Único:** `PROMPT-FE-NOVA-SOLICITACAO-STEP2-028`
* **Módulo:** Telas do Cidadão (`NovaSolicitacaoStep2.jsx`, `NovaSolicitacaoStep2.scss`, `NovaSolicitacaoStep1.jsx`), Roteamento (`App.js`), Testes Automatizados (`NovaSolicitacaoStep2.test.js`)
* **Objetivo:**
  1. **Construção da Etapa 2 do Fluxo de Nova Solicitação:** Permitir ao cidadão selecionar o serviço específico (subcategoria) do problema relatado.
  2. **Arquitetura DRY de Renderização Dinâmica:** Usar um único componente React para renderizar subcategorias conforme a categoria selecionada na Etapa 1, sem duplicar telas ou arquivos.
  3. **Isolamento de Escopo de CSS (Padrão BEM):** Evitar colisões e vazamentos de cores entre etapas subsequentes, aplicando o modificador exclusivo `.categoria-card--step2` para a cor pastel `#F4ECDC` e garantindo que `.categoria-card` na Etapa 1 permaneça `#eff0da`.
  4. **Resiliência e Fallback Seguro:** Assegurar que acessos diretos via URL `/solicitacao/etapa-2` ou recarregamento de página renderizem a tela com segurança, sem erros de runtime (`TypeError`).
  5. **Cobertura de Testes Automatizados:** Criação de testes unitários abrangendo renderização condicional, acessibilidade, fallback de estado e persistência no `localStorage`.
* **Ferramenta de IA:** Antigravity AI Assistant
* **Persona:** Arquiteto de Software e Tech Lead Frontend

---

## 2. Decisões Técnicas e Arquitetura

### 2.1 Metodologia DRY e Renderização Dinâmica via React Router (`state`)
* Em vez de criar múltiplos componentes de página (`NovaSolicitacaoAsfalto.jsx`, `NovaSolicitacaoBueiro.jsx`), adotou-se a metodologia DRY centralizando as configurações em um dicionário estruturado `CONFIG_CATEGORIAS`.
* O componente [NovaSolicitacaoStep2.jsx](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/pages/NovaSolicitacaoStep2.jsx) consome `location.state?.categoria` injetado pelo [NovaSolicitacaoStep1.jsx](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/pages/NovaSolicitacaoStep1.jsx):
  - **Asfalto:** `navigate('/solicitacao/etapa-2', { state: { categoria: 'asfalto' } })`
  - **Bueiro:** `navigate('/solicitacao/etapa-2', { state: { categoria: 'bueiro' } })`
* Caso o usuário acesse a URL diretamente sem estado, o fallback automático seleciona a categoria `'asfalto'`, mantendo a página sempre utilizável.

### 2.2 Isolamento de Escopo de CSS (Resolução de Colisão BEM)
* Ao ajustar a cor de fundo dos botões da Etapa 2 para `#F4ECDC` (para fornecer sensação visual de avanço de etapa), detectou-se um vazamento de CSS que alterava também a cor da Etapa 1 devido ao compartilhamento da classe `.categoria-card`.
* **Solução:** 
  1. A classe base `.categoria-card` em [NovaSolicitacaoStep2.scss](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/pages/NovaSolicitacaoStep2.scss) e [NovaSolicitacaoStep1.scss](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/pages/NovaSolicitacaoStep1.scss) teve seu fundo restaurado e unificado em `#eff0da`.
  2. Foi introduzida a classe modificadora BEM `.categoria-card--step2` aplicada exclusivamente aos botões da Etapa 2.
  3. No arquivo SCSS correspondente, a regra `&--step2 { background-color: #F4ECDC; }` foi aplicada, garantindo estrita separação cromática entre as etapas.

### 2.3 Ergonomia Visual, Design Neobrutalista e Scroll Invisível
* Mantida a fidelidade à moldura de smartphone de 385px no desktop (`.nova-solicitacao-card-mobile`), com cabeçalho institucional azul `#1a3458` e rodapé institucional fixo.
* A lista de subcategorias possui scroll vertical expansível e isolado com `gap: 28px` e barras de rolagem nativas invisíveis (`scrollbar-width: none;`).
* Ícones vetoriais cartum neobrutalistas personalizados (com linhas grossas de 2.5px a 3.5px e preenchimento harmonizado em `#F4ECDC`) foram criados para as opções em construção e opções funcionais sem fotografia.

---

## 3. Validação de Testes Automatizados

A suíte completa foi revalidada via terminal (`npm test -- --watchAll=false`):
* **Suítes de Teste:** 10 aprovadas de 10 existentes (100%).
* **Testes Executados:** 81 aprovados de 81 existentes (100%).
* **Testes Adicionados em `NovaSolicitacaoStep2.test.js`:**
  1. Renderização do cabeçalho institucional e link de retorno acessível para a Etapa 1.
  2. Renderização do cenário "Asfalto / Rua" (título, 1 botão funcional e 3 mocks em construção).
  3. Renderização do cenário "Bueiro / Boca-de-lobo" (título, 2 botões funcionais e 3 mocks em construção).
  4. Resiliência com fallback seguro para estado nulo/indefinido.
  5. Validação da classe base e do modificador de isolamento CSS `.categoria-card--step2`.
  6. Persistência e atualização dos dados de subcategoria no `localStorage`.
* **Status:** Zero regressões identificadas em toda a aplicação.

---

## 4. Mensagem de Commit Aplicada

```text
feat(frontend): tela dinamica de nova solicitacao etapa 2 e isolamento de css

- Criacao dos componentes NovaSolicitacaoStep2.jsx e NovaSolicitacaoStep2.scss
- Implementacao da metodologia DRY consumindo state.categoria via useLocation com fallback seguro
- Renderizacao dinamica de subcategorias para Asfalto (1 funcional + 3 mocks) e Bueiro (2 funcionais + 3 mocks)
- Criacao de icones cartum neobrutalistas para as subcategorias e rotas em construcao
- Isolamento estrito de CSS com modificador BEM .categoria-card--step2 (#F4ECDC), preservando a cor #eff0da na Etapa 1
- Atualizacao do roteamento em App.js e integracao da transicao de tela no NovaSolicitacaoStep1.jsx
- Criacao da suite completa de testes unitarios NovaSolicitacaoStep2.test.js
- Registro de governanca de IA em docs/prompts-ia/frontend/28-nova-solicitacao-etapa2.md
```
