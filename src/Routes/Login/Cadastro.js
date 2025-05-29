import React, { useState } from 'react';
import './login-cadastro.css';
import { useNavigate } from 'react-router-dom';

function Cadastro() {
  const navigate = useNavigate();
  const [tipoUsuario, setTipoUsuario] = useState('1'); // padrão: Aluno/Professor
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erros, setErros] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const novosErros = [];

    if (!nome.trim()) {
      novosErros.push('O nome é obrigatório.');
    }

    if (!email.trim()) {
      novosErros.push('O email é obrigatório.');
    } else if (!email.toLowerCase().endsWith('@unifucamp.edu.br')) {
      novosErros.push('Você não é aluno. Use um email @unifucamp.edu.br.');
    }

    if (!senha) {
      novosErros.push('A senha é obrigatória.');
    }

    if (!confirmarSenha) {
      novosErros.push('A confirmação de senha é obrigatória.');
    }

    if (senha && confirmarSenha && senha !== confirmarSenha) {
      novosErros.push('As senhas devem ser iguais.');
    }

    if (novosErros.length > 0) {
      setErros(novosErros);
      return;
    }

    // Se chegou aqui, não tem erros na validação frontend
    setErros([]); // limpa erros anteriores

    try {
      const response = await fetch('http://localhost/UNIFOOD/database/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, email, senha, tipo_usuario: parseInt(tipoUsuario) })
      });

      const data = await response.json();

      if (data.success) {
        setErros([]);
        navigate('/');
      } else {
        setErros([data.message || 'Erro ao cadastrar.']);
      }
    } catch (error) {
      console.error('Erro ao enviar:', error);
      setErros(['Erro na conexão com o servidor.']);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center justify-center min-h-screen main">
      <div className="bg-[#172c3c] rounded-md p-8 shadow-xl max-w-md w-full mx-4">
        <h1 className="text-white text-3xl font-semibold mb-6 text-center">Cadastro</h1>

        <label className="block text-gray-300 mb-2" htmlFor="tipoUsuario">Tipo de Usuário</label>
        <select
          id="tipoUsuario"
          value={tipoUsuario}
          onChange={(e) => setTipoUsuario(e.target.value)}
          className="w-full p-3 mb-4 rounded border border-gray-500 focus:outline-none focus:border-blue-500"
          required
        >
          <option value="1">Aluno/Professor</option>
          <option value="2">Responsável</option>
        </select>

        <label className="block text-gray-300 mb-2" htmlFor="nome">Nome</label>
        <input
          id="nome"
          type="text"
          placeholder="Digite seu nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full p-3 mb-4 rounded border border-gray-500 focus:outline-none focus:border-blue-500"
          required
        />

        <label className="block text-gray-300 mb-2" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 rounded border border-gray-500 focus:outline-none focus:border-blue-500"
          required
        />

        <label className="block text-gray-300 mb-2" htmlFor="senha">Senha</label>
        <input
          id="senha"
          type="password"
          placeholder="Digite sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full p-3 mb-6 rounded border border-gray-500 focus:outline-none focus:border-blue-500"
          required
        />

        <label className="block text-gray-300 mb-2" htmlFor="confirmarSenha">Confirmar Senha</label>
        <input
          id="confirmarSenha"
          type="password"
          placeholder="Confirme sua senha"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          className="w-full p-3 mb-6 rounded border border-gray-500 focus:outline-none focus:border-blue-500"
          required
        />

        {erros.length > 0 && (
          <ul className="text-red-500 mb-4 list-disc pl-5">
            {erros.map((erro, index) => (
              <li key={index}>{erro}</li>
            ))}
          </ul>
        )}

        <button
          type="submit"
          className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded transition-colors"
        >
          Cadastrar
        </button>
      </div>
    </form>
  );
}

export default Cadastro;
