import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import LoginPrefeitura from '../pages/LoginPrefeitura';
import * as api from '../services/api';

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('Página LoginPrefeitura (/login/prefeitura)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('deve renderizar campos de CPF com máscara, Senha, links de recuperação e cadastro', () => {
    render(
      <MemoryRouter>
        <LoginPrefeitura />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/CPF do Servidor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Senha$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Acessar o painel da prefeitura/i })).toBeInTheDocument();

    const linkEsqueci = screen.getByRole('link', { name: /Esqueci minha senha/i });
    expect(linkEsqueci).toHaveAttribute('href', '/esqueci-senha/prefeitura');

    const linkCadastro = screen.getByRole('link', { name: /Cadastrar novo acesso/i });
    expect(linkCadastro).toHaveAttribute('href', '/cadastro/prefeitura');
  });

  test('deve renderizar a estrutura de duas colunas com banner institucional e badge de segurança', () => {
    const { container } = render(
      <MemoryRouter>
        <LoginPrefeitura />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Acesso do Servidor Municipal/i })).toBeInTheDocument();
    expect(screen.getByText(/Ambiente restrito e monitorado/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Entrar com credenciais/i })).toBeInTheDocument();
    expect(container.querySelector('.login-prefeitura-card')).toBeInTheDocument();
    expect(container.querySelector('.login-prefeitura-card__banner')).toBeInTheDocument();
    expect(container.querySelector('.login-prefeitura-card__form-col')).toBeInTheDocument();
  });

  test('não deve conter botão ou link de voltar redundante no interior do cartão', () => {
    render(
      <MemoryRouter>
        <LoginPrefeitura />
      </MemoryRouter>
    );

    expect(screen.queryByRole('link', { name: /^Voltar$/i })).not.toBeInTheDocument();
  });

  test('deve aplicar máscara ao digitar CPF', () => {
    render(
      <MemoryRouter>
        <LoginPrefeitura />
      </MemoryRouter>
    );

    const inputCpf = screen.getByLabelText(/CPF do Servidor/i);
    fireEvent.change(inputCpf, { target: { value: '12345678901' } });

    expect(inputCpf.value).toBe('123.456.789-01');
  });

  test('deve alternar a visibilidade da senha ao clicar no botão de olho', () => {
    render(
      <MemoryRouter>
        <LoginPrefeitura />
      </MemoryRouter>
    );

    const inputSenha = screen.getByLabelText(/^Senha$/i);
    const btnToggle = screen.getByLabelText(/Exibir senha/i);

    expect(inputSenha).toHaveAttribute('type', 'password');

    fireEvent.click(btnToggle);
    expect(inputSenha).toHaveAttribute('type', 'text');

    fireEvent.click(btnToggle);
    expect(inputSenha).toHaveAttribute('type', 'password');
  });

  test('deve exibir mensagem de erro se CPF for inválido no envio', async () => {
    render(
      <MemoryRouter>
        <LoginPrefeitura />
      </MemoryRouter>
    );

    const inputCpf = screen.getByLabelText(/CPF do Servidor/i);
    fireEvent.change(inputCpf, { target: { value: '123' } });

    const btnSubmit = screen.getByRole('button', { name: /Acessar o painel da prefeitura/i });
    fireEvent.click(btnSubmit);

    expect(await screen.findByText(/Informe um CPF válido com 11 dígitos\./i)).toBeInTheDocument();
  });

  test('deve realizar login com sucesso e navegar para o painel', async () => {
    jest.spyOn(api, 'loginFuncionario').mockResolvedValueOnce({
      sucesso: true,
      token: 'jwt-admin-token-123',
      dados: { id: 'func-1', nome_completo: 'Servidor Municipal' },
    });

    render(
      <MemoryRouter>
        <LoginPrefeitura />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/CPF do Servidor/i), {
      target: { value: '11122233344' },
    });
    fireEvent.change(screen.getByLabelText(/^Senha$/i), {
      target: { value: 'senhaForte123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Acessar o painel da prefeitura/i }));

    await waitFor(() => {
      expect(api.loginFuncionario).toHaveBeenCalledWith({
        cpf: '11122233344',
        senha: 'senhaForte123',
      });
      expect(localStorage.getItem('zelus_admin_token')).toBe('jwt-admin-token-123');
      expect(mockedNavigate).toHaveBeenCalledWith('/prefeitura/painel');
    });
  });

  test('deve exibir erro da API caso as credenciais sejam recusadas', async () => {
    jest.spyOn(api, 'loginFuncionario').mockRejectedValueOnce(
      new Error('Credenciais de servidor inválidas.')
    );

    render(
      <MemoryRouter>
        <LoginPrefeitura />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/CPF do Servidor/i), {
      target: { value: '11122233344' },
    });
    fireEvent.change(screen.getByLabelText(/^Senha$/i), {
      target: { value: 'senhaErrada' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Acessar o painel da prefeitura/i }));

    expect(await screen.findByText(/Credenciais de servidor inválidas\./i)).toBeInTheDocument();
  });
});
