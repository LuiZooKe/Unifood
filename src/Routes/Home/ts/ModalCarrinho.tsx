import React, { useState } from 'react';
import { X } from 'lucide-react';

interface Produto {
  nome: string;
  preco: string;
  imagem: string;
  quantidade: number;
}

interface Usuario {
  nome?: string;
  email: string;
  saldo: number;
  numero_cartao?: string;
}

interface ModalCarrinhoProps {
  aberto: boolean;
  onFechar: () => void;
  onAbrirPagamento: () => void;
  itens: Produto[];
  calcularTotal: () => string;
  onAlterarQuantidade: (nome: string, novaQuantidade: number) => void;
  onRemover: (nome: string) => void;
  limparCarrinho: () => void;
  usuario: Usuario;
  atualizarUsuario: (usuarioAtualizado: Usuario) => void;
}

const ModalCarrinho: React.FC<ModalCarrinhoProps> = ({
  aberto,
  onFechar,
  onAbrirPagamento,
  itens,
  calcularTotal,
  onAlterarQuantidade,
  onRemover,
  limparCarrinho,
  usuario,
  atualizarUsuario,
}) => {
  const [abaAberta, setAbaAberta] = useState<'carrinho' | 'pedidos'>('carrinho');

  if (!aberto) return null;

  return (
    <div
      className={`
    fixed inset-0 z-[9999]
    flex items-center justify-center
    md:inset-auto md:top-28 md:right-[3.5rem] md:items-start md:justify-end
    bg-black/70 backdrop-blur-xl md:bg-transparent
    md:rounded-3xl shadow-2xl
  `}
      onClick={onFechar}
    >
      <div
        className="bg-white/95 backdrop-blur-md w-[90%] max-w-[500px] max-h-[90vh] md:max-h-[90vh]
    md:w-[380px] rounded-3xl shadow-xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >

        {/* 🔥 Cabeçalho igual ao perfil */}
        <div className="flex justify-center items-center relative py-4 border-b border-gray-300">
          <h2 className="text-center font-extrabold text-gray-800 leading-tight">
            <span className="block text-[clamp(2.5rem,6vw,4rem)]">Pedidos 🛍️</span>
          </h2>
          <button
            onClick={onFechar}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500"
          >
            <X className="w-8 h-8 sm:w-10 sm:h-10" />
          </button>
        </div>

        {/* 🔥 Conteúdo rolável */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* 🔥 Botões Carrinho e Pedidos */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setAbaAberta('carrinho')}
              className={`flex-1 py-2 rounded-xl font-semibold ${abaAberta === 'carrinho'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
            >
              Carrinho 🛒
            </button>
            <button
              onClick={() => setAbaAberta('pedidos')}
              className={`flex-1 py-2 rounded-xl font-semibold ${abaAberta === 'pedidos'
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
            >
              Pedidos 🍔
            </button>
          </div>

          {/* 🔥 Conteúdo das abas */}
          {abaAberta === 'carrinho' ? (
            <>
              {itens.length === 0 ? (
                <p className="text-center text-gray-700">Seu carrinho está vazio.</p>
              ) : (
                <div className="space-y-4 max-h-[50vh] md:max-h-[60vh] overflow-y-auto pr-2">
                  {itens.map((item) => (
                    <div
                      key={item.nome}
                      className="flex gap-4 bg-white rounded-xl p-4 shadow"
                    >
                      <img
                        src={item.imagem}
                        alt={item.nome}
                        className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] object-cover rounded-lg flex-shrink-0"
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
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              {/* 🔥 Aba de Pedidos */}
              <div className="bg-gray-100 rounded-xl p-4 text-center">
                <p className="text-lg text-gray-800 font-semibold">Você ainda não possui pedidos. 🍔</p>
                <p className="text-sm text-gray-600 mt-1">Quando fizer algum, eles aparecerão aqui.</p>
              </div>
            </>
          )}
        </div>

        {/* 🔥 Rodapé — aparece apenas na aba Carrinho */}
        {abaAberta === 'carrinho' && itens.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-300 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 px-6 pb-6">
            <p className="text-2xl font-bold text-gray-800">
              TOTAL: <span className="text-green-600">R$ {calcularTotal()}</span>
            </p>
            <button
              onClick={onAbrirPagamento}
              className="bg-green-600 hover:bg-green-700 text-white font-bold text-2xl py-3 px-8 rounded-xl shadow-md hover:shadow-xl transition-all"
            >
              Finalizar Compra
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalCarrinho;
