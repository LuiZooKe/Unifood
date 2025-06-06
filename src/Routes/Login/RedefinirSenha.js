import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function RedefinirSenha() {
  const [searchParams] = useSearchParams();
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [tokenValido, setTokenValido] = useState(false);
  const navigate = useNavigate();

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setErro('Token inválido ou ausente.');
      return;
    }

    const verificarToken = async () => {
      try {
        const response = await fetch(`http://localhost/Unifood/database/verificar-token.php?token=${token}`);
        const data = await response.json();

        if (data.success) {
          setTokenValido(true);
          setErro('');
        } else {
          setErro(data.message || 'Token inválido ou expirado.');
          setTokenValido(false);
        }
      } catch (err) {
        console.error('Erro ao verificar token:', err);
        setErro('Erro ao verificar o token.');
        setTokenValido(false);
      }
    };

    verificarToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      setMensagem('');
      return;
    }

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      setMensagem('');
      return;
    }

    try {
      const response = await fetch('http://localhost/Unifood/database/redefinir-senha.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senha, token }),
      });

      const data = await response.json();

      if (data.success) {
        setMensagem(data.message);
        setErro('');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setErro(data.message || 'Erro ao redefinir a senha.');
        setMensagem('');
      }
    } catch (err) {
      console.error('Erro ao redefinir a senha:', err);
      setErro('Erro ao redefinir a senha. Tente novamente mais tarde.');
      setMensagem('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center justify-center min-h-screen main">
      <div className="bg-[#520000] rounded-md p-8 shadow-xl max-w-md w-full mx-4">
        <h1 className="text-white text-2xl font-semibold mb-6 text-center">Redefinir Senha</h1>

        {!tokenValido ? (
          <p className="text-red-500 text-center">{erro || 'Verificando token...'}</p>
        ) : (
          <>
            <label className="block text-gray-300 mb-2" htmlFor="senha">Nova Senha</label>
            <input
              id="senha"
              type="password"
              placeholder="Digite a nova senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full p-3 mb-4 rounded border border-gray-500 focus:outline-none focus:border-red-500"
              required
            />

            <label className="block text-gray-300 mb-2" htmlFor="confirmarSenha">Confirmar Senha</label>
            <input
              id="confirmarSenha"
              type="password"
              placeholder="Confirme a nova senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              className="w-full p-3 mb-4 rounded border border-gray-500 focus:outline-none focus:border-red-500"
              required
            />

            {mensagem && <p className="text-green-500 mb-4">{mensagem}</p>}
            {erro && <p className="text-red-500 mb-4">{erro}</p>}

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded transition-colors"
            >
              Redefinir Senha
            </button>
          </>
        )}
      </div>
    </form>
  );
}

export default RedefinirSenha;
