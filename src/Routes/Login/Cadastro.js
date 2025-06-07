import React, { useState } from 'react';
import './login-cadastro.css';
import { useNavigate } from 'react-router-dom';
import fundoLogin from './img/fundo-logcad.jpg';
import logoUnifood from './img/logounifood.png';
import logoUniFUCAMP from './img/logoUNIFUCAMP.png';

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

    if (senha.length < 8) {
      novosErros.push('A senha deve ter pelo menos 8 caracteres.');
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
    <div className="flex min-h-screen">
      {/* Lado esquerdo com imagem de fundo */}
      <div
        className="w-1/2 hidden lg:flex items-center justify-center bg-cover bg-center rounded-r-3xl"
        style={{ backgroundImage: `url(${fundoLogin})` }}
      >
        <div className="bg-black bg-opacity-60 px-10 pt-14 pb-14 rounded-lg text-white flex flex-col items-center text-center">
          <h2 className="text-5xl font-bold mb-4 leading-snug">
            Novo por aqui?<br />
          </h2>
          <h3 className="text-4xl font-bold mb-[-30px] leading-snug">Crie sua conta e aproveite</h3>
          <br/>
          <h3 className="text-4xl font-bold mb-[-20px] leading-snug">todas as vantagens da UNIFOOD!</h3>
          <div className="flex justify-center items-center gap-6 mt-6">
              <img src={logoUnifood} alt="unifood" className="h-80" />
            <a href="https://www.unifucamp.edu.br/">
              <img src={logoUniFUCAMP} alt="unifucamp" className="h-22" />
            </a>
          </div>

        </div>
      </div>

      <form onSubmit={handleSubmit} 
      className="w-full lg:w-1/2 flex items-center justify-center bg-white p-10 rounded-r-1x3">
        <div className="max-w-md w-full">
          <h1 className="text-gray-800 text-3xl font-bold mb-6 text-center">CADASTRO</h1>
          <label className="block text-gray-700 mb-2" htmlFor="tipoUsuario">Tipo de Usuário</label>
          <select
            id="tipoUsuario"
            value={tipoUsuario}
            onChange={(e) => setTipoUsuario(e.target.value)}
            className="w-full p-3 mb-4 rounded border border-gray-500 focus:outline-none focus:border-red-500"
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
            className="w-full p-3 mb-4 rounded border border-gray-500 focus:outline-none focus:border-red-500"
            required
          />

          <label className="block text-gray-300 mb-2" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 rounded border border-gray-500 focus:outline-none focus:border-red-500"
            required
          />

          <label className="block text-gray-300 mb-2" htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full p-3 mb-6 rounded border border-gray-500 focus:outline-none focus:border-red-500"
            required
          />

          <label className="block text-gray-300 mb-2" htmlFor="confirmarSenha">Confirmar Senha</label>
          <input
            id="confirmarSenha"
            type="password"
            placeholder="Confirme sua senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            className="w-full p-3 mb-6 rounded border border-gray-500 focus:outline-none focus:border-red-500"
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
            className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded transition-colors"
          >
            Cadastrar
          </button>
        </div>
      </form>
    </div>
  );
}

export default Cadastro;
