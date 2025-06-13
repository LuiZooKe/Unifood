import React from 'react';
import { X } from 'lucide-react';

interface Produto {
  nome: string;
  preco: string;
  imagem: string;
  quantidade: number;
}

interface ModalCarrinhoProps {
  aberto: boolean;
  itens: Produto[];
  onFechar: () => void;
  onRemover: (nomeProduto: string) => void;
  onAlterarQuantidade: (nomeProduto: string, novaQuantidade: number) => void;
  calcularTotal: () => string;
}

function ModalCarrinho({
  aberto,
  itens,
  onFechar,
  onRemover,
  onAlterarQuantidade,
  calcularTotal,
}: ModalCarrinhoProps) {
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000] px-4">
      <div className="bg-white w-full max-w-[100vh] max-h-[100vh] overflow-auto rounded-2xl shadow-xl p-6 sm:p-10 relative text-[clamp(1rem,2.5vw,2rem)]">
        {/* Botão de fechar */}
        <button
          onClick={onFechar}
          className="absolute top-6 right-6 text-gray-500 hover:text-red-500"
        >
          <X className="w-10 h-10 sm:w-12 sm:h-12" />
        </button>

        {/* Título */}
        <h2 className="text-center mb-10 mt-4 font-extrabold text-gray-800 leading-tight">
          <span className="block whitespace-nowrap text-[clamp(2.5rem,6vw,4rem)]">CARRINHO</span>
          <span className="block whitespace-nowrap text-[clamp(2.5rem,5vw,4rem)]">🛒</span>
        </h2>

        {/* Lista de itens */}
        {itens.length === 0 ? (
          <p className="text-gray-600 text-center text-[clamp(1.25rem,3vw,2rem)]">
            Seu carrinho está vazio.
          </p>
        ) : (
          <ul className="space-y-6 max-h-[55vh] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {itens.map((item, index) => (
              <li
                key={index}
                className="flex gap-6 bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <img
                  src={item.imagem}
                  alt={item.nome}
                  className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] object-cover rounded-lg flex-shrink-0"
                />

                <div className="flex flex-col justify-between w-full">
                  <div className="flex flex-col justify-end flex-grow">
                    <h4 className="font-bold text-gray-800 leading-tight text-[clamp(1.5rem,3vw,2.5rem)] break-words">
                      {item.nome}
                    </h4>
                    <p className="text-gray-600 mt-1 text-[clamp(1.25rem,2.5vw,2rem)]">
                      Preço: <span className="font-semibold">{item.preco}</span>
                    </p>
                  </div>

                  <div className="flex flex-col items-end mt-4 gap-2">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => onAlterarQuantidade(item.nome, item.quantidade - 1)}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-xl font-bold"
                      >
                        −
                      </button>
                      <span className="text-2xl font-semibold">{item.quantidade}</span>
                      <button
                        onClick={() => onAlterarQuantidade(item.nome, item.quantidade + 1)}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-xl font-bold"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => onRemover(item.nome)}
                      className="text-red-600 hover:text-red-800 text-lg font-medium"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 pt-6 border-t border-gray-300 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
          <p className="text-2xl font-bold text-gray-800">
            TOTAL: <span className="text-green-600">R$ {calcularTotal()}</span>
          </p>
          <button
            onClick={() => alert("Funcionalidade de finalizar compra ainda não implementada!")}
            className="bg-green-600 hover:bg-green-700 text-white font-bold text-2xl py-4 px-8 rounded-xl shadow-md hover:shadow-xl transition-all"
          >
            Finalizar Compra
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalCarrinho;
