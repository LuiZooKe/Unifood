import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <form onSubmit={handleSubmit} className="flex items-center justify-center min-h-screen main">
      <div className="bg-[#520000] rounded-md p-8 shadow-xl max-w-md w-full mx-4">
        <h1 className="text-white text-2xl font-semibold mb-6 text-center">Recuperar Senha</h1>

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

        {mensagem && <p className="text-green-500 mb-4">{mensagem}</p>}
        {erro && <p className="text-red-500 mb-4">{erro}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded transition-colors"
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
  );
}

export default EsqueciSenha;
