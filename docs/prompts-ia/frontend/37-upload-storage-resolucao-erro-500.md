# Registro de Rastreabilidade de Prompt de IA — Passo 6: Resolução de Erro 500 via Supabase Storage

**Documento:** Registro de Governança de Engenharia de Prompt  
**ID do Registro:** `37-upload-storage-resolucao-erro-500`  
**Fase do Projeto:** Fase 3 — Integração e Resiliência em Produção  
**Etapa:** Diagnóstico de Erro 500 no Render, Migração Arquitetural para Supabase Storage e Compressão Client-Side:
- **Alerta Crítico em Produção:** Ao registrar ocorrências via smartphone (captura fotográfica nativa e GPS), o backend no Render retornava Erro HTTP 500 proveniente do Supabase PostgreSQL: `code: '22001', message: 'value too long for type character varying(512)'`.
- **Diagnóstico da Causa Raiz:**
  - A coluna `foto_url` da tabela `solicitacoes` no PostgreSQL possui restrição estrita de `VARCHAR(512)`.
  - O fluxo da Etapa 3 ([NovaSolicitacaoStep3.jsx](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/pages/NovaSolicitacaoStep3.jsx)) utilizava `FileReader.readAsDataURL(file)` sem compressão na captura da câmera do telemóvel, gerando strings Base64 de 3 MB a 15 MB (> 4.000.000 de caracteres).
  - A Etapa 4 ([NovaSolicitacaoStep4.jsx](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/pages/NovaSolicitacaoStep4.jsx)) injetava a string Base64 bruta diretamente no atributo `foto_url` do payload JSON de submissão para `POST /api/solicitacoes`.
- **Decisão Arquitetural Homologada:**
  - Descarte do armazenamento de Base64 em banco relacional (anti-pattern de bloat e saturação de I/O).
  - Implementação da **Opção A (Supabase Storage)**: pré-processamento client-side com redimensionamento em Canvas HTML5, upload binário direto para o bucket `solicitacoes-fotos` e persistência no banco unicamente da URL pública canônica (~90 caracteres).
- **Entregáveis de Código:**
  - Criação do serviço de mídia [supabaseStorage.js](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/services/supabaseStorage.js) implementando `otimizarImagemArquivo` (max 1280px / 80% JPEG), `base64ToBlob` e `uploadFotoSolicitacao`.
  - Refatoração de [NovaSolicitacaoStep3.jsx](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/pages/NovaSolicitacaoStep3.jsx) para compressão antecipada da foto no dispositivo.
  - Refatoração de [NovaSolicitacaoStep4.jsx](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/pages/NovaSolicitacaoStep4.jsx) com envio assíncrono prévio ao Storage e repasse da URL pública no JSON da ocorrência.
  - Configuração do bucket público `solicitacoes-fotos` e políticas de segurança RLS no Supabase.
- **Validação Global de Qualidade:**
  - Atualização dos testes automatizados em [NovaSolicitacaoStep4.test.js](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/tests/NovaSolicitacaoStep4.test.js) e [NovaSolicitacaoStep3.test.js](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/tests/NovaSolicitacaoStep3.test.js).
  - 100% de aprovação nas 15 suítes e 114 testes unitários e de integração do frontend.  
**Data/Hora do Registro:** 26 de outubro de 2026 - 22:15 (UTC-03:00)  
**Status:** Implementado, 100% Aprovado nos Testes Automatizados e Integrado à Documentação Arquitetural.

---

## 1. Metadados do Registro

