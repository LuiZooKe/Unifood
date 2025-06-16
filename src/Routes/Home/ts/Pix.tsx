import React from 'react';

interface PixProps {
  visivel: boolean;
  onConfirmar: () => void;
  onFechar: () => void;
}

const Pix: React.FC<PixProps> = ({ visivel, onConfirmar, onFechar }) => {
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
        <h2 className="text-4xl font-bold mb-6 text-center">Pagamento via Pix</h2>
        <div className="flex flex-col items-center gap-4">
          <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
            QR CODE AQUI
          </div>
          <p className="text-center text-gray-600">Escaneie o QR Code ou copie a chave abaixo:</p>
          <div className="bg-gray-100 p-2 rounded-md text-center">
            chavepix@unifood.com
          </div>
          <button
            onClick={onConfirmar}
            className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold"
          >
            Confirmar Pagamento
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pix;
