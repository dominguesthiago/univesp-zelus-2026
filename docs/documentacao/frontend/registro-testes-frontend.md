# Registro Oficial de Testes Automatizados de Frontend — Sistema ZELUS

**Documento:** Matriz de Qualidade, Governança de Testes e Cobertura de Componentes  
**Módulo:** `frontend/src/tests/`  
**Fase:** Fase 2 — Frontend, Governança e Experiência do Usuário (ZELUS)  
**Versão:** 1.0  
**Data:** 19 de outubro de 2026  
**Responsabilidade:** Engenharia de Qualidade (QA) e Automação Sênior  
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

---

## 5. Critérios de Aceite e Métricas de QA

* **Taxa de Sucesso:** 100% dos testes da suíte passando sem regressões.
* **Acessibilidade Automatizada:** Preservação de landmarks semânticos e ausência de nós órfãos de acessibilidade.
* **Conformidade Legal:** Isolamento rigoroso da chave `zelus_termo_aceito` na Web Storage API.
