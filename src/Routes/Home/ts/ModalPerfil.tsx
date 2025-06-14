import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

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

interface ModalPerfilProps {
  aberto: boolean;
  usuario: Usuario;
  abaAberta: 'dados' | 'carteira' | string;
  setAbaAberta: (aba: string) => void;
  onFechar: () => void;
  onLogout: () => void;
  onSalvar: (dadosAtualizados: Usuario) => void;
}

function ModalPerfil({
  aberto,
  usuario,
  abaAberta,
  setAbaAberta,
  onFechar,
  onLogout,
  onSalvar,
}: ModalPerfilProps) {
  const [dados, setDados] = useState<Usuario>(usuario);

  useEffect(() => {
    setDados(usuario);
  }, [usuario]);

  if (!aberto) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDados((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSalvar(dados);
  };

  const renderConteudo = () => {
    if (abaAberta === 'dados') {
      return (
        <div className="mt-6">
          <h3 className="text-4xl font-semibold mb-6">Seus Dados</h3>
          <div className="space-y-5">
            {[
              { label: 'Nome', name: 'nome' },
              { label: 'Email', name: 'email' },
              { label: 'Logradouro', name: 'logradouro' },
              { label: 'Número', name: 'numero' },
              { label: 'Bairro', name: 'bairro' },
              { label: 'Cidade', name: 'cidade' },
              { label: 'Telefone', name: 'telefone' },
            ].map((campo) => (
              <div key={campo.name}>
                <label className="block text-lg font-semibold mb-1">
                  {campo.label}:
                </label>
                <input
                  type="text"
                  name={campo.name}
                  value={(dados as any)[campo.name] || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
            ))}

            <div className="flex gap-4 pt-4">
              <button className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md hover:scale-105 transition">
                Alterar Senha
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md hover:scale-105 transition"
              >
                Salvar Dados
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (abaAberta === 'carteira') {
      return (
        <div className="mt-6 flex flex-col items-center">
          <h3 className="text-4xl font-semibold mb-6">Carteira</h3>
          <div className="bg-gray-100 rounded-2xl p-10 w-full max-w-[400px] text-center shadow-inner">
            <p className="text-xl text-gray-700 mb-2">Saldo Atual</p>
            <p className="text-5xl font-bold text-green-600">
              R$ {dados.saldo?.toFixed(2) || '0.00'}
            </p>
            <p className="text-sm text-gray-500 mt-4">
              * Funcionalidade de carteira será adicionada futuramente.
            </p>
          </div>
        </div>
      );
    }

    return (
      <p className="text-gray-600 mt-6">
        Selecione uma aba acima para visualizar ou editar seus dados.
      </p>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[1001]">
      <div className="bg-white w-full max-w-[800px] max-h-[95vh] overflow-auto rounded-3xl shadow-2xl p-8 sm:p-12 relative">
        <button
          onClick={onFechar}
          className="absolute top-6 right-6 text-gray-500 hover:text-red-500"
        >
          <X className="w-8 h-8" />
        </button>

        <h2 className="text-5xl font-extrabold text-gray-800 mb-8">Meu Perfil</h2>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setAbaAberta('dados')}
            className={`flex-1 py-3 rounded-xl font-semibold ${
              abaAberta === 'dados'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            } transition`}
          >
            Dados
          </button>
          <button
            onClick={() => setAbaAberta('carteira')}
            className={`flex-1 py-3 rounded-xl font-semibold ${
              abaAberta === 'carteira'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            } transition`}
          >
            Carteira
          </button>
        </div>

        {renderConteudo()}

        <div className="pt-8">
          <button
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl w-full shadow-md hover:scale-105 transition"
          >
            Desconectar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalPerfil;
