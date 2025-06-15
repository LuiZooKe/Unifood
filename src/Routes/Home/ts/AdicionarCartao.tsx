import React, { useState } from 'react';

interface AdicionarCartaoProps {
  aberto: boolean;
  onFechar: () => void;
  onAdicionar: (dados: {
    numero: string;
    nome: string;
    validade: string;
    cvv: string;
  }) => void;
}

const AdicionarCartao: React.FC<AdicionarCartaoProps> = ({
  aberto,
  onFechar,
  onAdicionar,
}) => {
  const [numero, setNumero] = useState('');
  const [nome, setNome] = useState('');
  const [validade, setValidade] = useState('');
  const [cvv, setCvv] = useState('');

  if (!aberto) return null;

  const handleAdicionar = () => {
    if (!numero || !nome || !validade || !cvv) {
      alert('Preencha todos os campos!');
      return;
    }
    onAdicionar({ numero, nome, validade, cvv });
    setNumero('');
    setNome('');
    setValidade('');
    setCvv('');
    onFechar();
  };

  return (
    <div className="absolute inset-0 z-[9999] bg-black/50 flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] md:w-[360px]">
        <h2 className="text-5xl font-bold text-center mb-4">
          Adicionar Cartão
        </h2>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Número do Cartão"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-3 py-2"
          />
          <input
            type="text"
            placeholder="Nome no Cartão"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-3 py-2"
          />
          <input
            type="text"
            placeholder="Validade (MM/AA)"
            value={validade}
            onChange={(e) => setValidade(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-3 py-2"
          />
          <input
            type="password"
            placeholder="CVV"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-3 py-2"
          />
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleAdicionar}
            className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold"
          >
            Adicionar
          </button>
          <button
            onClick={onFechar}
            className="flex-1 py-2 rounded-xl bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdicionarCartao;
