import React from 'react';

interface PagamentoProps {
  visivel: boolean;
  onPix: () => void;
  onCartao: () => void;
  onSaldo: () => void;
  onFechar: () => void;
}

const Pagamento: React.FC<PagamentoProps> = ({
  visivel,
  onPix,
  onCartao,
  onSaldo,
  onFechar,
}) => {
  if (!visivel) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-md flex items-center justify-center"
      onClick={onFechar}
    >
      <div
        className="bg-white rounded-3xl shadow-xl p-8 w-[90%] max-w-[400px] flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-4xl font-bold mb-6 text-center">
          PAGAMENTO 💳
        </h2>

        <button
          onClick={onPix}
          className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold"
        >
          Pagar com Pix
        </button>

        <button
          onClick={onCartao}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        >
          Pagar com Cartão
        </button>

        <button
          onClick={onSaldo}
          className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold"
        >
          Pagar com Saldo
        </button>
      </div>
    </div>
  );
};

export default Pagamento;
