import React, { useState } from 'react';
import './login-cadastro.css';
import { useNavigate } from 'react-router-dom';

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

        // Redireciona conforme o tipo de usuário
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
    <form onSubmit={handleLogin} className="flex items-center justify-center min-h-screen main">
      <div className="bg-[#520000] rounded-md p-8 shadow-xl max-w-md w-full mx-4">
        <h1 className="text-white text-3xl font-semibold mb-6 text-center">Login</h1>

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

        <label className="block text-gray-300 mb-2" htmlFor="password">Senha</label>
        <input
          id="password"
          type="password"
          placeholder="Digite sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full p-3 mb-2 rounded border border-gray-500 focus:outline-none focus:border-blue-500"
          required
        />

        {/* Link para "Esqueci minha senha" */}
        <div className="mb-6 text-right">
          <button
            type="button"
            onClick={() => navigate('/esqueci-senha')}
            className="text-blue-400 hover:underline text-lg font-medium px-2 py-1"
          >
            Esqueci minha senha
          </button>
        </div>

        {erro && <p className="text-red-500 mb-4">{erro}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded transition-colors"
        >
          Entrar
        </button>

        <button
          type="button"
          onClick={() => navigate('/cadastro')}
          className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded transition-colors"
        >
          Cadastro
        </button>
      </div>
    </form>
  );
}

export default Login;
