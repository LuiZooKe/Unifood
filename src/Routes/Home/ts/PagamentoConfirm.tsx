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
        className="bg-white rounded-3xl shadow-xl p-8 w-[90%] max-w-[420px] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[clamp(2rem,5vw,3rem)] font-extrabold mb-4 text-center text-green-600">
          PAGAMENTO APROVADO ✅
        </h2>

        <p className="text-center text-lg text-gray-800 mb-4">
          Seu pedido foi confirmado com sucesso!
        </p>

        {/* 🔥 Área de Animação ou Imagem */}
        <img
          src="/img/acompanhar-pedido.gif"
          alt="Como acompanhar pedido"
          className="w-full rounded-xl mb-4"
        />
        {/* Caso não tenha imagem ainda, pode comentar essa parte */}

        <p className="text-center text-sm text-gray-800 mb-2">
          ➡️ Para retirar, vá na aba <strong>Pedidos 📦</strong> e use o <strong>QR-Code</strong> para mostrar no balcão.
        </p>

        <p className="text-center text-xs text-gray-500 mb-6">
          Acompanhe o status do seu pedido na aba Pedidos.
        </p>

        <button
          onClick={handleConfirmar}
          className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-lg"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default PagamentoConfirm;
