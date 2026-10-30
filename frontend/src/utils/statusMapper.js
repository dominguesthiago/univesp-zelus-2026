/**
 * Utilitário de Mapeamento e Normalização de Status do Quadro Kanban
 * Escudo do Frontend para padronizar variações oriundas do banco de dados
 * nos 5 status estritos oficiais da plataforma:
 * - "Pendente"
 * - "Em análise"
 * - "Em execução"
 * - "Concluída"
 * - "Descartada"
 */

export const STATUS_ESTRITOS = [
  'Pendente',
  'Em análise',
  'Em execução',
  'Concluída',
  'Descartada',
];

export const COLUNAS_KANBAN = [
  {
    id: 'Pendente',
    titulo: 'Pendente',
    corPastel: '#EDE194',
    descricao: 'Aguardando triagem técnica inicial',
  },
  {
    id: 'Em análise',
    titulo: 'Em análise',
    corPastel: '#BCDCF4',
    descricao: 'Sob avaliação técnica da secretaria',
  },
  {
    id: 'Em execução',
    titulo: 'Em execução',
    corPastel: '#F9B188',
    descricao: 'Equipe em campo realizando o serviço',
  },
  {
    id: 'Concluída',
    titulo: 'Concluída',
    corPastel: '#D4E4BC',
    descricao: 'Serviço concluído e auditado',
  },
  {
    id: 'Descartada',
    titulo: 'Descartada',
    corPastel: '#ECC4BC',
    descricao: 'Improcedente ou duplicado',
  },
];

/**
 * Normaliza qualquer variação de status para um dos 5 status estritos.
 * @param {string} statusRaw - Status original vindo da API ou banco
 * @returns {string} Status padronizado ("Pendente", "Em análise", "Em execução", "Concluída", "Descartada")
 */
export function normalizarStatus(statusRaw) {
  if (!statusRaw || typeof statusRaw !== 'string') {
    return 'Pendente';
  }

  // Sanitização: remove acentos e converte para minúsculas para comparação resiliente
  const limpo = statusRaw
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  // 1. Em análise
  if (
    limpo === 'em analise' ||
    limpo === 'analise' ||
    limpo === 'em_analise' ||
    limpo.includes('analise')
  ) {
    return 'Em análise';
  }

  // 2. Em execução (inclui "em andamento", "andamento", etc.)
  if (
    limpo === 'em execucao' ||
    limpo === 'execucao' ||
    limpo === 'em_execucao' ||
    limpo === 'em andamento' ||
    limpo === 'andamento' ||
    limpo === 'em_andamento' ||
    limpo.includes('execuc') ||
    limpo.includes('andamento')
  ) {
    return 'Em execução';
  }

  // 3. Concluída
  if (
    limpo === 'concluida' ||
    limpo === 'concluido' ||
    limpo === 'concluida(o)' ||
    limpo === 'finalizado' ||
    limpo === 'finalizada' ||
    limpo.includes('conclui')
  ) {
    return 'Concluída';
  }

  // 4. Descartada
  if (
    limpo === 'descartada' ||
    limpo === 'descartado' ||
    limpo === 'cancelada' ||
    limpo === 'cancelado' ||
    limpo === 'rejeitada' ||
    limpo === 'rejeitado' ||
    limpo.includes('descart')
  ) {
    return 'Descartada';
  }

  // 5. Pendente (padrão e fallback)
  if (
    limpo === 'pendente' ||
    limpo === 'novo' ||
    limpo === 'aberto' ||
    limpo === 'aberta' ||
    limpo.includes('pendent')
  ) {
    return 'Pendente';
  }

  // Fallback seguro para qualquer status desconhecido
  return 'Pendente';
}

/**
 * Normaliza um objeto de solicitação vindo da API para a estrutura esperada pelo Kanban.
 * @param {Object} item - Objeto de solicitação cru da API
 * @returns {Object} Objeto padronizado
 */
export function normalizarSolicitacao(item) {
  if (!item) return null;

  const statusNormalizado = normalizarStatus(item.status);

  const enderecoNormalizado = item.endereco || {
    rua: item.rua || 'Logradouro não informado',
    numero: item.numero || 'S/N',
    bairro: item.bairro || 'Bairro não informado',
    cidade: item.cidade || 'Cidade não informada',
    cep: item.cep || '',
    ponto_referencia: item.ponto_referencia || '',
  };

  const coordenadasNormalizadas = item.coordenadas || {
    latitude: typeof item.latitude === 'number' ? item.latitude : parseFloat(item.latitude) || 0,
    longitude: typeof item.longitude === 'number' ? item.longitude : parseFloat(item.longitude) || 0,
  };

  const cidadaoNormalizado = item.cidadao || {
    nome: item.cidadaos?.nome_completo || 'Munícipe Registrado',
    cpf: item.cidadaos?.cpf || 'Não informado',
    telefone: item.cidadaos?.whatsapp || 'Não informado',
    email: item.cidadaos?.email || '',
  };

  const subcategoriaNome =
    item.subcategoria ||
    item.subcategorias?.nome ||
    'Solicitação Urbana';

  const historicoAuditoria =
    Array.isArray(item.historico_auditoria) && item.historico_auditoria.length > 0
      ? item.historico_auditoria
      : [
          {
            id: `aud-${item.id || 'inicial'}`,
            data_hora: item.created_at || new Date().toISOString(),
            funcionario: 'Sistema de Protocolo',
            status_anterior: 'Novo',
            novo_status: statusNormalizado,
            motivo: item.justificativa_status || 'Registro de solicitação no sistema.',
          },
        ];

  return {
    ...item,
    status: statusNormalizado,
    subcategoria: subcategoriaNome,
    endereco: enderecoNormalizado,
    coordenadas: coordenadasNormalizadas,
    cidadao: cidadaoNormalizado,
    historico_auditoria: historicoAuditoria,
  };
}

