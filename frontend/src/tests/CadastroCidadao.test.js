import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import CadastroCidadao from '../pages/CadastroCidadao';

const renderCadastroCidadao = () => {
  return render(
    <MemoryRouter>
      <CadastroCidadao />
    </MemoryRouter>
  );
};

describe('Página de Cadastro do Cidadão (CadastroCidadao)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
  });

  test('deve renderizar a estrutura semântica principal com landmark <main> e título <h1>', () => {
    const { container } = renderCadastroCidadao();

    const mainElement = container.querySelector('main#conteudo-principal');
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveClass('cadastro-main-container');

    const heading = screen.getByRole('heading', { level: 1, name: /Crie sua conta/i });
    expect(heading).toBeInTheDocument();
  });

  test('deve renderizar o formulário semântico <form> com aria-labelledby associado ao título', () => {
    const { container } = renderCadastroCidadao();

    const formElement = container.querySelector('form.cadastro-form');
    expect(formElement).toBeInTheDocument();
    expect(formElement).toHaveAttribute('aria-labelledby', 'cadastro-heading');
  });

  test('deve renderizar os 5 campos com seus respectivos <label> associados via htmlFor e id', () => {
    renderCadastroCidadao();

    // 1. Nome Completo
    const nomeLabel = screen.getByText(/^Nome Completo$/i);
    expect(nomeLabel).toBeInTheDocument();
    expect(nomeLabel.tagName).toBe('LABEL');
    expect(nomeLabel).toHaveAttribute('for', 'cadastro-nome');

    const nomeInput = screen.getByLabelText(/^Nome Completo$/i);
    expect(nomeInput).toBeInTheDocument();
    expect(nomeInput).toHaveAttribute('id', 'cadastro-nome');
    expect(nomeInput).toHaveAttribute('type', 'text');
    expect(nomeInput).toBeRequired();

    // 2. CPF (apenas números)
    const cpfLabel = screen.getByText(/CPF \(apenas números\)/i);
    expect(cpfLabel).toBeInTheDocument();
    expect(cpfLabel.tagName).toBe('LABEL');
    expect(cpfLabel).toHaveAttribute('for', 'cadastro-cpf');

    const cpfInput = screen.getByLabelText(/CPF \(apenas números\)/i);
    expect(cpfInput).toBeInTheDocument();
    expect(cpfInput).toHaveAttribute('id', 'cadastro-cpf');
    expect(cpfInput).toHaveAttribute('type', 'text');
    expect(cpfInput).toHaveAttribute('inputmode', 'numeric');
    expect(cpfInput).toBeRequired();

    // 3. E-mail (requisito do backend)
    const emailLabel = screen.getByText(/^E-mail$/i);
    expect(emailLabel).toBeInTheDocument();
    expect(emailLabel.tagName).toBe('LABEL');
    expect(emailLabel).toHaveAttribute('for', 'cadastro-email');

    const emailInput = screen.getByLabelText(/^E-mail$/i);
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('id', 'cadastro-email');
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('inputmode', 'email');
    expect(emailInput).toBeRequired();

    // 4. Telefone
    const telLabel = screen.getByText(/^Telefone$/i);
    expect(telLabel).toBeInTheDocument();
    expect(telLabel.tagName).toBe('LABEL');
    expect(telLabel).toHaveAttribute('for', 'cadastro-telefone');

    const telInput = screen.getByLabelText(/^Telefone$/i);
    expect(telInput).toBeInTheDocument();
    expect(telInput).toHaveAttribute('id', 'cadastro-telefone');
    expect(telInput).toHaveAttribute('type', 'tel');
    expect(telInput).toHaveAttribute('inputmode', 'tel');
    expect(telInput).toBeRequired();

    // 5. Senha
    const senhaLabel = screen.getByText(/^Senha$/i);
    expect(senhaLabel).toBeInTheDocument();
    expect(senhaLabel.tagName).toBe('LABEL');
    expect(senhaLabel).toHaveAttribute('for', 'cadastro-senha');

    const senhaInput = screen.getByLabelText(/^Senha$/i);
    expect(senhaInput).toBeInTheDocument();
    expect(senhaInput).toHaveAttribute('id', 'cadastro-senha');
    expect(senhaInput).toHaveAttribute('type', 'password');
    expect(senhaInput).toBeRequired();
  });

  test('deve aplicar máscaras ao digitar nos campos de CPF e Telefone', () => {
    renderCadastroCidadao();

    const cpfInput = screen.getByLabelText(/CPF \(apenas números\)/i);
    fireEvent.change(cpfInput, { target: { name: 'cpf', value: '12345678901' } });
    expect(cpfInput.value).toBe('123.456.789-01');

    const telInput = screen.getByLabelText(/^Telefone$/i);
    fireEvent.change(telInput, { target: { name: 'whatsapp', value: '11987654321' } });
    expect(telInput.value).toBe('(11) 98765-4321');
  });

  test('deve alternar a visibilidade da senha e atualizar atributos ARIA', () => {
    renderCadastroCidadao();

    const senhaInput = screen.getByLabelText(/^Senha$/i);
    const toggleButton = screen.getByRole('button', { name: /Exibir senha/i });

    expect(senhaInput).toHaveAttribute('type', 'password');
    expect(toggleButton).toHaveAttribute('aria-label', 'Exibir senha');
    expect(toggleButton).toHaveAttribute('aria-pressed', 'false');

    // Clica para exibir
    fireEvent.click(toggleButton);
    expect(senhaInput).toHaveAttribute('type', 'text');
    expect(toggleButton).toHaveAttribute('aria-label', 'Ocultar senha');
    expect(toggleButton).toHaveAttribute('aria-pressed', 'true');

    // Clica para ocultar
    fireEvent.click(toggleButton);
    expect(senhaInput).toHaveAttribute('type', 'password');
    expect(toggleButton).toHaveAttribute('aria-label', 'Exibir senha');
    expect(toggleButton).toHaveAttribute('aria-pressed', 'false');
  });

  test('deve exibir mensagem de erro ao submeter com campos inválidos', () => {
    renderCadastroCidadao();

    const submitButton = screen.getByRole('button', { name: /Cadastrar nova conta do cidadão/i });
    expect(submitButton).toHaveAttribute('type', 'submit');

    // 1. Nome vazio
    fireEvent.click(submitButton);
    let alertMessage = screen.getByRole('alert');
    expect(alertMessage).toHaveTextContent('Informe o seu nome completo.');

    // 2. Preenche nome, tenta com CPF incompleto
    const nomeInput = screen.getByLabelText(/^Nome Completo$/i);
    fireEvent.change(nomeInput, { target: { name: 'nome_completo', value: 'Maria da Silva' } });
    fireEvent.click(submitButton);

    alertMessage = screen.getByRole('alert');
    expect(alertMessage).toHaveTextContent('Informe um CPF válido com 11 dígitos.');

    // 3. Preenche CPF, tenta com e-mail inválido
    const cpfInput = screen.getByLabelText(/CPF \(apenas números\)/i);
    fireEvent.change(cpfInput, { target: { name: 'cpf', value: '12345678901' } });
    fireEvent.click(submitButton);

    alertMessage = screen.getByRole('alert');
    expect(alertMessage).toHaveTextContent('Informe um endereço de e-mail válido.');

    // 4. Preenche e-mail, tenta com telefone incompleto
    const emailInput = screen.getByLabelText(/^E-mail$/i);
    fireEvent.change(emailInput, { target: { name: 'email', value: 'maria@exemplo.com' } });
    fireEvent.click(submitButton);

    alertMessage = screen.getByRole('alert');
    expect(alertMessage).toHaveTextContent('Informe um número de telefone com DDD válido.');

    // 5. Preenche telefone, tenta com senha curta
    const telInput = screen.getByLabelText(/^Telefone$/i);
    fireEvent.change(telInput, { target: { name: 'whatsapp', value: '11987654321' } });
    fireEvent.click(submitButton);

    alertMessage = screen.getByRole('alert');
    expect(alertMessage).toHaveTextContent('A senha deve ter no mínimo 6 caracteres.');
  });

  test('deve submeter o formulário com dados válidos e fazer console.log do JSON preparado para o backend', () => {
    renderCadastroCidadao();

    fireEvent.change(screen.getByLabelText(/^Nome Completo$/i), {
      target: { name: 'nome_completo', value: 'Carlos Eduardo' },
    });
    fireEvent.change(screen.getByLabelText(/CPF \(apenas números\)/i), {
      target: { name: 'cpf', value: '98765432100' },
    });
    fireEvent.change(screen.getByLabelText(/^E-mail$/i), {
      target: { name: 'email', value: 'carlos@exemplo.com' },
    });
    fireEvent.change(screen.getByLabelText(/^Telefone$/i), {
      target: { name: 'whatsapp', value: '11999998888' },
    });
    fireEvent.change(screen.getByLabelText(/^Senha$/i), {
      target: { name: 'senha', value: 'senha123' },
    });

    const submitButton = screen.getByRole('button', { name: /Cadastrar nova conta do cidadão/i });
    fireEvent.click(submitButton);

    expect(console.log).toHaveBeenCalledWith(
      'Dados do Cadastro do Cidadão:',
      expect.stringContaining('"nome_completo": "Carlos Eduardo"')
    );
    expect(console.log).toHaveBeenCalledWith(
      'Dados do Cadastro do Cidadão:',
      expect.stringContaining('"email": "carlos@exemplo.com"')
    );
    expect(console.log).toHaveBeenCalledWith(
      'Dados do Cadastro do Cidadão:',
      expect.stringContaining('"cpf": "98765432100"')
    );
  });

  test('deve conter links acessíveis de voltar e entrar aqui apontando para /login/cidadao', () => {
    renderCadastroCidadao();

    const backLink = screen.getByRole('link', { name: /Voltar para a página de login/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', '/login/cidadao');

    const signinLink = screen.getByRole('link', { name: /Entrar aqui/i });
    expect(signinLink).toBeInTheDocument();
    expect(signinLink).toHaveAttribute('href', '/login/cidadao');
  });
});
