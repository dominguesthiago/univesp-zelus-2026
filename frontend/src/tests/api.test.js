import {
  request,
  listarCategorias,
  criarSolicitacao,
  listarMinhasSolicitacoes,
  loginCidadao,
  registrarCidadao,
  redefinirSenhaCidadao,
} from '../services/api';

describe('Serviço de API e Interceptação HTTP (api.js)', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  test('CT-API.1: deve injetar Authorization Bearer automaticamente quando zelus_token estiver no localStorage', async () => {
    localStorage.setItem('zelus_token', 'token-jwt-simulado-xyz');

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ sucesso: true, dados: [] }),
    });

    await request('/api/solicitacoes/minhas');

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [, options] = global.fetch.mock.calls[0];
    expect(options.headers).toMatchObject({
      'Content-Type': 'application/json',
      Authorization: 'Bearer token-jwt-simulado-xyz',
    });
  });

  test('CT-API.2: não deve incluir header Authorization quando zelus_token não existir no localStorage', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ sucesso: true }),
    });

    await request('/api/auth/cidadao/login', { method: 'POST' });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [, options] = global.fetch.mock.calls[0];
    expect(options.headers.Authorization).toBeUndefined();
    expect(options.headers['Content-Type']).toBe('application/json');
  });

  test('CT-API.3: deve combinar corretamente headers adicionais passados nas options', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ sucesso: true }),
    });

    await request('/api/status', {
      headers: { 'X-Custom-Header': 'ZelusTest' },
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [, options] = global.fetch.mock.calls[0];
    expect(options.headers['X-Custom-Header']).toBe('ZelusTest');
    expect(options.headers['Content-Type']).toBe('application/json');
  });

  test('CT-API.4: deve lançar Error com status e mensagem retornados pelo backend em caso de erro HTTP', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 409,
      json: async () => ({
        sucesso: false,
        mensagem: 'Já existe um problema deste tipo registado a menos de 10 metros daqui.',
      }),
    });

    await expect(criarSolicitacao({ subcategoria_id: '123' })).rejects.toMatchObject({
      message: 'Já existe um problema deste tipo registado a menos de 10 metros daqui.',
      status: 409,
    });
  });

  test('CT-API.5: deve encapsular erros de rede com status 0 e mensagem amigável', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Failed to fetch'));

    await expect(request('/api/qualquer')).rejects.toMatchObject({
      status: 0,
      message: expect.stringMatching(/Não foi possível conectar ao servidor/i),
    });
  });

  test('CT-API.6: deve chamar os endpoints e verbos corretos para os novos métodos', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ sucesso: true }),
    });

    // 1. listarCategorias (GET /api/categorias)
    await listarCategorias();
    expect(global.fetch).toHaveBeenLastCalledWith(
      expect.stringContaining('/api/categorias'),
      expect.objectContaining({ method: 'GET' })
    );

    // 2. listarMinhasSolicitacoes (GET /api/solicitacoes/minhas)
    await listarMinhasSolicitacoes();
    expect(global.fetch).toHaveBeenLastCalledWith(
      expect.stringContaining('/api/solicitacoes/minhas'),
      expect.objectContaining({ method: 'GET' })
    );

    // 3. criarSolicitacao (POST /api/solicitacoes)
    const payloadNova = { subcategoria_id: 'uuid-1', rua: 'Rua Teste' };
    await criarSolicitacao(payloadNova);
    expect(global.fetch).toHaveBeenLastCalledWith(
      expect.stringContaining('/api/solicitacoes'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(payloadNova),
      })
    );
  });
});
