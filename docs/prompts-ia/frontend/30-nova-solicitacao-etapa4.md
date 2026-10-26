# Registro de Rastreabilidade de Prompt de IA — Nova Solicitação: Etapa 4 (Confirme o Local e Geocodificação)

**Documento:** Registro de Governança de Engenharia de Prompt  
**ID do Registro:** `30-nova-solicitacao-etapa4`  
**Fase do Projeto:** Fase 2 — Frontend, Governança e Experiência do Usuário (ZELUS)  
**Etapa:** Construção, Integração de Geocodificação Reversa (Nominatim), Inputs Controlados Neobrutalistas, Refinamentos de Ergonomia Mobile e Testes Automatizados da tela "Nova Solicitação - Etapa 4 (Confirme o Local)":
- Criação dos componentes `NovaSolicitacaoStep4.jsx` e `NovaSolicitacaoStep4.scss`.
- Resgate resiliente dos dados das etapas anteriores (foto em miniatura Base64 e coordenadas de GPS) via `useLocation` com fallback em `localStorage` (`zelus_rascunho_solicitacao`).
- Integração assíncrona com a API de Geocodificação Reversa do OpenStreetMap/Nominatim com cancelamento seguro via `AbortController` e sanitização de logradouro, bairro e município em português (`Accept-Language: pt-BR`).
- Implementação de regra de segurança de dados: preenchimento automático de Rua, Bairro e Cidade, mantendo o campo "Número" estritamente vazio por padrão para digitação ativa e verificação humana do munícipe.
- Garantia de que todos os 4 campos funcionem como `controlled inputs` reativos e editáveis, com placeholders explícitos para tolerância total a falhas de rede ou ausência de GPS.
- Refinamento ergonômico estrito para visualização mobile em smartphones (margens entre inputs de 15px, respiro da miniatura de 20px, margin-top de 30px no formulário, margin-top de 30px no bloco de ações e margin-bottom de 5px no botão confirmar).
- Implementação do diálogo de confirmação `window.confirm` para o link "Cancelar solicitação", com limpeza do rascunho de dados e navegação segura para `/cidadao/painel`.
- Inclusão da rota `/solicitacao/etapa-4` em `App.js`.
- Criação da suíte completa de testes unitários automatizados em `NovaSolicitacaoStep4.test.js` com 100% de aprovação (12/12 suítes, 96/96 testes em todo o frontend).  
**Data/Hora do Registro:** 25 de outubro de 2026 - 22:45 (UTC-03:00)  
**Status:** Implementado, Validado Visualmente no Mobile, Aprovado na Suíte de Testes (12/12 suítes, 96/96 testes) e Versionado no Git.

---

## 1. Metadados do Registro

* **Identificador Único:** `PROMPT-FE-NOVA-SOLICITACAO-STEP4-030`
* **Módulo:** Telas do Cidadão (`NovaSolicitacaoStep4.jsx`, `NovaSolicitacaoStep4.scss`), Roteamento (`App.js`), Testes Automatizados (`NovaSolicitacaoStep4.test.js`)
* **Objetivo:**
  1. **Construção da Etapa 4 do Fluxo de Nova Solicitação:** Permitir ao cidadão visualizar a miniatura da foto capturada na Etapa 3 e confirmar o endereço onde o serviço urbano é solicitado.
  2. **Geocodificação Reversa Assíncrona:** Realizar busca de endereço a partir de latitude e longitude via API pública do Nominatim (OpenStreetMap), preenchendo automaticamente Rua, Bairro e Cidade.
  3. **Segurança de Localização Predial:** Manter o campo Número vazio por padrão, exigindo que o cidadão confirme ou preencha a numeração exata do imóvel em frente à ocorrência.
  4. **Resiliência e Fallback Sem Conexão/GPS:** Disponibilizar placeholders claros e intuitivos ("Digite o nome da rua", "Digite o número", etc.), permitindo que munícipes digitem manualmente o endereço caso o GPS esteja desabilitado ou a rede falhe.
  5. **Design System Neobrutalista e Ergonomia Mobile:** Inputs com bordas cartoon sólidas, sombras deslocadas, ícone de lápis indicando edição, botão verde-menta padronizado e link de cancelamento com diálogo de proteção.
  6. **Ajuste Fino de Layout Vertical:** Eliminar rolagem indesejada na tela mobile através do ajuste de margens (`margin-top: 30px` nas ações e `margin-bottom: 5px` no botão).
  7. **Cobertura Completa de Testes Automatizados:** Testes com mock de roteamento, geocodificação reversa, fallbacks, digitação controlada e cancelamento.
* **Ferramenta de IA:** Antigravity AI Assistant
* **Persona:** Arquiteto de Software e Tech Lead Frontend

---

## 2. Decisões Técnicas e Arquitetura

