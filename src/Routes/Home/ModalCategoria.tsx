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
  const numProdutos = produtos.length;
  const numColunas = Math.min(numProdutos, 3); // máximo 4 colunas

  // Largura do modal com base na quantidade de colunas
  const larguraModal =
    numColunas === 1
      ? 'max-w-[30%]'
      : numColunas === 2
      ? 'max-w-[45%]'
      : numColunas === 3
      ? 'max-w-[60%]'
      : 'max-w-[60%]'; // 4 ou mais

  // Classe de grid com base no número de colunas
  const gridColsClass =
    numColunas === 1
      ? 'grid-cols-1'
      : numColunas === 2
      ? 'grid-cols-2'
      : numColunas === 3
      ? 'grid-cols-3'
      : 'grid-cols-4';

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel
          className={`bg-white w-full ${larguraModal} rounded-2xl shadow-xl p-12 relative`}
        >
          {/* Botão de Fechar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Título da Categoria */}
          <Dialog.Title className="text-3xl font-extrabold mb-12 uppercase text-gray-900 text-center">
            {categoria}
          </Dialog.Title>

          {/* Lista de Produtos */}
          <div
            className={`grid ${gridColsClass} gap-6 ${
              numProdutos > 4 ? 'max-h-[70vh] overflow-y-auto' : ''
            }`}
          >
            {produtos.map((produto, index) => (
              <div
                key={index}
                className="border rounded-xl p-4 shadow-md hover:shadow-lg transition flex flex-col justify-between items-center text-center h-full"
              >
                {/* Imagem do Produto */}
                <img
                  src={produto.imagem}
                  alt={produto.nome}
                  className="w-full h-48 object-cover rounded mb-3"
                />

                {/* Nome do Produto */}
                <h3 className="text-lg font-bold leading-tight min-h-[3.5rem]">
                  {produto.nome}
                </h3>

                {/* Preço */}
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
