import React, { useState } from 'react';
import { IMaskInput } from 'react-imask';

interface AdicionarCartaoProps {
  visivel: boolean;
  onAdicionar: (dados: {
    numero: string;
    nome: string;
    validade: string;
    cvv: string;
  }) => void;
}

const AdicionarCartao: React.FC<AdicionarCartaoProps> = ({
  visivel,
  onAdicionar,
}) => {
  const [numero, setNumero] = useState('');
  const [nome, setNome] = useState('');
  const [validade, setValidade] = useState('');
  const [cvv, setCvv] = useState('');

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
  };

  if (!visivel) return null;

  return (
    <div className="w-full bg-white/40 backdrop-blur-md rounded-2xl shadow-md p-4">
      <h2 className="text-5xl font-bold mb-4 text-center">Adicionar Cartão</h2>
      <div className="flex flex-col gap-2">
        <IMaskInput
          mask="0000 0000 0000 0000"
          placeholder="Número do Cartão"
          value={numero}
          onAccept={(value) => setNumero(value)}
          className="w-full border border-gray-300 rounded-xl px-3 py-2"
        />

        <input
          type="text"
          placeholder="Nome no Cartão"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-3 py-2"
        />

        <IMaskInput
          mask="00/00"
          placeholder="Validade (MM/AA)"
          value={validade}
          onAccept={(value) => setValidade(value)}
          className="w-full border border-gray-300 rounded-xl px-3 py-2"
        />

        <IMaskInput
          mask="0000"
          placeholder="CVV"
          value={cvv}
          onAccept={(value) => setCvv(value)}
          className="w-full border border-gray-300 rounded-xl px-3 py-2"
        />

        <button
          onClick={handleAdicionar}
          className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold"
        >
          Adicionar
        </button>
      </div>
    </div>
  );
};

export default AdicionarCartao;
