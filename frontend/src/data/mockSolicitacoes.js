import fotoBuraco from '../assets/images/solicitacao-buraco.jpg';
import fotoBueiro from '../assets/images/solicitacao-bueiro.jpg';
import fotoEntulho from '../assets/images/solicitacao-entulho.jpg';

/**
 * Base de Dados Simulados (Mock Data) — Teste de Estresse de Rolagem
 * Contempla 10 cartões por coluna (50 solicitações no total):
 * 1. Pendente (10 chamados)     - Fundo Pastel: #EDE194
 * 2. Em análise (10 chamados)   - Fundo Pastel: #BCDCF4
 * 3. Em execução (10 chamados)  - Fundo Pastel: #F9B188
 * 4. Concluída (10 chamados)    - Fundo Pastel: #D4E4BC
 * 5. Descartada (10 chamados)   - Fundo Pastel: #ECC4BC
 */

export const MOCK_SOLICITACOES = [
  // =========================================================================
  // 1. COLUNA: PENDENTE (10 chamados)
  // =========================================================================
  {
    id: 'sol-001',
    protocolo: 'ZEL-2026-0101',
    status: 'Pendente',
    categoria: 'Pavimentação e Vias',
    subcategoria: 'Buraco no Asfalto',
    descricao: 'Buraco profundo na faixa da direita, risco iminente de colisão e quebra de suspensão de ônibus.',
    foto_url: fotoBuraco,
    endereco: { rua: 'Av. Paulista', numero: '1578', bairro: 'Bela Vista', cidade: 'São Paulo', cep: '01310-200', ponto_referencia: 'Vão Livre do MASP' },
    coordenadas: { latitude: -23.561414, longitude: -46.655881 },
    cidadao: { nome: 'Mariana Silveira Ramos', cpf: '342.***.***-18', telefone: '(11) 98712-3456', email: 'mariana.silveira@email.com' },
    created_at: '2026-10-29T08:15:00.000Z',
    historico_auditoria: [{ id: 'aud-001', data_hora: '2026-10-29T08:15:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Registro de chamado via portal do munícipe.' }]
  },
  {
    id: 'sol-002',
    protocolo: 'ZEL-2026-0102',
    status: 'Pendente',
    categoria: 'Saneamento e Drenagem',
    subcategoria: 'Bueiro Entupido',
    descricao: 'Bueiro obstruído com folhas e resíduos plásticos, gerando alagamento na calçada.',
    foto_url: fotoBueiro,
    endereco: { rua: 'Rua Augusta', numero: '920', bairro: 'Consolação', cidade: 'São Paulo', cep: '01304-001', ponto_referencia: 'Esq. Fernando de Albuquerque' },
    coordenadas: { latitude: -23.553924, longitude: -46.657012 },
    cidadao: { nome: 'João Pedro Alencar', cpf: '418.***.***-62', telefone: '(11) 97433-2190', email: 'joao.alencar@email.com' },
    created_at: '2026-10-29T08:45:00.000Z',
    historico_auditoria: [{ id: 'aud-002', data_hora: '2026-10-29T08:45:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Abertura pelo aplicativo móvel.' }]
  },
  {
    id: 'sol-003',
    protocolo: 'ZEL-2026-0103',
    status: 'Pendente',
    categoria: 'Limpeza Urbana',
    subcategoria: 'Descarte Irregular de Entulho',
    descricao: 'Móveis velhos e restos de alvenaria ocupando a calçada dos pedestres.',
    foto_url: fotoEntulho,
    endereco: { rua: 'Rua Teodoro Sampaio', numero: '1420', bairro: 'Pinheiros', cidade: 'São Paulo', cep: '05406-100', ponto_referencia: 'Próximo à Praça Benedito Calixto' },
    coordenadas: { latitude: -23.560124, longitude: -46.681145 },
    cidadao: { nome: 'Clara Beatriz Vasconcelos', cpf: '215.***.***-89', telefone: '(11) 99120-4478', email: 'clara.vasconcelos@email.com' },
    created_at: '2026-10-29T09:00:00.000Z',
    historico_auditoria: [{ id: 'aud-003', data_hora: '2026-10-29T09:00:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Reporte cidadão com foto anexa.' }]
  },
  {
    id: 'sol-004',
    protocolo: 'ZEL-2026-0104',
    status: 'Pendente',
    categoria: 'Iluminação Pública',
    subcategoria: 'Lâmpada Queimada',
    descricao: 'Poste apagado há 3 noites consecutivas, deixando a travessia de pedestres escura.',
    foto_url: fotoBuraco,
    endereco: { rua: 'Rua da Consolação', numero: '1850', bairro: 'Consolação', cidade: 'São Paulo', cep: '01302-001', ponto_referencia: 'Em frente à biblioteca municipal' },
    coordenadas: { latitude: -23.551210, longitude: -46.654310 },
    cidadao: { nome: 'Lucas Henrique Dias', cpf: '109.***.***-45', telefone: '(11) 98334-1122', email: 'lucas.dias@email.com' },
    created_at: '2026-10-29T09:12:00.000Z',
    historico_auditoria: [{ id: 'aud-004', data_hora: '2026-10-29T09:12:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Registro de iluminação pública.' }]
  },
  {
    id: 'sol-005',
    protocolo: 'ZEL-2026-0105',
    status: 'Pendente',
    categoria: 'Árvores e Podas',
    subcategoria: 'Poda com Risco na Fiação',
    descricao: 'Galho de grande porte enroscado nos cabos de baixa tensão.',
    foto_url: fotoBueiro,
    endereco: { rua: 'Alameda Santos', numero: '780', bairro: 'Cerqueira César', cidade: 'São Paulo', cep: '01419-001', ponto_referencia: 'Próximo ao Hotel' },
    coordenadas: { latitude: -23.567890, longitude: -46.653420 },
    cidadao: { nome: 'Patricia Mendes Prado', cpf: '301.***.***-70', telefone: '(11) 99221-5544', email: 'patricia.prado@email.com' },
    created_at: '2026-10-29T09:25:00.000Z',
    historico_auditoria: [{ id: 'aud-005', data_hora: '2026-10-29T09:25:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Abertura pelo munícipe.' }]
  },
  {
    id: 'sol-006',
    protocolo: 'ZEL-2026-0106',
    status: 'Pendente',
    categoria: 'Pavimentação e Vias',
    subcategoria: 'Buraco no Asfalto',
    descricao: 'Desnivelamento asfáltico após chuva torrencial, risco aos motociclistas.',
    foto_url: fotoBuraco,
    endereco: { rua: 'Rua Bela Cintra', numero: '430', bairro: 'Consolação', cidade: 'São Paulo', cep: '01415-000', ponto_referencia: 'Próximo à padaria' },
    coordenadas: { latitude: -23.552140, longitude: -46.653210 },
    cidadao: { nome: 'Eduardo Martins Costa', cpf: '445.***.***-23', telefone: '(11) 97112-8899', email: 'eduardo.costa@email.com' },
    created_at: '2026-10-29T09:30:00.000Z',
    historico_auditoria: [{ id: 'aud-006', data_hora: '2026-10-29T09:30:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Abertura pelo munícipe.' }]
  },
  {
    id: 'sol-007',
    protocolo: 'ZEL-2026-0107',
    status: 'Pendente',
    categoria: 'Saneamento e Drenagem',
    subcategoria: 'Tampa de Bueiro Solta',
    descricao: 'Grelha de ferro do bueiro quebrada no meio, perigo para pedestres.',
    foto_url: fotoBueiro,
    endereco: { rua: 'Rua Oscar Freire', numero: '1120', bairro: 'Pinheiros', cidade: 'São Paulo', cep: '01426-001', ponto_referencia: 'Próximo à loja de roupas' },
    coordenadas: { latitude: -23.565430, longitude: -46.671230 },
    cidadao: { nome: 'Camila Pires Vieira', cpf: '228.***.***-54', telefone: '(11) 98877-3344', email: 'camila.vieira@email.com' },
    created_at: '2026-10-29T09:40:00.000Z',
    historico_auditoria: [{ id: 'aud-007', data_hora: '2026-10-29T09:40:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Abertura de chamado.' }]
  },
  {
    id: 'sol-008',
    protocolo: 'ZEL-2026-0108',
    status: 'Pendente',
    categoria: 'Limpeza Urbana',
    subcategoria: 'Lixeira Pública Danificada',
    descricao: 'Lixeira de poste metálica vandalizada e sem fundo.',
    foto_url: fotoEntulho,
    endereco: { rua: 'Rua Haddock Lobo', numero: '595', bairro: 'Cerqueira César', cidade: 'São Paulo', cep: '01414-001', ponto_referencia: 'Em frente ao restaurante' },
    coordenadas: { latitude: -23.562110, longitude: -46.664320 },
    cidadao: { nome: 'Renato Nogueira Bueno', cpf: '339.***.***-67', telefone: '(11) 97665-2211', email: 'renato.bueno@email.com' },
    created_at: '2026-10-29T09:45:00.000Z',
    historico_auditoria: [{ id: 'aud-008', data_hora: '2026-10-29T09:45:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Chamado cidadão.' }]
  },
  {
    id: 'sol-009',
    protocolo: 'ZEL-2026-0109',
    status: 'Pendente',
    categoria: 'Sinalização Viária',
    subcategoria: 'Placa de Pare Derrubada',
    descricao: 'Placa R-1 atingida por veículo e cada no chão no cruzamento.',
    foto_url: fotoBuraco,
    endereco: { rua: 'Rua Pamplona', numero: '820', bairro: 'Jardim Paulista', cidade: 'São Paulo', cep: '01405-001', ponto_referencia: 'Cruzamento com Alameda Santos' },
    coordenadas: { latitude: -23.566510, longitude: -46.654120 },
    cidadao: { nome: 'Simone Toledo Barros', cpf: '512.***.***-91', telefone: '(11) 98110-4433', email: 'simone.barros@email.com' },
    created_at: '2026-10-29T09:50:00.000Z',
    historico_auditoria: [{ id: 'aud-009', data_hora: '2026-10-29T09:50:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Abertura de protocolo.' }]
  },
  {
    id: 'sol-010',
    protocolo: 'ZEL-2026-0110',
    status: 'Pendente',
    categoria: 'Pavimentação e Vias',
    subcategoria: 'Guia Rebaixada Quebrada',
    descricao: 'Rampa de acessibilidade de cadeirantes despedaçada.',
    foto_url: fotoBuraco,
    endereco: { rua: 'Av. Brigadeiro Luís Antônio', numero: '2050', bairro: 'Bela Vista', cidade: 'São Paulo', cep: '01318-002', ponto_referencia: 'Próximo ao Hospital' },
    coordenadas: { latitude: -23.564310, longitude: -46.649820 },
    cidadao: { nome: 'Bruno Cesar Faria', cpf: '189.***.***-82', telefone: '(11) 99443-1234', email: 'bruno.faria@email.com' },
    created_at: '2026-10-29T09:55:00.000Z',
    historico_auditoria: [{ id: 'aud-010', data_hora: '2026-10-29T09:55:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Registro formal.' }]
  },

  // =========================================================================
  // 2. COLUNA: EM ANÁLISE (10 chamados)
  // =========================================================================
  {
    id: 'sol-011',
    protocolo: 'ZEL-2026-0111',
    status: 'Em análise',
    categoria: 'Pavimentação e Vias',
    subcategoria: 'Buraco no Asfalto',
    descricao: 'Asfalto afundando após intervenção subterrânea de rede de água.',
    foto_url: fotoBuraco,
    endereco: { rua: 'Rua Domingos de Morais', numero: '2100', bairro: 'Vila Mariana', cidade: 'São Paulo', cep: '04036-000', ponto_referencia: 'Metrô Santa Cruz' },
    coordenadas: { latitude: -23.599182, longitude: -46.637210 },
    cidadao: { nome: 'Felipe Augusto Mendes', cpf: '189.***.***-34', telefone: '(11) 98112-9988', email: 'felipe.mendes@email.com' },
    created_at: '2026-10-28T11:05:00.000Z',
    historico_auditoria: [
      { id: 'aud-011-1', data_hora: '2026-10-28T11:05:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Abertura do chamado.' },
      { id: 'aud-011-2', data_hora: '2026-10-28T13:40:00.000Z', funcionario: 'Luciana Ferreira (Matrícula: 3105)', status_anterior: 'Pendente', novo_status: 'Em análise', motivo: 'Verificação técnica de responsabilidade de concessionária.' }
    ]
  },
  {
    id: 'sol-012',
    protocolo: 'ZEL-2026-0112',
    status: 'Em análise',
    categoria: 'Saneamento e Drenagem',
    subcategoria: 'Galeria Pluvial Rompida',
    descricao: 'Vazamento de água de drenagem brotando entre as lajes da calçada.',
    foto_url: fotoBueiro,
    endereco: { rua: 'Av. Rebouças', numero: '2800', bairro: 'Pinheiros', cidade: 'São Paulo', cep: '05402-400', ponto_referencia: 'Próximo à Av. Faria Lima' },
    coordenadas: { latitude: -23.571210, longitude: -46.689120 },
    cidadao: { nome: 'Vanessa Lins Prado', cpf: '277.***.***-19', telefone: '(11) 97554-3322', email: 'vanessa.lins@email.com' },
    created_at: '2026-10-28T14:20:00.000Z',
    historico_auditoria: [
      { id: 'aud-012-1', data_hora: '2026-10-28T14:20:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Abertura.' },
      { id: 'aud-012-2', data_hora: '2026-10-28T15:30:00.000Z', funcionario: 'Carlos Eduardo Silva (Matrícula: 4892)', status_anterior: 'Pendente', novo_status: 'Em análise', motivo: 'Enviado para vistoria da engenharia de drenagem.' }
    ]
  },
  {
    id: 'sol-013',
    protocolo: 'ZEL-2026-0113',
    status: 'Em análise',
    categoria: 'Limpeza Urbana',
    subcategoria: 'Terreno com Foco de Vetores',
    descricao: 'Área com lixo acumulado e mato alto em frente a escola pública.',
    foto_url: fotoEntulho,
    endereco: { rua: 'Rua Vergueiro', numero: '3410', bairro: 'Vila Mariana', cidade: 'São Paulo', cep: '04101-300', ponto_referencia: 'Esq. com Rua Pedro de Toledo' },
    coordenadas: { latitude: -23.589120, longitude: -46.634120 },
    cidadao: { nome: 'Rodrigo Santana Leite', cpf: '312.***.***-01', telefone: '(11) 98221-7788', email: 'rodrigo.leite@email.com' },
    created_at: '2026-10-28T15:00:00.000Z',
    historico_auditoria: [
      { id: 'aud-013-1', data_hora: '2026-10-28T15:00:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Abertura.' },
      { id: 'aud-013-2', data_hora: '2026-10-28T16:15:00.000Z', funcionario: 'Carlos Eduardo Silva (Matrícula: 4892)', status_anterior: 'Pendente', novo_status: 'Em análise', motivo: 'Notificação do proprietário em elaboração pela fiscalização.' }
    ]
  },
  {
    id: 'sol-014',
    protocolo: 'ZEL-2026-0114',
    status: 'Em análise',
    categoria: 'Árvores e Podas',
    subcategoria: 'Árvore com Tronco Oco',
    descricao: 'Tronco com cupins e inclinação anormal em direção à rua.',
    foto_url: fotoBueiro,
    endereco: { rua: 'Rua Peixoto Gomide', numero: '1340', bairro: 'Jardim Paulista', cidade: 'São Paulo', cep: '01409-001', ponto_referencia: 'Próximo ao Parque Trianon' },
    coordenadas: { latitude: -23.563410, longitude: -46.657810 },
    cidadao: { nome: 'Juliana Penteado Rossi', cpf: '405.***.***-63', telefone: '(11) 99332-1100', email: 'juliana.rossi@email.com' },
    created_at: '2026-10-28T15:45:00.000Z',
    historico_auditoria: [
      { id: 'aud-014-1', data_hora: '2026-10-28T15:45:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Abertura.' },
      { id: 'aud-014-2', data_hora: '2026-10-28T17:00:00.000Z', funcionario: 'Marcos Vinicius Lima (Matrícula: 5521)', status_anterior: 'Pendente', novo_status: 'Em análise', motivo: 'Agendamento de laudo com engenheiro agrônomo da subprefeitura.' }
    ]
  },
  {
    id: 'sol-015',
    protocolo: 'ZEL-2026-0115',
    status: 'Em análise',
    categoria: 'Iluminação Pública',
    subcategoria: 'Circuito em Curto',
    descricao: 'Luminárias piscando intermitentemente e barulho no transformador.',
    foto_url: fotoBuraco,
    endereco: { rua: 'Rua Bela Cintra', numero: '1450', bairro: 'Consolação', cidade: 'São Paulo', cep: '01415-001', ponto_referencia: 'Cruzamento com Alameda Itu' },
    coordenadas: { latitude: -23.558710, longitude: -46.661210 },
    cidadao: { nome: 'Tiago Fonseca Neves', cpf: '198.***.***-74', telefone: '(11) 97110-9988', email: 'tiago.neves@email.com' },
    created_at: '2026-10-28T16:10:00.000Z',
    historico_auditoria: [
      { id: 'aud-015-1', data_hora: '2026-10-28T16:10:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Abertura.' },
      { id: 'aud-015-2', data_hora: '2026-10-28T17:20:00.000Z', funcionario: 'Luciana Ferreira (Matrícula: 3105)', status_anterior: 'Pendente', novo_status: 'Em análise', motivo: 'Repassado ao consórcio de iluminação pública.' }
    ]
  },
  {
    id: 'sol-016',
    protocolo: 'ZEL-2026-0116',
    status: 'Em análise',
    categoria: 'Pavimentação e Vias',
    subcategoria: 'Afundamento de Pista',
    descricao: 'Trecho com trincas severas na faixa de ônibus da avenida.',
    foto_url: fotoBuraco,
    endereco: { rua: 'Av. Brigadeiro Faria Lima', numero: '2010', bairro: 'Pinheiros', cidade: 'São Paulo', cep: '01451-000', ponto_referencia: 'Próximo ao Shopping Iguatemi' },
    coordenadas: { latitude: -23.578120, longitude: -46.691230 },
    cidadao: { nome: 'Daniela Meireles Moura', cpf: '341.***.***-55', telefone: '(11) 98443-6677', email: 'daniela.moura@email.com' },
    created_at: '2026-10-28T16:30:00.000Z',
    historico_auditoria: [
      { id: 'aud-016-1', data_hora: '2026-10-28T16:30:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Abertura.' },
      { id: 'aud-016-2', data_hora: '2026-10-28T17:40:00.000Z', funcionario: 'Carlos Eduardo Silva (Matrícula: 4892)', status_anterior: 'Pendente', novo_status: 'Em análise', motivo: 'Triagem de pavimento de alto impacto em curso.' }
    ]
  },
  {
    id: 'sol-017',
    protocolo: 'ZEL-2026-0117',
    status: 'Em análise',
    categoria: 'Sinalização Viária',
    subcategoria: 'Semáforo Desregulado',
    descricao: 'Tempo amarelo muito curto causando frenagens bruscas.',
    foto_url: fotoBuraco,
    endereco: { rua: 'Rua da Consolação', numero: '2900', bairro: 'Cerqueira César', cidade: 'São Paulo', cep: '01416-000', ponto_referencia: 'Esq. Alameda Santos' },
    coordenadas: { latitude: -23.557810, longitude: -46.662310 },
    cidadao: { nome: 'Gabriel Antunes Prado', cpf: '211.***.***-30', telefone: '(11) 99554-1122', email: 'gabriel.prado@email.com' },
    created_at: '2026-10-28T17:00:00.000Z',
    historico_auditoria: [
      { id: 'aud-017-1', data_hora: '2026-10-28T17:00:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Abertura.' },
      { id: 'aud-017-2', data_hora: '2026-10-28T18:10:00.000Z', funcionario: 'Marcos Vinicius Lima (Matrícula: 5521)', status_anterior: 'Pendente', novo_status: 'Em análise', motivo: 'Encaminhado ao setor de sincronismo semafórico.' }
    ]
  },
  {
    id: 'sol-018',
    protocolo: 'ZEL-2026-0118',
    status: 'Em análise',
    categoria: 'Saneamento e Drenagem',
    subcategoria: 'Vazamento de Esgoto',
    descricao: 'Mau cheiro e refluxo na sarjeta em frente a comércio.',
    foto_url: fotoBueiro,
    endereco: { rua: 'Rua Pamplona', numero: '1420', bairro: 'Jardim Paulista', cidade: 'São Paulo', cep: '01405-002', ponto_referencia: 'Próximo ao mercado' },
    coordenadas: { latitude: -23.568910, longitude: -46.656710 },
    cidadao: { nome: 'Larissa Coutinho Ramos', cpf: '390.***.***-12', telefone: '(11) 98776-5544', email: 'larissa.ramos@email.com' },
    created_at: '2026-10-28T17:30:00.000Z',
    historico_auditoria: [
      { id: 'aud-018-1', data_hora: '2026-10-28T17:30:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Abertura.' },
      { id: 'aud-018-2', data_hora: '2026-10-28T18:30:00.000Z', funcionario: 'Carlos Eduardo Silva (Matrícula: 4892)', status_anterior: 'Pendente', novo_status: 'Em análise', motivo: 'Ofício de cobrança imediata à concessionária de saneamento.' }
    ]
  },
  {
    id: 'sol-019',
    protocolo: 'ZEL-2026-0119',
    status: 'Em análise',
    categoria: 'Limpeza Urbana',
    subcategoria: 'Acúmulo de Resíduos Comerciais',
    descricao: 'Sacos de lixo colocados fora dos horários de coleta padrão.',
    foto_url: fotoEntulho,
    endereco: { rua: 'Rua Augusta', numero: '2200', bairro: 'Cerqueira César', cidade: 'São Paulo', cep: '01412-000', ponto_referencia: 'Próximo aos bares' },
    coordenadas: { latitude: -23.561230, longitude: -46.665410 },
    cidadao: { nome: 'Helena Macedo Borges', cpf: '423.***.***-98', telefone: '(11) 97223-9911', email: 'helena.borges@email.com' },
    created_at: '2026-10-28T18:00:00.000Z',
    historico_auditoria: [
      { id: 'aud-019-1', data_hora: '2026-10-28T18:00:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Abertura.' },
      { id: 'aud-019-2', data_hora: '2026-10-28T19:00:00.000Z', funcionario: 'Luciana Ferreira (Matrícula: 3105)', status_anterior: 'Pendente', novo_status: 'Em análise', motivo: 'Encaminhado para rota de fiscalização de posturas municipais.' }
    ]
  },
  {
    id: 'sol-020',
    protocolo: 'ZEL-2026-0120',
    status: 'Em análise',
    categoria: 'Pavimentação e Vias',
    subcategoria: 'Paralelepípedo Solto',
    descricao: 'Pedras soltas na via histórica, barulho alto e risco aos veículos.',
    foto_url: fotoBuraco,
    endereco: { rua: 'Rua Maranhão', numero: '510', bairro: 'Higienópolis', cidade: 'São Paulo', cep: '01240-001', ponto_referencia: 'Em frente à praça' },
    coordenadas: { latitude: -23.547890, longitude: -46.658910 },
    cidadao: { nome: 'Arthur Guimarães Pinto', cpf: '156.***.***-43', telefone: '(11) 99881-0022', email: 'arthur.pinto@email.com' },
    created_at: '2026-10-28T18:30:00.000Z',
    historico_auditoria: [
      { id: 'aud-020-1', data_hora: '2026-10-28T18:30:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Abertura.' },
      { id: 'aud-020-2', data_hora: '2026-10-28T19:30:00.000Z', funcionario: 'Marcos Vinicius Lima (Matrícula: 5521)', status_anterior: 'Pendente', novo_status: 'Em análise', motivo: 'Vistoria com equipe de calcetaria patrimonial.' }
    ]
  },

  // =========================================================================
  // 3. COLUNA: EM EXECUÇÃO (10 chamados)
  // =========================================================================
  {
    id: 'sol-021',
    protocolo: 'ZEL-2026-0121',
    status: 'Em execução',
    categoria: 'Pavimentação e Vias',
    subcategoria: 'Buraco no Asfalto',
    descricao: 'Equipe de massa asfáltica a quente realizando fresagem e nivelamento.',
    foto_url: fotoBuraco,
    endereco: { rua: 'Av. Brigadeiro Luís Antônio', numero: '3400', bairro: 'Jardim Paulista', cidade: 'São Paulo', cep: '01402-001', ponto_referencia: 'Cruzamento com Alameda Santos' },
    coordenadas: { latitude: -23.575210, longitude: -46.654310 },
    cidadao: { nome: 'Renata Albuquerque Prado', cpf: '502.***.***-11', telefone: '(11) 97654-1234', email: 'renata.prado@email.com' },
    created_at: '2026-10-27T09:30:00.000Z',
    historico_auditoria: [
      { id: 'aud-021-1', data_hora: '2026-10-27T09:30:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Abertura.' },
      { id: 'aud-021-2', data_hora: '2026-10-27T10:15:00.000Z', funcionario: 'Carlos Eduardo Silva', status_anterior: 'Pendente', novo_status: 'Em análise', motivo: 'Aprovado.' },
      { id: 'aud-021-3', data_hora: '2026-10-28T08:00:00.000Z', funcionario: 'Marcos Vinicius Lima', status_anterior: 'Em análise', novo_status: 'Em execução', motivo: 'OS-8812 despachada para campo.' }
    ]
  },
  {
    id: 'sol-022',
    protocolo: 'ZEL-2026-0122',
    status: 'Em execução',
    categoria: 'Saneamento e Drenagem',
    subcategoria: 'Desobstrução Pluvial',
    descricao: 'Caminhão de sucção e hidrojateamento operando nas galerias.',
    foto_url: fotoBueiro,
    endereco: { rua: 'Rua Vergueiro', numero: '1850', bairro: 'Paraíso', cidade: 'São Paulo', cep: '04101-000', ponto_referencia: 'Viaduto do Paraíso' },
    coordenadas: { latitude: -23.578490, longitude: -46.638210 },
    cidadao: { nome: 'Gabriel Pires Castilho', cpf: '098.***.***-77', telefone: '(11) 99881-2244', email: 'gabriel.pires@email.com' },
    created_at: '2026-10-26T14:10:00.000Z',
    historico_auditoria: [
      { id: 'aud-022-1', data_hora: '2026-10-26T14:10:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Abertura.' },
      { id: 'aud-022-2', data_hora: '2026-10-27T08:30:00.000Z', funcionario: 'Luciana Ferreira', status_anterior: 'Em análise', novo_status: 'Em execução', motivo: 'Equipe de sucção mobilizada no trecho.' }
    ]
  },
  {
    id: 'sol-023',
    protocolo: 'ZEL-2026-0123',
    status: 'Em execução',
    categoria: 'Limpeza Urbana',
    subcategoria: 'Mutirão de Entulho',
    descricao: 'Caminhão basculante e retroescavadeira retirando entulho acumulado.',
    foto_url: fotoEntulho,
    endereco: { rua: 'Rua Treze de Maio', numero: '890', bairro: 'Bela Vista', cidade: 'São Paulo', cep: '01327-000', ponto_referencia: 'Praça Dom Orione' },
    coordenadas: { latitude: -23.558910, longitude: -46.648120 },
    cidadao: { nome: 'Beatriz Fonseca Siqueira', cpf: '319.***.***-21', telefone: '(11) 98119-4455', email: 'beatriz.siqueira@email.com' },
    created_at: '2026-10-27T11:00:00.000Z',
    historico_auditoria: [
      { id: 'aud-023-1', data_hora: '2026-10-27T11:00:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Abertura.' },
      { id: 'aud-023-2', data_hora: '2026-10-28T09:00:00.000Z', funcionario: 'Marcos Vinicius Lima', status_anterior: 'Em análise', novo_status: 'Em execução', motivo: 'Remoção mecanizada em andamento.' }
    ]
  },
  {
    id: 'sol-024',
    protocolo: 'ZEL-2026-0124',
    status: 'Em execução',
    categoria: 'Árvores e Podas',
    subcategoria: 'Remoção de Árvore Caída',
    descricao: 'Equipe de motosserra realizando corte e desobstrução de faixa.',
    foto_url: fotoBueiro,
    endereco: { rua: 'Av. Angélica', numero: '1420', bairro: 'Higienópolis', cidade: 'São Paulo', cep: '01228-100', ponto_referencia: 'Próximo à Praça Buenos Aires' },
    coordenadas: { latitude: -23.541210, longitude: -46.659120 },
    cidadao: { nome: 'Caio Roberto Esteves', cpf: '280.***.***-64', telefone: '(11) 97441-3322', email: 'caio.esteves@email.com' },
    created_at: '2026-10-27T14:30:00.000Z',
    historico_auditoria: [
      { id: 'aud-024-1', data_hora: '2026-10-27T14:30:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Abertura.' },
      { id: 'aud-024-2', data_hora: '2026-10-28T10:15:00.000Z', funcionario: 'Carlos Eduardo Silva', status_anterior: 'Em análise', novo_status: 'Em execução', motivo: 'Poda emergencial autorizada pela defesa civil.' }
    ]
  },
  {
    id: 'sol-025',
    protocolo: 'ZEL-2026-0125',
    status: 'Em execução',
    categoria: 'Iluminação Pública',
    subcategoria: 'Troca de Braço Metálico',
    descricao: 'Caminhão com cesto aéreo substituindo braço quebrado por vento.',
    foto_url: fotoBuraco,
    endereco: { rua: 'Rua Frei Caneca', numero: '720', bairro: 'Consolação', cidade: 'São Paulo', cep: '01307-001', ponto_referencia: 'Shopping Frei Caneca' },
    coordenadas: { latitude: -23.554120, longitude: -46.651230 },
    cidadao: { nome: 'Julio Cesar Magalhães', cpf: '419.***.***-38', telefone: '(11) 99110-5566', email: 'julio.magalhaes@email.com' },
    created_at: '2026-10-27T16:00:00.000Z',
    historico_auditoria: [
      { id: 'aud-025-1', data_hora: '2026-10-27T16:00:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Abertura.' },
      { id: 'aud-025-2', data_hora: '2026-10-28T11:00:00.000Z', funcionario: 'Luciana Ferreira', status_anterior: 'Em análise', novo_status: 'Em execução', motivo: 'Instalação de novo ponto de iluminação LED.' }
    ]
  },
  {
    id: 'sol-026',
    protocolo: 'ZEL-2026-0126',
    status: 'Em execução',
    categoria: 'Sinalização Viária',
    subcategoria: 'Pintura de Faixa de Pedestre',
    descricao: 'Equipe de trânsito aplicando tinta termoplástica na travessia.',
    foto_url: fotoBuraco,
    endereco: { rua: 'Rua Maria Antônia', numero: '280', bairro: 'Vila Buarque', cidade: 'São Paulo', cep: '01222-010', ponto_referencia: 'Próximo à universidade' },
    coordenadas: { latitude: -23.548910, longitude: -46.651120 },
    cidadao: { nome: 'Tatiana Gusmão Alvez', cpf: '302.***.***-95', telefone: '(11) 98334-2211', email: 'tatiana.alvez@email.com' },
    created_at: '2026-10-27T17:15:00.000Z',
    historico_auditoria: [
      { id: 'aud-026-1', data_hora: '2026-10-27T17:15:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Abertura.' },
      { id: 'aud-026-2', data_hora: '2026-10-28T12:00:00.000Z', funcionario: 'Marcos Vinicius Lima', status_anterior: 'Em análise', novo_status: 'Em execução', motivo: 'Pintura viária noturna/diurna em andamento.' }
    ]
  },
  {
    id: 'sol-027',
    protocolo: 'ZEL-2026-0127',
    status: 'Em execução',
    categoria: 'Pavimentação e Vias',
    subcategoria: 'Recapeamento de Sarjeta',
    descricao: 'Betoneira no local concretando sarjetão para escoamento.',
    foto_url: fotoBuraco,
    endereco: { rua: 'Rua Haddock Lobo', numero: '1210', bairro: 'Cerqueira César', cidade: 'São Paulo', cep: '01414-002', ponto_referencia: 'Esq. Alameda Lorena' },
    coordenadas: { latitude: -23.565120, longitude: -46.666710 },
    cidadao: { nome: 'Sergio Roberto Silveira', cpf: '120.***.***-83', telefone: '(11) 97665-1100', email: 'sergio.silveira@email.com' },
    created_at: '2026-10-27T18:00:00.000Z',
    historico_auditoria: [
      { id: 'aud-027-1', data_hora: '2026-10-27T18:00:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Abertura.' },
      { id: 'aud-027-2', data_hora: '2026-10-28T13:30:00.000Z', funcionario: 'Carlos Eduardo Silva', status_anterior: 'Em análise', novo_status: 'Em execução', motivo: 'Alvenaria de contenção hidráulica iniciada.' }
    ]
  },
  {
    id: 'sol-028',
    protocolo: 'ZEL-2026-0128',
    status: 'Em execução',
    categoria: 'Saneamento e Drenagem',
    subcategoria: 'Instalação de Nova Grelha',
    descricao: 'Soldagem de nova grelha antifurto de ferro fundido.',
    foto_url: fotoBueiro,
    endereco: { rua: 'Rua Itapeva', numero: '400', bairro: 'Bela Vista', cidade: 'São Paulo', cep: '01332-000', ponto_referencia: 'Atrás do MASP' },
    coordenadas: { latitude: -23.563120, longitude: -46.654310 },
    cidadao: { nome: 'Heloisa Paes Lemes', cpf: '234.***.***-49', telefone: '(11) 99221-8899', email: 'heloisa.lemes@email.com' },
    created_at: '2026-10-27T19:00:00.000Z',
    historico_auditoria: [
      { id: 'aud-028-1', data_hora: '2026-10-27T19:00:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Abertura.' },
      { id: 'aud-028-2', data_hora: '2026-10-28T14:00:00.000Z', funcionario: 'Luciana Ferreira', status_anterior: 'Em análise', novo_status: 'Em execução', motivo: 'Instalação física da tampa de ferro em execução.' }
    ]
  },
  {
    id: 'sol-029',
    protocolo: 'ZEL-2026-0129',
    status: 'Em execução',
    categoria: 'Limpeza Urbana',
    subcategoria: 'Varrição e Lavagem de Calçadão',
    descricao: 'Lavagem com caminhão pipa e água de reuso na praça.',
    foto_url: fotoEntulho,
    endereco: { rua: 'Praça Franklin Roosevelt', numero: '100', bairro: 'Consolação', cidade: 'São Paulo', cep: '01303-020', ponto_referencia: 'Praça Roosevelt' },
    coordenadas: { latitude: -23.549810, longitude: -46.649120 },
    cidadao: { nome: 'Marcos Vinicius Diniz', cpf: '455.***.***-07', telefone: '(11) 98774-3322', email: 'marcos.diniz@email.com' },
    created_at: '2026-10-27T20:00:00.000Z',
    historico_auditoria: [
      { id: 'aud-029-1', data_hora: '2026-10-27T20:00:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Abertura.' },
      { id: 'aud-029-2', data_hora: '2026-10-28T15:00:00.000Z', funcionario: 'Marcos Vinicius Lima', status_anterior: 'Em análise', novo_status: 'Em execução', motivo: 'Equipe de lavagem pesada de logradouros em campo.' }
    ]
  },
  {
    id: 'sol-030',
    protocolo: 'ZEL-2026-0130',
    status: 'Em execução',
    categoria: 'Pavimentação e Vias',
    subcategoria: 'Operação Tapa-Buraco',
    descricao: 'Rolo compactador compactando camada asfáltica final.',
    foto_url: fotoBuraco,
    endereco: { rua: 'Av. Brigadeiro Faria Lima', numero: '3150', bairro: 'Itaim Bibi', cidade: 'São Paulo', cep: '01451-001', ponto_referencia: 'Frente ao prédio corporativo' },
    coordenadas: { latitude: -23.582310, longitude: -46.685410 },
    cidadao: { nome: 'Fabiana Toledo Rios', cpf: '389.***.***-58', telefone: '(11) 97112-4455', email: 'fabiana.rios@email.com' },
    created_at: '2026-10-27T21:00:00.000Z',
    historico_auditoria: [
      { id: 'aud-030-1', data_hora: '2026-10-27T21:00:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Abertura.' },
      { id: 'aud-030-2', data_hora: '2026-10-28T16:00:00.000Z', funcionario: 'Carlos Eduardo Silva', status_anterior: 'Em análise', novo_status: 'Em execução', motivo: 'Aplicação de asfalto quente em ritmo acelerado.' }
    ]
  },

  // =========================================================================
  // 4. COLUNA: CONCLUÍDA (10 chamados)
  // =========================================================================
  {
    id: 'sol-031',
    protocolo: 'ZEL-2026-0131',
    status: 'Concluída',
    categoria: 'Limpeza Urbana',
    subcategoria: 'Remoção de Entulho',
    descricao: 'Remoção completa de 3 caçambas de entulho e limpeza do logradouro.',
    foto_url: fotoEntulho,
    endereco: { rua: 'Rua Bela Cintra', numero: '760', bairro: 'Consolação', cidade: 'São Paulo', cep: '01415-000', ponto_referencia: 'Praça Roosevelt' },
    coordenadas: { latitude: -23.551820, longitude: -46.652190 },
    cidadao: { nome: 'Tatiane Cristina Morais', cpf: '287.***.***-05', telefone: '(11) 98223-4556', email: 'tatiane.morais@email.com' },
    created_at: '2026-10-25T10:00:00.000Z',
    historico_auditoria: [
      { id: 'aud-031-1', data_hora: '2026-10-25T10:00:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Abertura.' },
      { id: 'aud-031-2', data_hora: '2026-10-26T16:45:00.000Z', funcionario: 'Luciana Ferreira', status_anterior: 'Em execução', novo_status: 'Concluída', motivo: 'Serviço finalizado com sucesso. Calçada totalmente desobstruída.' }
    ]
  },
  {
    id: 'sol-032',
    protocolo: 'ZEL-2026-0132',
    status: 'Concluída',
    categoria: 'Pavimentação e Vias',
    subcategoria: 'Buraco no Asfalto',
    descricao: 'Buraco tapado e asfalto nivelado pela operação tapa-buraco.',
    foto_url: fotoBuraco,
    endereco: { rua: 'Rua Oscar Freire', numero: '512', bairro: 'Cerqueira César', cidade: 'São Paulo', cep: '01426-001', ponto_referencia: 'Próximo à Haddock Lobo' },
    coordenadas: { latitude: -23.564100, longitude: -46.669890 },
    cidadao: { nome: 'Marcelo Rossi Camargo', cpf: '331.***.***-49', telefone: '(11) 97110-3344', email: 'marcelo.camargo@email.com' },
    created_at: '2026-10-24T08:20:00.000Z',
    historico_auditoria: [
      { id: 'aud-032-1', data_hora: '2026-10-24T08:20:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Abertura.' },
      { id: 'aud-032-2', data_hora: '2026-10-24T17:00:00.000Z', funcionario: 'Carlos Eduardo Silva', status_anterior: 'Em execução', novo_status: 'Concluída', motivo: 'Recapeamento localizado concluído e trânsito liberado.' }
    ]
  },
  {
    id: 'sol-033',
    protocolo: 'ZEL-2026-0133',
    status: 'Concluída',
    categoria: 'Saneamento e Drenagem',
    subcategoria: 'Limpeza de Boca de Lobo',
    descricao: 'Sucção profunda e descarte adequado de 500kg de sedimentos.',
    foto_url: fotoBueiro,
    endereco: { rua: 'Av. Paulista', numero: '2000', bairro: 'Bela Vista', cidade: 'São Paulo', cep: '01310-200', ponto_referencia: 'Frente ao Conjunto Nacional' },
    coordenadas: { latitude: -23.559810, longitude: -46.660120 },
    cidadao: { nome: 'Denise Castro Prado', cpf: '190.***.***-31', telefone: '(11) 98332-9900', email: 'denise.prado@email.com' },
    created_at: '2026-10-23T09:00:00.000Z',
    historico_auditoria: [
      { id: 'aud-033-1', data_hora: '2026-10-23T09:00:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Abertura.' },
      { id: 'aud-033-2', data_hora: '2026-10-24T15:30:00.000Z', funcionario: 'Marcos Vinicius Lima', status_anterior: 'Em execução', novo_status: 'Concluída', motivo: 'Bueiro limpo e teste de fluxo hídrico aprovado.' }
    ]
  },
  {
    id: 'sol-034',
    protocolo: 'ZEL-2026-0134',
    status: 'Concluída',
    categoria: 'Iluminação Pública',
    subcategoria: 'Troca de Luminária LED',
    descricao: 'Luminária de vapor de sódio substituída por LED 150W.',
    foto_url: fotoBuraco,
    endereco: { rua: 'Rua Augusta', numero: '1500', bairro: 'Consolação', cidade: 'São Paulo', cep: '01304-001', ponto_referencia: 'Esq. Luís Coelho' },
    coordenadas: { latitude: -23.556710, longitude: -46.660890 },
    cidadao: { nome: 'Rodrigo Mello Borges', cpf: '445.***.***-62', telefone: '(11) 99112-4433', email: 'rodrigo.borges@email.com' },
    created_at: '2026-10-23T11:00:00.000Z',
    historico_auditoria: [
      { id: 'aud-034-1', data_hora: '2026-10-23T11:00:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Abertura.' },
      { id: 'aud-034-2', data_hora: '2026-10-24T18:00:00.000Z', funcionario: 'Luciana Ferreira', status_anterior: 'Em execução', novo_status: 'Concluída', motivo: 'Iluminação restabelecida com sucesso.' }
    ]
  },
  {
    id: 'sol-035',
    protocolo: 'ZEL-2026-0135',
    status: 'Concluída',
    categoria: 'Árvores e Podas',
    subcategoria: 'Poda de Galhos Secos',
    descricao: 'Poda de desbaste e recolhimento imediato da madeira triturada.',
    foto_url: fotoBueiro,
    endereco: { rua: 'Rua Teodoro Sampaio', numero: '800', bairro: 'Pinheiros', cidade: 'São Paulo', cep: '05406-000', ponto_referencia: 'Praça dos Cavalos' },
    coordenadas: { latitude: -23.557810, longitude: -46.678910 },
    cidadao: { nome: 'Fernanda Leal Antunes', cpf: '312.***.***-90', telefone: '(11) 97445-6677', email: 'fernanda.antunes@email.com' },
    created_at: '2026-10-22T14:00:00.000Z',
    historico_auditoria: [
      { id: 'aud-035-1', data_hora: '2026-10-22T14:00:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Abertura.' },
      { id: 'aud-035-2', data_hora: '2026-10-23T16:00:00.000Z', funcionario: 'Carlos Eduardo Silva', status_anterior: 'Em execução', novo_status: 'Concluída', motivo: 'Poda finalizada e via varrida sem resíduos.' }
    ]
  },
  {
    id: 'sol-036',
    protocolo: 'ZEL-2026-0136',
    status: 'Concluída',
    categoria: 'Sinalização Viária',
    subcategoria: 'Reposição de Placa Pare',
    descricao: 'Nova chapa refletiva instalada com parafuso antivandálico.',
    foto_url: fotoBuraco,
    endereco: { rua: 'Rua da Consolação', numero: '1200', bairro: 'Consolação', cidade: 'São Paulo', cep: '01301-000', ponto_referencia: 'Esq. Dona Veridiana' },
    coordenadas: { latitude: -23.548920, longitude: -46.650120 },
    cidadao: { nome: 'Gustavo Paiva Sampaio', cpf: '201.***.***-76', telefone: '(11) 98889-1100', email: 'gustavo.sampaio@email.com' },
    created_at: '2026-10-22T16:00:00.000Z',
    historico_auditoria: [
      { id: 'aud-036-1', data_hora: '2026-10-22T16:00:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Abertura.' },
      { id: 'aud-036-2', data_hora: '2026-10-23T17:15:00.000Z', funcionario: 'Marcos Vinicius Lima', status_anterior: 'Em execução', novo_status: 'Concluída', motivo: 'Sinalização vertical regularizada.' }
    ]
  },
  {
    id: 'sol-037',
    protocolo: 'ZEL-2026-0137',
    status: 'Concluída',
    categoria: 'Pavimentação e Vias',
    subcategoria: 'Nivelamento de Tampa',
    descricao: 'Tampa de poço de visita nivelada perfeitamente com a pista.',
    foto_url: fotoBuraco,
    endereco: { rua: 'Av. Rebouças', numero: '1500', bairro: 'Pinheiros', cidade: 'São Paulo', cep: '05401-200', ponto_referencia: 'Próximo ao Hospital das Clínicas' },
    coordenadas: { latitude: -23.562110, longitude: -46.678120 },
    cidadao: { nome: 'Aline Miranda Franco', cpf: '419.***.***-83', telefone: '(11) 97110-3322', email: 'aline.franco@email.com' },
    created_at: '2026-10-21T09:00:00.000Z',
    historico_auditoria: [
      { id: 'aud-037-1', data_hora: '2026-10-21T09:00:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Abertura.' },
      { id: 'aud-037-2', data_hora: '2026-10-22T12:00:00.000Z', funcionario: 'Carlos Eduardo Silva', status_anterior: 'Em execução', novo_status: 'Concluída', motivo: 'Ajuste de cota de nivelamento finalizado.' }
    ]
  },
  {
    id: 'sol-038',
    protocolo: 'ZEL-2026-0138',
    status: 'Concluída',
    categoria: 'Limpeza Urbana',
    subcategoria: 'Remoção de Pichação',
    descricao: 'Pintura e hidrojateamento na mureta de proteção pública.',
    foto_url: fotoEntulho,
    endereco: { rua: 'Rua Bela Cintra', numero: '1900', bairro: 'Consolação', cidade: 'São Paulo', cep: '01415-002', ponto_referencia: 'Viaduto sobre a Rebouças' },
    coordenadas: { latitude: -23.561000, longitude: -46.663120 },
    cidadao: { nome: 'Wagner Silveira Couto', cpf: '302.***.***-19', telefone: '(11) 99332-8877', email: 'wagner.couto@email.com' },
    created_at: '2026-10-21T11:00:00.000Z',
    historico_auditoria: [
      { id: 'aud-038-1', data_hora: '2026-10-21T11:00:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Abertura.' },
      { id: 'aud-038-2', data_hora: '2026-10-22T14:30:00.000Z', funcionario: 'Luciana Ferreira', status_anterior: 'Em execução', novo_status: 'Concluída', motivo: 'Superfície restaurada na cor padrão institucional.' }
    ]
  },
  {
    id: 'sol-039',
    protocolo: 'ZEL-2026-0139',
    status: 'Concluída',
    categoria: 'Saneamento e Drenagem',
    subcategoria: 'Conserto de Guia Vazada',
    descricao: 'Guia pré-moldada concretada e alinhada ao meio-fio.',
    foto_url: fotoBueiro,
    endereco: { rua: 'Rua Peixoto Gomide', numero: '890', bairro: 'Jardim Paulista', cidade: 'São Paulo', cep: '01409-000', ponto_referencia: 'Próximo à Alameda Santos' },
    coordenadas: { latitude: -23.565410, longitude: -46.656120 },
    cidadao: { nome: 'Lorena Duarte Freitas', cpf: '280.***.***-44', telefone: '(11) 98443-2211', email: 'lorena.freitas@email.com' },
    created_at: '2026-10-20T14:00:00.000Z',
    historico_auditoria: [
      { id: 'aud-039-1', data_hora: '2026-10-20T14:00:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Abertura.' },
      { id: 'aud-039-2', data_hora: '2026-10-21T16:00:00.000Z', funcionario: 'Marcos Vinicius Lima', status_anterior: 'Em execução', novo_status: 'Concluída', motivo: 'Concretagem curada e serviço aprovado pela fiscalização.' }
    ]
  },
  {
    id: 'sol-040',
    protocolo: 'ZEL-2026-0140',
    status: 'Concluída',
    categoria: 'Pavimentação e Vias',
    subcategoria: 'Reparo de Asfalto em Faixa Exclusiva',
    descricao: 'Aplicação de asfalto especial de alta resistência para tráfego pesado.',
    foto_url: fotoBuraco,
    endereco: { rua: 'Av. Brigadeiro Faria Lima', numero: '1200', bairro: 'Pinheiros', cidade: 'São Paulo', cep: '01451-000', ponto_referencia: 'Largo da Batata' },
    coordenadas: { latitude: -23.569810, longitude: -46.696120 },
    cidadao: { nome: 'Thiago Furtado Luz', cpf: '198.***.***-71', telefone: '(11) 97665-0099', email: 'thiago.luz@email.com' },
    created_at: '2026-10-20T16:30:00.000Z',
    historico_auditoria: [
      { id: 'aud-040-1', data_hora: '2026-10-20T16:30:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Abertura.' },
      { id: 'aud-040-2', data_hora: '2026-10-21T18:00:00.000Z', funcionario: 'Carlos Eduardo Silva', status_anterior: 'Em execução', novo_status: 'Concluída', motivo: 'Faixa exclusiva liberada para circulação normal.' }
    ]
  },

  // =========================================================================
  // 5. COLUNA: DESCARTADA (10 chamados)
  // =========================================================================
  {
    id: 'sol-041',
    protocolo: 'ZEL-2026-0141',
    status: 'Descartada',
    categoria: 'Limpeza Urbana',
    subcategoria: 'Descarte Irregular de Entulho',
    descricao: 'Chamado em duplicidade com protocolo ZEL-0103 no mesmo número predial.',
    foto_url: fotoEntulho,
    endereco: { rua: 'Rua da Consolação', numero: '2410', bairro: 'Consolação', cidade: 'São Paulo', cep: '01302-001', ponto_referencia: 'Estação Paulista' },
    coordenadas: { latitude: -23.555230, longitude: -46.661100 },
    cidadao: { nome: 'Camila Duarte Fontes', cpf: '452.***.***-80', telefone: '(11) 98450-9011', email: 'camila.fontes@email.com' },
    created_at: '2026-10-23T11:40:00.000Z',
    historico_auditoria: [
      { id: 'aud-041-1', data_hora: '2026-10-23T11:40:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Abertura.' },
      { id: 'aud-041-2', data_hora: '2026-10-23T14:15:00.000Z', funcionario: 'Luciana Ferreira', status_anterior: 'Pendente', novo_status: 'Descartada', motivo: 'Duplicidade confirmada com protocolo ZEL-0103.' }
    ]
  },
  {
    id: 'sol-042',
    protocolo: 'ZEL-2026-0142',
    status: 'Descartada',
    categoria: 'Pavimentação e Vias',
    subcategoria: 'Buraco em Garagem Particular',
    descricao: 'Munícipe solicitou reparo em rampa privativa interna de condomínio residencial.',
    foto_url: fotoBuraco,
    endereco: { rua: 'Rua Oscar Freire', numero: '1420', bairro: 'Pinheiros', cidade: 'São Paulo', cep: '01426-002', ponto_referencia: 'Edifício Residencial' },
    coordenadas: { latitude: -23.567810, longitude: -46.674510 },
    cidadao: { nome: 'Marcio Andrade Vilela', cpf: '310.***.***-66', telefone: '(11) 99112-0088', email: 'marcio.vilela@email.com' },
    created_at: '2026-10-23T15:00:00.000Z',
    historico_auditoria: [
      { id: 'aud-042-1', data_hora: '2026-10-23T15:00:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Abertura.' },
      { id: 'aud-042-2', data_hora: '2026-10-23T16:30:00.000Z', funcionario: 'Carlos Eduardo Silva', status_anterior: 'Pendente', novo_status: 'Descartada', motivo: 'Fora do escopo público municipal. Área privada de responsabilidade condominial.' }
    ]
  },
  {
    id: 'sol-043',
    protocolo: 'ZEL-2026-0143',
    status: 'Descartada',
    categoria: 'Iluminação Pública',
    subcategoria: 'Lâmpada de Jardim Privado',
    descricao: 'Solicitação de troca de refletor de jardim interno de residência.',
    foto_url: fotoBuraco,
    endereco: { rua: 'Rua Pamplona', numero: '1780', bairro: 'Jardim Paulista', cidade: 'São Paulo', cep: '01405-003', ponto_referencia: 'Casa com portão verde' },
    coordenadas: { latitude: -23.571210, longitude: -46.658910 },
    cidadao: { nome: 'Regina Célia Prado', cpf: '228.***.***-15', telefone: '(11) 98334-7766', email: 'regina.prado@email.com' },
    created_at: '2026-10-24T10:00:00.000Z',
    historico_auditoria: [
      { id: 'aud-043-1', data_hora: '2026-10-24T10:00:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Abertura.' },
      { id: 'aud-043-2', data_hora: '2026-10-24T11:20:00.000Z', funcionario: 'Luciana Ferreira', status_anterior: 'Pendente', novo_status: 'Descartada', motivo: 'Improcedente: zeladoria municipal restringe-se a vias e logradouros públicos.' }
    ]
  },
  {
    id: 'sol-044',
    protocolo: 'ZEL-2026-0144',
    status: 'Descartada',
    categoria: 'Saneamento e Drenagem',
    subcategoria: 'Vazamento Inexistente',
    descricao: 'Vistoria presencial constatou que a poça dágua era decorrente de lavagem de calçada.',
    foto_url: fotoBueiro,
    endereco: { rua: 'Rua Bela Cintra', numero: '1120', bairro: 'Consolação', cidade: 'São Paulo', cep: '01415-001', ponto_referencia: 'Próximo à padaria' },
    coordenadas: { latitude: -23.555610, longitude: -46.658910 },
    cidadao: { nome: 'Otávio Silveira Maia', cpf: '190.***.***-42', telefone: '(11) 97554-1100', email: 'otavio.maia@email.com' },
    created_at: '2026-10-24T14:00:00.000Z',
    historico_auditoria: [
      { id: 'aud-044-1', data_hora: '2026-10-24T14:00:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Abertura.' },
      { id: 'aud-044-2', data_hora: '2026-10-25T09:00:00.000Z', funcionario: 'Marcos Vinicius Lima', status_anterior: 'Pendente', novo_status: 'Descartada', motivo: 'Vistoria in loco constatou inexistência de vazamento na rede pública.' }
    ]
  },
  {
    id: 'sol-045',
    protocolo: 'ZEL-2026-0145',
    status: 'Descartada',
    categoria: 'Árvores e Podas',
    subcategoria: 'Poda em Rodovia Estadual',
    descricao: 'Vegetação em acostamento de trecho sob concessão estadual.',
    foto_url: fotoBueiro,
    endereco: { rua: 'Rodovia Raposo Tavares', numero: 'KM 12', bairro: 'Butantã', cidade: 'São Paulo', cep: '05576-000', ponto_referencia: 'Acostamento km 12' },
    coordenadas: { latitude: -23.578910, longitude: -46.721230 },
    cidadao: { nome: 'Carla Beatriz Ribeiro', cpf: '341.***.***-79', telefone: '(11) 98877-2233', email: 'carla.ribeiro@email.com' },
    created_at: '2026-10-25T11:00:00.000Z',
    historico_auditoria: [
      { id: 'aud-045-1', data_hora: '2026-10-25T11:00:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Abertura.' },
      { id: 'aud-045-2', data_hora: '2026-10-25T13:30:00.000Z', funcionario: 'Carlos Eduardo Silva', status_anterior: 'Pendente', novo_status: 'Descartada', motivo: 'Competência da concessionária estadual da rodovia, fora da jurisdição municipal.' }
    ]
  },
  {
    id: 'sol-046',
    protocolo: 'ZEL-2026-0146',
    status: 'Descartada',
    categoria: 'Pavimentação e Vias',
    subcategoria: 'Informação Insuficiente',
    descricao: 'Endereço cadastrado não existe no cadastro oficial e foto sem referências.',
    foto_url: fotoBuraco,
    endereco: { rua: 'Rua Desconhecida', numero: 'S/N', bairro: 'Centro', cidade: 'São Paulo', cep: '01000-000', ponto_referencia: 'Perto de uma esquina' },
    coordenadas: { latitude: -23.550120, longitude: -46.633410 },
    cidadao: { nome: 'Lucas Alencar Viana', cpf: '409.***.***-20', telefone: '(11) 97112-9900', email: 'lucas.viana@email.com' },
    created_at: '2026-10-25T15:00:00.000Z',
    historico_auditoria: [
      { id: 'aud-046-1', data_hora: '2026-10-25T15:00:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Abertura.' },
      { id: 'aud-046-2', data_hora: '2026-10-26T10:00:00.000Z', funcionario: 'Luciana Ferreira', status_anterior: 'Pendente', novo_status: 'Descartada', motivo: 'Localização geográfica e endereço impossíveis de identificar.' }
    ]
  },
  {
    id: 'sol-047',
    protocolo: 'ZEL-2026-0147',
    status: 'Descartada',
    categoria: 'Limpeza Urbana',
    subcategoria: 'Duplicidade de Protocolo',
    descricao: 'Terceiro reporte do mesmo bueiro na Rua Augusta.',
    foto_url: fotoBueiro,
    endereco: { rua: 'Rua Augusta', numero: '920', bairro: 'Consolação', cidade: 'São Paulo', cep: '01304-001', ponto_referencia: 'Esq. Fernando de Albuquerque' },
    coordenadas: { latitude: -23.553924, longitude: -46.657012 },
    cidadao: { nome: 'Sergio Nogueira Pinto', cpf: '277.***.***-81', telefone: '(11) 99443-7788', email: 'sergio.pinto@email.com' },
    created_at: '2026-10-26T08:00:00.000Z',
    historico_auditoria: [
      { id: 'aud-047-1', data_hora: '2026-10-26T08:00:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Abertura.' },
      { id: 'aud-047-2', data_hora: '2026-10-26T09:30:00.000Z', funcionario: 'Carlos Eduardo Silva', status_anterior: 'Pendente', novo_status: 'Descartada', motivo: 'Protocolo duplicado apensado ao registro ZEL-0102.' }
    ]
  },
  {
    id: 'sol-048',
    protocolo: 'ZEL-2026-0148',
    status: 'Descartada',
    categoria: 'Sinalização Viária',
    subcategoria: 'Placa em Estacionamento Privado',
    descricao: 'Demarcação de vaga em shopping center.',
    foto_url: fotoBuraco,
    endereco: { rua: 'Av. Paulista', numero: '1230', bairro: 'Bela Vista', cidade: 'São Paulo', cep: '01310-100', ponto_referencia: 'Subsolo do shopping' },
    coordenadas: { latitude: -23.564510, longitude: -46.652120 },
    cidadao: { nome: 'Patricia Mendes Prado', cpf: '301.***.***-70', telefone: '(11) 99221-5544', email: 'patricia.prado@email.com' },
    created_at: '2026-10-26T11:00:00.000Z',
    historico_auditoria: [
      { id: 'aud-048-1', data_hora: '2026-10-26T11:00:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Abertura.' },
      { id: 'aud-048-2', data_hora: '2026-10-26T14:00:00.000Z', funcionario: 'Marcos Vinicius Lima', status_anterior: 'Pendente', novo_status: 'Descartada', motivo: 'Área privada sem jurisdição da fiscalização municipal de trânsito.' }
    ]
  },
  {
    id: 'sol-049',
    protocolo: 'ZEL-2026-0149',
    status: 'Descartada',
    categoria: 'Pavimentação e Vias',
    subcategoria: 'Obra Já Programada em Cronograma',
    descricao: 'Recapeamento completo da avenida já licitado sob contrato geral.',
    foto_url: fotoBuraco,
    endereco: { rua: 'Av. Brigadeiro Faria Lima', numero: '4000', bairro: 'Itaim Bibi', cidade: 'São Paulo', cep: '01451-002', ponto_referencia: 'Cruzamento com Av. JK' },
    coordenadas: { latitude: -23.587810, longitude: -46.681230 },
    cidadao: { nome: 'Eduardo Martins Costa', cpf: '445.***.***-23', telefone: '(11) 97112-8899', email: 'eduardo.costa@email.com' },
    created_at: '2026-10-26T15:00:00.000Z',
    historico_auditoria: [
      { id: 'aud-049-1', data_hora: '2026-10-26T15:00:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Abertura.' },
      { id: 'aud-049-2', data_hora: '2026-10-26T17:00:00.000Z', funcionario: 'Carlos Eduardo Silva', status_anterior: 'Pendente', novo_status: 'Descartada', motivo: 'Trecho integrado ao pacote de recapeamento estrutural contratado.' }
    ]
  },
  {
    id: 'sol-050',
    protocolo: 'ZEL-2026-0150',
    status: 'Descartada',
    categoria: 'Árvores e Podas',
    subcategoria: 'Vaso de Planta em Sacada',
    descricao: 'Planta de sacada de apartamento vizinho com galhos caindo.',
    foto_url: fotoBueiro,
    endereco: { rua: 'Rua Bela Cintra', numero: '2100', bairro: 'Consolação', cidade: 'São Paulo', cep: '01415-003', ponto_referencia: 'Edifício residencial' },
    coordenadas: { latitude: -23.562310, longitude: -46.664510 },
    cidadao: { nome: 'Camila Pires Vieira', cpf: '228.***.***-54', telefone: '(11) 98877-3344', email: 'camila.vieira@email.com' },
    created_at: '2026-10-26T18:00:00.000Z',
    historico_auditoria: [
      { id: 'aud-050-1', data_hora: '2026-10-26T18:00:00.000Z', funcionario: 'Sistema Automático ZELUS', status_anterior: 'Novo', novo_status: 'Pendente', motivo: 'Abertura.' },
      { id: 'aud-050-2', data_hora: '2026-10-27T09:00:00.000Z', funcionario: 'Luciana Ferreira', status_anterior: 'Pendente', novo_status: 'Descartada', motivo: 'Conflito de vizinhança particular. Sem pertinência com arborização urbana.' }
    ]
  }
];

/**
 * As 5 colunas estritas do fluxo Kanban
 * Cores Pastéis Obrigatórias para os Cartões:
 * - Pendente: #EDE194
 * - Em análise: #BCDCF4
 * - Em execução: #F9B188
 * - Concluída: #D4E4BC
 * - Descartada: #ECC4BC
 */
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
