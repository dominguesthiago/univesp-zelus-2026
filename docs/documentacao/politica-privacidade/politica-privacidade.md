# Política de Privacidade e Proteção de Dados Pessoais — Sistema ZELUS

**Documento:** Política de Privacidade, Proteção de Dados e Governança Regulatória  
**Legislação de Referência:** Lei Geral de Proteção de Dados Pessoais (Lei Federal nº 13.709/2018 - LGPD)  
**Versão:** 1.0  
**Data de Publicação:** 19 de outubro de 2026  
**Responsabilidade:** Encarregado pelo Tratamento de Dados Pessoais (DPO) & Equipe de Compliance ZELUS  
**Status:** Aprovado  

---

## 1. Apresentação e Enquadramento Legal

### 1.1 Identificação do Controlador e do Operador do Sistema ZELUS
O sistema **ZELUS** é uma plataforma tecnológica de utilidade pública municipal desenvolvida para a gestão, encaminhamento, monitoramento e execução de serviços urbanos e zeladoria municipal.

* **Controlador dos Dados:** A Administração Pública Municipal (Prefeitura Municipal / Secretaria Municipal de Serviços e Obras Urbanas), a quem competem as decisões referentes ao tratamento de dados pessoais.
* **Operador:** A equipe técnica gestora e operacional responsável pela infraestrutura de software, manutenção dos bancos de dados e provimento dos serviços da plataforma ZELUS.

### 1.2 Fundamentação Legal: LGPD (Lei Federal nº 13.709/2018) no Contexto da Administração Pública
O tratamento de dados pessoais no âmbito do ZELUS é regido pelos ditames da **Lei Federal nº 13.709, de 14 de agosto de 2018 (Lei Geral de Proteção de Dados Pessoais - LGPD)**, observando com rigor os princípios da finalidade, adequação, necessidade, livre acesso, qualidade dos dados, transparência, segurança, prevenção, não discriminação e responsabilização/prestação de contas (art. 6º da LGPD).

No contexto do setor público, o tratamento de dados pessoais destina-se a atender à sua finalidade pública, na persecução do interesse público, com o objetivo de executar as competências legais ou cumprir as atribuições legais do serviço público (art. 23 da LGPD).

---

## 2. Dados Coletados e Finalidade Específica

### 2.1 Dados Cadastrais e de Identificação do Cidadão
Para fins de identificação, autenticação e comunicação do andamento das demandas urbanas abertas pelo munícipe, são coletados:
* **Nome completo:** Para atribuição de autoria do chamado e personalização dos contatos formais.
* **Endereço de e-mail / Telefone celular:** Para autenticação na plataforma, envio de confirmação de abertura de protocolo e notificações automáticas de mudança de status da solicitação.
* **Cadastro de Pessoa Física (CPF):** Utilizado exclusivamente para verificação de unicidade cadastral no município e prevenção de fraudes ou chamados maliciosos/falsos (*trolling* ou sobrecarga indevida do serviço público).

### 2.2 Tratamento Específico de Dados de Geolocalização Exata (Latitude/Longitude)
Para que uma solicitação de reparo de zeladoria (ex: buraco em via pública, foco de lixo, poste com lâmpada apagada, poda emergencial de árvore) possa ser executada pelas equipes de campo, o sistema ZELUS realiza a coleta de **coordenadas geográficas exatas (latitude e longitude)**:
1. Por meio do leitor de GPS do dispositivo do cidadão, mediante solicitação e autorização expressa no navegador/aplicativo no momento da abertura do chamado; ou
2. Por meio de indicação direta e georreferenciada pelo próprio usuário sobre a interface de mapa; ou
3. Pela conversão (*geocoding*) do endereço textual fornecido pelo cidadão.

