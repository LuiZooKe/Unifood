import React, { useState } from 'react';

interface AdicionarSaldoProps {
  visivel: boolean;
  onAdicionar: (valor: number) => void;
}

const AdicionarSaldo: React.FC<AdicionarSaldoProps> = ({
  visivel,
  onAdicionar,
}) => {
  const [valor, setValor] = useState('');

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
  };

  if (!visivel) return null;

  return (
    <div className="w-full bg-white/40 backdrop-blur-md rounded-2xl shadow-md p-4">
      <h2 className="text-5xl font-bold mb-4 text-center">Adicionar Saldo</h2>
      <div className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Digite o valor"
          value={valor}
          onChange={handleValorChange}
          className="w-full border border-gray-300 rounded-xl px-3 py-2"
        />
        <button
          onClick={handleAdicionar}
          className="w-full py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold"
        >
          Adicionar
        </button>
      </div>
    </div>
  );
};

export default AdicionarSaldo;