### 2.1 Resgate Resiliente de Estado e Foto
* O componente busca primeiramente o estado passado pelo React Router (`location.state`), aplicando fallback imediato para o `localStorage` (`zelus_rascunho_solicitacao`).
* A foto capturada na Etapa 3 é exibida em miniatura com moldura quadrada (`110px × 110px`), cantos arredondados (`border-radius: 12px`), borda neobrutalista sólida (`3px solid #1a1a24`) e sombra sólida (`4px 4px 0 #1a1a24`).

### 2.2 Geocodificação Reversa com Nominatim (OpenStreetMap)
* **Chamada Assíncrona:** Realizada no `useEffect` de montagem se houver coordenadas válidas e se a rua ainda não tiver sido preenchida.
* **Parâmetros e Headers:** `format=jsonv2`, `addressdetails=1` e cabeçalho `Accept-Language: pt-BR,pt;q=0.9`.
* **Tratamento de Campos:** Mapeia variantes comuns em municípios brasileiros (`road`, `pedestrian`, `suburb`, `neighbourhood`, `city`, `town`).
* **Segurança e Validação Humana:** O campo **Número** é mantido propositalmente em branco (`""`), prevenindo que inconsistências de precisão do GPS apontem um número predial vizinho incorreto.

### 2.3 Resiliência de Interface e Inputs Controlados
* Todos os 4 campos (`rua`, `numero`, `bairro`, `cidade`) são controlados via estado React (`endereco`).
* Se a requisição de mapas falhar por timeout, restrição CORS ou ausência de GPS, a aplicação captura o erro silenciosamente via `catch`, oculta o indicador de busca e exibe os placeholders explícitos para preenchimento manual completo.

### 2.4 Ergonomia e Ajuste Fino Mobile
* `margin-top: 20px` no contêiner da miniatura (`.step4-thumbnail-container`).
* `margin-top: 30px` no formulário (`.step4-form`).
* `margin-bottom: 15px` entre cada campo de input (`.step4-input-group`), com `margin-bottom: 0` no último (`&:last-of-type`).
* `margin-top: 30px` no contêiner de ações (`.step4-actions`) para eliminar rolagem vertical indesejada.
* `margin-bottom: 5px` no botão verde-menta `.step4-btn-confirmar` para agrupamento harmônico com o link "Cancelar solicitação".

### 2.5 Ação de Cancelamento
* O acionamento de "Cancelar solicitação" executa `window.confirm('Tem certeza que deseja cancelar esta solicitação? Todos os dados serão perdidos.')`.
* Se o munícipe confirmar, remove o rascunho persistido e redireciona para `/cidadao/painel`.

---

## 3. Validação de Testes Automatizados

A suíte foi executada no terminal com `npm test -- --watchAll=false`:
* **Suítes de Teste:** 12 aprovadas de 12 existentes (100%).
* **Testes Executados:** 96 aprovados de 96 existentes (100%).
* **Cenários Testados em `NovaSolicitacaoStep4.test.js`:**
  1. Renderização do cabeçalho institucional ZELUS, link de retorno `< Voltar` para Etapa 3 e rodapé inclusivo.
  2. Renderização da miniatura da foto recebida via state (Base64).
  3. Exibição de placeholder "Sem foto" quando nenhuma imagem for fornecida.
  4. Preenchimento automático de Rua, Bairro e Cidade via mock da API Nominatim com o campo Número vazio.
  5. Simulação de digitação ativa do número e edição manual de logradouro pelo cidadão.
  6. Exibição de placeholders explícitos e tolerância a falhas na API de mapas/offline.
  7. Persistência de dados confirmados no `localStorage` e saída via `console.log`.
  8. Recusa no diálogo de cancelamento mantendo o rascunho e a tela ativa.
  9. Confirmação no cancelamento limpando o rascunho e redirecionando para `/cidadao/painel`.

---

## 4. Mensagem de Commit Aplicada

```text
feat(frontend): tela de confirmacao de local e geocodificacao etapa 4

- Criacao dos componentes NovaSolicitacaoStep4.jsx e NovaSolicitacaoStep4.scss
- Integracao assincrona com API de geocodificacao reversa (Nominatim/OpenStreetMap)
- Preenchimento automatico de logradouro, bairro e cidade com campo numero obrigatoriamente vazio
- Resiliencia com placeholders explicitos e inputs controlados para digitacao manual em falha de GPS
- Renderizacao neobrutalista da miniatura da foto capturada na Etapa 3
- Ajuste fino ergonomico de margens mobile eliminando rolagem vertical indesejada
- Dialogo de confirmacao com limpeza de rascunho no cancelamento de solicitacao
- Inclusao da rota /solicitacao/etapa-4 em App.js e navegacao de retorno para Etapa 3
- Criacao da suite de testes automatizados NovaSolicitacaoStep4.test.js (100% aprovada, 96/96 testes no frontend)
- Registro de governanca de IA em docs/prompts-ia/frontend/30-nova-solicitacao-etapa4.md
```
