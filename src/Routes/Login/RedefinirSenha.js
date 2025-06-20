import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import fundoLogin from './img/fundo-logcad.jpg';
import logoUnifood from './img/logounifood.png';
import logoUniFUCAMP from './img/logoUNIFUCAMP.png';

function RedefinirSenha() {
  const [searchParams] = useSearchParams();
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
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

    // Validação
    if (senha.length < 8) {
      setErro('A senha deve ter pelo menos 8 caracteres.');
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
    <div className="flex min-h-screen">

      <form onSubmit={handleSubmit} className="w-full lg:w-1/2 flex items-center justify-center bg-white p-10 rounded-l-1x3">
        <div className="w-full max-w-md">
          <h1 className="text-gray-800 text-3xl font-bold mb-6 text-center">Redefinir Senha</h1>

          {!tokenValido ? (
            <p className="text-red-500 text-center">{erro || 'Verificando token...'}</p>
          ) : (
            <>
              <label className="block text-gray-800 mb-2" htmlFor="senha">Nova Senha</label>
              <div className="relative">
                <input
                  id="senha"
                  type={mostrarSenha ? 'text' : 'password'}
                  placeholder="Digite a nova senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full p-3 mb-4 rounded border border-gray-500 focus:outline-none focus:border-red-500 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                >
                  {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <label className="block text-gray-800 mb-2" htmlFor="confirmarSenha">Confirmar Senha</label>
              <div className="relative">
                <input
                  id="confirmarSenha"
                  type={mostrarConfirmarSenha ? 'text' : 'password'}
                  placeholder="Confirme a nova senha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  className="w-full p-3 mb-4 rounded border border-gray-500 focus:outline-none focus:border-red-500 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                >
                  {mostrarConfirmarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/*  Mensagens agrupadas abaixo dos campos */}
              {(erro || mensagem) && (
                <div className={`mb-4 text-center ${erro ? 'text-red-500' : 'text-green-500'}`}>
                  {erro && <p>{erro}</p>}
                  {mensagem && <p>{mensagem}</p>}
                </div>
              )}

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

      {/*  Lado direito com imagem de fundo */}
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

export default RedefinirSenha;
