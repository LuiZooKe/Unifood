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
        className="bg-white rounded-3xl shadow-xl p-12 max-w-[90%] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 🔥 Título */}
        <h2 className="text-5x1 font-extrabold mb-4 text-center text-green-600">
          PAGAMENTO APROVADO
        </h2>
        {/* 🔥 Instruções */}
        <p className="text-center text-lg text-gray-800 mb-2">
          Para retirar, vá na aba <strong>Pedidos 🍔</strong>
        </p>
        <p className="text-center text-lg text-gray-800 mb-2">
          e use o <strong>QR-Code</strong> para mostrar no balcão.
        </p>
        {/* 🔥 Vídeo explicativo */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-[36rem] rounded-xl mb-[-4rem] object-cover"
        >
          <source src="/videos/pedido.webm" type="video/webm" />
          Seu navegador não suporta vídeos.
        </video>

        {/* 🔥 Botão de fechar */}
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
