import React from 'react';
import { X } from 'lucide-react';

interface PixProps {
  visivel: boolean;
  onFechar: () => void;
  onConfirmarPagamento: () => void;
  pedidoId: number;
  total: string;
}

const Pix: React.FC<PixProps> = ({
  visivel,
  onFechar,
  onConfirmarPagamento,
  pedidoId,
  total
}) => {
  if (!visivel) return null;

  const codigoQrFicticio = JSON.stringify({
    pedido: pedidoId,
    valor: total,
    descricao: 'Pagamento via Pix - UniFood',
  });

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center"
      onClick={onFechar}
    >
      <div
        className="bg-white rounded-3xl shadow-xl p-8 w-[92%] max-w-[460px] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 🔥 Cabeçalho */}
        <div className="flex justify-between items-center w-full mb-4">
          <h2 className="text-4xl font-extrabold text-center w-full text-gray-800">
            Pagamento via Pix
          </h2>
          <button
            onClick={onFechar}
            className="text-gray-500 hover:text-black absolute right-6 top-6"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* 💰 Valor */}
        <p className="text-2xl mb-2">
          Total: <strong className="text-green-700">R$ {total}</strong>
        </p>

        {/* 📸 QR Code */}
        <div className="flex justify-center mb-4">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
              codigoQrFicticio
            )}`}
            alt="QR Code Pix"
            className="rounded-xl border border-gray-300"
          />
        </div>

        {/* 🧾 Instruções */}
        <p className="text-base text-center mb-4 text-gray-600">
          Escaneie o QR Code para simular o pagamento ou clique em{' '}
          <strong>"Confirmar Pagamento"</strong> para continuar.
        </p>

        {/* ✅ Botão Confirmar */}
        <button
          onClick={onConfirmarPagamento}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-2xl font-semibold transition"
        >
          ✅ Confirmar Pagamento
        </button>
      </div>
    </div>
  );
};

export default Pix;
