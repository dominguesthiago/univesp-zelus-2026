import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import RecuperarSenhaCidadao from '../pages/RecuperarSenhaCidadao';
import { redefinirSenhaCidadao } from '../services/api';

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

jest.mock('../services/api', () => ({
  redefinirSenhaCidadao: jest.fn(),
}));

const renderRecuperarSenha = () => {
  return render(
    <MemoryRouter initialEntries={['/recuperar-senha/cidadao']}>
      <RecuperarSenhaCidadao />
    </MemoryRouter>
  );
};

describe('Página de Recuperação de Senha do Cidadão (RecuperarSenhaCidadao)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    redefinirSenhaCidadao.mockResolvedValue({
      sucesso: true,
      mensagem: 'Senha redefinida com sucesso!',
    });
  });

  test('deve renderizar a estrutura semântica principal com landmark <main> e título <h1>', () => {
    const { container } = renderRecuperarSenha();

    const mainElement = container.querySelector('main#conteudo-principal');
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveClass('recuperar-main-container');

    const heading = screen.getByRole('heading', { level: 1, name: /Recuperar Senha/i });
    expect(heading).toBeInTheDocument();
  });

  test('deve renderizar o aviso acadêmico amigável com role="note"', () => {
    renderRecuperarSenha();

    const avisoNote = screen.getByRole('note');
    expect(avisoNote).toBeInTheDocument();
    expect(avisoNote).toHaveTextContent(
      'Ambiente Acadêmico: Como não há envio real de e-mails, confirme seus dados abaixo para redefinir sua senha de forma segura.'
    );
  });

  test('deve renderizar o formulário semântico com aria-labelledby associado ao título', () => {
    const { container } = renderRecuperarSenha();

    const formElement = container.querySelector('form.recuperar-form');
    expect(formElement).toBeInTheDocument();
    expect(formElement).toHaveAttribute('aria-labelledby', 'recuperar-heading');
  });

  test('deve disponibilizar os 3 campos (CPF, E-mail, Nova Senha) associados aos seus respectivos <label>', () => {
    renderRecuperarSenha();

    // 1. CPF
    const cpfLabel = screen.getByText(/CPF \(apenas números\)/i);
    expect(cpfLabel).toBeInTheDocument();
    expect(cpfLabel).toHaveAttribute('for', 'recuperar-cpf');

    const cpfInput = screen.getByLabelText(/CPF \(apenas números\)/i);
    expect(cpfInput).toBeInTheDocument();
    expect(cpfInput).toHaveAttribute('id', 'recuperar-cpf');
    expect(cpfInput).toHaveAttribute('type', 'text');
    expect(cpfInput).toHaveAttribute('inputmode', 'numeric');
    expect(cpfInput).toBeRequired();

    // 2. E-mail
    const emailLabel = screen.getByText(/^E-mail$/i);
    expect(emailLabel).toBeInTheDocument();
    expect(emailLabel).toHaveAttribute('for', 'recuperar-email');

    const emailInput = screen.getByLabelText(/^E-mail$/i);
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('id', 'recuperar-email');
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('inputmode', 'email');
    expect(emailInput).toBeRequired();

    // 3. Nova Senha
    const senhaLabel = screen.getByText(/^Nova Senha$/i);
    expect(senhaLabel).toBeInTheDocument();
    expect(senhaLabel).toHaveAttribute('for', 'recuperar-senha');

    const senhaInput = screen.getByLabelText(/^Nova Senha$/i);
    expect(senhaInput).toBeInTheDocument();
    expect(senhaInput).toHaveAttribute('id', 'recuperar-senha');
    expect(senhaInput).toHaveAttribute('type', 'password');
    expect(senhaInput).toBeRequired();
  });

  test('deve aplicar máscara ao digitar CPF numérico no input', () => {
    renderRecuperarSenha();

    const cpfInput = screen.getByLabelText(/CPF \(apenas números\)/i);
    fireEvent.change(cpfInput, { target: { value: '12345678901' } });

    expect(cpfInput.value).toBe('123.456.789-01');
  });

  test('deve alternar a visibilidade da nova senha e atualizar os atributos ARIA acessíveis', () => {
    renderRecuperarSenha();

    const senhaInput = screen.getByLabelText(/^Nova Senha$/i);
    const toggleButton = screen.getByRole('button', { name: /Exibir senha/i });

    expect(senhaInput).toHaveAttribute('type', 'password');
    expect(toggleButton).toHaveAttribute('aria-label', 'Exibir senha');
    expect(toggleButton).toHaveAttribute('aria-pressed', 'false');

    // Clica para exibir
    fireEvent.click(toggleButton);
    expect(senhaInput).toHaveAttribute('type', 'text');
    expect(toggleButton).toHaveAttribute('aria-label', 'Ocultar senha');
    expect(toggleButton).toHaveAttribute('aria-pressed', 'true');

    // Clica para ocultar novamente
    fireEvent.click(toggleButton);
    expect(senhaInput).toHaveAttribute('type', 'password');
    expect(toggleButton).toHaveAttribute('aria-label', 'Exibir senha');
    expect(toggleButton).toHaveAttribute('aria-pressed', 'false');
  });

  test('deve validar regra do CPF: exigir 14 caracteres com a máscara', () => {
    renderRecuperarSenha();

    const cpfInput = screen.getByLabelText(/CPF \(apenas números\)/i);
    const submitButton = screen.getByRole('button', { name: /Redefinir senha da conta do cidadão/i });

    fireEvent.change(cpfInput, { target: { value: '123456' } });
    fireEvent.click(submitButton);

    const erroCpf = document.getElementById('erro-recuperar-cpf');
    expect(erroCpf).toBeInTheDocument();
    expect(erroCpf).toHaveTextContent('O CPF deve estar totalmente preenchido com 14 caracteres.');
    expect(redefinirSenhaCidadao).not.toHaveBeenCalled();
  });

  test('deve validar regra do E-mail: exigir formato padrão com @ e domínio', () => {
    renderRecuperarSenha();

    const cpfInput = screen.getByLabelText(/CPF \(apenas números\)/i);
    const emailInput = screen.getByLabelText(/^E-mail$/i);
    const submitButton = screen.getByRole('button', { name: /Redefinir senha da conta do cidadão/i });

    fireEvent.change(cpfInput, { target: { value: '12345678901' } });
    fireEvent.change(emailInput, { target: { value: 'emailinvalido' } });
    fireEvent.click(submitButton);

    const erroEmail = document.getElementById('erro-recuperar-email');
    expect(erroEmail).toBeInTheDocument();
    expect(erroEmail).toHaveTextContent('Informe um e-mail válido contendo @ e domínio.');
    expect(redefinirSenhaCidadao).not.toHaveBeenCalled();
  });

  test('deve validar regra de Nova Senha: exigir mín. 8 caracteres, pelo menos uma letra e um número', () => {
    renderRecuperarSenha();

    const cpfInput = screen.getByLabelText(/CPF \(apenas números\)/i);
    const emailInput = screen.getByLabelText(/^E-mail$/i);
    const senhaInput = screen.getByLabelText(/^Nova Senha$/i);
    const submitButton = screen.getByRole('button', { name: /Redefinir senha da conta do cidadão/i });

    fireEvent.change(cpfInput, { target: { value: '12345678901' } });
    fireEvent.change(emailInput, { target: { value: 'carlos@exemplo.com' } });

    // Senha muito curta
    fireEvent.change(senhaInput, { target: { value: 'abc' } });
    fireEvent.click(submitButton);

    let erroSenha = document.getElementById('erro-recuperar-senha');
    expect(erroSenha).toBeInTheDocument();
    expect(erroSenha).toHaveTextContent('mínimo 8 caracteres, contendo pelo menos uma letra e um número');
    expect(redefinirSenhaCidadao).not.toHaveBeenCalled();

    // Senha sem número
    fireEvent.change(senhaInput, { target: { value: 'senhasemnumero' } });
    fireEvent.click(submitButton);
    erroSenha = document.getElementById('erro-recuperar-senha');
    expect(erroSenha).toHaveTextContent('pelo menos uma letra e um número');

    // Senha sem letra
    fireEvent.change(senhaInput, { target: { value: '12345678' } });
    fireEvent.click(submitButton);
    erroSenha = document.getElementById('erro-recuperar-senha');
    expect(erroSenha).toHaveTextContent('pelo menos uma letra e um número');
  });

  test('deve enviar payload sanitizado para redefinirSenhaCidadao e navegar para /login/cidadao', async () => {
    renderRecuperarSenha();

    const cpfInput = screen.getByLabelText(/CPF \(apenas números\)/i);
    const emailInput = screen.getByLabelText(/^E-mail$/i);
    const senhaInput = screen.getByLabelText(/^Nova Senha$/i);
    const submitButton = screen.getByRole('button', { name: /Redefinir senha da conta do cidadão/i });

    fireEvent.change(cpfInput, { target: { value: '123.456.789-01' } });
    fireEvent.change(emailInput, { target: { value: 'carlos@exemplo.com' } });
    fireEvent.change(senhaInput, { target: { value: 'NovaSenha123' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(redefinirSenhaCidadao).toHaveBeenCalledWith({
        cpf: '12345678901',
        email: 'carlos@exemplo.com',
        nova_senha: 'NovaSenha123',
      });
    });

    await waitFor(
      () => {
        expect(mockedNavigate).toHaveBeenCalledWith('/login/cidadao', {
          state: {
            mensagemSucesso: 'Senha redefinida com sucesso! Faça login com suas novas credenciais.',
          },
        });
      },
      { timeout: 1500 }
    );
  });

  test('deve desabilitar o botão e exibir "Redefinindo..." durante o carregamento', async () => {
    let resolverPromise;
    redefinirSenhaCidadao.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolverPromise = resolve;
        })
    );

    renderRecuperarSenha();

    const cpfInput = screen.getByLabelText(/CPF \(apenas números\)/i);
    const emailInput = screen.getByLabelText(/^E-mail$/i);
    const senhaInput = screen.getByLabelText(/^Nova Senha$/i);
    const submitButton = screen.getByRole('button', { name: /Redefinir senha da conta do cidadão/i });

    fireEvent.change(cpfInput, { target: { value: '12345678901' } });
    fireEvent.change(emailInput, { target: { value: 'carlos@exemplo.com' } });
    fireEvent.change(senhaInput, { target: { value: 'NovaSenha123' } });

    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent(/Redefinindo.../i);
    expect(submitButton).toHaveAttribute('aria-busy', 'true');

    resolverPromise({ sucesso: true, mensagem: 'Senha redefinida.' });
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalled());
  });

  test('deve exibir mensagem de erro da API na tela com role="alert" e reabilitar o botão', async () => {
    redefinirSenhaCidadao.mockRejectedValueOnce(
      new Error('Dados não conferem. Verifique o CPF e o e-mail informados.')
    );

    renderRecuperarSenha();

    const cpfInput = screen.getByLabelText(/CPF \(apenas números\)/i);
    const emailInput = screen.getByLabelText(/^E-mail$/i);
    const senhaInput = screen.getByLabelText(/^Nova Senha$/i);
    const submitButton = screen.getByRole('button', { name: /Redefinir senha da conta do cidadão/i });

    fireEvent.change(cpfInput, { target: { value: '12345678901' } });
    fireEvent.change(emailInput, { target: { value: 'naoexiste@exemplo.com' } });
    fireEvent.change(senhaInput, { target: { value: 'NovaSenha123' } });

    fireEvent.click(submitButton);

    const erroAlerta = await screen.findByRole('alert');
    expect(erroAlerta).toBeInTheDocument();
    expect(erroAlerta).toHaveTextContent('Dados não conferem. Verifique o CPF e o e-mail informados.');

    expect(submitButton).not.toBeDisabled();
    expect(submitButton).toHaveTextContent(/Redefinir Senha/i);
  });

  test('deve conter links acessíveis de voltar no topo e de rodapé apontando para /login/cidadao', () => {
    renderRecuperarSenha();

    const backLink = screen.getByRole('link', { name: /Voltar para a página de login/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', '/login/cidadao');

    const loginFooterLink = screen.getByRole('link', { name: /Voltar ao Login/i });
    expect(loginFooterLink).toBeInTheDocument();
    expect(loginFooterLink).toHaveAttribute('href', '/login/cidadao');
  });
});
