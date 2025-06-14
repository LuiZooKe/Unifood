import React, { useState, useEffect } from 'react';

interface Usuario {
  nome?: string;
  email?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  telefone?: string;
  saldo?: number;
}

interface PerfilDropdownProps {
  aberto: boolean;
  usuario: Usuario;
  abaAberta: 'carteira' | 'dados';
  setAbaAberta: (aba: 'carteira' | 'dados') => void;
  onFechar: () => void;
  onLogout: () => void;
  onSalvar: (dadosAtualizados: Usuario) => void;
}

const PerfilDropdown: React.FC<PerfilDropdownProps> = ({
  aberto,
  usuario,
  abaAberta,
  setAbaAberta,
  onFechar,
  onLogout,
  onSalvar,
}) => {
  const [dados, setDados] = useState<Usuario>(usuario);

  useEffect(() => {
    const dadosUsuario = JSON.parse(localStorage.getItem('dadosUsuario') || '{}');
    setDados({ ...usuario, ...dadosUsuario });

    if (dadosUsuario.email) {
      fetch(`http://localhost/UNIFOOD/database/get_perfil.php?email=${dadosUsuario.email}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setDados(data.dados);
            localStorage.setItem('dadosUsuario', JSON.stringify(data.dados));
          }
        })
        .catch(err => console.error('Erro ao buscar perfil:', err));
    }
  }, [usuario]);

  if (!aberto) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDados((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
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

      if (result.success) {
        alert('Dados atualizados com sucesso!');
        const dadosAtualizados = {
          ...dados,
          nome: dados.nome,
          email: dados.email,
        };
        localStorage.setItem('dadosUsuario', JSON.stringify(dadosAtualizados));
        onSalvar(dadosAtualizados);
        onFechar();
      } else {
        alert('Erro ao atualizar dados: ' + result.message);
      }
    } catch (error) {
      console.error('Erro na atualização:', error);
      alert('Erro na conexão com o servidor.');
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-[400px] bg-white border border-gray-200 rounded-3xl shadow-2xl p-6 z-[9999]">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">MEU PERFIL</h2>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setAbaAberta('carteira')}
          className={`flex-1 py-3 rounded-xl font-semibold ${
            abaAberta === 'carteira'
              ? 'bg-green-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          Carteira
        </button>
        <button
          onClick={() => setAbaAberta('dados')}
          className={`flex-1 py-3 rounded-xl font-semibold ${
            abaAberta === 'dados'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          Dados
        </button>
      </div>

      {abaAberta === 'dados' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nome */}
          <div className="md:col-span-2">
            <p className="text-2xl font-semibold text-gray-700 text-center">
              <span className="font-bold">Nome:</span> {dados.nome || 'Não informado'}
            </p>
          </div>

          {/* Email */}
          <div className="md:col-span-2">
            <p className="text-2xl font-semibold text-gray-700 text-center">
              <span className="font-bold">Email:</span> {dados.email || 'Não informado'}
            </p>
          </div>

          {/* Logradouro */}
          <div className="space-y-1">
            <p className="text-2xl font-semibold text-gray-700">Logradouro</p>
            <input
              type="text"
              name="logradouro"
              value={dados.logradouro || ''}
              onChange={handleChange}
              placeholder="Digite o logradouro"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-red-600 text-black"
            />
          </div>

          {/* Número */}
          <div className="space-y-1">
            <p className="text-2xl font-semibold text-gray-700">Número</p>
            <input
              type="text"
              name="numero"
              value={dados.numero || ''}
              onChange={handleChange}
              placeholder="Nº"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-red-600 text-black"
            />
          </div>

          {/* Bairro */}
          <div className="space-y-1">
            <p className="text-2xl font-semibold text-gray-700">Bairro</p>
            <input
              type="text"
              name="bairro"
              value={dados.bairro || ''}
              onChange={handleChange}
              placeholder="Digite o bairro"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-red-600 text-black"
            />
          </div>

          {/* Cidade */}
          <div className="space-y-1">
            <p className="text-2xl font-semibold text-gray-700">Cidade</p>
            <input
              type="text"
              name="cidade"
              value={dados.cidade || ''}
              onChange={handleChange}
              placeholder="Digite a cidade"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-red-600 text-black"
            />
          </div>

          {/* Telefone */}
          <div className="md:col-span-2 space-y-1">
            <p className="text-2xl font-semibold text-gray-700">Telefone</p>
            <input
              type="text"
              name="telefone"
              value={dados.telefone || ''}
              onChange={handleChange}
              placeholder="Digite o telefone"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-red-600 text-black"
            />
          </div>

          {/* Ações */}
          <div className="md:col-span-2 flex gap-3">
            <button className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md hover:scale-105 transition">
              Alterar Senha
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md hover:scale-105 transition"
            >
              Salvar
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
      ) : (
        <div className="bg-gray-100 rounded-xl p-6 text-center">
          <p className="text-2xl font-semibold text-gray-700 pb-2">Saldo Atual</p>
          <p className="text-5xl font-bold text-green-600">
            R$ {dados.saldo?.toFixed(2) || '0.00'}
          </p>
        </div>
      )}
    </div>
  );
};

export default PerfilDropdown;
