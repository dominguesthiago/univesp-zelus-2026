# ZELUS — Sistema de Zeladoria Urbana para Cidades Inteligentes
# Documentação da Arquitetura do Projeto
# ==============================================================

# LEIA-ME — Arquitetura do Projeto ZELUS

## 1. O que é o ZELUS?

O **ZELUS** é um sistema web desenvolvido no âmbito universitário da UNIVESP, voltado à modernização da gestão pública municipal. Seu propósito fundamental é fornecer uma plataforma colaborativa, transparente e eficiente para o registro, geolocalização e acompanhamento de ocorrências de zeladoria urbana (como pavimentação asfáltica, manutenção de bueiros, iluminação pública e descarte irregular de resíduos).

A arquitetura do ZELUS foi projetada com base no desacoplamento de responsabilidades, garantindo alta disponibilidade, privacidade de dados em conformidade com as diretrizes da LGPD/GDPR e rigor matemático no tratamento de redundâncias.

---

## 2. Stack Tecnológica e Infraestrutura em Nuvem

| Camada | Tecnologia | Provedor / Hospedagem | Justificativa Arquitetural |
| :--- | :--- | :--- | :--- |
| **Frontend** | React + SCSS (JavaScript puro) | **Vercel** (Edge CDN) | Interface moderna, responsiva e componentizada. A distribuição via CDN global garante carregamento estático em milissegundos e baixa latência para munícipes em redes móveis. |
| **Backend** | Node.js + Express (JavaScript) | **Render** (Cloud PaaS) | API RESTful assíncrona orientada a eventos. O ambiente PaaS fornece execução contínua para o motor de regras de negócio, criptografia de senhas, validação geoespacial e proteção de credenciais mestras. |
| **Banco de Dados** | Supabase (PostgreSQL) | **Supabase Cloud** | Banco relacional robusto com conformidade ACID (*Atomicity, Consistency, Isolation, Durability*), integridade referencial estrita e trilha imutável de auditoria administrativa. |

> ⚠️ **Acessibilidade Pedagógica:** O projeto emprega JavaScript puro intencionalmente para assegurar máxima clareza conceitual e legibilidade de código entre os integrantes da equipe e a comunidade acadêmica.

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
O backend hospedado no Render não atua como mero repassador de dados, mas como o **núcleo computacional e regulatório** do ecossistema:
* **Filtro Espacial Anti-Spam (Fórmula de Haversine):** Executa o cálculo trigonométrico da distância de círculo máximo (*great-circle distance*) sobre o esferoide terrestre. Chamados para a mesma subcategoria abertos em um raio $\le 10\text{ metros}$ são interceptados e bloqueados com HTTP 409 (*Conflict*), prevenindo duplicidades e desperdício de recursos das equipes municipais.
* **Autenticação Stateless e Blindagem IDOR/BOLA:** Emissão e decodificação de JSON Web Tokens (RFC 7519). A identidade do cidadão (`req.usuario.id`) é extraída estritamente da assinatura criptográfica do token, impossibilitando que um usuário visualize ou altere ocorrências de terceiros por manipulação de parâmetros.
* **Geração de Protocolo Oficial Auditável:** Emissão padronizada de códigos de rastreabilidade alfanuméricos (`ZELUS-YYYYMMDD-XXXX`).
* **Criptografia de Senhas com Salting (Bcrypt):** Proteção das credenciais de acesso através de funções unidirecionais com fator de trabalho iterativo, inviabilizando ataques baseados em tabelas arco-íris (*Rainbow Tables*).

---

## 4. Topologia e Fluxo de Comunicação entre as Partes

```
[Munícipe no Navegador Web / Smartphone]
                    │
                    │ 1. Acessa interface (HTTPS)
                    ▼
   [Frontend — React SPA na Vercel (Edge CDN)]
                    │
                    │ 2. Dispara requisições REST (Fetch API com Bearer JWT)
                    ▼
     [Backend — Node.js & Express no Render (PaaS)]
                    │
                    │ 3. Executa:
                    │    - Validação de JWT e RBAC
                    │    - Cálculo de Haversine (raio 10m)
                    │    - Hashes Bcrypt e Sanitização
                    │    - Emissão de Protocolo Oficial
                    │
                    │ 4. Operações de persistência com service_role
                    ▼
   [Banco de Dados — Supabase (PostgreSQL Cloud)]
```

