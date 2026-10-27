# ZELUS — Sistema de Zeladoria Urbana para Cidades Inteligentes
# Documentação da Arquitetura do Projeto
# ==============================================================

# LEIA-ME — Arquitetura do Projeto ZELUS

## 1. O que é o ZELUS?

O **ZELUS** é um sistema web voltado à modernização e transformação digital da gestão pública municipal. Seu propósito fundamental é fornecer uma plataforma colaborativa, transparente e eficiente para o registro, geolocalização e acompanhamento de ocorrências de zeladoria urbana (como pavimentação asfáltica, manutenção de bueiros, iluminação pública e descarte irregular de resíduos).

A arquitetura do ZELUS foi projetada com base no desacoplamento estrito de responsabilidades, garantindo alta disponibilidade, privacidade de dados em conformidade com as diretrizes da LGPD/GDPR, otimização de tráfego de rede e rigor matemático no tratamento de redundâncias operacionais.

---

## 2. Stack Tecnológica e Infraestrutura em Nuvem

| Camada | Tecnologia | Provedor / Hospedagem | Justificativa Arquitetural |
| :--- | :--- | :--- | :--- |
| **Frontend** | React + SCSS (JavaScript puro) | **Vercel** (Edge CDN) | Interface moderna, responsiva e componentizada. A distribuição via CDN global garante carregamento estático em milissegundos e baixa latência para munícipes em redes móveis. |
| **Backend** | Node.js + Express (JavaScript) | **Render** (Cloud PaaS) | API RESTful assíncrona orientada a eventos. O ambiente PaaS fornece execução contínua para o motor de regras de negócio, criptografia de senhas, validação geoespacial e proteção de credenciais mestras. |
| **Banco de Dados** | Supabase (PostgreSQL) | **Supabase Cloud** | Banco relacional robusto com conformidade ACID (*Atomicity, Consistency, Isolation, Durability*), integridade referencial estrita e trilha imutável de auditoria administrativa. |
| **Armazenamento de Objetos (Storage)** | Supabase Storage (S3-compatible) | **Supabase Cloud** | Object Storage dedicado para persistência de evidências visuais (fotos de ocorrências). O desacoplamento do binário alivia o banco relacional, viabiliza CDN global e preserva as colunas relacionais leves (`VARCHAR(512)`). |

> ⚠️ **Acessibilidade Pedagógica:** O projeto emprega JavaScript puro intencionalmente para assegurar máxima clareza conceitual e legibilidade de código entre os integrantes da equipe e desenvolvedores colaboradores.

---

## 3. Infraestrutura de Nuvem do Backend: O Papel do Render (PaaS)

### 3.1 O que é o Render?
O **Render** é uma plataforma moderna em nuvem categorizada como Plataforma como Serviço (*Platform as a Service* — PaaS). Ele automatiza o ciclo contínuo de compilação, containerização, deploy e monitoramento de serviços web e APIs a partir de repositórios Git, eliminando o atrito operacional de manutenção manual de servidores e máquinas virtuais.

### 3.2 Justificativa da Escolha para o Backend ZELUS
A adoção do Render como provedor de hospedagem da API Node.js/Express fundamenta-se em critérios técnicos rigorosos:

1. **Ambiente Dedicado e Contínuo para o Event Loop:**  
   Diferente de soluções puramente Serverless (FaaS) — que apresentam limitações rígidas de tempo de execução, problemas recorrentes de esgotamento de conexões (*connection pooling*) com o PostgreSQL e latências variáveis de *cold start* —, o Render executa a API Express como um Web Service dedicado. Isso permite que a arquitetura *Non-Blocking I/O* do Node.js opere de forma contínua, delegando operações assíncronas ao thread pool da biblioteca `libuv` sem interrupções de contexto.
2. **Isolamento Criptográfico e Segurança de Credenciais:**  
   O backend atua como a fronteira de segurança entre a internet e o banco de dados. Variáveis sensíveis e críticas — como a `SUPABASE_SERVICE_KEY` (chave com privilégios administrativos de bypass RLS) e o `JWT_SECRET` (chave de assinatura dos tokens de autenticação) — residem exclusivamente no cofre de variáveis de ambiente do Render, jamais sendo expostas no código client-side ou trafegadas no bundle do navegador.
