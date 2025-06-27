import React, { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';

interface PixProps {
  visivel: boolean;
  onFechar: () => void;
  onConfirmarPagamento: () => void;
  total: string;
  valorParcial?: number; // 🔹 novo
}

const Pix: React.FC<PixProps> = ({
  visivel,
  onFechar,
  onConfirmarPagamento,
  total,
  valorParcial
}) => {
  const [copiado, setCopiado] = useState(false);

  if (!visivel) return null;

  const chavePix = 'unifood@unifucamp.edu.br';

  const valorNumero = valorParcial ?? parseFloat(total.replace(',', '.'));
  const valorFormatado = valorNumero.toFixed(2).replace('.', ',');

  const textoQr = `
    Pagamento UniFood
    Chave: ${chavePix}
    Valor: R$ ${valorFormatado}
    Descrição: Pedido no UniFood
  `.trim();

  const copiarChave = () => {
    navigator.clipboard.writeText(chavePix);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center"
      onClick={onFechar}
    >
      <div
        className="bg-white rounded-3xl shadow-xl p-8 w-[92%] max-w-[460px] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center w-full mb-4">
          <h2 className="text-[clamp(2rem,6vw,3rem)] font-extrabold text-center w-full text-gray-800">
            PAGAMENTO VIA PIX
          </h2>
          <button
            onClick={onFechar}
            className="text-gray-500 hover:text-black absolute right-6 top-6"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        <p className="text-2xl mb-2">
          Total: <strong className="text-green-700">R$ {valorFormatado}</strong>
        </p>

        <div className="flex justify-center mb-4">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
              textoQr
            )}`}
            alt="QR Code Pix"
            className="rounded-xl border border-gray-300"
          />
        </div>

        <div className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 mb-4">
          <p className="text-center text-lg text-gray-800 mb-2">
            Ou utilize nossa chave Pix:
          </p>
          <div className="flex items-center justify-center gap-2">
            <p className="text-x1 font-semibold text-gray-900 break-all">
              {chavePix}
            </p>
            <button
              onClick={copiarChave}
              className="text-green-600 hover:text-green-800 transition"
              title="Copiar chave"
            >
              {copiado ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>

          {copiado && (
            <div className="text-center text-green-600 font-semibold text-sm mt-2 animate-fade-in-out">
              ✅ Chave Pix copiada
            </div>
          )}
        </div>

        <p className="text-lg text-center mb-4 text-gray-600">
          Escaneie o QR Code ou copie a chave Pix para realizar o pagamento.
          Após o pagamento, clique em <strong>"Confirmar Pagamento"</strong> para continuar.
        </p>

        <button
          onClick={onConfirmarPagamento}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-3xl font-semibold transition"
        >
          ✅ Confirmar Pagamento
        </button>
      </div>
    </div>
  );
};

export default Pix;
