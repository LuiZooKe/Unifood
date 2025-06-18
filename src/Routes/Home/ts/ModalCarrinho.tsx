import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';

interface Produto {
  nome: string;
  preco: string;
  imagem: string;
  quantidade: number;
}

interface Pedido {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  itens: Produto[];
  valor: number | string;
  tipo_pagamento: string;
  data: string;
  hora: string;
  status: string;
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
}) => {
  const [abaAberta, setAbaAberta] = useState<'carrinho' | 'pedidos'>('carrinho');
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null);

  const buscarPedidos = async () => {
    try {
      const response = await fetch(`http://localhost/Unifood/database/listar_pedidos.php?email=${usuario.email}`);
      const data = await response.json();
      if (data.success) {
        setPedidos(
          data.pedidos.map((pedido: any) => ({
            ...pedido,
            valor: parseFloat(pedido.valor),
          }))
        );
      } else {
        setPedidos([]);
      }
    } catch {
      setPedidos([]);
    }
  };

  useEffect(() => {
    if (abaAberta === 'pedidos') buscarPedidos();
  }, [abaAberta]);

  if (!aberto) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center 
        md:inset-auto md:top-28 md:right-[3.5rem] md:items-start md:justify-end 
        bg-black/70 backdrop-blur-xl md:bg-transparent md:rounded-3xl shadow-2xl"
        onClick={onFechar}
      >
        <div
          className="bg-white/95 backdrop-blur-md w-[90%] max-w-[500px] 
          md:w-[380px] max-h-[90vh] md:max-h-[80vh] 
          rounded-3xl shadow-xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 🔥 Cabeçalho */}
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

          {/* 🔥 Abas */}
          <div className="flex gap-2 px-6 pt-4 pb-2 border-b border-gray-300">
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

          {/* 🔥 Conteúdo */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {abaAberta === 'carrinho' ? (
              itens.length === 0 ? (
                <p className="text-center text-gray-700">Seu carrinho está vazio.</p>
              ) : (
                <div className="space-y-4">
                  {itens.map((item) => (
                    <div key={item.nome} className="flex gap-4 bg-white rounded-xl p-4 shadow">
                      <img src={item.imagem} alt={item.nome} className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] object-cover rounded-lg" />
                      <div className="flex flex-col justify-between w-full">
                        <div>
                          <h4 className="font-bold text-gray-800 text-[clamp(1.5rem,3vw,2.5rem)]">{item.nome}</h4>
                          <p className="text-gray-600">Preço: <span className="font-semibold">{item.preco}</span></p>
                        </div>
                        <div className="flex flex-col items-end mt-4 gap-2">
                          <div className="flex items-center gap-4">
                            <button onClick={() => onAlterarQuantidade(item.nome, item.quantidade - 1)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">−</button>
                            <span className="text-2xl font-semibold">{item.quantidade}</span>
                            <button onClick={() => onAlterarQuantidade(item.nome, item.quantidade + 1)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">+</button>
                          </div>
                          <button onClick={() => onRemover(item.nome)} className="text-red-600 hover:text-red-800 text-lg font-medium">Remover</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              pedidos.length === 0 ? (
                <div className="bg-gray-100 rounded-xl p-4 text-center">
                  <p className="text-lg text-gray-800 font-semibold">Você ainda não possui pedidos. 🍔</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pedidos.map((pedido) => (
                    <div
                      key={pedido.id}
                      className="bg-white rounded-xl p-4 shadow cursor-pointer hover:bg-gray-50"
                      onClick={() => setPedidoSelecionado(pedido)}
                    >
                      <h4 className="font-bold text-gray-800 text-xl">Pedido #{pedido.id}</h4>
                      <p className="text-gray-600">Data: {pedido.data} - {pedido.hora}</p>
                      <p className="text-green-600 font-bold">
                        Valor: R$ {Number(pedido.valor).toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>

          {/* 🔥 Rodapé */}
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

      {/* 🔥 Modal de Detalhes do Pedido (Independente, na mesma posição) */}
      {pedidoSelecionado && ReactDOM.createPortal(
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center 
          md:inset-auto md:top-28 md:right-[3.5rem] md:items-start md:justify-end 
          bg-black/70 backdrop-blur-xl md:bg-transparent md:rounded-3xl shadow-2xl"
          onClick={() => setPedidoSelecionado(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-xl p-8 
            w-[90%] max-w-[500px] md:w-[380px] 
            min-h-[90vh] md:min-h-[80vh] 
            max-h-[90vh] md:max-h-[80vh] 
            flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-5xl font-extrabold text-gray-900">
                Pedido #{pedidoSelecionado.id}
              </h3>
              <button
                onClick={() => setPedidoSelecionado(null)}
                className="text-gray-500 hover:text-red-500"
              >
                <X className="w-10 h-10" />
              </button>
            </div>

            <div className="w-full mb-4">
              <div className="bg-gray-100 rounded-xl px-4 py-3">
                <p className="text-xl text-gray-700"><strong>Data:</strong> {pedidoSelecionado.data} - {pedidoSelecionado.hora}</p>
                <p className="text-xl text-gray-700"><strong>Status:</strong> {pedidoSelecionado.status}</p>
                <p className="text-xl text-gray-700"><strong>Forma de Pagamento:</strong> {pedidoSelecionado.tipo_pagamento.toUpperCase()}</p>
                <p className="text-xl font-extrabold text-gray-900">
                  Total: <span className="text-blue-700">R$ {Number(pedidoSelecionado.valor).toFixed(2).replace('.', ',')}</span>
                </p>
              </div>
            </div>

            <div className="flex justify-center mb-4">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                  JSON.stringify({ pedido_id: pedidoSelecionado.id })
                )}`}
                alt="QR Code do Pedido"
                className="rounded-xl border border-gray-300"
              />
            </div>

            <div className="flex flex-col flex-1 overflow-y-auto">
              <div className="bg-gray-100 rounded-xl px-4 py-3 mb-3">
                <h3 className="text-2xl font-bold text-gray-700">Itens do Pedido</h3>
              </div>
              <div className="space-y-4 px-2">
                {pedidoSelecionado.itens.length === 0 ? (
                  <p className="text-center text-2xl text-gray-500">Nenhum item encontrado.</p>
                ) : (
                  pedidoSelecionado.itens.map((item, idx) => {
                    const precoUnitario =
                      typeof item.preco === 'string'
                        ? parseFloat(item.preco.replace('R$', '').replace(',', '.'))
                        : item.preco;

                    return (
                      <div
                        key={idx}
                        className="flex gap-4 items-center border border-gray-100 rounded-xl p-2"
                      >
                        <img
                          src={item.imagem}
                          alt={item.nome}
                          className="w-20 h-20 rounded-xl object-cover border border-gray-200"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-2xl text-gray-800">{item.nome}</p>
                          <p className="text-lg text-gray-500">
                            {item.quantidade}x R$ {precoUnitario.toFixed(2).replace('.', ',')}
                          </p>
                        </div>
                        <p className="font-bold text-xl">
                          R$ {(precoUnitario * item.quantidade).toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default ModalCarrinho;
