import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
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

  const [modalSaldoAberto, setModalSaldoAberto] = useState(false);
  const [modalCartaoAberto, setModalCartaoAberto] = useState(false);
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
      className={`fixed ${aberto ? 'flex' : 'hidden'}
        top-1/2 left-1/2 md:top-20 md:right-5 md:left-auto md:translate-x-0
        -translate-x-1/2 -translate-y-1/2 md:translate-y-0
        z-[9999] bg-gradient-to-b from-white/30 via-white/10 to-gray-300/30 
        backdrop-blur-2xl rounded-3xl shadow-2xl 
        p-6 flex-col w-[90%] md:w-[380px] h-[90%] md:h-auto`}
    >
      <div className="md:hidden flex justify-end mb-4">
        <button
          onClick={onFechar}
          className="text-gray-700 text-3xl font-bold hover:text-red-700"
        >
          ✕
        </button>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">MEU PERFIL</h2>

      <div className="flex gap-2 mb-4">
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

      {/* Aba Dados */}
      <div
        className={`${abaAberta === 'dados' ? 'block' : 'hidden'
          } grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700`}
      >
        <div className="md:col-span-2">
          <p className="text-xl font-semibold text-center">{dados.nome}</p>
        </div>
        <div className="md:col-span-2">
          <p className="text-xl font-semibold text-center">{dados.email}</p>
        </div>

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

        {[
          {
            label: 'Nova Senha',
            value: novaSenha,
            setValue: setNovaSenha,
            mostrar: mostrarSenha,
            setMostrar: setMostrarSenha,
          },
          {
            label: 'Confirmar Nova Senha',
            value: confirmarSenha,
            setValue: setConfirmarSenha,
            mostrar: mostrarConfirmar,
            setMostrar: setMostrarConfirmar,
          },
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
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

      {/* Aba Carteira */}
      <div className={`${abaAberta === 'carteira' ? 'block' : 'hidden'}`}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-md text-gray-700">Saldo Atual:</p>
            <p className="text-4xl font-bold text-green-600">
              R$ {Number(dados.saldo || 0).toFixed(2)}
            </p>
          </div>
          <button
            className="py-2 px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md"
            onClick={() => setModalSaldoAberto(true)}
          >
            Adicionar Saldo
          </button>
        </div>

        {cartao ? (
          <div className="w-full bg-white/30 backdrop-blur-md rounded-xl p-4 shadow-md">
            <p className="text-lg font-semibold text-gray-800 mb-2">Cartão Cadastrado:</p>
            <p className="text-2xl text-gray-700">
              <strong>Número:</strong> **** **** **** {cartao.numero.slice(-4)}
            </p>
            <p className="text-2xl text-gray-700">
              <strong>Nome:</strong> {cartao.nome}
            </p>
            <p className="text-2xl text-gray-700">
              <strong>Validade:</strong> {cartao.validade}
            </p>
            <button
              className="mt-3 w-full py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md"
              onClick={() => setCartao(null)}
            >
              Remover Cartão
            </button>
          </div>
        ) : (
          <button
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md hover:scale-105 transition"
            onClick={() => setModalCartaoAberto(true)}
          >
            Adicionar Cartão de Crédito
          </button>
        )}
      </div>


      <AdicionarSaldo
        aberto={modalSaldoAberto}
        onFechar={() => setModalSaldoAberto(false)}
        onAdicionar={(valor) => {
          const novoSaldo = Number(dados.saldo || 0) + valor;
          const dadosAtualizados = { ...dados, saldo: novoSaldo };
          setDados(dadosAtualizados);
          localStorage.setItem('dadosUsuario', JSON.stringify(dadosAtualizados));
          alert(`Saldo adicionado com sucesso! Novo saldo: R$ ${novoSaldo.toFixed(2)}`);
        }}
      />

      <AdicionarCartao
        aberto={modalCartaoAberto}
        onFechar={() => setModalCartaoAberto(false)}
        onAdicionar={(dadosCartao) => {
          setCartao(dadosCartao);
          alert('Cartão cadastrado com sucesso!');
        }}
      />
    </div>
  );
};

export default PerfilDropdown;
