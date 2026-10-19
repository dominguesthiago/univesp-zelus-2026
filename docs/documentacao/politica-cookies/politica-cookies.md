# Política de Cookies e Armazenamento Web Local — Sistema ZELUS

**Documento:** Política de Cookies, Tecnologias de Armazenamento Local e Transparência  
**Legislação e Normas:** Lei Federal nº 13.709/2018 (LGPD) e Guia Orientativo de Cookies da ANPD  
**Versão:** 1.0  
**Data de Publicação:** 19 de outubro de 2026  
**Responsabilidade:** Engenharia de Frontend & Equipe de Compliance e Segurança da Informação ZELUS  
**Status:** Aprovado  

---

## 1. Visão Geral e Princípio de Transparência

### 1.1 O que são Cookies e Tecnologias de Armazenamento Web
*Cookies* e APIs de Armazenamento Web (*Web Storage*) são mecanismos disponibilizados pelos navegadores modernos para salvar pequenos volumes de informação no próprio dispositivo do usuário. Enquanto os *cookies HTTP* tradicionais são trafegados no cabeçalho de cada requisição de rede entre o cliente e o servidor, as soluções modernas de *Web Storage* (como `localStorage` e `sessionStorage`) mantêm os dados isolados exclusivamente no cliente até que sejam acessados explicitamente pela aplicação.

### 1.2 Declaração de Uso: Natureza Estritamente Funcional e Essencial do ZELUS
O sistema municipal **ZELUS** adota uma postura de estrito respeito à privacidade e à experiência do cidadão (*Privacy by Default*). O sistema **não utiliza cookies tradicionais persistentes de rastreamento de comportamento**, telemetria de marketing, pixels de redes sociais ou ferramentas invasivas de terceiros. 

Toda retenção de dados temporários no dispositivo do munícipe ou do servidor público restringe-se àquilo que é **estritamente necessário e funcional** para permitir a autenticação segura e a manutenção da sessão de trabalho.

---

## 2. Arquitetura de Sessão: Web Storage vs. Cookies

### 2.1 Uso Exclusivo de Local/Session Storage para Tokens JWT de Autenticação
A persistência de sessão e identidade no frontend do ZELUS é estruturada integralmente em torno do padrão aberto **JSON Web Token (JWT - RFC 7519)**, gerenciada pelo navegador através da especificação da W3C/WHATWG *Web Storage API*:

| Tecnologia Utilizada | Chave Gravada | Finalidade Técnica | Tempo de Vida / Persistência |
| :--- | :--- | :--- | :--- |
| **`localStorage` / `sessionStorage`** | `zelus_access_token` | Armazenar temporariamente o token JWT assinado criptograficamente, anexado no cabeçalho `Authorization: Bearer <token>` das requisições à API REST do backend. | Dura enquanto o token for válido (tempo padrão de 60 minutos) ou até que o usuário efetue *Logout*. |
| **`sessionStorage`** | `zelus_temp_session` | Guardar o estado volátil do formulário de chamado (evitando perda de dados se o cidadão recarregar a tela antes do envio final). | Destruído automaticamente assim que a aba do navegador é fechada. |
| **`localStorage`** | `zelus_ui_theme` | Guardar a preferência de acessibilidade visual do usuário (Tema Claro / Tema Escuro / Alto Contraste). | Persistente até limpeza manual pelo usuário. |

### 2.2 Estrutura do Token de Acesso, Validade e Mecanismo de Renovação
* **Segurança Criptográfica:** O token JWT é assinado digitalmente pelo servidor com algoritmo assimétrico ou chave secreta segura.
* **Payload Mínimo:** O token contém exclusivamente a identificação pública da conta (ID de usuário, perfil de acesso cidadão/servidor e tempo de expiração `exp`). **Nenhum dado pessoal sensível (como CPF, endereço residencial ou dados bancários) é embutido no payload do token.**
* **Expiração Rápida:** Tokens possuem ciclo de vida curto, minimizando a janela de exposição em caso de eventuais comprometimentos do dispositivo local.

### 2.3 Ausência Total de Cookies de Rastreamento de Terceiros (*Third-Party Cookies*)
O ZELUS declara formalmente que:
* **Não utiliza** cookies de publicidade direcionada (como Google AdSense, Meta Pixel, etc.);
* **Não realiza** rastreamento de navegação cruzada entre sites (*cross-site tracking*);
* **Não compartilha** dados de sessão com redes de anunciantes ou corretores de dados (*data brokers*).

---

## 3. Fundamentação Regulatória para Dispensa de Banner de Consentimento

### 3.1 Classificação sob a Guia Orientativa de Cookies da ANPD
De acordo com o **Guia Orientativo de Cookies e Proteção de Dados Pessoais da Autoridade Nacional de Proteção de Dados (ANPD)**, os mecanismos de armazenamento e cookies classificam-se em duas grandes categorias:
1. **Cookies Estritamente Necessários (Funcionais/Operacionais):** Aqueles indispensáveis para que o sítio eletrônico execute suas funções básicas requisitadas pelo usuário (ex: gerenciar logins, autenticar requisições de API, garantir segurança contra ataques de negação de serviço e lembrar escolhas de acessibilidade).
2. **Cookies Não Necessários (Marketing, Estatísticos/Analytics, Redes Sociais):** Aqueles voltados à criação de perfis comportamentais e publicidade.

