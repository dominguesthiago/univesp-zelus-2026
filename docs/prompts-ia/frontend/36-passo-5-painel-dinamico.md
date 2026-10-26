# Registro de Rastreabilidade de Prompt de IA — Passo 5: Painel do Cidadão Dinâmico (`GET /api/solicitacoes/minhas`)

**Documento:** Registro de Governança de Engenharia de Prompt  
**ID do Registro:** `36-passo-5-painel-dinamico`  
**Fase do Projeto:** Fase 3 — Integração de Dados (Front-end <-> Back-end)  
**Etapa:** Painel do Cidadão Dinâmico, Skeletons Neobrutalistas, Resiliência a Falhas e Empty State Acessível:
- Refatoração de [PainelCidadao.jsx](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/pages/PainelCidadao.jsx) integrando a função `listarMinhasSolicitacoes()` de [api.js](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/services/api.js) via requisição autenticada com token JWT (`GET /api/solicitacoes/minhas`).
- Substituição do mock estático de 8 itens por dados reais do Supabase/Express, mapeando UUID real (`id`), protocolo oficial (`ZELUS-YYYYMMDD-XXXX`), status da solicitação, data formatada no padrão brasileiro (`pt-BR`), endereço completo e imagem anexada com fallback inteligente.
- Implementação de estados visuais neobrutalistas em [PainelCidadao.scss](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/pages/PainelCidadao.scss):
  - **Skeletons Neobrutalistas:** 3 cartões de placeholder pulsantes com bordas pretas de 3px, sombra dura e animação CSS `@keyframes pulse-skeleton-painel`, com acessibilidade `role="status"` e `aria-label="Carregando suas solicitações..."`.
  - **Tratamento de Falhas (Retry):** Alerta resiliente com `role="alert"`, `aria-live="assertive"`, ícone de exclamação e botão funcional `"TENTAR NOVAMENTE"` que reexecuta a busca sem recarregar a página.
  - **Empty State Acessível:** Exibição amigável quando o cidadão ainda não possui chamados (`dados: []`), com ilustração visual neobrutalista, título h3, mensagem motivacional e botão de ação direta `"+ CRIAR MINHA PRIMEIRA SOLICITAÇÃO 📱"` navegando para a Etapa 1.
  - **Novos Badges de Status:** Suporte aos status `"Em Andamento"` (`.badge--andamento`) e `"Descartada"` (`.badge--descartada`), somando-se aos já existentes `"Pendente"` e `"Concluído"`.
- Cobertura de Testes Automatizados (TDD): Atualização completa de [PainelCidadao.test.js](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/tests/PainelCidadao.test.js) cobrindo os cenários `CT-PNL.1` a `CT-PNL.5` com 7/7 testes aprovados e 0 warnings de ciclo assíncrono.
- Validação Global de Qualidade: 15/15 suítes e 116/116 testes unitários de front-end aprovados com 100% de sucesso.  
**Data/Hora do Registro:** 26 de outubro de 2026 - 14:10 (UTC-03:00)  
**Status:** Implementado, 100% Aprovado nos Testes Unitários e Integrado à Governança.

---

## 1. Metadados do Registro

* **Identificador Único:** `PROMPT-FE-INTEGRACAO-PASSO5-036`
* **Módulo:** Painel do Cidadão (`PainelCidadao.jsx`), Estilos (`PainelCidadao.scss`), Testes Unitários (`PainelCidadao.test.js`), Governança (`docs/documentacao/frontend/registro-testes-frontend.md`)
* **Objetivo:**
  1. **Consumo Dinâmico da API:** Ligar a tela principal do munícipe ao endpoint autenticado `GET /api/solicitacoes/minhas`, trazendo os chamados reais vinculados ao `usuario.id` extraído do JWT.
  2. **Feedback Visual Imediato:** Apresentar Skeletons Neobrutalistas durante a busca de dados, eliminando flashes de tela em branco ou renderizações parciais.
  3. **Resiliência de Rede:** Disponibilizar botão de Retry caso ocorra oscilação de conectividade móvel do munícipe.
  4. **Engajamento com Empty State:** Oferecer jornada clara de boas-vindas para novos munícipes através de um botão de chamada para ação (CTA) que direciona imediatamente para o fluxo de nova solicitação.
  5. **Integridade de UI e Acessibilidade:** Conformidade com WCAG 2.1 AA (`role="status"`, `role="alert"`, `role="region"`, `aria-label`).