3. **Criptografia de Transporte Ponta a Ponta (HTTPS / TLS Nativo):**  
   O Render provisiona e renova automaticamente certificados digitais SSL/TLS. Isso assegura que todo o tráfego HTTP originado pelo aplicativo na Vercel ou em smartphones transite criptografado, impedindo ataques de interceptação (*Man-in-the-Middle*) e eliminando problemas de *Mixed Content*.
4. **Desacoplamento e Resiliência Operacional:**  
   A separação física entre a Vercel (camada de apresentação) e o Render (camada computacional de negócio) garante que picos de tráfego na interface web não saturem o poder de processamento da API, e manutenções no backend não impeçam o carregamento visual da aplicação pelo usuário.

### 3.3 Regras de Negócio Centrais Processadas pelo Backend
O backend hospedado no Render atua como o **núcleo computacional e regulatório** do ecossistema:
* **Filtro Espacial Anti-Spam (Fórmula de Haversine):** Executa o cálculo trigonométrico da distância de círculo máximo (*great-circle distance*) sobre o esferoide terrestre. Chamados para a mesma subcategoria abertos em um raio $\le 10\text{ metros}$ são interceptados e bloqueados com HTTP 409 (*Conflict*), prevenindo duplicidades e desperdício de recursos das equipes municipais.
* **Autenticação Stateless e Blindagem IDOR/BOLA:** Emissão e decodificação de JSON Web Tokens (RFC 7519). A identidade do cidadão (`req.usuario.id`) é extraída estritamente da assinatura criptográfica do token, impossibilitando que um usuário visualize ou altere ocorrências de terceiros por manipulação de parâmetros.
* **Geração de Protocolo Oficial Auditável:** Emissão padronizada de códigos de rastreabilidade alfanuméricos (`ZELUS-YYYYMMDD-XXXX`).
* **Criptografia de Senhas com Salting (Bcrypt):** Proteção das credenciais de acesso através de funções unidirecionais com fator de trabalho iterativo, inviabilizando ataques baseados em tabelas arco-íris (*Rainbow Tables*).

---

## 4. Estratégia de Armazenamento de Arquivos: Migração de Base64 para Supabase Storage

### 4.1 Problema Identificado (O Anti-Pattern do Base64 no Banco Relacional)
Nas versões iniciais de prototipagem, as imagens capturadas pelo telemóvel eram convertidas em strings Base64 (`data:image/jpeg;base64,...`) e injetadas no corpo do payload JSON da requisição `POST /api/solicitacoes`.

Em ambiente de produção móvel, esta abordagem revelou sérios gargalos arquiteturais:
1. **Estouro de Tipagem no PostgreSQL (`code: '22001'`):** A coluna `foto_url` da tabela `solicitacoes` foi modelada estritamente como `VARCHAR(512)` para armazenar localizadores uniformes de recursos (URLs). Uma fotografia de smartphone em alta resolução (3 MB a 12 MB) gera uma string Base64 com centenas de milhares ou milhões de caracteres, sendo rejeitada pelo PostgreSQL com o erro `value too long for type character varying(512)`.
2. **Degradação de Banda e CPU no Backend:** A codificação Base64 impõe um overhead de ~33% sobre o tamanho do arquivo binário. O envio de múltiplos megabytes via JSON exigiria aumentar o limite global de parsing do Express (`express.json()`), saturando o buffer de memória do Node.js no Render e gerando potenciais falhas de HTTP 413 (*Payload Too Large*).
3. **Inchaço de Dados Relacionais (*Database Bloat*):** Armazenar strings gigantescas de Base64 no PostgreSQL sobrecarrega os arquivos de dados (*heap pages*), satura a memória compartilhada de cache (*shared buffers*) e degrada drasticamente a velocidade de backups e dumps do banco.

### 4.2 Nova Arquitetura de Mídia Adotada
A solução definitiva adotada implementa a dissociação completa entre a **metainformação relacional** e o **armazenamento binário de objetos**:

```
[Smartphone / Navegador]
       │
       │ 1. Captura da Foto (Câmera Nativa / HTML5 Video)
       ▼
 [Canvas HTML5 Client-Side]  ──► Redimensiona para max 1280px e comprime JPEG (0.8)
       │                         (Redução de ~10 MB para ~150-250 KB)
       │
       │ 2. Upload Binário Direto (multipart/form-data via SDK Supabase)
       ▼
[Supabase Storage: Bucket 'solicitacoes-fotos']
       │
       │ 3. Retorno imediato da URL pública (ex: https://.../solicitacao_123.jpg ~90 chars)
       ▼
[Payload JSON Enxuto (< 2 KB)] ──► POST /api/solicitacoes (Render) ──► PostgreSQL (VARCHAR 512)
```

