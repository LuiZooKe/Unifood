import React from 'react';
import { X } from 'lucide-react';

interface Produto {
  nome: string;
  preco: string;
  imagem: string;
  quantidade: number;
}

interface Usuario {
  nome?: string;
  email?: string;
  saldo?: number;
  numero_cartao?: string;
}

interface PagamentoProps {
  visivel: boolean;
  onFechar: () => void;
  onPagar: (metodo: 'pix' | 'cartao' | 'saldo') => void;
  itens: Produto[];
  total: string;
  usuario: Usuario;
}

const Pagamento: React.FC<PagamentoProps> = ({
  visivel,
  onFechar,
  onPagar,
  itens,
  total,
  usuario,
}) => {
  if (!visivel) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-md flex items-center justify-center"
      onClick={onFechar}
    >
      <div
        className="bg-white rounded-3xl shadow-xl p-10 w-[92%] max-w-[500px] flex flex-col items-center max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onFechar}
          className="absolute top-6 right-6 text-gray-500 hover:text-red-500"
        >
          <X className="w-10 h-10" />
        </button>

        {/* Título */}
        <h2 className="text-5xl font-extrabold mb-10 text-center text-gray-900">
          Revisar Pedido
        </h2>

        {/* Dados do Cliente */}
        <div className="w-full mb-8">
          <h3 className="text-3xl font-bold mb-3 text-gray-700">Cliente</h3>
          <div className="space-y-2 text-2xl text-gray-800">
            <p><strong>Nome:</strong> {usuario.nome}</p>
            <p><strong>Email:</strong> {usuario.email}</p>
            <p><strong>Saldo:</strong> R$ {(usuario.saldo ?? 0).toFixed(2)}</p>
            {usuario.numero_cartao ? (
              <p>
                <strong>Cartão:</strong> **** **** ****{' '}
                {usuario.numero_cartao.slice(-4)}
              </p>
            ) : (
              <p className="text-red-600">Nenhum cartão cadastrado</p>
            )}
          </div>
        </div>

        {/* Itens do Pedido */}
        <div className="w-full mb-8">
          <h3 className="text-3xl font-bold mb-3 text-gray-700">
            Itens do Pedido
          </h3>
          {itens.length === 0 ? (
            <p className="text-center text-2xl text-gray-500">
              Seu carrinho está vazio.
            </p>
          ) : (
            <div className="space-y-6">
              {itens.map((item) => (
                <div
                  key={item.nome}
                  className="flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-3xl text-gray-800">{item.nome}</p>
                    <p className="text-xl text-gray-500">
                      {item.quantidade}x {item.preco}
                    </p>
                  </div>
                  <p className="font-bold text-2xl">
                    R${' '}
                    {(
                      parseFloat(item.preco.replace('R$', '').replace(',', '.')) *
                      item.quantidade
                    ).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Total */}
        <div className="w-full border-t border-gray-200 pt-6 mb-10">
          <p className="text-4xl font-extrabold text-center text-gray-900">
            Total: <span className="text-green-600">R$ {total}</span>
          </p>
        </div>

        {/* Botões */}
        <div className="w-full flex flex-col gap-2">
          <button
            onClick={() => onPagar('pix')}
            className="w-full py-5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-3xl shadow-md hover:shadow-lg transition"
          >
            💸 Pagar com Pix
          </button>

          <button
            onClick={() => onPagar('cartao')}
            className="w-full py-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-3xl shadow-md hover:shadow-lg transition"
          >
            💳 Pagar com Cartão
          </button>

          <button
            onClick={() => onPagar('saldo')}
            className="w-full py-5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-3xl shadow-md hover:shadow-lg transition"
          >
            🏦 Pagar com Saldo
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagamento;
