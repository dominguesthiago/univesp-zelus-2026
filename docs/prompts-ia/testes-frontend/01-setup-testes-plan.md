# Registro de Rastreabilidade de Prompt de IA — Configuração e Execução de Testes de Frontend

**Documento:** Registro de Governança de Engenharia de Prompt  
**ID do Registro:** `01-setup-testes-plan`  
**Fase do Projeto:** Fase 2 — Frontend, Governança e Experiência do Usuário (ZELUS)  
**Etapa:** Bateria 01 de Testes Automatizados (QA) e Inicialização de Servidor  
**Data/Hora do Registro:** 19 de outubro de 2026 - 19:19 (UTC-03:00)  
**Status:** Executado e Arquivado  

---

## 1. Metadados do Registro

* **Identificador Único:** `PROMPT-QA-FRONTEND-SETUP-001`
* **Módulo:** Garantia da Qualidade (QA), Testes Automatizados e Execução Local
* **Objetivo:** Estabelecer a infraestrutura de testes no frontend do ZELUS (Jest + React Testing Library), criar testes unitários para os componentes `CookieBanner` e `ActionCard`, documentar a matriz oficial de testes e inicializar o servidor de desenvolvimento.
* **Ferramenta de IA:** Antigravity AI Assistant
* **Persona:** Engenheiro de Qualidade (QA) e Automação Sênior

---

## 2. Prompts Originais Transcritos

### 2.1 Prompt de Planejamento

```text
Atuando como Engenheiro de Qualidade (QA) e Automação Sênior, o nosso próximo passo é garantir a qualidade da tela inicial, criando os testes automatizados dos componentes e iniciando o servidor para visualização.

A Tua Tarefa Agora:
NÃO geres o código final dos testes ainda. Elabora apenas um Plano de Ação detalhando a arquitetura desta etapa de QA, seguido da instrução para levantar o servidor.

Mapeamento para o Plano de Ação:

frontend/src/tests/CookieBanner.test.js: Detalha o escopo do teste usando React Testing Library. Ele deve verificar: renderização do texto, clique no botão e se a função localStorage.setItem foi chamada corretamente com a chave zelus_termo_aceito.

frontend/src/tests/ActionCard.test.js: Detalha o escopo verificando se as props (title, description) são exibidas na tela e se o clique na tag <button> dispara a função mockada do onClick.

docs/documentacao/frontend/registro-testes-frontend.md: Detalha a criação do documento oficial de QA registrando a configuração do Jest/React Testing Library e esta primeira bateria de testes da Home.

docs/prompts-ia/testes-frontend/01-setup-testes-plan.md: Confirma a criação deste arquivo para o histórico do QA.

Comando de Execução: Informa que, após a minha aprovação deste plano, o teu primeiro passo prático será abrir um terminal paralelo e rodar npm start no diretório frontend/ para expor a interface no http://localhost:3000.

Devolve estritamente o Plano de Ação. Termine perguntando se o plano está aprovado para a geração do código e a inicialização do servidor.
```

### 2.2 Prompt de Execução (Aprovação)

```text
O Plano de Ação de QA e execução está 100% aprovado. Excelente diagnóstico sobre as dependências do Testing Library e o uso do MemoryRouter.

Sua Tarefa Agora:
Execute fisicamente as seguintes ações na ordem:

Atualize o frontend/package.json e instale as dependências de teste (@testing-library/react, @testing-library/jest-dom, @testing-library/user-event).

Crie o diretório frontend/src/tests/ e os arquivos CookieBanner.test.js e ActionCard.test.js com todos os casos de teste mapeados no plano.

Crie a documentação de QA em docs/documentacao/frontend/registro-testes-frontend.md e o registro do prompt em docs/prompts-ia/testes-frontend/01-setup-testes-plan.md.

Execute o comando npm test -- --watchAll=false (ou equivalente no seu script) para rodar e validar a suíte de testes.

Por fim, abra um terminal paralelo e execute npm start para levantar a interface no http://localhost:3000.

Me avise apenas quando a suíte de testes passar com sucesso e o servidor estiver no ar.
```

---

## 3. Decisões Arquiteturais e Entregas Vinculadas

### 3.1 Artefatos Gerados
1. [CookieBanner.test.js](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/tests/CookieBanner.test.js):
   * Casos de teste para renderização de conformidade LGPD, clique com gravação de `'zelus_termo_aceito' = 'true'` via `jest.spyOn`, desmonte de tela e supressão quando previamente aceito. Envolvido com `MemoryRouter`.
2. [ActionCard.test.js](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/tests/ActionCard.test.js):
   * Casos de teste para validação de `title` em `<h2>`, `description`, atributo decorativo `alt=""` / `aria-hidden="true"`, clique em `<button>` com mock `jest.fn()` e aplicação de classe temática de cor.
3. [setupTests.js](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/setupTests.js):
   * Configuração global do `@testing-library/jest-dom`.
4. [registro-testes-frontend.md](file:///c:/Users/dfeni/univesp-zelus-2026/docs/documentacao/frontend/registro-testes-frontend.md):
   * Documentação oficial de estratégia de testes, comandos de execução e matriz de cobertura.
5. [01-setup-testes-plan.md](file:///c:/Users/dfeni/univesp-zelus-2026/docs/prompts-ia/testes-frontend/01-setup-testes-plan.md):
   * Este registro de rastreabilidade.

---

## 4. Referências e Padrões Aplicados

1. **React Testing Library Guiding Principles**: Testar a interface da forma que o usuário e o leitor de tela interagem, priorizando consultas semânticas por acessibilidade.
2. **Jest Test Runner**: Validação de asserções, espionagem de chamadas a APIs nativas do navegador e mocks determinísticos.
