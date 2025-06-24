import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { notify } from '../../../utils/notify';

interface Produto {
  nome: string;
  preco: string;
  imagem: string;
  descricao: string;
  quantidade: number;
}

interface ModalCategoriaProps {
  categoriaSelecionada: string;
  produtos: Produto[];
  onAddToCart: (produto: Produto) => void;
  onClose: () => void;
  estaLogado: boolean;
}

const ModalCategoria: React.FC<ModalCategoriaProps> = ({
  categoriaSelecionada,
  produtos,
  onAddToCart,
  onClose,
  estaLogado,
}) => {
  if (!categoriaSelecionada) return null;

  return (
    <div className="w-full max-w-[99%] md:max-w-[70%] mx-auto bg-white rounded-3xl shadow-xl border p-10 mb-10">
      <div className="flex justify-between items-center mb-8 relative">
        <h3 className="text-5xl font-bold uppercase text-center w-full text-gray-900">
          {categoriaSelecionada}
        </h3>
        <button
          onClick={onClose}
          className="absolute right-0 text-gray-500 hover:text-red-600 transition"
          title="Fechar"
        >
          ✕
        </button>
      </div>

      <div className="flex gap-8 overflow-x-auto pb-3">
        {produtos.map((produto, index) => {
          const disponivel = produto.quantidade > 0;

          return (
            <div
              key={index}
              className="min-w-[270px] max-w-[270px] bg-white border rounded-2xl shadow-md hover:shadow-xl flex flex-col max-h-[480px]"
            >
              <img
                src={produto.imagem}
                alt={produto.nome}
                className="w-full h-44 object-cover rounded-t-2xl"
              />

              <div className="p-4 flex flex-col flex-1">
                <h4 className="text-[2rem] text-gray-900 font-extrabold leading-tight mb-1 text-center">
                  {produto.nome}
                </h4>

                <p className="text-gray-700 text-[1.2rem] text-center mb-1 break-words max-h-[60px] overflow-y-auto">
                  {produto.descricao || 'Sem descrição.'}
                </p>

                <p
                  className={`text-[1.2rem] font-semibold text-center mb-1 ${
                    disponivel ? 'text-green-600' : 'text-red-500'
                  }`}
                >
                  {disponivel ? 'DISPONÍVEL' : 'EM FALTA'}
                </p>

                <p className="text-red-600 font-extrabold text-[1.5rem] text-center mb-3">
                  {produto.preco}
                </p>

                <button
                  onClick={() => {
                    if (estaLogado && disponivel) {
                      onAddToCart(produto);
                    } else if (!estaLogado) {
                      notify.error('Faça login para adicionar itens ao carrinho!');
                    }
                  }}
                  className={`w-full ${
                    disponivel
                      ? 'bg-red-600 hover:bg-red-700 cursor-pointer'
                      : 'bg-gray-400 cursor-not-allowed'
                  } text-white font-bold rounded-xl py-3 flex justify-center items-center gap-2 mt-auto`}
                  disabled={!disponivel}
                >
                  <ShoppingCart size={20} /> Adicionar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ModalCategoria;
