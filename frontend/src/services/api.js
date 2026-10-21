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

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const mensagemErro =
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
      error.message ||
        'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.'
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

const api = {
  request,
  registrarCidadao,
  loginCidadao,
  redefinirSenhaCidadao,
};

export default api;


