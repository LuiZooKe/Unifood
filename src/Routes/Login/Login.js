import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import fundoLogin from './img/fundo-logcad.jpg';
import logoUnifood from './img/logounifood.png';
import logoUniFUCAMP from './img/logoUNIFUCAMP.png';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost/UNIFOOD/database/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('usuarioLogado', 'true');
        localStorage.setItem('tipo_usuario', data.tipo_usuario);
        setErro('');

        if (parseInt(data.tipo_usuario, 10) === 0) {
          navigate('/funcionario');
        } else {
          navigate('/');
        }
      } else {
        setErro(data.message);
      }
    } catch (error) {
      console.error('Erro ao logar:', error);
      setErro('Erro de conexão com o servidor.');
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
            Bateu aquela fome?<br />
          </h2>
          <h3 className="text-4xl font-bold mb-4 leading-snug">Faça login e resolva isso rapidinho.</h3>
          <div className="flex justify-center items-center gap-6 mt-6">
            <a href="#home">
              <img src={logoUnifood} alt="unifood" className="h-80" />
            </a>
            <a href="#home">
              <img src={logoUniFUCAMP} alt="unifucamp" className="h-22" />
            </a>
          </div>

        </div>
      </div>

      {/* Lado direito com formulário */}
      <form
        onSubmit={handleLogin}
        className="w-full lg:w-1/2 flex items-center justify-center bg-white p-10 rounded-r-1x3">
        <div className="w-full max-w-md">
          <h1 className="text-gray-800 text-3xl font-bold mb-6 text-center">LOGIN</h1>

          <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 rounded border border-gray-500 focus:outline-none focus:border-red-500"
            required
          />

          <label className="block text-gray-700 mb-2" htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full p-3 mb-2 rounded border border-gray-500 focus:outline-none focus:border-red-500"
            required
          />

          <div className="mb-4 text-right">
            <button
              type="button"
              onClick={() => navigate('/esqueci-senha')}
              className="text-[15px] font-semibold text-red-500 hover:underline"
            >
              Esqueci minha senha
            </button>
          </div>

          {erro && <p className="text-red-500 mb-4">{erro}</p>}

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded"
          >
            Entrar
          </button>

          <button
            type="button"
            onClick={() => navigate('/cadastro')}
            className="w-full mt-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded"
          >
            Cadastro
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
