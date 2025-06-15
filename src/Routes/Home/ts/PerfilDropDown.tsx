import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import IMask from 'imask';
import AdicionarSaldo from './AdicionarSaldo.tsx';
import AdicionarCartao from './AdicionarCartao.tsx';


interface Usuario {
  nome?: string;
  email?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  celular?: string;
  saldo?: number | string | null;
}

interface Cartao {
  numero: string;
  nome: string;
  validade: string;
}

interface PerfilDropdownProps {
  aberto: boolean;
  usuario: Usuario;
  onFechar: () => void;
  onLogout: () => void;
  onSalvar: (dadosAtualizados: Usuario) => void;
}

const PerfilDropdown: React.FC<PerfilDropdownProps> = ({
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

  const [saldoAberto, setSaldoAberto] = useState(false);
  const [cartaoAberto, setCartaoAberto] = useState(false);
  const [cartao, setCartao] = useState<Cartao | null>(null);

  useEffect(() => {
    const dadosUsuario = JSON.parse(localStorage.getItem('dadosUsuario') || '{}');
    setDados({ ...usuario, ...dadosUsuario });

    if (dadosUsuario.email) {
      fetch(`http://localhost/UNIFOOD/database/get_perfil.php?email=${dadosUsuario.email}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            const dadosRecebidos = {
              ...data.dados,
              celular: data.dados.telefone,
              saldo: Number(data.dados.saldo || 0),
            };
            delete dadosRecebidos.telefone;

            setDados(prev => ({ ...prev, ...dadosRecebidos }));
            localStorage.setItem('dadosUsuario', JSON.stringify(dadosRecebidos));
          }
        })
        .catch(err => console.error('Erro ao buscar perfil:', err));
    }
  }, [usuario]);

  if (!aberto) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'celular') {
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
          telefone: dados.celular,
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

  return (
    <div
      className={`
    fixed inset-0 z-[9999]
    flex items-center justify-center
    md:inset-auto md:top-28 md:right-[3.5rem] md:items-start md:justify-end
    bg-black/70 backdrop-blur-xl md:bg-transparent
    md:rounded-3xl shadow-2xl
  `}
      onClick={onFechar}
    >


      <div
        className="
    bg-gradient-to-br from-white/80 to-white/50 backdrop-blur-lg
    w-[90%] max-w-[500px] h-[90%]
    md:w-[380px] md:h-auto 
    rounded-3xl shadow-xl 
    overflow-auto relative 
    px-6 py-8
  "
        onClick={(e) => e.stopPropagation()}
      >

        <button
          onClick={onFechar}
          className="absolute top-6 right-6 text-gray-500 hover:text-red-500"
        >
          <X className="w-10 h-10 sm:w-12 sm:h-12" />
        </button>

        <h2 className="text-center mb-8 mt-4 font-extrabold text-gray-800 leading-tight">
          <span className="block text-[clamp(2.5rem,6vw,4rem)]">MEU PERFIL 👤</span>
        </h2>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setAbaAberta('carteira')}
            className={`flex-1 py-2 rounded-xl font-semibold ${abaAberta === 'carteira'
              ? 'bg-green-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
          >
            Carteira
          </button>
          <button
            onClick={() => setAbaAberta('dados')}
            className={`flex-1 py-2 rounded-xl font-semibold ${abaAberta === 'dados'
              ? 'bg-red-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
          >
            Dados
          </button>
        </div>

        {abaAberta === 'carteira' && (
          <>
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-md text-gray-700">Saldo Atual:</p>
                <p className="text-4xl font-bold text-green-600">
                  R$ {Number(dados.saldo || 0).toFixed(2)}
                </p>
              </div>
              <button
                className="py-2 px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md"
                onClick={() => {
                  setSaldoAberto(!saldoAberto);
                  setCartaoAberto(false);
                }}
              >
                {saldoAberto ? 'Fechar' : 'Adicionar Saldo'}
              </button>
            </div>

            {cartao ? (
              <div className="w-full bg-white/40 backdrop-blur-md rounded-xl p-4 shadow-md mb-4">
                <p className="text-lg font-semibold text-gray-800 mb-2">Cartão Cadastrado:</p>
                <p><strong>Número:</strong> **** **** **** {cartao.numero.slice(-4)}</p>
                <p><strong>Nome:</strong> {cartao.nome}</p>
                <p><strong>Validade:</strong> {cartao.validade}</p>
                <button
                  className="mt-3 w-full py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md"
                  onClick={() => setCartao(null)}
                >
                  Remover Cartão
                </button>
              </div>
            ) : (
              <button
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md hover:scale-105 transition mb-4"
                onClick={() => {
                  setCartaoAberto(!cartaoAberto);
                  setSaldoAberto(false);
                }}
              >
                {cartaoAberto ? 'Fechar' : 'Adicionar Cartão de Crédito'}
              </button>
            )}

            <div className="flex flex-col md:flex-row gap-4">
              <AdicionarSaldo
                visivel={saldoAberto}
                onAdicionar={(valor) => {
                  const novoSaldo = Number(dados.saldo || 0) + valor;
                  const dadosAtualizados = { ...dados, saldo: novoSaldo };
                  setDados(dadosAtualizados);
                  localStorage.setItem('dadosUsuario', JSON.stringify(dadosAtualizados));
                  alert(`Saldo adicionado com sucesso! Novo saldo: R$ ${novoSaldo.toFixed(2)}`);
                  setSaldoAberto(false);
                }}
              />
              <AdicionarCartao
                visivel={cartaoAberto}
                onAdicionar={(dadosCartao) => {
                  setCartao(dadosCartao);
                  alert('Cartão cadastrado com sucesso!');
                  setCartaoAberto(false);
                }}
              />
            </div>
          </>
        )}

        {abaAberta === 'dados' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700">
            {[
              { field: 'logradouro', label: 'Logradouro' },
              { field: 'numero', label: 'Número' },
              { field: 'bairro', label: 'Bairro' },
              { field: 'cidade', label: 'Cidade' },
              { field: 'celular', label: 'Celular' },
            ].map(({ field, label }) => (
              <div key={field} className={field === 'celular' ? 'md:col-span-2 space-y-1' : 'space-y-1'}>
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

            <div className="md:col-span-2">
              <button
                onClick={handleSubmit}
                className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md hover:scale-105 transition"
              >
                Atualizar Dados
              </button>
            </div>

            <div className="md:col-span-2">
              <button
                onClick={onLogout}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:scale-105 transition"
              >
                Desconectar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerfilDropdown;
