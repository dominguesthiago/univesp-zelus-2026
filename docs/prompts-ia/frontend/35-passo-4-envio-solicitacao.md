# Registro de Rastreabilidade de Prompt de IA — Passo 4: O Envio Real (`POST /api/solicitacoes`)

**Documento:** Registro de Governança de Engenharia de Prompt  
**ID do Registro:** `35-passo-4-envio-solicitacao`  
**Fase do Projeto:** Fase 3 — Integração de Dados (Front-end <-> Back-end)  
**Etapa:** Envio Transacional de Ocorrências, Blindagem Anti-Duplicidade e Emissão de Protocolo Oficial:
- Refatoração de [NovaSolicitacaoStep4.jsx](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/pages/NovaSolicitacaoStep4.jsx) integrando a função `criarSolicitacao(payloadEnvio)` de [api.js](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/services/api.js) via requisição autenticada com token JWT nativo.
- Montagem do payload transacional conforme o schema estrito exigido pelo backend Express e Supabase (`subcategoria_id`, `latitude`, `longitude`, `descricao`, `rua`, `numero`, `ponto_referencia`, `bairro`, `cidade`, `foto_url`).
- Implementação de prevenção de duplo envio (Anti-Double Submit) através do estado `enviando`, desabilitando os botões de ação e alternando visualmente para o texto `"ENVIANDO..."` com spinner neobrutalista integrado.
- Tratamento resiliente de respostas de erro da API, capturando especificamente o código HTTP 409 (Filtro Espacial Anti-Spam Haversine de 10 metros), erros de validação HTTP 400 e falhas genéricas de conexão de rede, exibindo alertas acessíveis com `role="alert"` e `aria-live="assertive"`.
- Limpeza compulsória do rascunho temporário (`zelus_rascunho_solicitacao`) no `localStorage` após sucesso, registro no histórico de chamados (`zelus_historico_chamados`) e transição para a Etapa 5 ([NovaSolicitacaoSucesso.jsx](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/pages/NovaSolicitacaoSucesso.jsx)) trafegando o protocolo oficial emitido pelo servidor (`ZELUS-YYYYMMDD-XXXX`).
- Cobertura de Testes Automatizados (TDD): Atualização completa de [NovaSolicitacaoStep4.test.js](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/tests/NovaSolicitacaoStep4.test.js) cobrindo os cenários `CT-ENV.1` a `CT-ENV.5` com 11/11 testes aprovados.
- Validação Global de Qualidade: 15/15 suítes e 115/115 testes unitários de front-end aprovados com 100% de sucesso.  
**Data/Hora do Registro:** 26 de outubro de 2026 - 13:54 (UTC-03:00)  
**Status:** Implementado, 100% Aprovado nos Testes Unitários e Integrado à Governança.

---

## 1. Metadados do Registro

* **Identificador Único:** `PROMPT-FE-INTEGRACAO-PASSO4-035`
* **Módulo:** Revisão e Confirmação de Local (`NovaSolicitacaoStep4.jsx`), Estilos (`NovaSolicitacaoStep4.scss`), Testes Unitários (`NovaSolicitacaoStep4.test.js`), Governança (`docs/documentacao/frontend/registro-testes-frontend.md`)
* **Objetivo:**
  1. **Consumo de Endpoint Oficial:** Enviar chamados para `POST /api/solicitacoes` autenticados via JWT no cabeçalho `Authorization: Bearer <token>`.
  2. **Validação de Schema:** Transmitir coordenadas geodésicas (`latitude` e `longitude` como números), `subcategoria_id` (UUID real), endereço e foto Base64.
  3. **Robustez de UX:** Prevenir cliques repetidos durante a latência de rede e expor claramente os erros retornados pela API (como a regra anti-duplicidade de 10m).
  4. **Emissão de Protocolo:** Conectar o frontend ao algoritmo gerador de protocolos do servidor, eliminando códigos provisórios mockados.
* **Ferramenta de IA:** Antigravity AI Assistant
* **Persona:** Arquiteto de Software e Tech Lead Full Stack

---

## 2. Decisões Técnicas e Arquitetura

### 2.1 Especificação do Contrato do Payload
O método `criarSolicitacao` despacha um objeto JSON estritamente validado:
```javascript
{
  subcategoria_id: "b1b2c3d4-0001-4000-8000-000000000001", // UUID v4 Foreign Key
  latitude: -21.3589,                                        // Float
  longitude: -48.0678,                                       // Float
  descricao: "Buraco na via",                                // String (baseada na subcategoria)
  rua: "Rua das Flores",                                     // String preenchida ou editada
  numero: "500",                                             // String ('S/N' se não informado)
  ponto_referencia: null,                                    // String ou null
  bairro: "Centro",                                          // String
  cidade: "Pradópolis",                                      // String
  foto_url: "data:image/jpeg;base64,..."                     // String Base64 ou URL
}
```

### 2.2 Tratamento de Exceções e Respostas da API
* **HTTP 201 Created:**  
  Retorna `{ sucesso: true, protocolo: 'ZELUS-20261026-XXXX', dados: { id, ... } }`. O rascunho é expurgado do `localStorage` e a tela de sucesso é acionada.
* **HTTP 409 Conflict (Haversine 10m):**  
  Interceptado com mensagem amigável: `"Já existe um problema deste tipo registado a menos de 10 metros daqui."`. O munícipe permanece com os dados intactos em tela para decidir se ajusta o local ou cancela.
* **HTTP 400 Bad Request:**  
  Exibe mensagem informando sobre parâmetros ausentes.
* **Status 0 (Offline):**  
  Informa que o servidor está inacessível e orienta a tentar novamente.

---

## 3. Validação de Testes Automatizados (TDD)

A suíte [NovaSolicitacaoStep4.test.js](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/tests/NovaSolicitacaoStep4.test.js) foi executada no terminal com `npm test -- --watchAll=false src/tests/NovaSolicitacaoStep4.test.js`:
* **Resultado:** 11/11 testes aprovados (100%).
* **Cenários Homologados:**
  1. `CT-ENV.1`: Envio bem-sucedido com consumo de `criarSolicitacao()`, montagem de payload sanitizado, limpeza de rascunho e navegação para Etapa 5 com o protocolo oficial.
  2. `CT-ENV.2`: Aplicação do estado de loading e desabilitação de botões evitando duplicidade de requisições (Anti-Double Submit).
  3. `CT-ENV.3`: Captura e exibição de alerta acessível com `role="alert"` para o erro HTTP 409 do filtro Haversine.
  4. `CT-ENV.4`: Tratamento amigável de falha genérica de rede com preservação dos dados para nova tentativa.
  5. `CT-ENV.5`: Cancelamento de solicitação com confirmação explícita (`window.confirm`), garantindo descarte do rascunho e retorno ao Painel do Cidadão.

A validação global (`npm test -- --watchAll=false`) resultou em 15/15 suítes e 115/115 testes aprovados.
