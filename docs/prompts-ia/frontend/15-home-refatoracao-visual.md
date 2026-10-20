# Registro de Rastreabilidade de Prompt de IA — Refatoração Visual da Tela Inicial (Fidelidade aos Mockups)

**Documento:** Registro de Governança de Engenharia de Prompt  
**ID do Registro:** `15-home-refatoracao-visual`  
**Fase do Projeto:** Fase 2 — Frontend, Governança e Experiência do Usuário (ZELUS)  
**Etapa:** Refatoração de UI/UX da Tela Inicial (Home) para Fidelidade Estrita aos Mockups Oficial Desktop e Mobile  
**Data/Hora do Registro:** 20 de outubro de 2026 - 18:05 (UTC-03:00)  
**Status:** Executado e Validado  

---

## 1. Metadados do Registro

* **Identificador Único:** `PROMPT-FE-HOME-VISUAL-REFACTOR-015`
* **Módulo:** Tela Inicial (`Home.jsx`, `Home.scss`, `ActionCard.scss`, `Header.jsx`, `Header.scss`, `Footer.scss`, `_variables.scss`)
* **Objetivo:** Refatorar a interface da tela inicial para alcançar 100% de conformidade com os mockups oficiais de referência (`Gemini_Generated_Image_2.jpeg` para desktop e `1_2.jfif` para mobile), garantindo fidelidade cromática, diagramação horizontal dos cartões com ilustrações ricas, tipografia institucional e zero rolagem vertical em celulares.
* **Ferramenta de IA:** Antigravity AI Assistant
* **Persona:** Engenheiro de Frontend Sênior especializado em UI/UX

---

## 2. Prompt Original Transcrito

```text
Atuando como Engenheiro de Frontend Sênior especializado em UI/UX, precisamos de refatorar a Tela Inicial (Home.jsx e Home.scss) para que fique 100% alinhada com a identidade visual dos nossos mockups (Gemini_Generated_Image_2.jpeg para desktop e 1_2.jfif para mobile) e com o padrão de excelência que aplicámos no ecrã de Login do Cidadão.

A tua tarefa agora:
NÃO cries novos ficheiros desnecessários. Refatora a Home.jsx, a Home.scss e o ActionCard.scss (se necessário) para garantir:

Paleta de Cores e Identidade: Uso rigoroso das cores institucionais corretas do nosso Design System (_variables.scss): o Azul Institucional no cabeçalho, o Verde Menta suave no card 'Sou Cidadão' e o Amarelo/Laranja vibrante no card 'Acesso Prefeitura'.

Tipografia e Espaçamentos: O título principal ('Como deseja acessar o ZELUS?') deve ter o espaçamento exato em relação ao cabeçalho e estar perfeitamente centralizado.

Proporções dos Cartões (ActionCards): Os cartões devem manter o estilo cartum (bordas pretas grossas de 3px a 4px, cantos fortemente arredondados e sombra sólida projetada), com as ilustrações e textos perfeitamente proporcionados — lado a lado no Desktop e empilhados de forma limpa e sem scroll indesejado no Mobile.

Rastreabilidade: Atualiza ou cria o ficheiro de registo docs/prompts-ia/frontend/15-home-refatoracao-visual.md com os detalhes desta melhoria.

Realiza as alterações, compila o código e avisa-me assim que estiver pronto para validarmos!
```

---

## 3. Decisões Arquiteturais e Entregas Vinculadas

### 3.1 Fidelidade Estrita de Identidade Visual e Mockups

1. **Ilustrações Oficiais Extraídas:**
   - [`ilustracao-cidadao.png`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/assets/images/ilustracao-cidadao.png): Extraída a arte do munícipe/família na cidade com pin de localização e poste de luz.
   - [`ilustracao-prefeitura.png`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/assets/images/ilustracao-prefeitura.png): Extraída a arte do servidor público operando o painel administrativo de gestão municipal.
   - [`logo-zelus-icon.png`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/assets/images/logo-zelus-icon.png): Ícone 3D em cubo azul com letra branca 'Z' integrado ao [`Header.jsx`](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/components/Header.jsx).

2. **Cores Institucionais (`_variables.scss`):**
   - `$color-primary`: `#1a3458` (Azul institucional marinho para cabeçalhos e títulos).
   - `$color-secondary`: `#aaebd3` (Verde menta pastel idêntico ao fundo do card "SOU CIDADÃO").
   - `$color-accent`: `#fbd362` (Amarelo ouro vibrante idêntico ao fundo do card "ACESSO PREFEITURA").

3. **Arquitetura Horizontal dos Cartões (`ActionCard.scss`):**
   - Os cartões agora utilizam diagramação **horizontal** (`flex-direction: row; align-items: stretch;`):
     - **Lado esquerdo (46% a 48%):** A ilustração estende-se confortavelmente até as bordas internas do card.
     - **Lado direito (52% a 54%):** Bloco de texto com título em caixa alta bold (`SOU CIDADÃO` / `ACESSO PREFEITURA`) e descrição com ícone (`📱` e `💻`).
   - Bordas grossas cartum (`3px` a `3.5px solid #1a1a24`), raio arredondado (`20px` a `28px`) e sombra sólida projetada (`4px` a `6px`).

4. **Diagramação Responsiva e Zero Scroll (`Home.scss`):**
   - **Desktop:** Cartões lado a lado em grid de 2 colunas amplas (`max-width: 1020px; gap: 32px`).
   - **Mobile:** Cartões empilhados verticalmente com largura contida (`max-width: 375px; gap: 14px`), encaixando título, cards e rodapé dentro da altura útil de 600px a 700px sem scroll.

5. **Harmonização do Cabeçalho e Rodapé (`Header.scss` e `Footer.scss`):**
   - Cabeçalho global no tom institucional `#1a3458`, centralizado no mobile e com botão "Acessibilidade (?)" à direita no desktop.
   - Rodapé com tagline limpa `ZELUS • Acessível e inclusivo para todos` sem divisórias rígidas.

---

## 4. Verificação Técnica

- **Compilação Contínua:** Webpack Dev Server compilou com sucesso (`Compiled successfully`).
- **Suíte de Testes Automatizados:** 100% de aprovação em todos os testes unitários (`npm test`).
