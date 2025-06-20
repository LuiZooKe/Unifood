import React, { useEffect, useState } from 'react';
import { Plus, Minus, ShoppingCart, X } from 'lucide-react';

interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: string;
  imagem: string;
  categoria: string;
}

interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
}

interface Pedido {
  id: number;
  itens: { nome: string; preco: string; quantidade: number }[];
  total: string;
  dataHora: string;
}

const AbaPDV: React.FC = () => {
  const [categorias, setCategorias] = useState<string[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);
  const [carrinho, setCarrinho] = useState<{ [id: string]: ItemCarrinho }>({});
  const [pedidoGerado, setPedidoGerado] = useState<Pedido | null>(null);
  const [tipoPagamento, setTipoPagamento] = useState<string>('DINHEIRO');
  const [nomeCliente, setNomeCliente] = useState<string>('');

  //  Carregar Categorias
  useEffect(() => {
    fetch('http://localhost/Unifood/database/categorias.php?action=listar')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const categoriasValidas = data.categorias
            .map((cat: any) => cat.nome)
            .filter((nome: string) => {
              const produtosDaCategoria = produtos.filter(p => p.categoria === nome);
              return produtosDaCategoria.length > 0 && nome.toLowerCase() !== 'estoque';
            });
          setCategorias(categoriasValidas);
        }
      });
  }, [produtos]);

  //  Carregar Produtos
  useEffect(() => {
    fetch('http://localhost/Unifood/database/produtos.php?action=listar')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProdutos(data.produtos);
        }
      });
  }, []);

  const adicionarAoCarrinho = (produto: Produto) => {
    setCarrinho(prev => {
      const existente = prev[produto.id];
      return {
        ...prev,
        [produto.id]: {
          produto,
          quantidade: existente ? existente.quantidade + 1 : 1,
        },
      };
    });
  };

  const alterarQuantidade = (id: string, quantidade: number) => {
    setCarrinho(prev => {
      if (quantidade <= 0) {
        const novo = { ...prev };
        delete novo[id];
        return novo;
      }
      return {
        ...prev,
        [id]: {
          ...prev[id],
          quantidade,
        },
      };
    });
  };

  const calcularTotalNumerico = () => {
    return Object.values(carrinho).reduce((acc, item) => {
      return acc + parseFloat(item.produto.preco) * item.quantidade;
    }, 0);
  };

  const calcularTotalFormatado = () => {
    return calcularTotalNumerico().toFixed(2).replace('.', ',');
  };

  const finalizarPedido = async () => {
    const data = new Date();
    const data_pedido = data.toLocaleDateString('pt-BR');
    const hora_pedido = data.toLocaleTimeString('pt-BR');

    const pedido = {
      nome_cliente: nomeCliente || 'PDV',
      email_cliente: 'pdv@unifood.com',
      telefone_cliente: '00000000000',
      itens: Object.values(carrinho).map(item => ({
        nome: item.produto.nome,
        preco: `R$ ${item.produto.preco}`,
        imagem: `http://localhost/Unifood/database/imgProdutos/${item.produto.imagem}`,
        descricao: item.produto.descricao,
        quantidade: item.quantidade,
      })),
      valor_total: calcularTotalNumerico(),
      tipo_pagamento: tipoPagamento,
      tipo_venda: 'PDV',
      status: 'PENDENTE',
      observacoes: '',
      data_pedido,
      hora_pedido,
    };

    try {
      const res = await fetch('http://localhost/Unifood/database/finalizar_pedido.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido),
      });

      const data = await res.json();

      if (data.success) {
        setPedidoGerado({
          id: data.pedido_id,
          itens: pedido.itens,
          total: calcularTotalFormatado(),
          dataHora: `${data_pedido} ${hora_pedido}`,
        });
        setCarrinho({});
      } else {
        alert(`Erro ao salvar pedido: ${data.message}`);
      }
    } catch (error) {
      alert('Erro de conexão com servidor');
      console.error(error);
    }
  };

  return (
    <div className="flex gap-4 p-6 flex-col lg:flex-row">
      {/*  CATEGORIAS */}
      <div className="lg:w-1/5 w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[clamp(2.5rem,5vw,3.5rem)] font-extrabold text-white whitespace-nowrap">
            PRODUTOS
          </h2>
          {categoriaSelecionada && (
            <button onClick={() => setCategoriaSelecionada(null)} className="text-red-300">
              <X size={32} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap lg:flex-col gap-2">
          {categorias.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoriaSelecionada(cat)}
              className={`w-full px-4 py-3 rounded-xl font-bold text-xl ${categoriaSelecionada === cat
                ? 'bg-white text-black'
                : 'bg-[#8b0000] text-white hover:bg-[#6e0000]'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/*  PRODUTOS */}
      <div className="lg:w-3/5 w-full lg:mt-[6.5rem]">
        {categoriaSelecionada ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {produtos
              .filter(p => p.categoria === categoriaSelecionada)
              .map(p => (
                <div
                  key={p.id}
                  className="bg-[#8b0000]/70 rounded-2xl p-4 flex flex-col shadow-lg h-full"
                >
                  <img
                    src={`http://localhost/Unifood/database/imgProdutos/${p.imagem}`}
                    alt={p.nome}
                    className="h-32 object-cover rounded-xl mb-2"
                  />
                  <h3 className="font-extrabold text-5xl text-white mb-1">{p.nome}</h3>
                  <p className="text-gray-200 text-md mb-2 flex-1 break-words">{p.descricao}</p>
                  <p className="text-red-200 font-bold text-x1 mb-4">
                    R$ {p.preco}
                  </p>
                  <button
                    onClick={() => adicionarAoCarrinho(p)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl py-3 flex justify-center items-center gap-2 mt-auto"
                  >
                    <ShoppingCart size={20} /> Adicionar
                  </button>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-2xl text-gray-200 text-center mt-24">
            Selecione uma categoria
          </p>
        )}
      </div>

      {/*  PEDIDO */}
      <div className="lg:w-[26%] w-full flex flex-col">
        <h2 className="text-5xl font-extrabold text-white mb-4">PEDIDO</h2>
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 flex flex-col flex-1">
          {/*  Lista com Scroll */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-5 max-h-[16rem]">
            {pedidoGerado ? null : (
              Object.keys(carrinho).length === 0 ? (
                <p className="text-center text-gray-600 text-lg">Carrinho vazio.</p>
              ) : (
                Object.values(carrinho).map(item => (
                  <div
                    key={item.produto.id}
                    className="flex gap-3 items-center bg-white rounded-2xl p-3 shadow border border-gray-200"
                  >
                    <img
                      src={`http://localhost/Unifood/database/imgProdutos/${item.produto.imagem}`}
                      alt={item.produto.nome}
                      className="w-16 h-16 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-xl text-gray-800">{item.produto.nome}</p>
                      <p className="text-gray-500 text-lg">
                        {item.quantidade}x R$ {item.produto.preco}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => alterarQuantidade(item.produto.id, item.quantidade + 1)}
                        className="bg-gray-100 hover:bg-gray-200 text-black rounded-full w-9 h-9 flex items-center justify-center"
                      >
                        <Plus size={20} />
                      </button>
                      <button
                        onClick={() => alterarQuantidade(item.produto.id, item.quantidade - 1)}
                        className="bg-gray-100 hover:bg-gray-200 text-black rounded-full w-9 h-9 flex items-center justify-center"
                      >
                        <Minus size={20} />
                      </button>
                    </div>
                  </div>
                ))
              )
            )}
          </div>

          {/*  Fixo na parte inferior */}
          <div className={`${pedidoGerado ? '' : 'border-t border-gray-300'}`}>
            {/*  Nome */}
            <div className="mb-2">
              <label className="block text-lg font-bold text-gray-800 mb-1">
                Nome do Cliente:
              </label>
              {pedidoGerado ? (
                <p className="text-xl font-semibold text-gray-700">{nomeCliente || 'PDV'}</p>
              ) : (
                <input
                  value={nomeCliente}
                  onChange={(e) => setNomeCliente(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="Digite o nome"
                />
              )}
            </div>

            <div className="mb-2">
              <label className="block text-lg font-bold text-gray-800 mb-1">
                Tipo de Pagamento:
              </label>
              {pedidoGerado ? (
                <p className="text-xl font-semibold text-gray-700">
                  {tipoPagamento === 'DINHEIRO'
                    ? 'Dinheiro'
                    : tipoPagamento === 'PIX'
                      ? 'Pix'
                      : tipoPagamento === 'CARTAO'
                        ? 'Cartão'
                        : ''}
                </p>
              ) : (
                <select
                  value={tipoPagamento}
                  onChange={(e) => setTipoPagamento(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  <option value="DINHEIRO">Dinheiro</option>
                  <option value="PIX">Pix</option>
                  <option value="CARTAO">Cartão</option>
                </select>
              )}
            </div>

            <p className="text-2xl font-bold text-gray-800 mb-3">
              TOTAL: <span className="text-green-600">
                R$ {pedidoGerado ? pedidoGerado.total : calcularTotalFormatado()}
              </span>
            </p>

            {/*  Ocultar botão Finalizar se QR visível */}
            {!pedidoGerado && (
              <button
                onClick={finalizarPedido}
                disabled={Object.keys(carrinho).length === 0}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-2xl py-4 rounded-2xl shadow-lg"
              >
                Finalizar Pedido
              </button>
            )}

            {/*  QR CODE */}
            {pedidoGerado && (
              <div className="flex flex-col items-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                    JSON.stringify({ pedido_id: pedidoGerado.id })
                  )}`}
                  alt={`QR Code do Pedido ${pedidoGerado.id}`}
                  className="border rounded-xl"
                />
                <p className="text-center text-md text-gray-600 mt-1">
                  {pedidoGerado.dataHora}
                </p>
                <button
                  onClick={() => {
                    setPedidoGerado(null);
                    setNomeCliente('');
                    setTipoPagamento('DINHEIRO');
                  }}
                  className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white text-xl font-bold rounded-2xl py-4"
                >
                  Novo Pedido
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbaPDV;
