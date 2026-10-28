import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import RecuperarSenhaPrefeitura from '../pages/RecuperarSenhaPrefeitura';
import * as api from '../services/api';

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('Página RecuperarSenhaPrefeitura (/esqueci-senha/prefeitura)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve renderizar campos CPF, Nova Senha e Chave de Acesso Administrativa', () => {
    render(
      <MemoryRouter>
        <RecuperarSenhaPrefeitura />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/CPF do Servidor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nova Senha \(mínimo 6 caracteres\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Chave de Acesso Administrativa/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Confirmar alteração de senha do servidor/i })
    ).toBeInTheDocument();
  });

  test('deve renderizar a estrutura de duas colunas com banner institucional e badge de segurança', () => {
    const { container } = render(
      <MemoryRouter>
        <RecuperarSenhaPrefeitura />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Recuperação de Senha/i })).toBeInTheDocument();
    expect(screen.getByText(/Ambiente restrito e monitorado/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Redefinir credenciais/i })).toBeInTheDocument();
    expect(container.querySelector('.recuperar-prefeitura-card')).toBeInTheDocument();
    expect(container.querySelector('.recuperar-prefeitura-card__banner')).toBeInTheDocument();
    expect(container.querySelector('.recuperar-prefeitura-card__form-col')).toBeInTheDocument();
  });

  test('não deve conter botão ou link de voltar redundante no interior do banner', () => {
    render(
      <MemoryRouter>
        <RecuperarSenhaPrefeitura />
      </MemoryRouter>
    );

    expect(screen.queryByRole('link', { name: /^Voltar$/i })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Voltar para o login/i })).toBeInTheDocument();
  });

  test('deve alternar a visibilidade da nova senha ao clicar no botão de olho', () => {
    render(
      <MemoryRouter>
        <RecuperarSenhaPrefeitura />
      </MemoryRouter>
    );

    const inputSenha = screen.getByLabelText(/Nova Senha \(mínimo 6 caracteres\)/i);
    const btnToggle = screen.getByLabelText(/Exibir senha/i);

    expect(inputSenha).toHaveAttribute('type', 'password');

    fireEvent.click(btnToggle);
    expect(inputSenha).toHaveAttribute('type', 'text');

    fireEvent.click(screen.getByLabelText(/Ocultar senha/i));
    expect(inputSenha).toHaveAttribute('type', 'password');
  });

  test('deve alternar a visibilidade da chave de acesso ao clicar no botão de olho', () => {
    render(
      <MemoryRouter>
        <RecuperarSenhaPrefeitura />
      </MemoryRouter>
    );

    const inputChave = screen.getByLabelText(/Chave de Acesso Administrativa/i);
    const btnToggle = screen.getByLabelText(/Exibir chave/i);

    expect(inputChave).toHaveAttribute('type', 'password');

    fireEvent.click(btnToggle);
    expect(inputChave).toHaveAttribute('type', 'text');

    fireEvent.click(screen.getByLabelText(/Ocultar chave/i));
    expect(inputChave).toHaveAttribute('type', 'password');
  });

  test('deve exigir Chave de Acesso Administrativa para redefinir a senha', async () => {
    render(
      <MemoryRouter>
        <RecuperarSenhaPrefeitura />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/CPF do Servidor/i), {
      target: { value: '11122233344' },
    });
    fireEvent.change(screen.getByLabelText(/Nova Senha \(mínimo 6 caracteres\)/i), {
      target: { value: 'novaSenha123' },
    });

    fireEvent.click(
      screen.getByRole('button', { name: /Confirmar alteração de senha do servidor/i })
    );

    expect(
      await screen.findByText(/A Chave de Acesso Administrativa é obrigatória\./i)
    ).toBeInTheDocument();
  });

  test('deve redefinir senha com sucesso e redirecionar para o login', async () => {
    jest.spyOn(api, 'redefinirSenhaFuncionario').mockResolvedValueOnce({
      sucesso: true,
      mensagem: 'Senha redefinida com sucesso!',
    });

    render(
      <MemoryRouter>
        <RecuperarSenhaPrefeitura />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/CPF do Servidor/i), {
      target: { value: '11122233344' },
    });
    fireEvent.change(screen.getByLabelText(/Nova Senha \(mínimo 6 caracteres\)/i), {
      target: { value: 'novaSenha123' },
    });
    fireEvent.change(screen.getByLabelText(/Chave de Acesso Administrativa/i), {
      target: { value: 'ZELUS-ADM-2026' },
    });

    fireEvent.click(
      screen.getByRole('button', { name: /Confirmar alteração de senha do servidor/i })
    );

    await waitFor(() => {
      expect(api.redefinirSenhaFuncionario).toHaveBeenCalledWith({
        cpf: '11122233344',
        nova_senha: 'novaSenha123',
        chave_acesso: 'ZELUS-ADM-2026',
      });
      expect(mockedNavigate).toHaveBeenCalledWith('/login/prefeitura', {
        state: expect.objectContaining({
          mensagemSucesso: expect.stringMatching(/Senha redefinida com sucesso/i),
        }),
      });
    });
  });

  test('deve exibir mensagem de erro caso o servidor não seja encontrado', async () => {
    jest.spyOn(api, 'redefinirSenhaFuncionario').mockRejectedValueOnce(
      new Error('Servidor não localizado com o CPF informado.')
    );

    render(
      <MemoryRouter>
        <RecuperarSenhaPrefeitura />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/CPF do Servidor/i), {
      target: { value: '00011122233' },
    });
    fireEvent.change(screen.getByLabelText(/Nova Senha \(mínimo 6 caracteres\)/i), {
      target: { value: 'novaSenha123' },
    });
    fireEvent.change(screen.getByLabelText(/Chave de Acesso Administrativa/i), {
      target: { value: 'ZELUS-ADM-2026' },
    });

    fireEvent.click(
      screen.getByRole('button', { name: /Confirmar alteração de senha do servidor/i })
    );

    expect(
      await screen.findByText(/Servidor não localizado com o CPF informado\./i)
    ).toBeInTheDocument();
  });
});
