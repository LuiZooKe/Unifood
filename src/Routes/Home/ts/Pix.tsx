import React from 'react';

interface PixProps {
  visivel: boolean;
  onFechar: () => void;
  onConfirmar: () => void;
}

const Pix: React.FC<PixProps> = ({ visivel, onFechar, onConfirmar }) => {
  if (!visivel) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-md flex items-center justify-center"
      onClick={onFechar}
    >
      <div
        className="bg-white rounded-3xl shadow-xl p-8 w-[90%] max-w-[400px] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-4xl font-bold mb-6 text-center">
          QR Code Gerado 🧾
        </h2>
        <p className="text-center text-lg mb-6">
          Simule a leitura do QR Code e clique em "Confirmar Pagamento"
        </p>
        <button
          onClick={onConfirmar}
          className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold mb-3"
        >
          Confirmar Pagamento
        </button>
        <button
          onClick={onFechar}
          className="w-full py-3 rounded-xl bg-gray-400 hover:bg-gray-500 text-white font-semibold"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default Pix;
