import React, { useState } from 'react';

interface AdicionarSaldoProps {
  aberto: boolean;
  onFechar: () => void;
  onAdicionar: (valor: number) => void;
}

const AdicionarSaldo: React.FC<AdicionarSaldoProps> = ({
  aberto,
  onFechar,
  onAdicionar,
}) => {
  const [valor, setValor] = useState('');

  if (!aberto) return null;

  const formatarValor = (valor: string) => {
    const numeros = valor.replace(/\D/g, '');
    const numero = parseFloat(numeros) / 100;
    return numero.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorFormatado = formatarValor(e.target.value);
    setValor(valorFormatado);
  };

  const handleAdicionar = () => {
    const valorNum = Number(valor.replace(/\D/g, '')) / 100;
    if (isNaN(valorNum) || valorNum <= 0) {
      alert('Informe um valor válido!');
      return;
    }
    onAdicionar(valorNum);
    setValor('');
    onFechar();
  };

  return (
    <div className="absolute inset-0 z-[9999] bg-black/50 flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] md:w-[360px]">
        <h2 className="text-5xl font-bold text-center mb-4">
          Adicionar Saldo
        </h2>
        <input
          type="text"
          placeholder="Digite o valor"
          value={valor}
          onChange={handleValorChange}
          className="w-full border border-gray-300 rounded-xl px-3 py-2 mb-4"
        />
        <div className="flex gap-2">
          <button
            onClick={handleAdicionar}
            className="flex-1 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold"
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

export default AdicionarSaldo;
