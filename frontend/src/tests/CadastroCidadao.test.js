import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import CadastroCidadao from '../pages/CadastroCidadao';
import { registrarCidadao } from '../services/api';

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

jest.mock('../services/api', () => ({
  registrarCidadao: jest.fn(),
}));

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
    registrarCidadao.mockResolvedValue({
      sucesso: true,
      mensagem: 'Cidadão cadastrado com sucesso.',
    });
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

    // 3. E-mail (requisito crítico do backend)
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

  test('deve validar regra do Nome Completo: rejeitar vazio, nome único ou caracteres não-alfabéticos', () => {
    renderCadastroCidadao();
    const submitButton = screen.getByRole('button', { name: /Cadastrar nova conta do cidadão/i });
    const nomeInput = screen.getByLabelText(/^Nome Completo$/i);

    // 1. Nome vazio
    fireEvent.click(submitButton);
    let erroNome = document.getElementById('erro-nome');
    expect(erroNome).toBeInTheDocument();
    expect(erroNome).toHaveTextContent('Informe o seu nome completo.');
    expect(registrarCidadao).not.toHaveBeenCalled();

    // 2. Apenas uma palavra
    fireEvent.change(nomeInput, { target: { name: 'nome_completo', value: 'Carlos' } });
    fireEvent.click(submitButton);
    erroNome = document.getElementById('erro-nome');
    expect(erroNome).toHaveTextContent('pelo menos duas palavras');
    expect(registrarCidadao).not.toHaveBeenCalled();

    // 3. Contendo números ou símbolos
    fireEvent.change(nomeInput, { target: { name: 'nome_completo', value: 'Carlos Silva 123' } });
    fireEvent.click(submitButton);
    erroNome = document.getElementById('erro-nome');
    expect(erroNome).toHaveTextContent('deve conter apenas letras');
    expect(registrarCidadao).not.toHaveBeenCalled();
  });

  test('deve validar regra do CPF: exigir exatamente 14 caracteres com a máscara', () => {
    renderCadastroCidadao();
    const submitButton = screen.getByRole('button', { name: /Cadastrar nova conta do cidadão/i });
    const nomeInput = screen.getByLabelText(/^Nome Completo$/i);
    const cpfInput = screen.getByLabelText(/CPF \(apenas números\)/i);

    fireEvent.change(nomeInput, { target: { name: 'nome_completo', value: 'Carlos Eduardo' } });

    // CPF incompleto (menos de 14 caracteres)
    fireEvent.change(cpfInput, { target: { name: 'cpf', value: '123456789' } });
    fireEvent.click(submitButton);

    const erroCpf = document.getElementById('erro-cpf');
    expect(erroCpf).toBeInTheDocument();
    expect(erroCpf).toHaveTextContent('totalmente preenchido com 14 caracteres');
    expect(registrarCidadao).not.toHaveBeenCalled();
  });

  test('deve validar regra de E-mail: exigir formato padrão com @ e domínio', () => {
    renderCadastroCidadao();
    const submitButton = screen.getByRole('button', { name: /Cadastrar nova conta do cidadão/i });
    const nomeInput = screen.getByLabelText(/^Nome Completo$/i);
    const cpfInput = screen.getByLabelText(/CPF \(apenas números\)/i);
    const emailInput = screen.getByLabelText(/^E-mail$/i);

    fireEvent.change(nomeInput, { target: { name: 'nome_completo', value: 'Carlos Eduardo' } });
    fireEvent.change(cpfInput, { target: { name: 'cpf', value: '12345678901' } });

    // E-mail sem @ ou sem domínio
    fireEvent.change(emailInput, { target: { name: 'email', value: 'carlossemdominio' } });
    fireEvent.click(submitButton);

    const erroEmail = document.getElementById('erro-email');
    expect(erroEmail).toBeInTheDocument();
    expect(erroEmail).toHaveTextContent('e-mail válido contendo @ e domínio');
    expect(registrarCidadao).not.toHaveBeenCalled();
  });

  test('deve validar regra de Telefone: exigir exatamente 15 caracteres com a máscara', () => {
    renderCadastroCidadao();
    const submitButton = screen.getByRole('button', { name: /Cadastrar nova conta do cidadão/i });
    const nomeInput = screen.getByLabelText(/^Nome Completo$/i);
    const cpfInput = screen.getByLabelText(/CPF \(apenas números\)/i);
    const emailInput = screen.getByLabelText(/^E-mail$/i);
    const telInput = screen.getByLabelText(/^Telefone$/i);

    fireEvent.change(nomeInput, { target: { name: 'nome_completo', value: 'Carlos Eduardo' } });
    fireEvent.change(cpfInput, { target: { name: 'cpf', value: '12345678901' } });
    fireEvent.change(emailInput, { target: { name: 'email', value: 'carlos@exemplo.com' } });

    // Telefone incompleto (menos de 15 caracteres)
    fireEvent.change(telInput, { target: { name: 'whatsapp', value: '119999988' } });
    fireEvent.click(submitButton);

    const erroTel = document.getElementById('erro-telefone');
    expect(erroTel).toBeInTheDocument();
    expect(erroTel).toHaveTextContent('totalmente preenchido com 15 caracteres');
    expect(registrarCidadao).not.toHaveBeenCalled();
  });

  test('deve validar regra de Senha: exigir no mínimo 8 caracteres com pelo menos uma letra e um número', () => {
    renderCadastroCidadao();
    const submitButton = screen.getByRole('button', { name: /Cadastrar nova conta do cidadão/i });
    const nomeInput = screen.getByLabelText(/^Nome Completo$/i);
    const cpfInput = screen.getByLabelText(/CPF \(apenas números\)/i);
    const emailInput = screen.getByLabelText(/^E-mail$/i);
    const telInput = screen.getByLabelText(/^Telefone$/i);
    const senhaInput = screen.getByLabelText(/^Senha$/i);

    fireEvent.change(nomeInput, { target: { name: 'nome_completo', value: 'Carlos Eduardo' } });
    fireEvent.change(cpfInput, { target: { name: 'cpf', value: '12345678901' } });
    fireEvent.change(emailInput, { target: { name: 'email', value: 'carlos@exemplo.com' } });
    fireEvent.change(telInput, { target: { name: 'whatsapp', value: '11999998888' } });

    // Senha curta
    fireEvent.change(senhaInput, { target: { name: 'senha', value: 'Ab12' } });
    fireEvent.click(submitButton);
    let erroSenha = document.getElementById('erro-senha');
    expect(erroSenha).toHaveTextContent('mínimo 8 caracteres, contendo pelo menos uma letra e um número');
    expect(registrarCidadao).not.toHaveBeenCalled();

    // Senha sem número
    fireEvent.change(senhaInput, { target: { name: 'senha', value: 'abcdefgh' } });
    fireEvent.click(submitButton);
    erroSenha = document.getElementById('erro-senha');
    expect(erroSenha).toHaveTextContent('pelo menos uma letra e um número');
    expect(registrarCidadao).not.toHaveBeenCalled();

    // Senha sem letra
    fireEvent.change(senhaInput, { target: { name: 'senha', value: '12345678' } });
    fireEvent.click(submitButton);
    erroSenha = document.getElementById('erro-senha');
    expect(erroSenha).toHaveTextContent('pelo menos uma letra e um número');
    expect(registrarCidadao).not.toHaveBeenCalled();
  });

  test('deve enviar o payload sanitizado para a API registrarCidadao e navegar para /login/cidadao', async () => {
    renderCadastroCidadao();

    fireEvent.change(screen.getByLabelText(/^Nome Completo$/i), {
      target: { name: 'nome_completo', value: 'Carlos Eduardo' },
    });
    fireEvent.change(screen.getByLabelText(/CPF \(apenas números\)/i), {
      target: { name: 'cpf', value: '987.654.321-00' },
    });
    fireEvent.change(screen.getByLabelText(/^E-mail$/i), {
      target: { name: 'email', value: 'carlos@exemplo.com' },
    });
    fireEvent.change(screen.getByLabelText(/^Telefone$/i), {
      target: { name: 'whatsapp', value: '(11) 99999-8888' },
    });
    fireEvent.change(screen.getByLabelText(/^Senha$/i), {
      target: { name: 'senha', value: 'SenhaForte123' },
    });

    const submitButton = screen.getByRole('button', { name: /Cadastrar nova conta do cidadão/i });
    fireEvent.click(submitButton);

    // a) O payload sanitizado é enviado corretamente
    await waitFor(() => {
      expect(registrarCidadao).toHaveBeenCalledWith({
        nome_completo: 'Carlos Eduardo',
        cpf: '98765432100',
        email: 'carlos@exemplo.com',
        whatsapp: '11999998888',
        senha: 'SenhaForte123',
      });
    });

    // Redireciona com state de mensagem de sucesso
    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/login/cidadao', {
        state: { mensagemSucesso: 'Cadastro realizado com sucesso! Faça login para continuar.' },
      });
    });
  });

  test('deve desabilitar o botão e exibir "Cadastrando..." enquanto a requisição estiver pendente', async () => {
    let resolverPromise;
    registrarCidadao.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolverPromise = resolve;
        })
    );

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
      target: { name: 'senha', value: 'SenhaForte123' },
    });

    const submitButton = screen.getByRole('button', { name: /Cadastrar nova conta do cidadão/i });
    fireEvent.click(submitButton);

    // b) O botão fica desabilitado durante o carregamento e exibe "Cadastrando..."
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Cadastrando...');
    expect(submitButton).toHaveAttribute('aria-busy', 'true');

    // Resolve a promise para liberar o estado
    resolverPromise({ sucesso: true });
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalled());
  });

  test('deve renderizar erro retornado pela API na tela e reabilitar o botão de submissão', async () => {
    registrarCidadao.mockRejectedValueOnce(new Error('CPF já cadastrado.'));

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
      target: { name: 'senha', value: 'SenhaForte123' },
    });

    const submitButton = screen.getByRole('button', { name: /Cadastrar nova conta do cidadão/i });
    fireEvent.click(submitButton);

    // c) Erros da API são renderizados na tela de forma acessível
    const erroAlerta = await screen.findByRole('alert');
    expect(erroAlerta).toBeInTheDocument();
    expect(erroAlerta).toHaveTextContent('CPF já cadastrado.');

    expect(submitButton).not.toBeDisabled();
    expect(submitButton).toHaveTextContent('CADASTRAR');
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