* **Ferramenta de IA:** Antigravity AI Assistant
* **Persona:** Arquiteto de Software e Especialista em Front-end & UX

---

## 2. Decisões Técnicas e Arquitetura

### 2.1 Contrato de Dados do Endpoint `GET /api/solicitacoes/minhas`
O painel consome a lista tipada retornada pelo controlador do back-end:
```javascript
{
  sucesso: true,
  dados: [
    {
      id: "b1b2c3d4-0001-4000-8000-000000000001", // UUID v4
      protocolo: "ZELUS-20261026-AAAA",            // Protocolo Oficial
      status: "Pendente",                           // 'Pendente' | 'Em Andamento' | 'Concluído' | 'Descartada'
      descricao: "Buraco na via",                  // String
      rua: "Rua das Flores",                       // String
      numero: "123",                               // String
      bairro: "Centro",                            // String
      cidade: "Pradópolis",                        // String
      foto_url: "data:image/jpeg;base64,...",      // Base64 ou URL pública
      created_at: "2026-10-26T12:00:00Z"           // ISO 8601 Timestamp
    }
  ]
}
```

### 2.2 Estratégia de Fallback Visual para Fotos
Para garantir que solicitações registradas sem imagem fotográfica não quebrem o grid ou apresentem lacunas estéticas:
```javascript
const obterImagemSolicitacao = (solicitacao) => {
  if (solicitacao.foto_url && solicitacao.foto_url.trim() !== '') {
    return solicitacao.foto_url;
  }
  const desc = (solicitacao.descricao || '').toLowerCase();
  if (desc.includes('lixo') || desc.includes('entulho') || desc.includes('descarte')) {
    return lixoImg;
  }
  if (desc.includes('ilumina') || desc.includes('lâmpada') || desc.includes('poste') || desc.includes('luz')) {
    return posteImg;
  }
  return buracoImg;
};
```

### 2.3 Gestão de Estados de Interface (State Machine)
* **Carregando (`carregando === true`):** Renderiza o container de skeletons com 3 cartões de visual neobrutalista pulsante.
* **Erro (`erro !== null`):** Renderiza bloco de alerta neobrutalista com botão de retry associado ao `useCallback(carregarSolicitacoes)`.
* **Vazio (`!carregando && !erro && solicitacoes.length === 0`):** Renderiza o Empty State com CTA para criação de chamado.
* **Populada (`!carregando && !erro && solicitacoes.length > 0`):** Renderiza a grade de solicitações com cabeçalho, protocolo, data, badge e thumbnail.

---

## 3. Validação de Testes Automatizados (TDD)

A suíte [PainelCidadao.test.js](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/tests/PainelCidadao.test.js) foi executada no terminal com `npm test -- --watchAll=false src/tests/PainelCidadao.test.js`:
* **Resultado:** 7/7 testes aprovados (100%).
* **Cenários Homologados:**
  1. `CT-PNL.1`: Renderização da lista dinâmica com dados reais retornados pela API, checando protocolos, status estilizados (`badge--pendente`, `badge--concluido`) e formatação de endereços.
  2. `CT-PNL.2`: Renderização dos 3 Skeletons neobrutalistas com `role="status"` e animação de pulso durante a latência de busca.
  3. `CT-PNL.3`: Renderização do Empty State acessível com `role="region"`, texto convidativo e acionamento do botão CTA direcionando para `/solicitacao/etapa-1`.
  4. `CT-PNL.4`: Exibição de alerta acessível com `role="alert"` em caso de rejeição de rede, com reexecução bem-sucedida após clique no botão `"TENTAR NOVAMENTE"`.
  5. `CT-PNL.5`: Saudação personalizada com base no `localStorage` (`nome_completo`) e fallback seguro para `"Cidadão"`.
  6. **Regra de Ouro:** Aplicação e remoção da classe `painel-cidadao-ativo` na montagem e desmontagem do componente.

A validação global (`npm test -- --watchAll=false`) resultou em 15/15 suítes e 116/116 testes aprovados, coroando a entrega com zero regressões.
