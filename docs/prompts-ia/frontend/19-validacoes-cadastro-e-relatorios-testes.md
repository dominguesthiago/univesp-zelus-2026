# Registro de Rastreabilidade de Prompt de IA — Validações de Formulário no Cadastro, Geração de Relatórios de Testes e Correção de Governança

**Documento:** Registro de Governança de Engenharia de Prompt  
**ID do Registro:** `19-validacoes-cadastro-e-relatorios-testes`  
**Fase do Projeto:** Fase 2 — Frontend, Governança e Experiência do Usuário (ZELUS)  
**Etapa:** Validações de Formulário no Cadastro, Elaboração de Relatórios de Testes e Reestruturação Sequencial da Governança de Prompts  
**Data/Hora do Registro:** 21 de outubro de 2026 - 10:30 (UTC-03:00)  
**Status:** Executado e Validado  

---

## 1. Metadados do Registro

* **Identificador Único:** `PROMPT-FE-VALIDACOES-TESTES-GOVERNANCA-019`
* **Módulo:** Governança, Validação de Dados, Qualidade de Software (QA) e Cadastro do Cidadão
* **Objetivo:** 
  1. Implementar regras estritas de validação em frontend para os 5 campos da tela de Cadastro do Cidadão (`CadastroCidadao.jsx` e `CadastroCidadao.scss`) com mensagens de erro acessíveis (`role="alert"`, `aria-live="polite"`, `aria-describedby`) e bloqueio da emissão de dados inconsistentes.
  2. Documentar de forma aprofundada as regras de validação para o Trabalho de Conclusão de Curso (TCC) em `docs/documentacao/regras-validacao-frontend.md`.
  3. Criar suíte de testes unitários da Home (`Home.test.js`) e produzir relatórios detalhados individuais para todas as 5 suítes de testes em `docs/testes-frontend/` (`relatorio-home.md`, `relatorio-login-cidadao.md`, `relatorio-cadastro-cidadao.md`, `relatorio-action-card.md`, `relatorio-cookie-banner.md` e `LEIA-ME-TESTES.md`).
  4. Corrigir a numeração cronológica dos documentos de rastreabilidade de IA do frontend, eliminando duplicidades (`10-`, `11-`, `12-`, `15-`) e restabelecendo uma sequência unívoca de `01` a `19`.
* **Ferramenta de IA:** Antigravity AI Assistant
* **Persona:** Engenheiro de Software e Tech Lead do Projeto ZELUS

---

## 2. Prompt Original Transcrito

```text
Atuando como Engenheiro de Software e Tech Lead do projeto ZELUS, precisamos aplicar regras de validação de frontend na tela de Cadastro do Cidadão, corrigir a governança dos nossos arquivos e documentar TODOS os testes automatizados já criados.

A tua tarefa agora:

1. Implementar Validações no Frontend (CadastroCidadao.jsx):
   - Antes de submeter o formulário (no handleSubmit), implementa as seguintes regras de validação. Se alguma falhar, exibe uma mensagem de erro clara (ex: texto vermelho acessível abaixo do campo com aria-live="polite") e impede o console.log:
     * Nome Completo: Deve conter pelo menos duas palavras (separadas por espaço) e apenas letras.
     * CPF: Deve estar totalmente preenchido (exatamente 14 caracteres com a máscara).
     * E-mail: Validação de regex padrão (deve conter @ e domínio).
     * Telefone: Deve estar totalmente preenchido (exatamente 15 caracteres com a máscara).
     * Senha: Deve ter no mínimo 8 caracteres, contendo obrigatoriamente pelo menos uma letra e um número.

2. Documentar as Regras de Negócio (TCC):
   - Cria um ficheiro em docs/documentacao/regras-validacao-frontend.md.
   - Documenta de forma técnica as regras de validação que aplicaste na tela de Cadastro.

3. Gerar Relatórios de TODOS os Testes:
   - Executa a suite de testes completa de todo o frontend.
   - Para CADA arquivo de teste existente (ex: Home, LoginCidadao, CadastroCidadao, ActionCard, etc.), cria um relatório MD separado na pasta docs/testes-frontend/ (ex: relatorio-home.md, relatorio-login-cidadao.md, relatorio-cadastro-cidadao.md).
   - Cada relatório deve listar quais comportamentos e regras de acessibilidade foram validados e o status de aprovação.

4. Corrigir a Numeração de Rastreabilidade:
   - Na pasta docs/prompts-ia/frontend/, verifica a numeração dos ficheiros. Renomeia os ficheiros para garantir que seguem uma ordem sequencial lógica e sem repetições (ex: corrige os duplicados 10- e 11- e os seguintes).
   - Regista as ações deste prompt no ficheiro sequencial adequado (ex: 14-validacoes-cadastro-e-relatorios-testes.md).

5. Commit:
   - Após garantir que nada quebrou, faz o commit com a mensagem: feat(frontend): validacoes de formulario no cadastro, geracao de relatorios de testes e correcao de governanca.
   - Faz o git push origin main e avisa o utilizador.
```

