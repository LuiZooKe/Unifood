import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

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
  const [mostrarCliente, setMostrarCliente] = useState(false);
  const [mostrarItens, setMostrarItens] = useState(true);

  // 🔥 Sempre que abrir o modal, zera o estado:
  useEffect(() => {
    if (visivel) {
      setMostrarCliente(false); // Dados do cliente fechado
      setMostrarItens(true);    // Itens do pedido aberto
    }
  }, [visivel]);

  if (!visivel) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-md flex items-center justify-center"
      onClick={onFechar}
    >
      <div
        className="bg-white rounded-3xl shadow-xl p-8 w-[92%] max-w-[500px] flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 🔥 Botão de Fechar */}
        <button
          onClick={onFechar}
          className="absolute top-6 right-6 text-gray-500 hover:text-red-500"
        >
          <X className="w-10 h-10" />
        </button>

        {/* 🔥 Título */}
        <h2 className="text-5xl font-extrabold mb-4 text-center text-gray-900">
          Revisar Pedido
        </h2>

        {/* 🔥 Accordion Dados do Cliente */}
        <div className="w-full mb-4">
          <button
            onClick={() => setMostrarCliente(!mostrarCliente)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl"
          >
            <span className="text-2xl font-bold text-gray-700">
              Dados do Cliente
            </span>
            {mostrarCliente ? <ChevronUp /> : <ChevronDown />}
          </button>

          {mostrarCliente && (
            <div className="mt-3 space-y-2 px-2 text-xl text-gray-800">
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
          )}
        </div>

        {/* 🔥 Accordion Itens do Pedido */}
        <div className="w-full flex-1 mb-4 overflow-y-auto">
          <button
            onClick={() => setMostrarItens(!mostrarItens)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl"
          >
            <span className="text-2xl font-bold text-gray-700">
              Itens do Pedido
            </span>
            {mostrarItens ? <ChevronUp /> : <ChevronDown />}
          </button>

          {mostrarItens && (
            <div className="mt-3 space-y-4 px-2">
              {itens.length === 0 ? (
                <p className="text-center text-2xl text-gray-500">
                  Seu carrinho está vazio.
                </p>
              ) : (
                itens.map((item) => (
                  <div key={item.nome} className="flex gap-4 items-center">
                    <img
                      src={item.imagem}
                      alt={item.nome}
                      className="w-20 h-20 rounded-xl object-cover border border-gray-200"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-2xl text-gray-800">{item.nome}</p>
                      <p className="text-lg text-gray-500">
                        {item.quantidade}x {item.preco}
                      </p>
                    </div>
                    <p className="font-bold text-xl">
                      R${' '}
                      {(
                        parseFloat(item.preco.replace('R$', '').replace(',', '.')) *
                        item.quantidade
                      ).toFixed(2)}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* 🔥 Total e Botões */}
        <div className="w-full border-t border-gray-200 pt-4">
          <p className="text-3xl font-extrabold text-center text-gray-900 mb-4">
            Total: <span className="text-green-600">R$ {total}</span>
          </p>

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
    </div>
  );
};

export default Pagamento;
