import React from 'react';

interface PagamentoConfirmProps {
  visivel: boolean;
  onFechar: () => void;
  onConfirmar: () => void;
}

const PagamentoConfirm: React.FC<PagamentoConfirmProps> = ({
  visivel,
  onFechar,
  onConfirmar,
}) => {
  if (!visivel) return null;

  const handleConfirmar = () => {
    onConfirmar();
    onFechar();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-md flex items-center justify-center"
      onClick={handleConfirmar}
    >
      <div
        className="bg-white rounded-3xl shadow-xl p-8 w-[90%] max-w-[400px] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-4xl font-bold mb-6 text-center text-green-600">
          PAGAMENTO APROVADO! ✅
        </h2>
        <p className="text-center text-lg mb-6">
          Seu pedido foi confirmado com sucesso.
        </p>
        <button
          onClick={handleConfirmar}
          className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default PagamentoConfirm;
