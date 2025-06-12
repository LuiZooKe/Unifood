import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X, Info, ShoppingCart } from 'lucide-react';

interface Produto {
  nome: string;
  preco: string;
  imagem: string;
  descricao: string;
}

interface ModalCategoriaProps {
  isOpen: boolean;
  onClose: () => void;
  categoria: string;
  produtos: Produto[];
  onAddToCart: (produto: Produto) => void;
}

export const ModalCategoria = ({
  isOpen,
  onClose,
  categoria,
  produtos,
  onAddToCart,
}: ModalCategoriaProps) => {
  const [indexVisivel, setIndexVisivel] = useState<number | null>(null);
  const [animacaoCarrinho, setAnimacaoCarrinho] = useState<number | null>(null);

  const toggleDescricao = (index: number) => {
    setIndexVisivel(indexVisivel === index ? null : index);
  };

  const handleAddToCart = (produto: Produto, index: number) => {
    onAddToCart(produto);
    setAnimacaoCarrinho(index);
    setTimeout(() => setAnimacaoCarrinho(null), 1750);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-[1000] px-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-auto">
        <Dialog.Panel className="bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-12 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
          >
            <X className="w-12 h-12" />
          </button>

          <Dialog.Title
  className="font-extrabold uppercase text-gray-900 mb-8 text-center mx-auto block leading-tight max-w-[90vw]"
  style={{
    fontSize: 'clamp(1rem, 10vw, 2.5rem)', // Adapta de 16px até 40px
    textAlign: 'center',
  }}
>
  {categoria}
</Dialog.Title>



          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {produtos.map((produto, index) => (
              <div
                key={index}
                className="relative border rounded-xl p-4 shadow-md hover:shadow-lg transition flex flex-col justify-between items-center text-center h-full overflow-hidden"
              >
                {indexVisivel === index && (
                  <div className="absolute inset-0 bg-white bg-opacity-95 z-20 flex flex-col justify-center items-center p-6">
                    <button
                      onClick={() => setIndexVisivel(null)}
                      className="absolute top-2 right-2 text-gray-500 hover:text-red-600 transition"
                      title="Fechar descrição"
                    >
                      <X className="w-12 h-12" />
                    </button>

                    <p className="text-gray-800 text-base md:text-[20px] leading-relaxed break-words text-center max-h-full max-w-full overflow-y-auto">
                      {produto.descricao || 'Sem descrição.'}
                    </p>
                  </div>
                )}

                <img
                  src={produto.imagem}
                  alt={produto.nome}
                  className="w-full h-48 object-cover rounded mb-3"
                />

                <h3 className="text-lg font-bold leading-tight min-h-[3.5rem] z-10">
                  {produto.nome}
                </h3>

                <div className="flex items-center justify-between w-full mt-3 z-10">
                  <p className="text-red-600 font-semibold text-[2rem]">{produto.preco}</p>

                  <div className="flex items-center gap-3">
                    <button
                      className="text-gray-600 hover:text-blue-600 p-3 rounded-full transition"
                      title="Ver descrição"
                      onClick={() => toggleDescricao(index)}
                    >
                      <Info className="w-9 h-9 md:w-10 md:h-10" />
                    </button>

                    <button
                      className="relative text-white bg-red-600 hover:bg-red-700 p-3 rounded-full transition"
                      title="Adicionar ao carrinho"
                      onClick={() => handleAddToCart(produto, index)}
                    >
                      <ShoppingCart className="w-10 h-10 md:w-12 md:h-12" />

                      {/* +1 animação */}
                      {animacaoCarrinho === index && (
                        <span className="absolute -top-3 -right-3 bg-green-500 text-white rounded-full text-sm px-5 py-4 animate-bounce shadow-md pointer-events-none">
                          +1
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