1. O **munícipe** interage com o aplicativo React hospedado na Vercel.
2. O **frontend** consome a URL base pública da API no Render (`REACT_APP_API_URL`), injetando de forma transparente o token JWT nos cabeçalhos HTTP.
3. O **backend no Render** intercepta a requisição, aplica os middlewares de autenticação, processa as regras de negócio e validações matemáticas.
4. O backend realiza consultas e inserções no **Supabase** de forma isolada e segura, devolvendo a resposta estruturada em JSON para o frontend.

---

## 5. Estrutura de Pastas do Projeto

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
    ├── package.json        ← Dependências da interface React
    ├── .env.example        ← Modelo de variáveis públicas (REACT_APP_API_URL)
    ├── public/             ← Estrutura HTML base e ícones estáticos
    └── src/                ← Código-fonte da aplicação React
        ├── index.js        ← Ponto de inicialização do React DOM
        ├── App.js          ← Componente raiz e roteamento (React Router)
        ├── pages/          ← Telas do sistema (Login, Cadastro, Painel, Fluxo de Solicitação)
        ├── components/     ← Componentes reutilizáveis (ActionCard, CookieBanner, etc.)
        ├── services/       ← Camada de serviço de rede e contratos da API (api.js)
        ├── styles/         ← Folhas de estilo SCSS neobrutalistas e variáveis globais
        └── tests/          ← Suítes automatizadas de testes unitários e de integração
```

---

## 6. Convenções de Nomenclatura

| Tipo | Convenção | Exemplo Prático |
| :--- | :--- | :--- |
| **Componentes React** | PascalCase | `NovaSolicitacaoStep4.jsx` |
| **Páginas** | PascalCase | `PainelCidadao.jsx` |
| **Serviços Client-Side** | camelCase | `api.js` |
| **Controladores (Backend)** | camelCase | `solicitacaoController.js` |
| **Rotas (Backend)** | camelCase + Routes | `solicitacaoRoutes.js` |
| **Estilos SCSS** | PascalCase / kebab-case | `NovaSolicitacaoStep4.scss` |
| **Variáveis e Funções** | camelCase | `calcularDistancia` |
| **Constantes Globais** | UPPER_SNAKE_CASE | `RAIO_TERRA_METROS` |

---

## 7. Referências Bibliográficas e Tecnológicas

1. **Fielding, R. T. (2000).** *Architectural Styles and the Design of Network-based Software Architectures.* Doctoral dissertation, University of California, Irvine. Fundamentação dos princípios da arquitetura RESTful.
2. **IETF (2015).** *RFC 7519: JSON Web Token (JWT).* Internet Engineering Task Force. Especificação formal de transmissão compacta e segura de dados de autenticação.
3. **OpenJS Foundation (2024).** *Node.js Technical Documentation & Concurrency Model.* Documentação oficial dos fundamentos de I/O assíncrono e Event Loop. Disponível em: https://nodejs.org/docs
4. **Render Services Inc. (2024).** *Render Documentation: Web Services Architecture and Deployment Guide.* Documentação oficial de operação PaaS em nuvem. Disponível em: https://docs.render.com
5. **Sinnott, R. W. (1984).** *"Virtues of the Haversine"*. *Sky and Telescope*, vol. 68, p. 159. Formulação trigonométrica para determinação de distâncias geodésicas em esferoides.
6. **Supabase Inc. (2024).** *Supabase Reference Architecture & PostgreSQL Cloud Platform.* Disponível em: https://supabase.com/docs
7. **Vercel Inc. (2024).** *Vercel Edge Network Architecture.* Disponível em: https://vercel.com/docs

---

*Documentação mantida pela equipe ZELUS — UNIVESP 2026*
