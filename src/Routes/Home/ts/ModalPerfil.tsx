import React from 'react';
import { X } from 'lucide-react';

interface Usuario {
  nome?: string;
  email?: string;
  tipo_usuario?: string;
}

interface ModalPerfilProps {
  aberto: boolean;
  usuario: Usuario;
  abaAberta: 'dados' | 'carteira' | string;
  setAbaAberta: (aba: string) => void;
  onFechar: () => void;
  onLogout: () => void;
}

function ModalPerfil({
  aberto,
  usuario,
  abaAberta,
  setAbaAberta,
  onFechar,
  onLogout,
}: ModalPerfilProps) {
  if (!aberto) return null;

  const renderConteudo = () => {
    if (abaAberta === 'dados') {
      return (
        <div className="mt-6">
          <h3 className="text-2xl font-semibold mb-4">Seus Dados</h3>
          <ul className="mb-6 space-y-2 text-gray-700">
            <li><strong>Nome:</strong> {usuario.nome || 'Não informado'}</li>
            <li><strong>Email:</strong> {usuario.email || 'Não informado'}</li>
            <li><strong>Tipo de usuário:</strong> {
              usuario.tipo_usuario === '1' ? 'Aluno/Professor' :
              usuario.tipo_usuario === '2' ? 'Responsável' : 'Não informado'
            }</li>
          </ul>

          <button className="mb-3 w-full py-2 px-4 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold">
            Alterar Senha
          </button>
          <button className="w-full py-2 px-4 rounded bg-yellow-500 hover:bg-yellow-600 text-white font-semibold">
            Atualizar Dados
          </button>
        </div>
      );
    }

    if (abaAberta === 'carteira') {
      return (
        <div className="mt-6 text-gray-600">
          Funcionalidade de carteira será adicionada futuramente.
        </div>
      );
    }

    return (
      <p className="text-gray-600 mt-6">
        Escolha uma opção abaixo para gerenciar seu perfil.
      </p>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1001]">
      <div className="bg-white w-full max-w-[100vh] max-h-[100vh] overflow-auto rounded-2xl shadow-xl p-6 sm:p-10 relative text-[clamp(1rem,2.5vw,2rem)]">
        <button
          onClick={onFechar}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
        >
          <X className="w-8 h-8" />
        </button>

        <h2 className="text-5xl font-bold text-gray-800 mb-4">Meu Perfil</h2>

        <div className="flex gap-4 mt-4">
          <button
            onClick={() => setAbaAberta('dados')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold ${
              abaAberta === 'dados'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Dados
          </button>
          <button
            onClick={() => setAbaAberta('carteira')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold ${
              abaAberta === 'carteira'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Carteira
          </button>
        </div>

        {renderConteudo()}

        <div className="mt-3">
          <button
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            Desconectar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalPerfil;