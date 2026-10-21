# Registro de Rastreabilidade de Prompt de IA — Afinação dos Cartões na Tela Home

**Documento:** Registro de Governança de Engenharia de Prompt  
**ID do Registro:** `13-afinacao-cartoes-home`  
**Fase do Projeto:** Fase 2 — Frontend, Governança e Experiência do Usuário (ZELUS)  
**Etapa:** Refinamento de espaçamentos e proporções dos ActionCards e do layout da Home  
**Data/Hora do Registro:** 19 de outubro de 2026 - 20:35 (UTC-03:00)  
**Status:** Executado e Validado  

---

## 1. Metadados do Registro

* **Identificador Único:** `PROMPT-FE-HOME-CARDS-REFINE-012`
* **Módulo:** Tela Inicial (`Home.scss`) e Cartões de Ação (`ActionCard.scss`)
* **Objetivo:** Preencher harmoniosamente a altura da tela no mobile centralizando o conteúdo verticalmente, conter a largura dos cartões no mobile para não tocarem as bordas, ampliar a separação entre colunas no desktop e aumentar o corpo dos cartões (padding e min-height).
* **Ferramenta de IA:** Antigravity AI Assistant
* **Persona:** Engenheiro de Frontend Sênior especializado em UI/UX

---

## 2. Prompt Original Transcrito

```text
Atuando como Engenheiro de Frontend Sênior, vamos refinar os espaçamentos dos cartões na tela Home com base na revisão de UX, sem alterar o CookieBanner ou a página de Privacidade.

A Tua Tarefa Agora:
Altere apenas os arquivos abaixo:

frontend/src/pages/Home.scss:

Para preencher melhor a tela no mobile e eliminar o vazio até o rodapé: Garanta que o container principal da Home ocupe a altura disponível e centralize o conteúdo verticalmente (ex: display: flex; flex-direction: column; justify-content: center; flex: 1;).

No mobile, os cartões não podem tocar as bordas. Adicione um padding lateral maior ou limite a largura da grade (width: 90%; max-width: 400px; margin: 0 auto;). Aumente o gap vertical entre os cartões.

No desktop (@media (min-width: ...)), altere para display: grid; (se necessário) e aumente ligeiramente o gap (espaço) entre as colunas para separar mais os dois cartões.

frontend/src/components/ActionCard.scss:

Ajuste as margens internas (padding) ou a altura mínima (min-height) para que os cartões fiquem mais "encorpados" e ocupem melhor a tela no celular.

Crie fisicamente o arquivo docs/prompts-ia/frontend/12-afinacao-cartoes-home.md com o registro destas alterações visuais.

Execute as alterações, salve os arquivos e avise-me quando concluir.
```

---

## 3. Ações Físicas Realizadas

### 3.1 `frontend/src/pages/Home.scss`
* **Preenchimento e centralização vertical:**
  * `.home`: configurado com `display: flex; flex-direction: column; justify-content: center; flex: 1; min-height: calc(100vh - 160px);`, ocupando todo o espaço útil disponível entre Header e Footer e eliminando o vazio inferior.
* **Contenção no mobile:**
  * `.home__cards`: definido com `width: 90%; max-width: 400px; margin: 0 auto; gap: vars.$spacing-xl;`, impedindo que os cartões toquem as bordas do viewport em celulares e garantindo respiração vertical confortável.
* **Separação no desktop:**
  * `@media (min-width: vars.$breakpoint-md)`: reativado `display: grid; grid-template-columns: repeat(2, 1fr); width: 100%; max-width: 900px;` com gap aumentado (`gap: vars.$spacing-2xl;` / 48px) para separar mais as duas opções (Cidadão vs. Prefeitura).

### 3.2 `frontend/src/components/ActionCard.scss`
* **Cartões mais encorpados:**
  * No mobile: adicionada altura mínima de `min-height: 240px;` e aumentado o padding interno para `padding: vars.$spacing-xl vars.$spacing-lg;` (32px vertical e 24px horizontal).
  * No desktop: ajustada a altura mínima para `min-height: 280px;` e padding para `padding: vars.$spacing-2xl vars.$spacing-xl;` (48px vertical e 32px horizontal).

---

## 4. Validação e Qualidade

1. **Testes Automatizados:** Suíte Jest executada sem falhas (`npm test -- --watchAll=false`): 8 testes em 2 arquivos de teste (100% aprovados).
2. **Servidor Local:** Servidor React ativo compilando os SCSS e servindo em `http://localhost:3000`.
