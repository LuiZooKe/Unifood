import React from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';

interface Produto {
  nome: string;
  preco: string;
  imagem: string;
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
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Fundo escurecido */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />

      {/* Container Central do Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-auto">
        <Dialog.Panel className="bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-12 relative">
          {/* Botão de Fechar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Título da Categoria */}
          <Dialog.Title className="text-3xl font-extrabold mb-8 uppercase text-gray-900 text-center">
            {categoria}
          </Dialog.Title>

          {/* Lista de Produtos com Grid Responsivo */}
          <div
            className={`grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3`}
          >
            {produtos.map((produto, index) => (
              <div
                key={index}
                className="border rounded-xl p-4 shadow-md hover:shadow-lg transition flex flex-col justify-between items-center text-center h-full"
              >
                <img
                  src={produto.imagem}
                  alt={produto.nome}
                  className="w-full h-48 object-cover rounded mb-3"
                />
                <h3 className="text-lg font-bold leading-tight min-h-[3.5rem]">
                  {produto.nome}
                </h3>
                <p className="text-red-600 font-semibold text-[1.6rem] mt-3">
                  {produto.preco}
                </p>
              </div>
            ))}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>

  );
};
