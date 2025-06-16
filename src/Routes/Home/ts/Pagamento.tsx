import React from 'react';

interface PagamentoProps {
  visivel: boolean;
  onSelecionar: (metodo: 'pix' | 'cartao' | 'saldo') => void;
  onFechar: () => void;
}

const Pagamento: React.FC<PagamentoProps> = ({
  visivel,
  onSelecionar,
  onFechar,
}) => {
  if (!visivel) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-md flex items-center justify-center"
      onClick={onFechar}
    >
      <div
        className="bg-white rounded-3xl shadow-xl p-8 w-[90%] max-w-[400px]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-4xl font-bold mb-6 text-center">Pagamento</h2>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => onSelecionar('pix')}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold"
          >
            Pagar com Pix
          </button>
          <button
            onClick={() => onSelecionar('cartao')}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            Pagar com Cartão
          </button>
          <button
            onClick={() => onSelecionar('saldo')}
            className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold"
          >
            Pagar com Saldo
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagamento;