### 2.3 Finalidade Técnica da Geolocalização: Aplicação da Fórmula de Haversine
A coleta do par ordenado (latitude, longitude) possui finalidade estrita e objetiva:
* **Cálculo da Distância Ortodrômica (Fórmula de Haversine):** O ZELUS implementa algoritmos baseados na fórmula matemática de Haversine para computar distâncias reais na superfície esférica terrestre entre múltiplos chamados abertos.
* **Agrupamento de Demandas e Roteirização Eficiente:** O cálculo de proximidade geográfica permite ao sistema consolidar automaticamente chamados correlatos na mesma rua, quarteirão ou praça. Isso impede a duplicidade de ordens de serviço, racionaliza o deslocamento de viaturas públicas, reduz a emissão de poluentes e otimiza a aplicação dos recursos públicos municipais.
* **Restrição de Uso:** Em nenhuma hipótese as coordenadas de geolocalização do usuário são utilizadas para rastreamento contínuo de rotas, monitoramento de deslocamento do cidadão ou qualquer finalidade alheia ao reparo urbano solicitado.

---

## 3. Bases Legais para o Tratamento (Art. 7º e 8º da LGPD)

### 3.1 Cumprimento de Obrigação Legal e Execução de Políticas Públicas
O tratamento dos dados no ZELUS é primariamente amparado pelas seguintes bases legais do art. 7º da LGPD:
* **Art. 7º, inciso II:** Para o cumprimento de obrigação legal ou regulatória pelo controlador;
* **Art. 7º, inciso III:** Pela administração pública, para o tratamento e uso compartilhado de dados necessários à execução de políticas públicas previstas em leis e regulamentos ou respaldadas em contratos, convênios ou instrumentos congêneres.

### 3.2 Termo de Consentimento Livre, Informado e Inequívoco para Acesso ao GPS
No momento específico em que a aplicação web solicita acesso à API de Geolocalização do navegador (*Geolocation API*):
* Um diálogo claro e contextualizado esclarece ao titular: *"O ZELUS solicita acesso à sua localização atual apenas para apontar no mapa o local exato da ocorrência urbana a ser reparada"*.
* O consentimento é concedido ou revogado livremente pelo usuário nas configurações do navegador ou dispositivo, sem que haja impedimento para a abertura manual do chamado através de digitação do endereço tradicional.

---

## 4. Ciclo de Vida, Retenção e Descarte dos Dados

### 4.1 Período de Armazenamento Ativo durante a Tramitação do Chamado
Os dados pessoais do solicitante (nome, contato e CPF) permanecem vinculados ao chamado durante todo o seu ciclo ativo: *Triagem -> Em Análise -> Ordem de Serviço Emitida -> Em Execução -> Concluído*. Esse vínculo é indispensável para eventual contato da fiscalização municipal, esclarecimento sobre a localização do dano urbano e validação do atendimento prestado.

### 4.2 Anonimização e Desassociação dos Dados Pessoais após a Conclusão
Assim que a ordem de serviço do chamado atinge o estado final de **Concluído e Homologado**:
* **Desassociação do Solicitante:** Decorrido o prazo regulamentar de 90 (noventa) dias após a homologação da conclusão do serviço (período concedido ao munícipe para eventual contestação ou reabertura), os dados de identificação pessoal do solicitante (nome, CPF, e-mail) são desvinculados do registro do chamado ou passam por processo irreversível de **anonimização** (art. 12 da LGPD).
* **Conversão em Dado Aberto de Infraestrutura Urbana:** O registro técnico do chamado — contendo a data, categoria do serviço, fotos da via pública reparada e as coordenadas geográficas do logradouro — é preservado como patrimônio histórico e estatístico da cidade, deixando de ser classificado como dado pessoal nos termos da legislação.

### 4.3 Dados Estatísticos Agregados e Prazos Regimentais de Prescrição
Os relatórios consolidados de tempo de resposta por bairro, densidade de buracos asfaltados e índices de atendimento por secretaria são processados de forma agregada e anônima, servindo de subsídio para o planejamento orçamentário do Plano Plurianual (PPA) e Lei de Diretrizes Orçamentárias (LDO) do Município.

