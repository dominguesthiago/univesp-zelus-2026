# Registro de Rastreabilidade de Prompt de IA — Nova Solicitação: Etapa 3 (Captura de Foto e GPS)

**Documento:** Registro de Governança de Engenharia de Prompt  
**ID do Registro:** `29-nova-solicitacao-etapa3`  
**Fase do Projeto:** Fase 2 — Frontend, Governança e Experiência do Usuário (ZELUS)  
**Etapa:** Construção, Câmera HTML5 Nativa, Fallback Fotográfico, Captura Dupla (Foto + GPS), Refatoração Visual Neobrutalista e Testes Automatizados da tela "Nova Solicitação - Etapa 3 (Captura de Foto)":
- Criação dos componentes `NovaSolicitacaoStep3.jsx` e `NovaSolicitacaoStep3.scss`.
- Implementação de feed de vídeo nativo HTML5 via `navigator.mediaDevices.getUserMedia` com preferência estrita para `{ facingMode: { ideal: "environment" } }` (câmera traseira).
- Visor neobrutalista quadrado com elementos gráficos de viewfinder (cantos brancos `⌜ ⌝ ⌞ ⌟`, retículo central de foco, indicador `REC` pulsante e nível de bateria).
- Fallback fotográfico inteligente para ambientes HTTP locais e dispositivos móveis via `<input type="file" accept="image/*" capture="environment">`, forçando a câmera nativa no modo fotografia e bloqueando modo filmadora.
- Transformação do botão principal "TIRAR FOTO" em label/gatilho para acionamento direto do input nativo sem botões secundários poluentes no visor.
- Captura dupla simultânea: conversão da foto para JPEG Base64 (via `<canvas>`) e coordenadas GPS de alta precisão via `navigator.geolocation.getCurrentPosition`, com persistência em `localStorage` e navegação para `/solicitacao/etapa-4`.
- Refatoração visual de UI com alinhamento rigoroso às Etapas 1 e 2 (mesmas propriedades globais de tipografia e margens) e herança da identidade do botão "+ NOVA SOLICITAÇÃO" da Home (fundo verde-menta `#aaebd3`, tipografia `#1a1a24`, borda de 3.5px e sombra sólida de 6px).
- Maximização do visor da câmera via Flexbox (`flex: 1 1 0`), eliminando margens fantasmas e mantendo a proporção 1:1 perfeitamente centralizada.
- Suíte completa de testes unitários criada em `NovaSolicitacaoStep3.test.js` com 100% de aprovação (11/11 suítes, 87/87 testes).  
**Data/Hora do Registro:** 25 de outubro de 2026 - 11:48 (UTC-03:00)  
**Status:** Implementado, Validado Visualmente no Mobile, Aprovado na Suíte de Testes (11/11 suítes, 87/87 testes) e Versionado no Git.

---

## 1. Metadados do Registro

* **Identificador Único:** `PROMPT-FE-NOVA-SOLICITACAO-STEP3-029`
* **Módulo:** Telas do Cidadão (`NovaSolicitacaoStep3.jsx`, `NovaSolicitacaoStep3.scss`, `NovaSolicitacaoStep2.jsx`), Roteamento (`App.js`), Testes Automatizados (`NovaSolicitacaoStep3.test.js`)
* **Objetivo:**
  1. **Construção da Etapa 3 do Fluxo de Nova Solicitação:** Permitir ao cidadão capturar a foto do problema urbano e coletar as coordenadas geográficas (latitude/longitude) em uma única ação.
  2. **Feed de Câmera em Tempo Real:** Integrar a API nativa `getUserMedia` priorizando a câmera traseira em celulares (`facingMode: "environment"`).
  3. **Fallback Resiliente para Testes em HTTP:** Como navegadores móveis restringem `getUserMedia` a origens seguras (HTTPS/localhost), foi implementado o fallback via `<input type="file" accept="image/*" capture="environment">`, acionado pelo próprio botão "TIRAR FOTO".
  4. **Captura Dupla (Foto + GPS):** Coletar tanto a imagem recortada em quadrado idêntico ao visor quanto as coordenadas de geolocalização com alta precisão (`enableHighAccuracy: true`).
  5. **Refatoração Visual Neobrutalista e Flexbox:** Adequar a tipografia do cabeçalho ao padrão das Etapas 1 e 2, maximizar o tamanho útil do visor eliminando margens superiores fantasmas e estilizar o botão no padrão verde-menta da Home.
  6. **Cobertura de Testes Automatizados:** Testes unitários com mocks de streams de vídeo, canvas e geolocalização, validando isolamento de CSS, BEM e navegação para a Etapa 4.
* **Ferramenta de IA:** Antigravity AI Assistant
* **Persona:** Arquiteto de Software e Tech Lead Frontend

---

## 2. Decisões Técnicas e Arquitetura

### 2.1 Feed HTML5 com Câmera Traseira (`environment`)
* Utilização de `navigator.mediaDevices.getUserMedia` com restrição `{ facingMode: { ideal: "environment" } }` para escolher preferencialmente a câmera traseira do smartphone.
* Fallback secundário para qualquer dispositivo de vídeo disponível (ex: webcam de notebook em desktop).
* Desligamento explícito de todas as faixas do stream (`track.stop()`) tanto ao capturar a foto quanto ao desmontar o componente (`useEffect` cleanup), prevenindo consumo desnecessário de bateria ou retenção da câmera.