* **Identificador Único:** `PROMPT-FE-STORAGE-ERRO500-037`
* **Módulos Afetados:**
  * Camada de Serviços: [supabaseStorage.js](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/services/supabaseStorage.js)
  * Telas de Captura e Envio: [NovaSolicitacaoStep3.jsx](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/pages/NovaSolicitacaoStep3.jsx), [NovaSolicitacaoStep4.jsx](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/pages/NovaSolicitacaoStep4.jsx)
  * Suítes de Teste: [NovaSolicitacaoStep3.test.js](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/tests/NovaSolicitacaoStep3.test.js), [NovaSolicitacaoStep4.test.js](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/tests/NovaSolicitacaoStep4.test.js)
  * Documentação: [LEIA-ME-ARQUITETURA.md](file:///c:/Users/dfeni/univesp-zelus-2026/docs/documentacao/LEIA-ME-ARQUITETURA.md)
* **Objetivos Técnicos:**
  1. Identificar o limite relacional estrito causador do erro SQLSTATE `22001`.
  2. Substituir a transferência de Base64 em payloads JSON por upload direto em Object Storage compatível com S3 (Supabase Storage).
  3. Reduzir o footprint de memória no telemóvel do cidadão e prevenir falhas de estouro de cota no `localStorage` (< 5 MB).
  4. Manter a compatibilidade com a modelagem do banco de dados relacional sem necessitar alterar a tipagem da coluna `foto_url VARCHAR(512)`.
* **Ferramenta de IA:** Antigravity AI Assistant
* **Persona:** Arquiteto de Software e Tech Lead Full Stack

---

## 2. Prompts Submetidos e Respostas Estruturadas

### 2.1 Prompt Inicial — Diagnóstico Analítico do Incidente em Produção
```text
Alerta Crítico de Produção: Ao testar a criação de uma solicitação no telemóvel (envolvendo captura de foto e GPS), o backend no Render retornou Erro 500. Os logs mostram uma rejeição do Supabase (PostgreSQL) no momento do INSERT: code: '22001', message: 'value too long for type character varying(512)'.

Tarefa Analítica:
1. Verifica nos modelos do backend ou scripts de banco de dados qual coluna da tabela solicitacoes possui o limite estrito de 512 caracteres (provavelmente a coluna destinada à foto).
2. Analisa o código do frontend (Etapa 3 e Etapa 4) para confirmar o que está a ser enviado no payload JSON referente à imagem. Estamos a enviar uma string Base64 gigante diretamente para o backend?
3. Apresenta o plano de resolução. Sugere a arquitetura correta (ex: fazer upload prévio para o Supabase Storage e enviar apenas a URL pública) ou, se for um MVP temporário, a alteração do tipo da coluna no banco de dados para TEXT.

Apresenta apenas o diagnóstico e a solução arquitetural para aprovação. Nada de jargões académicos ou menções a TCC.
```

### 2.2 Resumo do Diagnóstico Técnico Retornado
* **Ponto 1 (Coluna Relacional):**  
  Identificada no arquivo `backend/src/database/schema.sql` (linha 52) a coluna `foto_url VARCHAR(512)` na tabela `public.solicitacoes`. O PostgreSQL rejeita qualquer string superior a 512 bytes disparando `22001 (string_data_right_truncation)`.
* **Ponto 2 (Análise de Payload no Frontend):**  
  Confirmado o envio de Base64 não-otimizado. No telemóvel, o seletor fotográfico nativo capturava fotos de 3 a 12 MB que, ao passarem por `FileReader.readAsDataURL`, resultavam em strings de até 15 milhões de caracteres trafegadas no JSON de submissão da Etapa 4.
* **Ponto 3 (Análise Comparativa de Soluções):**  
  * *Opção A (Recomendada):* Upload direto no Supabase Storage (bucket `solicitacoes-fotos`) com compressão client-side em Canvas HTML5 e envio da URL pública canônica (< 100 caracteres).
  * *Opção B (Paliativa):* Alteração da coluna para `TEXT` no PostgreSQL e ampliação do limite de parsing do Express para 15 MB (rejeitada por degradar buffers e backups relacionais).

---

### 2.3 Prompt de Homologação e Implementação
```text
Aprovada a Opção A. Atualize o código do frontend (Etapas 3 e 4) para fazer o upload da imagem diretamente para o Supabase Storage e enviar apenas a URL pública final no POST para o backend. Forneça também o passo a passo exato do que eu preciso configurar manualmente no painel do Supabase para criar e liberar o acesso ao bucket "solicitacoes-fotos".
```

---

## 3. Decisões de Implementação e Arquitetura

### 3.1 Camada de Armazenamento Client-Side (`supabaseStorage.js`)
O novo módulo centraliza toda a lógica de manipulação e transferência de mídia:
```javascript
// Otimização por redimensionamento em Canvas HTML5
export function otimizarImagemArquivo(file, maxDimension = 1280, quality = 0.8) { ... }

// Conversão resiliente de Base64 para Blob nativo
export function base64ToBlob(dataUrl) { ... }

// Upload assíncrono para o bucket 'solicitacoes-fotos' com recuperação da URL pública
export async function uploadFotoSolicitacao(foto) { ... }
```

### 3.2 Refatoração da Etapa 3 (`NovaSolicitacaoStep3.jsx`)
Na captura de foto móvel (`handleArquivoFallback`), o arquivo capturado é redimensionado preventivamente para uma resolução máxima de 1280px e 80% de qualidade JPEG. Isso assegura:
* Ocupação de menos de 250 KB no `localStorage` (bem abaixo do teto de 5 MB).
* Redução de mais de 95% do consumo de banda do cidadão no upload móvel.

### 3.3 Refatoração da Etapa 4 (`NovaSolicitacaoStep4.jsx`)
No acionamento do botão `CONFIRMAR` (`handleConfirmar`):
1. O estado de carregamento `enviando = true` é ativado com spinner neobrutalista.
2. A função `uploadFotoSolicitacao(dadosIniciais.foto)` transfere o Blob para o Storage.
3. A URL pública canônica retornada (ex: `https://[ref].supabase.co/storage/v1/object/public/solicitacoes-fotos/solicitacao_[ts]_[hash].jpg`) é atribuída a `foto_url`.
4. O método `criarSolicitacao(payloadEnvio)` despacha o JSON enxuto (< 2 KB) para `POST /api/solicitacoes`.
5. Em caso de falha de conexão com o Storage, o fluxo captura o erro de forma graciosa e reabilita o botão para nova tentativa sem perda dos dados preenchidos pelo cidadão.

### 3.4 Configuração e Segurança do Bucket no Supabase
* **Bucket:** `solicitacoes-fotos` (Public: `true`)
* **MIME Types Permitidos:** `image/jpeg`, `image/png`, `image/webp`
* **Políticas RLS:**
  * `INSERT`: Permitido para `anon` e `authenticated` com checagem `bucket_id = 'solicitacoes-fotos'`.
  * `SELECT`: Leitura pública irrestrita para `anon` e `authenticated`.

---

## 4. Rastreabilidade de Testes e Homologação

* **Suítes Afetadas:**
  * `NovaSolicitacaoStep3.test.js`: 4/4 testes aprovados (captura, canvas, fallback e navegação).
  * `NovaSolicitacaoStep4.test.js`: 12/12 testes aprovados (renderização, integração reversa Nominatim, upload para Supabase Storage, envio de URL pública, anti-double submit, tratamento de erro 409 Haversine e tratamento de falha de upload do Storage).
* **Resultado Global da Bateria:**
  * 15/15 suítes de teste aprovadas.
  * 114/114 testes aprovados com 100% de cobertura.