---

## 3. Decisões Arquiteturais e Entregas Vinculadas

### 3.1 Validações de Frontend (`CadastroCidadao.jsx` e `CadastroCidadao.scss`)
* **Nome Completo:** Expressão regular `/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/` associada a contagem de tokens por `split(/\s+/) >= 2`, garantindo preenchimento de nome e sobrenome sem números ou caracteres especiais.
* **CPF:** Validação estrita de 14 caracteres com máscara (`/^\d{3}\.\d{3}\.\d{3}-\d{2}$/`).
* **E-mail:** Expressão regular `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` exigindo `@` e domínio válido.
* **Telefone:** Validação estrita de 15 caracteres com máscara (`/^\(\d{2}\) \d{5}-\d{4}$/`).
* **Senha:** Validação de entropia mínima ($\ge 8$ caracteres, $\ge 1$ letra `[A-Za-z]`, $\ge 1$ número `\d`).
* **Acessibilidade dos Erros:** Mensagens vermelhas acessíveis sob cada campo inválido (`.cadastro-field__error` com `role="alert"`, `aria-live="polite"` e `aria-describedby`), além da borda destacada em `.cadastro-input-box--invalid`.

### 3.2 Documentação Técnica para TCC (`regras-validacao-frontend.md`)
* Elaboração do documento [`docs/documentacao/regras-validacao-frontend.md`](file:///c:/Users/dfeni/univesp-zelus-2026/docs/documentacao/regras-validacao-frontend.md) contendo motivação arquitetural, conformidade WCAG 2.1 AA (critérios 3.3.1, 3.3.2 e 3.3.3), diagramas conceituais ASCII, matriz de regras de negócio e sanitização de payload.

### 3.3 Relatórios de Testes Automatizados (`docs/testes-frontend/`)
* Criação de [`Home.test.js`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/tests/Home.test.js) e geração de relatórios de cobertura:
  1. [`relatorio-home.md`](file:///c:/Users/dfeni/univesp-zelus-2026/docs/testes-frontend/relatorio-home.md) (5 testes)
  2. [`relatorio-login-cidadao.md`](file:///c:/Users/dfeni/univesp-zelus-2026/docs/testes-frontend/relatorio-login-cidadao.md) (10 testes)
  3. [`relatorio-cadastro-cidadao.md`](file:///c:/Users/dfeni/univesp-zelus-2026/docs/testes-frontend/relatorio-cadastro-cidadao.md) (12 testes)
  4. [`relatorio-action-card.md`](file:///c:/Users/dfeni/univesp-zelus-2026/docs/testes-frontend/relatorio-action-card.md) (4 testes)
  5. [`relatorio-cookie-banner.md`](file:///c:/Users/dfeni/univesp-zelus-2026/docs/testes-frontend/relatorio-cookie-banner.md) (4 testes)
  6. [`LEIA-ME-TESTES.md`](file:///c:/Users/dfeni/univesp-zelus-2026/docs/testes-frontend/LEIA-ME-TESTES.md) (Painel consolidado)

### 3.4 Correção da Numeração de Governança de Prompts
Reestruturação dos arquivos na pasta `docs/prompts-ia/frontend/` em ordem cronológica estrita de `01` a `19`:
* `12-afinacao-cartoes-home.md` $\rightarrow$ `13-afinacao-cartoes-home.md`
* `15-home-refatoracao-semantica.md` $\rightarrow$ `16-home-refatoracao-semantica.md`
* `10-refatoracao-logincidadao.md` $\rightarrow$ `17-refatoracao-logincidadao.md`
* `11-criacao-cadastrocidadao.md` $\rightarrow$ `18-criacao-cadastrocidadao.md`
* Novo registro: `19-validacoes-cadastro-e-relatorios-testes.md`

---

## 4. Verificação Técnica

- **Suíte de Testes:** 100% de aprovação (5 suítes / 35 testes automatizados aprovados via Jest).
- **Build de Produção:** Testado e aprovado via `npm run build`.
- **Deploy:** Enviado para o branch `main` via `git push origin main`.
