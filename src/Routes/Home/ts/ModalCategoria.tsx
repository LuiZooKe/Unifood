import React, { useState } from 'react';
import { Info, ShoppingCart, X } from 'lucide-react';

interface Produto {
  nome: string;
  preco: string;
  imagem: string;
  descricao: string;
}

interface ModalCategoriaProps {
  categoriaSelecionada: string;
  produtos: Produto[];
  onAddToCart: (produto: Produto) => void;
  onClose: () => void;
  estaLogado: boolean; // 👈 adiciona isso
}

const ModalCategoria: React.FC<ModalCategoriaProps> = ({
  categoriaSelecionada,
  produtos,
  onAddToCart,
  onClose,
  estaLogado,
}) => {
  const [descricaoVisivel, setDescricaoVisivel] = useState<number | null>(null);
  const [animacaoCarrinho, setAnimacaoCarrinho] = useState<number | null>(null);

  const handleAddToCart = (produto: Produto, index: number) => {
    onAddToCart(produto);
    setAnimacaoCarrinho(index);
    setTimeout(() => setAnimacaoCarrinho(null), 1500);
  };

  if (!categoriaSelecionada) return null;

  return (
    <div
      className="w-full max-w-[99%] md:max-w-[70%] mx-auto bg-white rounded-3xl shadow-xl border p-10 mb-10"
    >
      <div className="flex justify-between items-center mb-8 relative">
        <h3 className="text-5xl font-bold uppercase text-center w-full text-gray-900">
          {categoriaSelecionada}
        </h3>
        <button
          onClick={onClose}
          className="absolute right-0 text-gray-500 hover:text-red-600 transition"
          title="Fechar"
        >
          <X className="w-12 h-12" />
        </button>
      </div>

      <div className="flex gap-8 overflow-x-auto pb-3">
        {produtos.map((produto, index) => (
          <div
            key={index}
            className="min-w-[270px] max-w-[270px] bg-white border rounded-2xl shadow-md hover:shadow-xl transition flex-shrink-0 relative"
          >
            {/* Descrição flutuante */}
            {descricaoVisivel === index && (
              <div className="absolute inset-0 bg-white z-20 flex flex-col justify-center items-center p-6 border rounded-2xl">
                <button
                  onClick={() => setDescricaoVisivel(null)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
                >
                  ✕
                </button>
                <p className="text-gray-800 text-base leading-relaxed text-center">
                  {produto.descricao || 'Sem descrição.'}
                </p>
              </div>
            )}

            <img
              src={produto.imagem}
              alt={produto.nome}
              className="w-full h-44 object-cover rounded-t-2xl"
            />

            <div className="p-4 flex flex-col justify-between">
              <h4 className="text-[2rem] font-bold mb-2 text-center">{produto.nome}</h4>

              <p className="text-red-600 text-[2rem] font-semibold text-xl mb-3 text-center">
                {produto.preco}
              </p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() =>
                    setDescricaoVisivel(descricaoVisivel === index ? null : index)
                  }
                  className="text-gray-600 hover:text-blue-600 p-2 rounded-full"
                  title="Ver descrição"
                >
                  <Info className="w-12 h-12" />
                </button>

                <button
                  onClick={() => {
                    if (estaLogado) {
                      handleAddToCart(produto, index);
                    } else {
                      alert('Faça login para adicionar itens ao carrinho!');
                    }
                  }}
                  className={`relative text-white ${estaLogado ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400 cursor-not-allowed'
                    } p-2 rounded-full`}
                  title={estaLogado ? "Adicionar ao carrinho" : "Faça login para adicionar"}
                  disabled={!estaLogado} // 🔒 Segurança visual e física
                >
                  <ShoppingCart className="w-12 h-10" />

                  {animacaoCarrinho === index && (
                    <span className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full text-xs px-3 py-2 animate-bounce shadow-md">
                      +1
                    </span>
                  )}
                </button>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModalCategoria;
