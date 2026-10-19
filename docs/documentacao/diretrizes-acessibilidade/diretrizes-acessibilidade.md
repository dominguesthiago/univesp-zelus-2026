# Diretrizes de Acessibilidade Digital — Sistema ZELUS

**Documento:** Diretrizes de Acessibilidade Digital e Design Inclusivo  
**Versão:** 1.0  
**Data:** 19 de outubro de 2026  
**Responsabilidade:** Engenharia de Frontend & Especialista em Compliance e Acessibilidade Digital  
**Status:** Aprovado  

---

## 1. Introdução e Compromisso Institucional

### 1.1 Objetivo e Escopo de Acessibilidade no ZELUS
O **ZELUS** é a plataforma integrada de gestão de solicitações e zeladoria urbana municipal, desenhada para servir à totalidade dos cidadãos e agentes públicos municipais. Por se tratar de um serviço público essencial — voltado ao registro, acompanhamento e solução de demandas urbanas como pavimentação, iluminação pública, saneamento e conservação de praças —, o sistema deve ser universalmente acessível, inclusivo e transparente.

A acessibilidade digital não é tratada no ZELUS como uma funcionalidade secundária ou corretiva, mas como um **requisito não funcional prioritário e estruturante de arquitetura** (*accessibility by design*), abrangendo todas as interfaces de usuário da aplicação web (mobile, tablet e desktop).

### 1.2 Marco Legal Brasileiro (LBI - Lei 13.146/2015 e Decreto 5.296/2004)
A obrigatoriedade de acessibilidade nas plataformas públicas no Brasil é regida por instrumentos legais fundamentais:

* **Lei Brasileira de Inclusão da Pessoa com Deficiência (Estatuto da Pessoa com Deficiência - Lei nº 13.146/2015)**: O Artigo 63 estabelece como imperativa a acessibilidade nos sítios da internet mantidos por órgãos do governo ou por empresas prestadoras de serviços públicos, devendo atender às melhores práticas e diretrizes internacionais consagradas.
* **Decreto Federal nº 5.296/2004**: Regulamenta as Leis nº 10.048/2000 e 10.098/2000, estabelecendo normas gerais e critérios básicos para a promoção da acessibilidade das pessoas com deficiência ou com mobilidade reduzida no acesso aos meios de comunicação e à informação.
* **Lei de Acesso à Informação (Lei nº 12.527/2011)**: Determina a divulgação de informações de interesse coletivo ou geral por meio de tecnologias de informação acessíveis.

---

## 2. Padrões Adotados e Níveis de Conformidade

### 2.1 WCAG 2.1 Nível AA (W3C/WAI)
O ZELUS adota formalmente as diretrizes internacionais **WCAG 2.1 (*Web Content Accessibility Guidelines*)**, estabelecidas pela iniciativa WAI (*Web Accessibility Initiative*) do consórcio W3C, no **Nível de Conformidade AA**.

A arquitetura do frontend é construída em consonância com os quatro princípios basilares da WCAG:
1. **Perceptível:** As informações e componentes da interface devem ser apresentados de maneira que possam ser percebidos pelos sentidos dos usuários.
2. **Operável:** Os componentes de navegação, formulários e controles devem ser acionáveis por qualquer dispositivo de entrada (especialmente teclado).
3. **Compreensível:** A informação e a operação da interface devem ser claras, intuitivas e previsíveis.
4. **Robusto:** O código deve ser interoperável com múltiplos agentes de usuário presentes e futuros, especialmente tecnologias assistivas.

### 2.2 eMAG v3.1 (Modelo de Acessibilidade em Governo Eletrônico)
Em consonância com as exigências da administração pública no Brasil, o ZELUS integra os parâmetros do **eMAG v3.1 (Modelo de Acessibilidade em Governo Eletrônico)**, adaptando os critérios de sucesso da WCAG à realidade dos serviços governamentais brasileiros, incluindo diretrizes para marcação de metadados, links padronizados e atalhos de navegação governamental.

