/**
 * Camada de Serviço de API (Service Layer) do Frontend ZELUS
 * Centraliza as requisições HTTP para a API REST do Backend.
 */

const getBaseUrl = () => {
  const envUrl = process.env.REACT_APP_API_URL;
  if (!envUrl) return '';
  return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
};

/**
 * Função utilitária para requisições HTTP padronizadas com tratamento de erros.
 * @param {string} endpoint - Caminho relativo do recurso (ex: '/api/auth/cidadao/registro')
 * @param {RequestInit} [options={}] - Opções customizadas do Fetch API
 * @returns {Promise<any>}
 */
export async function request(endpoint, options = {}) {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${endpoint}`;

  // Resgate automático e transparente do token JWT de autenticação
  const token =
    typeof window !== 'undefined' && window.localStorage
      ? localStorage.getItem('zelus_token')
      : null;

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const mensagemErro =
        data?.error ||
        data?.mensagem ||
        data?.message ||
        `Erro na requisição ao servidor (${response.status})`;
      const error = new Error(mensagemErro);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.status !== undefined) {
      throw error;
    }
    const networkError = new Error(
      !error.message || error.message === 'Failed to fetch' || error.message.includes('fetch')
        ? 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.'
        : error.message
    );
    networkError.status = 0;
    networkError.data = null;
    throw networkError;
  }
}

/**
 * Registra um novo cidadão (munícipe) no sistema ZELUS
 * POST /api/auth/cidadao/registro
 * @param {Object} dados
 * @param {string} dados.nome_completo
 * @param {string} dados.cpf - 11 dígitos numéricos sanitizados
 * @param {string} dados.email
 * @param {string} dados.whatsapp - dígitos numéricos sanitizados
 * @param {string} dados.senha
 * @returns {Promise<{sucesso: boolean, mensagem: string, dados?: any}>}
 */
export async function registrarCidadao(dados) {
  return request('/api/auth/cidadao/registro', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

/**
 * Autentica (login) um cidadão no sistema ZELUS
 * POST /api/auth/cidadao/login
 * @param {Object} credenciais
 * @param {string} credenciais.cpf - 11 dígitos numéricos sanitizados
 * @param {string} credenciais.senha
 * @returns {Promise<{sucesso: boolean, mensagem: string, token: string, dados: any}>}
 */
export async function loginCidadao(credenciais) {
  return request('/api/auth/cidadao/login', {
    method: 'POST',
    body: JSON.stringify(credenciais),
  });
}

/**
 * Redefine a senha de acesso do cidadão
 * PUT /api/auth/cidadao/nova-senha
 * @param {Object} dados
 * @param {string} dados.cpf - 11 dígitos numéricos sanitizados
 * @param {string} dados.email
 * @param {string} dados.nova_senha
 * @returns {Promise<{sucesso: boolean, mensagem: string}>}
 */
export async function redefinirSenhaCidadao(dados) {
  return request('/api/auth/cidadao/nova-senha', {
    method: 'PUT',
    body: JSON.stringify(dados),
  });
}

/**
 * Autentica um funcionário/servidor da Prefeitura no sistema ZELUS
 * POST /api/prefeitura/auth/login
 * @param {Object} credenciais
 * @param {string} credenciais.cpf - CPF com ou sem máscara
 * @param {string} credenciais.senha
 * @returns {Promise<{sucesso: boolean, mensagem: string, token: string, funcionario?: any, dados?: any}>}
 */
export async function loginPrefeitura(credenciais) {
  return request('/api/prefeitura/auth/login', {
    method: 'POST',
    body: JSON.stringify(credenciais),
  });
}

export async function loginFuncionario(credenciais) {
  return loginPrefeitura(credenciais);
}

/**
 * Registra um novo funcionário/servidor da Prefeitura
 * Exige a Chave de Acesso Administrativa
 * POST /api/prefeitura/auth/cadastro
 * @param {Object} dados
 * @param {string} dados.nomeCompleto
 * @param {string} dados.cpf
 * @param {string} dados.senha
 * @param {string} dados.chaveAdministrativa
 * @returns {Promise<{sucesso: boolean, mensagem: string, funcionario?: any, dados?: any}>}
 */
export async function cadastrarPrefeitura(dados) {
  return request('/api/prefeitura/auth/cadastro', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

export async function registrarFuncionario(dados) {
  return cadastrarPrefeitura(dados);
}

/**
 * Redefine a senha de acesso do funcionário/servidor da Prefeitura
 * Exige a Chave de Acesso Administrativa
 * PUT /api/auth/funcionario/nova-senha
 * @param {Object} dados
 * @param {string} dados.cpf
 * @param {string} dados.nova_senha
 * @param {string} dados.chave_acesso
 * @returns {Promise<{sucesso: boolean, mensagem: string}>}
 */
export async function redefinirSenhaFuncionario(dados) {
  return request('/api/auth/funcionario/nova-senha', {
    method: 'PUT',
    body: JSON.stringify(dados),
  });
}

/**
 * Lista todas as categorias e suas respectivas subcategorias cadastradas no ZELUS.
 * GET /api/categorias
 * @returns {Promise<{sucesso: boolean, dados: Array<{id: string, nome: string, subcategorias: Array<{id: string, nome: string}>}>}>}
 */
export async function listarCategorias() {
  return request('/api/categorias', {
    method: 'GET',
  });
}

/**
 * Cria uma nova solicitação de zeladoria urbana com validação geoespacial.
 * POST /api/solicitacoes
 * @param {Object} dados
 * @param {string} dados.subcategoria_id - UUID da subcategoria vinculada
 * @param {number} dados.latitude - Coordenada GPS decimal
 * @param {number} dados.longitude - Coordenada GPS decimal
 * @param {string} dados.descricao - Relato detalhado do problema
 * @param {string} dados.rua - Logradouro da ocorrência
 * @param {string} dados.bairro - Bairro da ocorrência
 * @param {string} dados.cidade - Cidade da ocorrência
 * @param {string} [dados.numero] - Número ou lote (opcional)
 * @param {string} [dados.ponto_referencia] - Ponto de referência (opcional)
 * @param {string} [dados.foto_url] - URL da imagem capturada (opcional)
 * @returns {Promise<{sucesso: boolean, mensagem: string, protocolo: string, dados: Object}>}
 */
export async function criarSolicitacao(dados) {
  return request('/api/solicitacoes', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

/**
 * Recupera o histórico de solicitações abertas exclusivamente pelo cidadão logado.
 * GET /api/solicitacoes/minhas
 * @returns {Promise<{sucesso: boolean, mensagem: string, dados: Array<Object>}>}
 */
export async function listarMinhasSolicitacoes() {
  return request('/api/solicitacoes/minhas', {
    method: 'GET',
  });
}

const api = {
  request,
  registrarCidadao,
  loginCidadao,
  redefinirSenhaCidadao,
  loginFuncionario,
  registrarFuncionario,
  loginPrefeitura,
  cadastrarPrefeitura,
  redefinirSenhaFuncionario,
  listarCategorias,
  criarSolicitacao,
  listarMinhasSolicitacoes,
};

export default api;