### 4.3 Benefícios Arquiteturais Comprovados
* **Compressão no Cliente (Edge Pre-processing):** O serviço [supabaseStorage.js](file:///c:/Users/dfeni/univesp-zelus-2026/frontend/src/services/supabaseStorage.js) utiliza a API de Canvas do navegador para redimensionar a imagem antes do tráfego de rede. Isso preserva a cota do `localStorage` (limite estrito de 5 MB dos browsers) e economiza dados móveis do cidadão em conexões 3G/4G.
* **Isolamento de Carga do Backend:** O tráfego pesado de upload binário é delegado integralmente aos servidores de infraestrutura do Supabase Storage. O backend no Render processa unicamente metadados leves em JSON (< 2 KB), mantendo seu tempo de resposta na faixa de dezenas de milissegundos.
* **Integridade Relacional e Baixo Custo de Armazenamento:** A coluna `foto_url VARCHAR(512)` armazena apenas a URL canônica pública do arquivo. As imagens são servidas diretamente pela CDN global do Supabase com cabeçalhos otimizados de cache HTTP (`Cache-Control: 3600`).

---

## 5. Topologia e Fluxo de Comunicação entre as Partes

```
[Munícipe no Navegador Web / Smartphone]
                    │
                    │ 1. Acessa interface (HTTPS)
                    ▼
   [Frontend — React SPA na Vercel (Edge CDN)]
         │                               │
         │ 2a. Upload direto da imagem   │ 2b. POST /api/solicitacoes
         │     otimizada (Canvas HTML5)  │     (Payload JSON enxuto com foto_url pública)
         ▼                               ▼
[Supabase Storage: 'solicitacoes-fotos'] [Backend — Node.js & Express no Render]
         │                               │
         │ Emite URL pública permanente  │ 3. Executa:
         │ (<= 100 caracteres)           │    - Validação de JWT e RBAC
         │                               │    - Cálculo de Haversine (raio 10m)
         │                               │    - Sanitização e Protocolo Oficial
         │                               │
         │                               │ 4. INSERT com service_role
         └──────────────────────────────►▼
                   [Banco de Dados — Supabase (PostgreSQL Cloud)]
                   (Gravação do registro na tabela 'solicitacoes')
```

1. O **munícipe** captura a evidência fotográfica da ocorrência em seu smartphone.
2. O **frontend** redimensiona a imagem localmente via Canvas HTML5 e faz o upload direto para o bucket `solicitacoes-fotos` do Supabase Storage, resgatando a URL pública gerada.
3. O frontend envia a requisição `POST /api/solicitacoes` ao backend no Render contendo os dados do formulário e a URL pública da foto.
4. O **backend no Render** valida a sessão JWT, executa o cálculo de proximidade espacial de Haversine (10 metros) e insere o registro com sucesso no **PostgreSQL**, retornando o protocolo oficial gerado.

---

## 6. Estrutura de Pastas do Projeto

```
univesp-zelus-2026/         ← Raiz do projeto (este repositório)
│
├── package.json            ← Scripts de conveniência para orquestração local
│
├── docs/                   ← Governança técnica e documentações do projeto
│   ├── documentacao/       ← Dossiês de arquitetura, testes e conformidade
│   │   ├── LEIA-ME-ARQUITETURA.md        ← Este documento de visão geral
│   │   ├── backend/                      ← Dossiê de arquitetura e testes da API
│   │   └── frontend/                     ← Registros e relatórios de homologação
│   └── prompts-ia/         ← Rastreabilidade de prompts utilizados no desenvolvimento
│
├── backend/                ← Camada de Negócio e API REST (Hospedada no Render)
│   ├── package.json        ← Dependências (express, bcryptjs, jsonwebtoken, @supabase/supabase-js)
│   ├── .env.example        ← Modelo de variáveis de ambiente do servidor
│   └── src/                ← Código-fonte da API
│       ├── server.js       ← Ponto de entrada, configuração do Express e CORS
│       ├── config/         ← Conexão administrativa com Supabase (supabase.js)
│       ├── routes/         ← Declaração e roteamento dos endpoints RESTful
│       ├── controllers/    ← Controladores de requisições e respostas HTTP
│       ├── middlewares/    ← Interceptores de autenticação (JWT) e controle RBAC
│       └── utils/          ← Algoritmos matemáticos (cálculo de Haversine)
│
└── frontend/               ← Aplicação Client-Side (Hospedada na Vercel)
    ├── package.json        ← Dependências da interface React (@supabase/supabase-js, lucide-react)
    ├── .env.example        ← Modelo de variáveis públicas (REACT_APP_API_URL, SUPABASE_URL)
    ├── public/             ← Estrutura HTML base e ícones estáticos
    └── src/                ← Código-fonte da aplicação React
        ├── index.js        ← Ponto de inicialização do React DOM
        ├── App.js          ← Componente raiz e roteamento (React Router)
        ├── pages/          ← Telas do sistema (Login, Cadastro, Painel, Fluxo de Solicitação)
        ├── components/     ← Componentes reutilizáveis (ActionCard, CookieBanner, etc.)
        ├── services/       ← Camada de serviço de rede e contratos da API
        │   ├── api.js              ← Cliente de integração com o Backend Express
        │   └── supabaseStorage.js  ← Serviço de compressão e upload para Supabase Storage
        ├── styles/         ← Folhas de estilo SCSS neobrutalistas e variáveis globais
        └── tests/          ← Suítes automatizadas de testes unitários e de integração
```

---

## 7. Convenções de Nomenclatura

| Tipo | Convenção | Exemplo Prático |
| :--- | :--- | :--- |
| **Componentes React** | PascalCase | `NovaSolicitacaoStep4.jsx` |
| **Páginas** | PascalCase | `PainelCidadao.jsx` |
| **Serviços Client-Side** | camelCase | `api.js`, `supabaseStorage.js` |
| **Controladores (Backend)** | camelCase | `solicitacaoController.js` |
| **Rotas (Backend)** | camelCase + Routes | `solicitacaoRoutes.js` |
| **Estilos SCSS** | PascalCase / kebab-case | `NovaSolicitacaoStep4.scss` |
| **Variáveis e Funções** | camelCase | `calcularDistancia`, `uploadFotoSolicitacao` |
| **Constantes Globais** | UPPER_SNAKE_CASE | `RAIO_TERRA_METROS`, `BUCKET_NAME` |

---

## 8. Referências Bibliográficas e Tecnológicas

1. **Fielding, R. T. (2000).** *Architectural Styles and the Design of Network-based Software Architectures.* Doctoral dissertation, University of California, Irvine. Fundamentação dos princípios da arquitetura RESTful.
2. **IETF (1998).** *RFC 2397: The "data" URL scheme.* Internet Engineering Task Force. Análise sobre as limitações e overhead de dados em Base64 em tráfego HTTP.
3. **IETF (2015).** *RFC 7519: JSON Web Token (JWT).* Internet Engineering Task Force. Especificação formal de transmissão compacta e segura de dados de autenticação.
4. **OpenJS Foundation (2024).** *Node.js Technical Documentation & Concurrency Model.* Documentação oficial dos fundamentos de I/O assíncrono e Event Loop. Disponível em: https://nodejs.org/docs
5. **Render Services Inc. (2024).** *Render Documentation: Web Services Architecture and Deployment Guide.* Documentação oficial de operação PaaS em nuvem. Disponível em: https://docs.render.com
6. **Sinnott, R. W. (1984).** *"Virtues of the Haversine"*. *Sky and Telescope*, vol. 68, p. 159. Formulação trigonométrica para determinação de distâncias geodésicas em esferoides.
7. **Supabase Inc. (2024).** *Supabase Storage: High-Performance Object Storage for Modern Applications.* Documentação oficial de arquitetura de Storage e políticas RLS. Disponível em: https://supabase.com/docs/guides/storage
8. **Vercel Inc. (2024).** *Vercel Edge Network Architecture.* Disponível em: https://vercel.com/docs
9. **W3C (2024).** *HTML Canvas 2D Context Specification.* World Wide Web Consortium. Padrão internacional para manipulação, redimensionamento e exportação binária de imagens no cliente.

---

*Documentação técnica mantida pela equipe de desenvolvimento ZELUS — 2026*