---

## 3. Perceptibilidade e Contraste Visual

### 3.1 Relações Mínimas de Contraste Cromático
Todas as combinações de cores entre o texto (primeiro plano) e o fundo no ZELUS devem respeitar rigorosamente os seguintes critérios mínimos de contraste (WCAG 2.1 Critério de Sucesso 1.4.3 e 1.4.11):

| Tipo de Elemento | Proporção Mínima de Contraste (AA) | Exemplos de Aplicação no ZELUS |
| :--- | :--- | :--- |
| **Texto Normal** (< 18pt ou < 14pt em negrito) | **4.5:1** | Descrições de chamados, mensagens de feedback, labels de formulários, texto de botões secundários. |
| **Texto Grande** (≥ 18pt ou ≥ 14pt em negrito) | **3.0:1** | Títulos de seções (H1, H2, H3), números de protocolos destacados em dashboards. |
| **Elementos de UI e Gráficos Essenciais** | **3.0:1** | Bordas de campos de entrada (*inputs*), ícones com ação interativa, marcadores de status no mapa e chips. |

*Nota Técnica:* As paletas de cores do design system do ZELUS (em temas claro e escuro) são validadas computacionalmente durante o processo de build para assegurar que nenhum token viole os índices de 4.5:1 / 3.0:1.

### 3.2 Independência de Informação por Cor
Nenhuma informação crítica, status ou alerta de validação de formulário pode depender exclusivamente da cor para transmitir seu significado (Critério 1.4.1):
* **Status de Chamados:** Além de cores distintas (ex: verde para "Concluído", amarelo para "Em Análise", vermelho para "Urgente"), cada badge/chip deve conter texto explicativo explícito e um ícone representativo acompanhado de descrição semântica.
* **Erros de Validação:** Campos inválidos não devem apenas exibir uma borda vermelha; devem conter um ícone de alerta, texto legível abaixo do campo e o atributo `aria-invalid="true"`.

### 3.3 Tipografia, Espaçamento e Redimensionamento de Texto
* **Unidades Relativas:** Todos os tamanhos de fonte, espaçamentos e dimensões de layout devem ser definidos em unidades relativas (`rem`, `em`, `%`, `ch`), nunca em valores fixos (`px`).
* **Zoom de até 200% (Critério 1.4.4):** A aplicação deve permitir ampliação de zoom de até 200% através do navegador sem que ocorra perda de funcionalidade, sobreposição de caixas de texto ou necessidade de rolagem horizontal desordenada (*reflow* responsivo).
* **Espaçamento de Texto (Critério 1.4.12):** O layout deve suportar que o usuário aumente a altura de linha (*line-height*) para pelo menos 1.5 vezes o tamanho da fonte, o espaçamento entre parágrafos para pelo menos 2 vezes o tamanho da fonte, e o espaçamento entre letras/palavras sem truncar palavras essenciais.

---

## 4. Operabilidade e Navegação por Teclado

### 4.1 Foco Visível Obrigatório (`:focus-visible`)
Todos os elementos interativos (botões, links, campos de formulário, alternadores e abas) devem possuir um indicador de foco claro e de alto contraste quando focalizados via teclado (Critério 2.4.7).
* O seletor CSS `outline: none;` é **terminantemente proibido**, a menos que substituído imediatamente por uma borda ou anel de foco customizado com contraste mínimo de 3.0:1 contra o fundo adjacente.
* Uso de classes e estilos baseados em `:focus-visible` com anéis de foco destacados (ex: `outline: 2px solid #0056b3; outline-offset: 2px;`).

