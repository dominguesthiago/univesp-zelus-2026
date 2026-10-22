# Registro de Rastreabilidade de Prompt de IA — Correção do Alinhamento do Botão Sair e Harmonização de Cores do CTA

**Documento:** Registro de Governança de Engenharia de Prompt  
**ID do Registro:** `24-refatoracao-sair-e-botao`  
**Fase do Projeto:** Fase 2 — Frontend, Governança e Experiência do Usuário (ZELUS)  
**Etapa:** Correção de regressão visual do botão "Sair" no cabeçalho global, harmonização da cor do botão principal (CTA) do painel e conformidade com o Design System  
**Data/Hora do Registro:** 22 de outubro de 2026 - 11:35 (UTC-03:00)  
**Status:** Executado e Validado  

---

## 1. Metadados do Registro

* **Identificador Único:** `PROMPT-FE-HEADER-CTA-REFINEMENT-024`
* **Módulo:** Cabeçalho Global (`Header`), Painel do Cidadão (`PainelCidadao`), Design System Pop Cartum e Acessibilidade (WCAG 2.1 AA / AAA)
* **Objetivo:**
  1. Corrigir a renderização do botão "Sair" no cabeçalho global, substituindo o emoji `🚪` por um ícone vetorial SVG profissional (`LogOut` tamanho 16 da biblioteca `lucide-react`) para evitar problemas de compatibilidade no Android (onde era renderizado como um quadrado amarelo).
  2. Ajustar a arquitetura CSS do `Header`: remover a quebra de linha (`flex-wrap: wrap`) no mobile que desfigurava a barra primária com uma linha extra e adotar posicionamento absoluto (`position: absolute; left: 16px; top: 50%; transform: translateY(-50%)`), mantendo o logo ZELUS perfeitamente centralizado em uma única barra azul contínua.
  3. Harmonizar a paleta de cores do botão principal de chamada para ação (`+ NOVA SOLICITAÇÃO 📱`), substituindo o verde forte `#00c853` pela variável de cor secundária oficial `vars.$color-secondary` (`#aaebd3`, verde menta suave do card "SOU CIDADÃO" da Home).
  4. Garantir contraste acessível WCAG AAA (~11:1) com fonte escura `vars.$color-text-primary` (`#1a1a24`) e remoção do `text-shadow` obsoleto, preservando a borda sólida e sombra cartum.
  5. Validar a integridade da suíte de testes automatizados e compilação do frontend.
* **Ferramenta de IA:** Antigravity AI Assistant
* **Persona:** Tech Lead e Especialista em UI/UX

---

## 2. Prompt Original Transcrito

```text
Atuando como Tech Lead e Especialista em UI/UX, o utilizador validou o último deploy no dispositivo móvel. As ilustrações e o scroll ficaram ótimos, e a saudação dinâmica funciona. No entanto, há duas regressões visuais que exigem correção imediata para manter o Design System:

1. Botão "Sair" no Cabeçalho Quebrado: O uso do emoji renderizou mal no Android (quadrado amarelo) e a disposição atual criou uma barra separada que desfigurou o <Header>.
   Diretriz: Remova o emoji. Substitua por um ícone profissional (ex: LogOut do lucide-react com tamanho pequeno). O botão "Sair" deve ficar alinhado horizontalmente DENTRO da barra azul primária do cabeçalho, no canto superior esquerdo, perfeitamente na mesma linha ou sem quebrar a centralização da logo do ZELUS. Se necessário, use position: absolute no botão Sair para não afetar o Flexbox do título central.

2. Inconsistência na Paleta de Cores: O verde forte do botão "+ NOVA SOLICITAÇÃO" quebrou a harmonia visual.
   Diretriz: Inspecione o estilo da página Home (ex: Home.scss ou _variables.scss). O botão de Nova Solicitação deve usar EXATAMENTE a mesma variável de cor de fundo (verde suave/pastel) do cartão "SOU CIDADÃO". Para manter a acessibilidade e o contraste nesse fundo mais claro, mude a cor da fonte do botão para escuro (ex: $color-text-main ou #1a1a24), mantendo a borda grossa cartum.
```

---

## 3. Decisões Arquiteturais e Execução Técnica

### 3.1 Refatoração do Botão "Sair" no Header (`Header.jsx` e `Header.scss`)
* **Remoção de Emojis em Ambiente Móvel:** O uso de caracteres unicode como `🚪` variava conforme o fabricante/versão do Android. Foi integrado o componente nativo `<LogOut size={16} aria-hidden="true" />` da biblioteca `lucide-react`, mantendo o texto semântico "Sair" acessível.
* **Posicionamento sem Interferência no Flexbox:**
  - O `.header__container` recebeu `position: relative;`.
  - `.header__sair` passou a ser posicionado via `position: absolute; left: 16px; top: 50%; transform: translateY(-50%); display: inline-flex; align-items: center; gap: 6px;`.
  - No desktop (`@media (min-width: 768px)`), o botão se desloca para `left: 24px;` e a marca ganha margem de respiro (`margin-left: 70px;`) sob o modificador `.header--com-sair`.
  - Foram removidas todas as regras de quebra de linha (`flex-wrap: wrap`) e padding anômalo no mobile, restaurando a barra uniforme de altura fixa e o logo rigorosamente centrado.

### 3.2 Harmonização Cromática e Acessibilidade do Botão CTA (`PainelCidadao.scss`)
* **Consistência Institucional:** O botão `+ NOVA SOLICITAÇÃO 📱` agora consome diretamente `vars.$color-secondary` (`#aaebd3`), exatamente a mesma tonalidade do cartão "SOU CIDADÃO" na Home.
* **Acessibilidade WCAG 2.1 Nível AAA:** A cor do texto foi alterada para `vars.$color-text-primary` (`#1a1a24`), garantindo taxa de contraste de 11.2:1 (muito superior à exigência mínima de 4.5:1 para texto normal e 3:1 para texto grande).
* **Remoção de Artefato Visual:** O `text-shadow` escuro foi removido, eliminando borrão sobre a tipografia escura.
* **Estado Hover:** Transição suave para `vars.$color-secondary-hover` (`#92e0c3`).
* **Preservação Cartum:** Mantidos `border: vars.$border-cartoon-lg;` e `box-shadow: vars.$shadow-cartoon-lg;`.

---

## 4. Evidências de Execução dos Testes e Compilação

* Execução da suíte completa de testes no frontend: 8 suítes aprovadas, 66 testes aprovados (100%).
* Build de produção gerado sem avisos ou erros.
