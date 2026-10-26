import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';

// Componente espião para validar a recepção do state `from`
const LoginSpy = () => {
  const location = useLocation();
  return (
    <div>
      <span>Tela de Login</span>
      <span data-testid="origem-redirect">
        {location.state?.from?.pathname || 'sem-origem'}
      </span>
    </div>
  );
};

const renderComRoteamento = ({ rotaInicial = '/rota-privada', token = null }) => {
  if (token) {
    localStorage.setItem('zelus_token', token);
  } else {
    localStorage.clear();
  }

  return render(
    <MemoryRouter initialEntries={[rotaInicial]}>
      <Routes>
        <Route path="/login/cidadao" element={<LoginSpy />} />
        <Route
          path="/rota-privada"
          element={
            <PrivateRoute>
              <div data-testid="conteudo-protegido">Conteúdo Exclusivo do Cidadão</div>
            </PrivateRoute>
          }
        />
        <Route
          path="/solicitacao/etapa-1"
          element={
            <PrivateRoute>
              <div data-testid="conteudo-solicitacao">Etapa 1 da Solicitação</div>
            </PrivateRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );
};

describe('Componente de Guarda de Segurança (PrivateRoute.jsx)', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('CT-SEC.1: deve renderizar o conteúdo protegido (children) quando o zelus_token estiver presente', () => {
    renderComRoteamento({
      rotaInicial: '/rota-privada',
      token: 'jwt-valido-123',
    });

    expect(screen.getByTestId('conteudo-protegido')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo Exclusivo do Cidadão')).toBeInTheDocument();
    expect(screen.queryByText('Tela de Login')).not.toBeInTheDocument();
  });

  test('CT-SEC.2: deve barrar e redirecionar usuário anônimo para /login/cidadao quando zelus_token não existir', () => {
    renderComRoteamento({
      rotaInicial: '/rota-privada',
      token: null,
    });

    // O conteúdo privado não pode ser montado/renderizado
    expect(screen.queryByTestId('conteudo-protegido')).not.toBeInTheDocument();
    // A tela de login deve ser exibida
    expect(screen.getByText('Tela de Login')).toBeInTheDocument();
  });

  test('CT-SEC.3: deve repassar a rota de origem no state de navegação para possibilitar retorno pós-login', () => {
    renderComRoteamento({
      rotaInicial: '/solicitacao/etapa-1',
      token: null,
    });

    expect(screen.getByTestId('origem-redirect')).toHaveTextContent('/solicitacao/etapa-1');
  });

  test('CT-SEC.4: deve proteger adequadamente quando o token for removido dinamicamente', () => {
    localStorage.removeItem('zelus_token');

    renderComRoteamento({
      rotaInicial: '/rota-privada',
      token: null,
    });

    expect(screen.queryByTestId('conteudo-protegido')).not.toBeInTheDocument();
    expect(screen.getByText('Tela de Login')).toBeInTheDocument();
  });
});
