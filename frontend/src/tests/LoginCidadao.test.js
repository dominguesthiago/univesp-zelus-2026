import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import LoginCidadao from '../pages/LoginCidadao';

const renderLoginCidadao = () => {
  return render(
    <MemoryRouter>
      <LoginCidadao />
    </MemoryRouter>
  );
};

describe('Página de Login do Cidadão (LoginCidadao)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve renderizar a estrutura semântica principal com landmark <main> e título <h1>', () => {
    const { container } = renderLoginCidadao();

    const mainElement = container.querySelector('main#conteudo-principal');
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveClass('login-main-container');

    const heading = screen.getByRole('heading', { level: 1, name: /Acesse sua conta/i });
    expect(heading).toBeInTheDocument();
  });

  test('deve renderizar o formulário semântico <form> com aria-labelledby associado ao título', () => {
    const { container } = renderLoginCidadao();

    const formElement = container.querySelector('form.login-form');
    expect(formElement).toBeInTheDocument();
    expect(formElement).toHaveAttribute('aria-labelledby', 'login-heading');
  });

  test('deve disponibilizar o campo de CPF acessível associado ao seu <label> via htmlFor/id', () => {
    renderLoginCidadao();

    const cpfLabel = screen.getByText(/CPF \(apenas números\)/i);
    expect(cpfLabel).toBeInTheDocument();
    expect(cpfLabel.tagName).toBe('LABEL');
    expect(cpfLabel).toHaveAttribute('for', 'login-cpf');

    const cpfInput = screen.getByLabelText(/CPF \(apenas números\)/i);
    expect(cpfInput).toBeInTheDocument();
    expect(cpfInput).toHaveAttribute('id', 'login-cpf');
    expect(cpfInput).toHaveAttribute('type', 'text');
    expect(cpfInput).toHaveAttribute('inputmode', 'numeric');
    expect(cpfInput).toHaveAttribute('aria-required', 'true');
    expect(cpfInput).toBeRequired();
  });

  test('deve disponibilizar o campo de Senha acessível associado ao seu <label> via htmlFor/id', () => {
    renderLoginCidadao();

    const senhaLabel = screen.getByText(/^Senha$/i);
    expect(senhaLabel).toBeInTheDocument();
    expect(senhaLabel.tagName).toBe('LABEL');
    expect(senhaLabel).toHaveAttribute('for', 'login-senha');

    const senhaInput = screen.getByLabelText(/^Senha$/i);
    expect(senhaInput).toBeInTheDocument();
    expect(senhaInput).toHaveAttribute('id', 'login-senha');
    expect(senhaInput).toHaveAttribute('type', 'password');
    expect(senhaInput).toHaveAttribute('aria-required', 'true');
    expect(senhaInput).toBeRequired();
  });

  test('deve aplicar máscara ao digitar CPF numérico no input', () => {
    renderLoginCidadao();

    const cpfInput = screen.getByLabelText(/CPF \(apenas números\)/i);
    fireEvent.change(cpfInput, { target: { value: '12345678901' } });

    expect(cpfInput.value).toBe('123.456.789-01');
  });

  test('deve alternar a visibilidade da senha e atualizar os atributos ARIA acessíveis', () => {
    renderLoginCidadao();

    const senhaInput = screen.getByLabelText(/^Senha$/i);
    const toggleButton = screen.getByRole('button', { name: /Exibir senha/i });

    expect(senhaInput).toHaveAttribute('type', 'password');
    expect(toggleButton).toHaveAttribute('aria-label', 'Exibir senha');
    expect(toggleButton).toHaveAttribute('aria-pressed', 'false');

    // Clica para exibir a senha
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

  test('deve conter botão de submissão do tipo submit com papel acessível', () => {
    renderLoginCidadao();

    const submitButton = screen.getByRole('button', { name: /Entrar na conta do cidadão/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute('type', 'submit');
  });

  test('deve exibir mensagem de erro com role="alert" ao tentar submeter CPF incompleto', () => {
    renderLoginCidadao();

    const cpfInput = screen.getByLabelText(/CPF \(apenas números\)/i);
    fireEvent.change(cpfInput, { target: { value: '123' } });

    const submitButton = screen.getByRole('button', { name: /Entrar na conta do cidadão/i });
    fireEvent.click(submitButton);

    const alertMessage = screen.getByRole('alert');
    expect(alertMessage).toBeInTheDocument();
    expect(alertMessage).toHaveTextContent('Informe um CPF válido com 11 dígitos.');
    expect(cpfInput).toHaveAttribute('aria-invalid', 'true');
  });

  test('deve exibir mensagem de erro ao submeter CPF válido mas com senha em branco', () => {
    renderLoginCidadao();

    const cpfInput = screen.getByLabelText(/CPF \(apenas números\)/i);
    fireEvent.change(cpfInput, { target: { value: '12345678901' } });

    const submitButton = screen.getByRole('button', { name: /Entrar na conta do cidadão/i });
    fireEvent.click(submitButton);

    const alertMessage = screen.getByRole('alert');
    expect(alertMessage).toBeInTheDocument();
    expect(alertMessage).toHaveTextContent('Informe a sua senha.');
  });

  test('deve renderizar links de navegação acessíveis para recuperação de senha, cadastro e voltar', () => {
    renderLoginCidadao();

    const backLink = screen.getByRole('link', { name: /Voltar para a página inicial/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', '/');

    const forgotLink = screen.getByRole('link', { name: /Esqueci minha senha/i });
    expect(forgotLink).toBeInTheDocument();
    expect(forgotLink).toHaveAttribute('href', '/recuperar-senha');

    const signupLink = screen.getByRole('link', { name: /Cadastre-se aqui/i });
    expect(signupLink).toBeInTheDocument();
    expect(signupLink).toHaveAttribute('href', '/cadastro/cidadao');
  });
});