---

## 5. Segurança da Informação e Compartilhamento de Dados

### 5.1 Criptografia em Trânsito e em Repouso
O ZELUS implementa controles técnicos e organizacionais rigorosos de segurança da informação (art. 46 da LGPD):
* **Criptografia em Trânsito:** Toda a comunicação entre o navegador do munícipe e os servidores da aplicação ocorre sob o protocolo seguro **HTTPS / TLS 1.3**, garantindo integridade e confidencialidade do tráfego.
* **Criptografia em Repouso:** Credenciais de autenticação (senhas) são irreversivelmente processadas utilizando algoritmos robustos de dispersão com salting (*hashing* via bcrypt/Argon2). Dados sensíveis armazenados no banco relacional contam com criptografia de volume.
* **Trilhas de Auditoria (*Logs*):** Qualquer acesso de servidores públicos aos chamados gera registro auditável de data, hora, IP e identificação funcional do operador.

### 5.2 Não Comercialização e Restrição de Acesso
É terminantemente vedada a comercialização, cessão, compartilhamento para fins comerciais ou monetização de quaisquer dados pessoais custodiados no ZELUS. O compartilhamento ocorre estritamente entre secretarias e órgãos municipais co-responsáveis pela execução direta da zeladoria urbana, respeitado o dever de sigilo funcional.

---

## 6. Direitos do Titular de Dados e Canal do Encarregado (DPO)

### 6.1 Exercício dos Direitos (Art. 18 da LGPD)
O munícipe cadastrado no ZELUS pode exercer a qualquer momento seus direitos previstos em lei, incluindo:
1. **Confirmação da existência de tratamento** de seus dados na plataforma;
2. **Acesso aos dados** constantes em seu perfil e histórico de solicitações;
3. **Correção de dados incompletos, inexatos ou desatualizados** diretamente no painel do cidadão;
4. **Anonimização ou eliminação** de dados desnecessários ou tratados em desconformidade com a LGPD;
5. **Informação sobre o uso compartilhado** dos seus dados entre as entidades públicas municipais.

### 6.2 Canal de Contato com o Encarregado de Proteção de Dados (DPO)
Para o encaminhamento de requisições formais, dúvidas sobre o tratamento de dados pessoais ou comunicações de incidentes, o cidadão pode contatar diretamente o Encarregado pelo Tratamento de Dados Pessoais da Prefeitura Municipal:

* **Encarregado Institucional (DPO):** Ouvidoria e Controladoria Geral do Município
* **Canal Eletrônico Oficial:** `dpo@zelus.municipio.sp.gov.br`
* **Endereço Físico:** Paço Municipal — Gabinete de Transparência e Proteção de Dados
* **Horário de Atendimento:** Segunda a Sexta-feira, das 09h às 17h

---

## 7. Referências Normativas e Bibliográficas

1. **BRASIL**. *Lei Federal nº 13.709, de 14 de agosto de 2018*. Dispõe sobre a proteção de dados pessoais e altera a Lei nº 12.965, de 23 de abril de 2014 (Marco Civil da Internet). Diário Oficial da União, Brasília, DF, 15 ago. 2018.
2. **ANPD (Autoridade Nacional de Proteção de Dados)**. *Guia Orientativo: Tratamento de Dados Pessoais pelo Poder Público*. Brasília: Coordenação-Geral de Normatização, ANPD, 2022.
3. **ANPD**. *Guia Orientativo de Segurança da Informação para Agentes de Tratamento de Pequeno Porte*. Brasília: ANPD, 2021.
4. **SINNOTT, Roger W.** *Virtues of the Haversine*. Sky and Telescope, v. 68, n. 2, p. 159, 1984.
5. **BRASIL**. *Lei Federal nº 12.527, de 18 de novembro de 2011*. Regula o acesso a informações previsto no inciso XXXIII do art. 5º da Constituição Federal (Lei de Acesso à Informação).