### 4.2 Ordem Lógica e Sequencial de Tabulação
* **Sequência de Leitura e Foco (Critério 2.4.3):** A ordem de foco via tecla <kbd>Tab</kbd> e <kbd>Shift + Tab</kbd> deve seguir rigorosamente a lógica visual e contextual do fluxo da página (topo para baixo, esquerda para a direita).
* **Proibição de `tabindex` Positivo:** O uso de `tabindex="1"`, `tabindex="2"` etc. é vetado. Elementos interativos nativos (`<button>`, `<a>`, `<input>`, `<select>`) herdam `tabindex="0"`. Elementos que necessitam receber foco programmaticamente devem utilizar `tabindex="-1"`.

### 4.3 Links de Salto para Conteúdo Principal (*Skip Links*)
Para evitar a necessidade de o usuário navegar repetidamente por todo o cabeçalho e menu institucional a cada carregamento de página (Critério 2.4.1 e eMAG):
* A primeira interação via teclado de qualquer página deve exibir o *Skip Link* ("Pular para o conteúdo principal"), que direciona o foco para o elemento `<main id="conteudo-principal" tabindex="-1">`.
* Em páginas com mapas e relatórios, atalhos secundários ("Pular para formulário de abertura de chamado" ou "Pular para lista de chamados") devem ser implementados.

### 4.4 Gerenciamento de Armadilhas de Foco (*Focus Traps*) em Modais
Diálogos, modais e gavetas laterais de detalhes de chamado devem obedecer ao padrão W3C WAI-ARIA Dialog (Modal):
1. Ao abrir o modal, o foco deve ser movido automaticamente para o primeiro elemento interativo do diálogo (ou para o título do modal via `tabindex="-1"`).
2. O foco do teclado deve ficar contido no interior do diálogo enquanto ele estiver aberto (*trap* intencional).
3. Pressionar a tecla <kbd>Esc</kbd> deve fechar imediatamente o modal.
4. Ao fechar o modal, o foco do teclado deve retornar com precisão ao elemento que disparou a sua abertura.

---

## 5. Robustez e Suporte a Leitores de Tela (Tecnologias Assistivas)

