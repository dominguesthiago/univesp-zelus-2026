import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import CadastroPrefeitura from '../pages/CadastroPrefeitura';
import * as api from '../services/api';

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('Página CadastroPrefeitura (/cadastro/prefeitura)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve renderizar campos Nome, CPF, Senha e Chave Administrativa', () => {
    render(
      <MemoryRouter>
        <CadastroPrefeitura />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Nome Completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/CPF do Servidor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Senha \(mínimo 6 caracteres\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Chave Administrativa/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Concluir cadastro de servidor público/i })
    ).toBeInTheDocument();
  });

  test('deve renderizar a estrutura de duas colunas com banner institucional e badge de segurança', () => {
    const { container } = render(
      <MemoryRouter>
        <CadastroPrefeitura />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Novo Acesso Administrativo/i })).toBeInTheDocument();
    expect(screen.getByText(/Ambiente restrito e monitorado/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Cadastrar servidor/i })).toBeInTheDocument();
    expect(container.querySelector('.cadastro-prefeitura-card')).toBeInTheDocument();
    expect(container.querySelector('.cadastro-prefeitura-form__grid')).toBeInTheDocument();
  });

  test('não deve conter botão ou link de voltar redundante no interior do cartão', () => {
    render(
      <MemoryRouter>
        <CadastroPrefeitura />
      </MemoryRouter>
    );

    expect(screen.queryByRole('link', { name: /^Voltar$/i })).not.toBeInTheDocument();
  });

  test('deve alternar a visibilidade da senha ao clicar no botão de olho', () => {
    render(
      <MemoryRouter>
        <CadastroPrefeitura />
      </MemoryRouter>
    );

    const inputSenha = screen.getByLabelText(/Senha \(mínimo 6 caracteres\)/i);
    const btnToggle = screen.getByLabelText(/Exibir senha/i);

    expect(inputSenha).toHaveAttribute('type', 'password');

    fireEvent.click(btnToggle);
    expect(inputSenha).toHaveAttribute('type', 'text');

    fireEvent.click(screen.getByLabelText(/Ocultar senha/i));
    expect(inputSenha).toHaveAttribute('type', 'password');
  });

  test('deve alternar a visibilidade da chave administrativa ao clicar no botão de olho', () => {
    render(
      <MemoryRouter>
        <CadastroPrefeitura />
      </MemoryRouter>
    );

    const inputChave = screen.getByLabelText(/Chave Administrativa/i);
    const btnToggle = screen.getByLabelText(/Exibir chave/i);

    expect(inputChave).toHaveAttribute('type', 'password');

    fireEvent.click(btnToggle);
    expect(inputChave).toHaveAttribute('type', 'text');

    fireEvent.click(screen.getByLabelText(/Ocultar chave/i));
    expect(inputChave).toHaveAttribute('type', 'password');
  });

  test('deve barrar submissão se a Chave Administrativa não for preenchida', async () => {
    render(
      <MemoryRouter>
        <CadastroPrefeitura />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Nome Completo/i), {
      target: { value: 'Carlos Silva' },
    });
    fireEvent.change(screen.getByLabelText(/CPF do Servidor/i), {
      target: { value: '11122233344' },
    });
    fireEvent.change(screen.getByLabelText(/Senha \(mínimo 6 caracteres\)/i), {
      target: { value: 'senhaForte123' },
    });

    fireEvent.click(
      screen.getByRole('button', { name: /Concluir cadastro de servidor público/i })
    );

    expect(
      await screen.findByText(/A Chave de Acesso Administrativa é obrigatória\./i)
    ).toBeInTheDocument();
  });

  test('deve realizar cadastro com sucesso e redirecionar para login', async () => {
    jest.spyOn(api, 'cadastrarPrefeitura').mockResolvedValueOnce({
      sucesso: true,
      mensagem: 'Servidor cadastrado com sucesso!',
    });

    render(
      <MemoryRouter>
        <CadastroPrefeitura />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Nome Completo/i), {
      target: { value: 'Mariana Costa' },
    });
    fireEvent.change(screen.getByLabelText(/CPF do Servidor/i), {
      target: { value: '98765432100' },
    });
    fireEvent.change(screen.getByLabelText(/Senha \(mínimo 6 caracteres\)/i), {
      target: { value: 'minhaSenha123' },
    });
    fireEvent.change(screen.getByLabelText(/Chave Administrativa/i), {
      target: { value: 'ZELUS-ADM-2026' },
    });

    fireEvent.click(
      screen.getByRole('button', { name: /Concluir cadastro de servidor público/i })
    );

    await waitFor(() => {
      expect(api.cadastrarPrefeitura).toHaveBeenCalledWith({
        nomeCompleto: 'Mariana Costa',
        cpf: '98765432100',
        senha: 'minhaSenha123',
        chaveAdministrativa: 'ZELUS-ADM-2026',
      });
      expect(mockedNavigate).toHaveBeenCalledWith('/login/prefeitura', {
        state: expect.objectContaining({
          mensagemSucesso: expect.stringMatching(/Servidor cadastrado com sucesso/i),
        }),
      });
    });
  });

  test('deve exibir erro caso a API recuse a Chave Administrativa', async () => {
    jest.spyOn(api, 'cadastrarPrefeitura').mockRejectedValueOnce(
      new Error('Chave administrativa incorreta. Cadastro restrito a servidores autorizados.')
    );

    render(
      <MemoryRouter>
        <CadastroPrefeitura />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Nome Completo/i), {
      target: { value: 'Mariana Costa' },
    });
    fireEvent.change(screen.getByLabelText(/CPF do Servidor/i), {
      target: { value: '98765432100' },
    });
    fireEvent.change(screen.getByLabelText(/Senha \(mínimo 6 caracteres\)/i), {
      target: { value: 'minhaSenha123' },
    });
    fireEvent.change(screen.getByLabelText(/Chave Administrativa/i), {
      target: { value: 'CHAVE_ERRADA' },
    });

    fireEvent.click(
      screen.getByRole('button', { name: /Concluir cadastro de servidor público/i })
    );

    expect(
      await screen.findByText(/Chave administrativa incorreta/i)
    ).toBeInTheDocument();
  });

  test('deve exibir erro caso o CPF já esteja cadastrado na API (409)', async () => {
    jest.spyOn(api, 'cadastrarPrefeitura').mockRejectedValueOnce(
      new Error('Este CPF já está cadastrado no sistema municipal.')
    );

    render(
      <MemoryRouter>
        <CadastroPrefeitura />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Nome Completo/i), {
      target: { value: 'Mariana Costa' },
    });
    fireEvent.change(screen.getByLabelText(/CPF do Servidor/i), {
      target: { value: '98765432100' },
    });
    fireEvent.change(screen.getByLabelText(/Senha \(mínimo 6 caracteres\)/i), {
      target: { value: 'minhaSenha123' },
    });
    fireEvent.change(screen.getByLabelText(/Chave Administrativa/i), {
      target: { value: 'ZELUS-ADM-2026' },
    });

    fireEvent.click(
      screen.getByRole('button', { name: /Concluir cadastro de servidor público/i })
    );

    expect(
      await screen.findByText(/Este CPF já está cadastrado no sistema municipal/i)
    ).toBeInTheDocument();
  });
});
