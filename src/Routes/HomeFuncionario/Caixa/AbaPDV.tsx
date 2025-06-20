import React, { useState } from 'react';

interface Produto {
  nome: string;
  preco: string;
  imagem: string;
  descricao: string;
  categoria: string;
}

interface AbaPDVProps {
  produtos: Produto[];
}

interface Pedido {
  id: number;
  itens: { nome: string; preco: string; quantidade: number }[];
  valorTotal: string;
  dataHora: string;
}

const AbaPDV: React.FC<AbaPDVProps> = ({ produtos }) => {
  const categorias = Array.from(new Set(produtos.map(p => p.categoria)));

  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);
  const [itensCarrinho, setItensCarrinho] = useState<{ [nome: string]: { produto: Produto; quantidade: number } }>({});
  const [pedidoGerado, setPedidoGerado] = useState<Pedido | null>(null);
  const [contadorPedidos, setContadorPedidos] = useState(1);
  const [descricaoVisivel, setDescricaoVisivel] = useState<string | null>(null);

  const handleAddToCart = (produto: Produto) => {
    setItensCarrinho(prev => {
      const itemAtual = prev[produto.nome];
      return {
        ...prev,
        [produto.nome]: {
          produto,
          quantidade: itemAtual ? itemAtual.quantidade + 1 : 1,
        },
      };
    });
  };

  const handleAlterarQuantidade = (nome: string, quantidade: number) => {
    setItensCarrinho(prev => {
      if (quantidade <= 0) {
        const novo = { ...prev };
        delete novo[nome];
        return novo;
      }
      return {
        ...prev,
        [nome]: {
          ...prev[nome],
          quantidade,
        },
      };
    });
  };

  const calcularTotal = () => {
    return Object.values(itensCarrinho)
      .reduce((total, item) => {
        const preco = parseFloat(item.produto.preco.replace('R$', '').replace(',', '.'));
        return total + preco * item.quantidade;
      }, 0)
      .toFixed(2)
      .replace('.', ',');
  };

  const limparCarrinho = () => {
    setItensCarrinho({});
  };

  const finalizarPedido = () => {
    if (Object.keys(itensCarrinho).length === 0) return;

    const itens = Object.values(itensCarrinho).map(item => ({
      nome: item.produto.nome,
      preco: item.produto.preco,
      quantidade: item.quantidade,
    }));

    const dataHora = new Date().toLocaleString();

    const novoPedido: Pedido = {
      id: contadorPedidos,
      itens,
      valorTotal: calcularTotal(),
      dataHora,
    };

    setPedidoGerado(novoPedido);
    setContadorPedidos(prev => prev + 1);
    limparCarrinho();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-8">
      {/* Categorias */}
      <div className="w-full lg:w-1/4">
        <h2 className="text-4xl font-bold mb-4">Categorias</h2>
        <div className="space-y-3">
          {categorias.map(categoria => (
            <button
              key={categoria}
              onClick={() => setCategoriaSelecionada(categoria)}
              className={`w-full text-2xl font-semibold py-4 px-6 rounded-xl transition ${
                categoriaSelecionada === categoria ? 'bg-red-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {categoria}
            </button>
          ))}
        </div>
      </div>

      {/* Produtos */}
      <div className="w-full lg:w-2/4">
        {categoriaSelecionada ? (
          <div>
            <div className="flex justify-between mb-4">
              <h3 className="text-4xl font-bold">{categoriaSelecionada}</h3>
              <button
                onClick={() => setCategoriaSelecionada(null)}
                className="text-red-600 font-semibold hover:underline"
              >
                Fechar
              </button>
            </div>

            <div className="flex gap-8 overflow-x-auto pb-3">
              {produtos
                .filter(p => p.categoria === categoriaSelecionada)
                .map((produto, index) => (
                  <div
                    key={index}
                    className="min-w-[270px] max-w-[270px] bg-white border rounded-2xl shadow-md hover:shadow-xl transition flex-shrink-0 relative"
                  >
                    {/* Descrição flutuante */}
                    {descricaoVisivel === produto.nome && (
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
                            setDescricaoVisivel(descricaoVisivel === produto.nome ? null : produto.nome)
                          }
                          className="text-gray-600 hover:text-blue-600 p-2 rounded-full"
                          title="Ver descrição"
                        >
                          ℹ
                        </button>

                        <button
                          onClick={() => handleAddToCart(produto)}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full"
                          title="Adicionar ao carrinho"
                        >
                          🛒
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-3xl text-gray-500">Selecione uma categoria</p>
          </div>
        )}
      </div>

      {/* Carrinho */}
      <div className="w-full lg:w-1/4 flex flex-col">
        <h2 className="text-4xl font-bold mb-4">Carrinho</h2>
        <div className="flex-1 bg-white rounded-xl border p-4 shadow space-y-4 overflow-y-auto">
          {Object.keys(itensCarrinho).length === 0 ? (
            <p className="text-center text-lg text-gray-500">Nenhum item no carrinho</p>
          ) : (
            Object.values(itensCarrinho).map(item => (
              <div key={item.produto.nome} className="flex gap-4 items-center border-b pb-2">
                <img src={item.produto.imagem} alt={item.produto.nome} className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="font-bold text-xl">{item.produto.nome}</p>
                  <p className="text-sm text-gray-500">{item.quantidade}x {item.produto.preco}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAlterarQuantidade(item.produto.nome, item.quantidade - 1)}
                    className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                  >−</button>
                  <span className="text-lg font-semibold">{item.quantidade}</span>
                  <button
                    onClick={() => handleAlterarQuantidade(item.produto.nome, item.quantidade + 1)}
                    className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                  >+</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Total e Botão */}
        <div className="mt-4">
          <p className="text-2xl font-bold mb-4">
            Total: <span className="text-red-600">R$ {calcularTotal()}</span>
          </p>
          <button
            onClick={finalizarPedido}
            disabled={Object.keys(itensCarrinho).length === 0}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-2xl py-4 rounded-xl shadow-lg"
          >
            Finalizar Pedido
          </button>
        </div>

        {/* QR Code */}
        {pedidoGerado && (
          <div className="mt-6 flex flex-col items-center">
            <p className="font-bold text-xl mb-2">QR Code do Pedido #{pedidoGerado.id}</p>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                JSON.stringify(pedidoGerado)
              )}`}
              alt="QR Code"
              className="border rounded-xl"
            />
            <p className="text-center text-gray-500 text-sm mt-2">
              {pedidoGerado.dataHora}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AbaPDV;