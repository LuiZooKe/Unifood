import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import fundoLogin from './img/fundo-logcad.jpg';
import logoUnifood from './img/logounifood.png';
import logoUniFUCAMP from './img/logoUNIFUCAMP.png';

function EsqueciSenha() {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost/UNIFOOD/database/esqueci-senha.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Erro na resposta do servidor.');
      }

      const data = await response.json();

      if (data.success) {
        setMensagem(data.message);
        setErro('');
      } else {
        setErro(data.message || 'Erro ao solicitar redefinição.');
        setMensagem('');
      }
    } catch (error) {
      console.error('Erro:', error);
      setErro('Erro de conexão com o servidor.');
      setMensagem('');
    }
  };

  return (
    <div className="flex min-h-screen">
      <form onSubmit={handleSubmit} className="w-full lg:w-1/2 flex items-center justify-center bg-white p-10 rounded-l-1x3">
        <div className="w-full max-w-md">
          <h1 className="text-gray-800 text-3xl font-bold mb-6 text-center">Recuperar Senha</h1>

          <label className="block text-gray-800 mb-2" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 rounded border border-gray-700 focus:outline-none focus:border-red-500"
            required
          />

          {mensagem && <p className="text-green-500 mb-4">{mensagem}</p>}
          {erro && <p className="text-red-500 mb-4">{erro}</p>}

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded transition-colors"
          >
            Enviar link de redefinição
          </button>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full mt-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded transition-colors"
          >
            Voltar
          </button>
        </div>
      </form>

      {/* Lado direito com imagem de fundo */}
      <div
        className="w-1/2 hidden lg:flex items-center justify-center bg-cover bg-center rounded-l-3xl"
        style={{ backgroundImage: `url(${fundoLogin})` }}
      >
        <div className="bg-black bg-opacity-60 px-10 pt-14 pb-14 rounded-lg text-white flex flex-col items-center text-center">
          <h2 className="text-5xl font-bold mb-4 leading-snug">
            Esqueceu a senha?<br />
          </h2>
          <h3 className="text-4xl font-bold mb-4 leading-snug">Vamos resolver isso.</h3>
          <div className="flex justify-center items-center gap-6 mt-6">
              <img src={logoUnifood} alt="unifood" className="h-80" />
            <a href="https://www.unifucamp.edu.br/">
              <img src={logoUniFUCAMP} alt="unifucamp" className="h-22" />
            </a>
          </div>

        </div>
      </div>
    </div>

  );
}

export default EsqueciSenha;