A ANPD estabelece expressamente que **cookies e armazenamentos estritamente necessários dispensam a coleta prévia de consentimento do usuário**, uma vez que o serviço não pode operar sem tais recursos e sua finalidade apoia-se no legítimo interesse da prestação do serviço ou no cumprimento de dever legal.

### 3.2 Não Intrusividade: Prevenção da "Fadiga de Banners" (*Cookie Fatigue*)
Por operar de forma limpa, técnica e focada exclusivamente no atendimento ao cidadão, **o ZELUS opta por NÃO poluir a interface pública com banners intrusivos, caixas de bloqueio de tela ou avisos de "Aceito todos os cookies"**.

Essa decisão técnica e jurídica:
* Garante conformidade integral com as diretrizes da ANPD;
* Evita a chamada "fadiga de banners", onde o usuário aceita condições sem ler;
* Melhora substancialmente a acessibilidade digital para usuários de leitores de tela e navegação por teclado, que comumente sofrem com banners de consentimento mal codificados bloqueando o fluxo de navegação.

A presente política atua como instrumento de plena transparência pública ativa (princípio do livre acesso e transparência da LGPD).

---

## 4. Práticas de Segurança em Armazenamento Local

### 4.1 Mitigação de Ataques XSS e Medidas de Isolamento
Como os tokens JWT são mantidos em `localStorage`/`sessionStorage`, a aplicação implementa sólidas contramedidas de arquitetura:
* **Política de Segurança de Conteúdo Estrita (*Content Security Policy - CSP*):** Cabeçalhos HTTP que restringem a execução de scripts embutidos não autorizados e bloqueiam a injeção de código malicioso (*Cross-Site Scripting - XSS*).
* **Sanitização Universal de Entradas:** Todas as entradas de dados fornecidas em campos de texto, fotos ou nomes de chamados são validadas e higienizadas tanto no frontend quanto no backend.
* **Isolamento de Origem (*Same-Origin Policy*):** O acesso aos dados armazenados no Web Storage é restrito unicamente ao domínio exato oficial do ZELUS.

### 4.2 Limpeza Automática do Storage no Encerramento de Sessão (*Logout*)
Ao acionar o botão de "Sair" da aplicação:
* As rotinas de frontend executam imediatamente a remoção das chaves `zelus_access_token` e `zelus_temp_session`;
* O token é invalidado no contexto do cliente e do servidor, garantindo que terceiros que venham a utilizar o mesmo terminal compartilhado (ex: computadores públicos de telecentros, bibliotecas ou poupatempos) não consigam acessar a conta do cidadão anterior.

---

## 5. Como o Cidadão Pode Gerenciar seus Dados de Navegador

### 5.1 Instruções para Limpeza de Cache e Local Storage nos Principais Navegadores
O cidadão ou servidor público tem total controle sobre os dados armazenados em sua máquina e pode excluí-los a qualquer momento:

* **Google Chrome / Microsoft Edge:**
  1. Clique nos três pontos no canto superior direito e selecione `Configurações` -> `Privacidade e Segurança`;
  2. Selecione `Limpar dados de navegação`;
  3. Marque `Cookies e outros dados do site` e confirme em `Limpar dados`.
* **Mozilla Firefox:**
  1. Acesse o menu de opções e clique em `Configurações` -> `Privacidade e Segurança`;
  2. Na seção `Cookies e dados de sites`, clique em `Limpar dados`.
* **Safari (macOS / iOS):**
  1. Vá em `Ajustes` -> `Safari`;
  2. Selecione `Avançado` -> `Dados dos Sites` e clique em `Remover todos os dados do site`.

---

## 6. Referências Normativas e Bibliográficas

1. **ANPD (Autoridade Nacional de Proteção de Dados)**. *Guia Orientativo: Cookies e Proteção de Dados Pessoais*. Brasília: Coordenação-Geral de Normatização, ANPD, outubro de 2022. Disponível em: <https://www.gov.br/anpd/pt-br/documentos-e-publicacoes/guia-orientativo-cookies-e-protecao-de-dados-pessoais.pdf>.
2. **IETF (Internet Engineering Task Force)**. *RFC 7519: JSON Web Token (JWT)*. M. Jones, J. Bradley, N. Sakimura. Maio de 2015. Disponível em: <https://datatracker.ietf.org/doc/html/rfc7519>.
3. **WHATWG / W3C**. *Web Storage (Second Edition) - W3C Recommendation*. Ian Hickson et al. Disponível em: <https://html.spec.whatwg.org/multipage/webstorage.html>.
4. **OWASP Foundation**. *OWASP Top 10 Web Application Security Risks*. Identificação e mitigação de vulnerabilidades XSS e gerenciamento de sessões seguras. Disponível em: <https://owasp.org/www-project-top-ten/>.
5. **BRASIL**. *Lei Federal nº 13.709, de 14 de agosto de 2018*. Lei Geral de Proteção de Dados Pessoais (LGPD).