### 5.1 Semântica HTML5 Nativa e Hierarquia de Cabeçalhos
A estrutura do DOM deve basear-se em elementos semânticos padrão do HTML5 antes de recorrer a soluções WAI-ARIA artificiais (primeira regra do ARIA: *se existe um elemento HTML nativo com a semântica necessária, use-o*):
* Uso obrigatório de marcas estruturais: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`.
* Hierarquia de cabeçalhos estrita: Deve haver exatamente um único elemento `<h1>` por página (indicando o título da tela/serviço), seguido de `<h2>` para grandes blocos e `<h3>` para subdivisões, sem pular níveis hierárquicos (por exemplo, de `<h2>` direto para `<h4>`).

### 5.2 Emprego Preciso de Atributos WAI-ARIA
* **Botões de Ação com Apenas Ícone:** Devem conter obrigatoriamente `aria-label="Descrição da ação"` ou um elemento de texto acessível visualmente oculto (`class="sr-only"`).
* **Regiões Vivas (*Live Regions*):** Mensagens dinâmicas geradas sem recarregamento da tela (como confirmação de protocolo enviado, toast de sucesso ou mensagens de erro de rede) devem utilizar `role="status"` ou `aria-live="polite"` para que o leitor de tela anuncie a alteração sem interromper a fala em curso.
* **Estados Interativos:** Uso correto de atributos como `aria-expanded="true|false"` em menus expansíveis e accordions, e `aria-current="page"` em itens ativos de navegação.

### 5.3 Formulários Acessíveis e Mensagens de Erro
A abertura de chamados no ZELUS envolve preenchimento de campos de texto, anexação de fotos e seleção de categorias:
* **Associação Explícita:** Todo `<input>`, `<select>` ou `<textarea>` deve ter um `<label>` associado através dos atributos `for` e `id`.
* **Instruções e Dicas:** Informações auxiliares de formato (ex: "Exemplo: 00.000-000") devem ser vinculadas via `aria-describedby="id-instrucao"`.
* **Erros de Validação:** Quando um campo estiver inválido, além de `aria-invalid="true"`, o erro específico deve ser associado via `aria-describedby` ou `aria-errormessage`, garantindo que o leitor de tela leia o motivo do erro assim que o foco pousar no campo.

### 5.4 Acessibilidade em Componentes Geoespaciais (Mapas e Coordenadas)
A funcionalidade de geolocalização e mapas interativos (utilizados para a fórmula de Haversine e marcação de incidentes) apresenta desafios históricos de acessibilidade:
* **Alternativa Textual Obrigatória:** O mapa não pode ser a única forma de selecionar o local de uma ocorrência. Deve ser disponibilizado um formulário acessível para inserção textual do endereço (Nome da rua/avenida, número aproximado, bairro e ponto de referência), além da opção de detecção automática por GPS.
* **Marcadores Acessíveis:** Quando marcadores de chamados forem exibidos na interface de mapa, uma tabela ou lista textual correlata deve estar disponível em formato textual ordenado por proximidade, acessível via teclado e tecnologia assistiva.

---

## 6. Checklist de Validação e Testes Contínuos

### 6.1 Testes Automatizados
* **Integração no Pipeline CI/CD:** Execução de rotinas com `@axe-core/cli` ou plugins equivalentes para verificação de regressões de acessibilidade em cada commit.
* **Auditorias Lighthouse:** Meta obrigatória de atingir pontuação ≥ 95 em Acessibilidade no Google Lighthouse em todas as rotas públicas do ZELUS.
* **Linters de Acessibilidade:** Uso do plugin `eslint-plugin-jsx-a11y` no ambiente de desenvolvimento frontend.

### 6.2 Testes Manuais com Leitores de Tela e Navegação por Teclado
Nenhum componente ou tela é considerado "Pronto" (*Definition of Done*) sem a execução dos seguintes testes manuais:
1. **Navegação 100% Desconectada do Mouse:** Completar o fluxo de ponta a ponta (login, navegação, abertura de chamado com upload e envio) utilizando apenas as teclas <kbd>Tab</kbd>, <kbd>Enter</kbd>, <kbd>Espaço</kbd>, <kbd>Esc</kbd> e setas direcionais.
2. **Sessão com Leitor de Tela:** Validação de pronúncia, contexto e anúncios nos leitores **NVDA** (Windows), **Orca** (Linux) e **TalkBack / VoiceOver** (Mobile).

---

## 7. Referências Normativas e Bibliográficas

1. **W3C (World Wide Web Consortium)**. *Web Content Accessibility Guidelines (WCAG) 2.1*. W3C Recommendation 05 June 2018. Disponível em: <https://www.w3.org/TR/WCAG21/>.
2. **BRASIL. Governo Digital**. *eMAG - Modelo de Acessibilidade em Governo Eletrônico (Versão 3.1)*. Brasília: Ministério do Planejamento, Orçamento e Gestão / Ministério da Gestão e da Inovação em Serviços Públicos. Disponível em: <https://governodigital.sp.gov.br/acessibilidade-digital/emag/>.
3. **BRASIL**. *Lei nº 13.146, de 6 de julho de 2015*. Lei Brasileira de Inclusão da Pessoa com Deficiência (Estatuto da Pessoa com Deficiência). Diário Oficial da União, Brasília, DF, 7 jul. 2015.
4. **BRASIL**. *Decreto nº 5.296, de 2 de dezembro de 2004*. Regulamenta as Leis nos 10.048, de 8 de novembro de 2000, e 10.098, de 19 de dezembro de 2000. Diário Oficial da União, Brasília, DF, 3 dez. 2004.
5. **W3C/WAI**. *WAI-ARIA Authoring Practices Guide (APG)*. Patterns and practices for accessible web application widgets. W3C Working Group Note. Disponível em: <https://www.w3.org/WAI/ARIA/apg/>.
6. **THE A11Y PROJECT**. *A community-driven effort to make digital accessibility easier*. Disponível em: <https://www.a11yproject.com/>.
