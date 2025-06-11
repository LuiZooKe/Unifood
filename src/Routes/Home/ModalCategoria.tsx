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
}

export const ModalCategoria = ({
  isOpen,
  onClose,
  categoria,
  produtos,
}: ModalCategoriaProps) => {
  const [indexVisivel, setIndexVisivel] = useState<number | null>(null);

  const toggleDescricao = (index: number) => {
    if (indexVisivel === index) {
      setIndexVisivel(null); // Oculta se clicar de novo
    } else {
      setIndexVisivel(index); // Mostra a descrição desse card
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-auto">
        <Dialog.Panel className="bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-12 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
          >
            <X className="w-12 h-12" />
          </button>

          <Dialog.Title className="text-3xl font-extrabold mb-8 uppercase text-gray-900 text-center">
            {categoria}
          </Dialog.Title>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {produtos.map((produto, index) => (
              <div
                key={index}
                className="relative border rounded-xl p-4 shadow-md hover:shadow-lg transition flex flex-col justify-between items-center text-center h-full overflow-hidden"
              >
                {/* Overlay de descrição visível apenas quando selecionado */}
                {indexVisivel === index && (
                  <div className="absolute inset-0 bg-white bg-opacity-95 z-20 flex flex-col justify-center items-center p-6">
                    {/* Botão para fechar o overlay */}
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
                      <Info className="w-7 h-7 md:w-8 md:h-8" />
                    </button>

                    <button
                      className="text-white bg-red-600 hover:bg-red-700 p-3 rounded-full transition"
                      title="Adicionar ao carrinho"
                      onClick={() => console.log(`Adicionar ${produto.nome} ao carrinho`)}
                    >
                      <ShoppingCart className="w-7 h-7 md:w-8 md:h-8" />
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
