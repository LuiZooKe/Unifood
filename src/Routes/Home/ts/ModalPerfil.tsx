import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import IMask from 'imask';
import AdicionarCartao from './AdicionarCartao.tsx';

interface Usuario {
  nome?: string;
  email: string;
  saldo: number;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  telefone?: string;
  numero_cartao?: string;
  nome_cartao?: string;
  validade_cartao?: string;
  cvv_cartao?: string;
}

interface Cartao {
  numero: string;
  nome: string;
  validade: string;
  cvv: string;
}

interface ModalPerfilProps {
  aberto: boolean;
  usuario: Usuario;
  onFechar: () => void;
  onLogout: () => void;
  onSalvar: (dadosAtualizados: Usuario) => void;
}

const ModalPerfil: React.FC<ModalPerfilProps> = ({
  aberto,
  usuario,
  onFechar,
  onLogout,
  onSalvar,
}) => {
  const [dados, setDados] = useState<Usuario>(usuario);
  const [abaAberta, setAbaAberta] = useState<'carteira' | 'dados'>('carteira');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [cartao, setCartao] = useState<Cartao | null>(null);
  const [cartaoAberto, setCartaoAberto] = useState(false);

  useEffect(() => {
    if (aberto) {
      setDados(usuario);

      if (usuario.numero_cartao) {
        setCartao({
          numero: usuario.numero_cartao,
          nome: usuario.nome_cartao || '',
          validade: usuario.validade_cartao || '',
          cvv: usuario.cvv_cartao || '',
        });
      } else {
        setCartao(null);
      }
    }
  }, [aberto, usuario]);

  if (!aberto) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'telefone') {
      const masked = IMask.createMask({ mask: '(00) 00000-0000' });
      masked.resolve(value);
      setDados((prev) => ({ ...prev, [name]: masked.value }));
    } else {
      setDados((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    if (novaSenha !== confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }

    try {
      const response = await fetch('http://localhost/UNIFOOD/database/update_perfil.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: dados.email,
          logradouro: dados.logradouro,
          numero: dados.numero,
          bairro: dados.bairro,
          cidade: dados.cidade,
          telefone: dados.telefone,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        alert('Erro ao atualizar dados: ' + result.message);
        return;
      }

      if (novaSenha) {
        const senhaRes = await fetch('http://localhost/UNIFOOD/database/update_senha.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: dados.email,
            senha: novaSenha,
          }),
        });

        const senhaResult = await senhaRes.json();

        if (!senhaResult.success) {
          alert('Dados atualizados, mas erro ao atualizar senha: ' + senhaResult.message);
        } else {
          alert('Dados e senha atualizados com sucesso!');
        }
      } else {
        alert('Dados atualizados com sucesso!');
      }

      const dadosAtualizados = {
        ...dados,
        nome: dados.nome,
        email: dados.email,
      };
      localStorage.setItem('dadosUsuario', JSON.stringify(dadosAtualizados));
      onSalvar(dadosAtualizados);
      setNovaSenha('');
      setConfirmarSenha('');
      onFechar();
    } catch (error) {
      console.error('Erro na atualização:', error);
      alert('Erro na conexão com o servidor.');
    }
  };

  const handleRemoverCartao = async () => {
    try {
      const res = await fetch('http://localhost/UNIFOOD/database/update_cartao.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: dados.email,
          numero_cartao: '',
          nome_cartao: '',
          validade_cartao: '',
          cvv_cartao: '',
        }),
      });

      const data = await res.json();

      if (data.success) {
        setCartao(null);
        alert('Cartão removido com sucesso!');
      } else {
        alert('Erro ao remover cartão: ' + data.message);
      }
    } catch (error) {
      console.error('Erro na remoção do cartão:', error);
      alert('Erro na conexão com o servidor');
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center
      md:inset-auto md:top-28 md:right-[3.5rem] md:items-start md:justify-end
      bg-black/70 backdrop-blur-xl md:bg-transparent md:rounded-3xl shadow-2xl"
      onClick={onFechar}
    >
      <div
        className="bg-white/95 backdrop-blur-md w-[90%] max-w-[500px] max-h-[90vh] md:max-h-[90vh]
        md:w-[380px] rounded-3xl shadow-xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >

        {/* 🔥 Cabeçalho */}
        <div className="flex justify-center items-center relative py-4 border-b border-gray-300">
          <h2 className="text-center font-extrabold text-gray-800 leading-tight">
            <span className="block text-[clamp(2.5rem,6vw,4rem)]">MEU PERFIL 👤</span>
          </h2>
          <button
            onClick={onFechar}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500"
          >
            <X className="w-8 h-8 sm:w-10 sm:h-10" />
          </button>
        </div>

        {/* 🔥 Aba Carteira / Dados */}
        <div className="flex gap-2 px-6 pt-4 pb-2 border-b border-gray-300">
          <button
            onClick={() => setAbaAberta('carteira')}
            className={`flex-1 py-2 rounded-xl font-semibold ${abaAberta === 'carteira'
              ? 'bg-green-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
          >
            Carteira 💰
          </button>
          <button
            onClick={() => setAbaAberta('dados')}
            className={`flex-1 py-2 rounded-xl font-semibold ${abaAberta === 'dados'
              ? 'bg-red-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
          >
            Dados 🪪
          </button>
        </div>

        {/* 🔥 Conteúdo rolável */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {abaAberta === 'dados' && (
            <div className="bg-gray-100 rounded-xl p-4 mb-4 text-center">
              <p className="text-xl text-center font-bold text-gray-800">{dados.nome}</p>
              <p className="text-md text-center text-gray-600">{dados.email}</p>
            </div>
          )}

          {abaAberta === 'carteira' ? (
            <div>
              <div className="flex justify-between items-center mb-4 gap-4">
                <div>
                  <p className="text-md text-gray-700">Saldo Atual:</p>
                  <p className="text-4xl font-bold text-green-600">
                    R$ {(Number(dados.saldo) || 0).toFixed(2).replace('.', ',')}
                  </p>
                </div>

                {cartao ? (
                  <button
                    className="py-2 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md"
                    onClick={handleRemoverCartao}
                  >
                    Remover Cartão
                  </button>
                ) : (
                  <button
                    className="py-2 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md"
                    onClick={() => setCartaoAberto(!cartaoAberto)}
                  >
                    {cartaoAberto ? 'Fechar' : 'Adicionar Cartão'}
                  </button>
                )}
              </div>

              {cartao && (
                <div className="w-full bg-white/40 backdrop-blur-md rounded-xl p-4 shadow-md">
                  <p className="text-lg font-semibold text-gray-800 mb-2">Cartão Cadastrado:</p>
                  <p><strong>Número:</strong> **** **** **** {cartao.numero.slice(-4)}</p>
                  <p><strong>Nome:</strong> {cartao.nome}</p>
                  <p><strong>Validade:</strong> {cartao.validade}</p>
                </div>
              )}

              <AdicionarCartao
                visivel={cartaoAberto}
                onAdicionar={(dadosCartao) => {
                  setCartao(dadosCartao);
                  alert('Cartão cadastrado com sucesso!');
                  setCartaoAberto(false);
                }}
                usuario={dados}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700">
              {[{ field: 'logradouro', label: 'Logradouro' },
              { field: 'numero', label: 'Número' },
              { field: 'bairro', label: 'Bairro' },
              { field: 'cidade', label: 'Cidade' },
              { field: 'telefone', label: 'Telefone' },
              ].map(({ field, label }) => (
                <div key={field} className={field === 'telefone' ? 'md:col-span-2 space-y-1' : 'space-y-1'}>
                  <p className="text-lg font-semibold">{label}</p>
                  <input
                    type="text"
                    name={field}
                    value={(dados as any)[field] || ''}
                    onChange={handleChange}
                    placeholder={`Digite ${label}`}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-red-600 text-black"
                  />
                </div>
              ))}

              {[{
                label: 'Nova Senha', value: novaSenha, setValue: setNovaSenha,
                mostrar: mostrarSenha, setMostrar: setMostrarSenha,
              },
              {
                label: 'Confirmar Nova Senha', value: confirmarSenha, setValue: setConfirmarSenha,
                mostrar: mostrarConfirmar, setMostrar: setMostrarConfirmar,
              }
              ].map(({ label, value, setValue, mostrar, setMostrar }, idx) => (
                <div key={idx} className="md:col-span-2 space-y-1 relative">
                  <p className="text-lg font-semibold">{label}</p>
                  <input
                    type={mostrar ? 'text' : 'password'}
                    name={label.toLowerCase().replace(/ /g, '')}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={label}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-red-600 text-black pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrar(!mostrar)}
                    className="absolute right-3 top-1/2 text-gray-600"
                  >
                    {mostrar ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 🔥 Rodapé Fixo */}
        {abaAberta === 'dados' && (
          <div className="flex flex-col gap-3 px-6 pb-6 pt-4 border-t border-gray-300">
            <button
              onClick={handleSubmit}
              className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md hover:scale-105 transition"
            >
              Atualizar Dados
            </button>
            <button
              onClick={onLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:scale-105 transition"
            >
              Desconectar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalPerfil;