### 2.2 Fallback Fotográfico e Experiência Mobile em HTTP
* Em testes via rede local Wi-Fi em HTTP (`http://192.168.18.19:3000`), os navegadores móveis modernos bloqueiam o `getUserMedia`.
* Para garantir usabilidade total no dispositivo real do usuário:
  1. O visor exibe um aviso claro e amigável sem botões secundários poluentes.
  2. O botão principal grande "TIRAR FOTO" renderiza dinamicamente como `<label htmlFor="step3-camera-input">`.
  3. O `<input type="file">` oculto utiliza obrigatoriamente `accept="image/*"` e `capture="environment"`, forçando o sistema operacional do celular a abrir a câmera diretamente no modo de foto (bloqueando modo gravação de vídeo).
  4. No evento `onChange`, o arquivo é lido como Base64 e a geolocalização é disparada imediatamente, realizando o `navigate('/solicitacao/etapa-4')`.

### 2.3 Captura Simultânea de Foto e GPS
* **Câmera Inline:** O frame de vídeo é recortado proporcionalmente no centro em formato quadrado (`1:1`) através de `<canvas>` e convertido em JPEG com compressão otimizada (`0.85`).
* **Geolocalização:** Encapsulada em uma `Promise` resiliente com timeout de 8 segundos, alta precisão (`enableHighAccuracy: true`) e tratamento de erros sem travar a navegação caso o usuário recuse o GPS.
* **Persistência de Rascunho:** Os dados completos (dados da Etapa 2 + `foto` + `latitude` + `longitude` + `coordenadas`) são gravados no `localStorage` sob a chave `zelus_rascunho_solicitacao`.

### 2.4 Refatoração Visual e Distribuição Espacial (Flexbox)
* **Cabeçalho:** Unificado com as classes `.nova-solicitacao-topo`, `.nova-solicitacao-titulo` (1.26rem, peso 800) e `.nova-solicitacao-etapa` (0.90rem, peso 500) com margem inferior de 8px.
* **Visor Flexível:** Área intermediária com `flex: 1 1 0; min-height: 0; display: flex; align-items: center; justify-content: center; margin: 0; padding: 0;`, permitindo que o visor aproveite todo o espaço útil sem margens superiores fantasmas.
* **Botão Verde-Menta:** Alinhado com a identidade do botão "+ NOVA SOLICITAÇÃO" da Home (`background-color: #aaebd3`, tipografia preta `#1a1a24`, borda de 3.5px e sombra de 6px), ancorado 8px abaixo do visor.
* **Remoção de Stepper Dots:** As 4 bolinhas indicadoras de etapa no rodapé foram removidas para simplificar a hierarquia visual.

---

## 3. Validação de Testes Automatizados

A suíte de testes completa foi executada via terminal (`npm test -- --watchAll=false`):
* **Suítes de Teste:** 11 aprovadas de 11 existentes (100%).
* **Testes Executados:** 87 aprovados de 87 existentes (100%).
* **Cenários Testados em `NovaSolicitacaoStep3.test.js`:**
  1. Renderização do cabeçalho institucional e link de retorno `< Voltar` para a Etapa 2.
  2. Renderização semântica do título `<h1>` e indicador de etapa ("Etapa 3 de 4").
  3. Renderização do visor neobrutalista, isolamento BEM e elementos visuais de viewfinder (REC, bateria, retículo).
  4. Renderização do botão "TIRAR FOTO" com a classe neobrutalista padronizada.
  5. Captura dupla completa com câmera inline ativa (frame base64 + GPS + navegação e persistência).
  6. Captura completa no modo fallback com input nativo (`accept="image/*"` e `capture="environment"`).
* **Status:** Zero regressões identificadas em toda a aplicação.

---

## 4. Mensagem de Commit Aplicada

```text
feat(frontend): tela de captura de foto e gps etapa 3

- Criacao dos componentes NovaSolicitacaoStep3.jsx e NovaSolicitacaoStep3.scss
- Integracao da camera HTML5 nativa com navigator.mediaDevices.getUserMedia (facingMode: environment)
- Visor fotografico neobrutalista quadrado com overlay de viewfinder (REC, bateria e reticulo de foco)
- Fallback fotográfico inteligente com input accept="image/*" e capture="environment" acionado pelo botao principal
- Captura dupla simultanea de foto (JPEG Base64 via canvas) e coordenadas GPS de alta precisao
- Refatoracao visual alinhando cabecalho as Etapas 1 e 2 e botao no padrao verde-menta da Home
- Maximizacao do visor via Flexbox eliminando margens fantasmas e ancorando botao abaixo do visor
- Integracao da rota /solicitacao/etapa-3 em App.js e navegacao em NovaSolicitacaoStep2.jsx
- Criacao da suite completa de testes unitarios NovaSolicitacaoStep3.test.js (100% de aprovacao)
- Registro de governanca de IA em docs/prompts-ia/frontend/29-nova-solicitacao-etapa3.md
```
