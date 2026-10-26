import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';

/**
 * Componente de Guarda de Rota (Route Guard / Protected Route)
 * Intercepta acessos a rotas restritas do cidadão:
 * - Se o 'zelus_token' estiver presente no localStorage, renderiza os filhos (children) ou <Outlet />.
 * - Se ausente (usuário anônimo), interrompe a renderização e redireciona para o login.
 *
 * @param {Object} props
 * @param {React.ReactNode} [props.children] - Componente filho a ser protegido
 * @returns {JSX.Element}
 */
const PrivateRoute = ({ children }) => {
  const location = useLocation();

  // 1. Verificação segura da existência do token JWT
  const token =
    typeof window !== 'undefined' && window.localStorage
      ? localStorage.getItem('zelus_token')
      : null;

  // 2. Se não autenticado, redireciona para a tela de login preservando a rota de origem
  if (!token) {
    return <Navigate to="/login/cidadao" replace state={{ from: location }} />;
  }

  // 3. Se autenticado, renderiza o conteúdo filho (ou Outlet para rotas aninhadas)
  return children ? children : <Outlet />;
};

export default PrivateRoute;
