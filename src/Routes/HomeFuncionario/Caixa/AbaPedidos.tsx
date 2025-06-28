import React, { useEffect, useState } from 'react';
import { QrCode, ChevronDown, X } from 'lucide-react';
import LeitorQR from './LeitorQr.tsx';

interface Item {
  nome: string;
  preco: number;
  quantidade: number;
  imagem: string;
}

interface Pedido {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  itens: Item[];
  valor: number;
  tipo_pagamento: string;
  data: string;
  hora: string;
  status: string;
  observacoes?: string;
}

const AbaPedidos: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filtro, setFiltro] = useState<'dia' | 'semana' | 'mes'>('dia');
  const [statusFiltro, setStatusFiltro] = useState<'todos' | 'pendente' | 'finalizado'>('todos');
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null);
  const [leitorAberto, setLeitorAberto] = useState(false);
  const [dropdownPeriodo, setDropdownPeriodo] = useState(false);
  const [dropdownStatus, setDropdownStatus] = useState(false);

  const buscarPedidos = async () => {
    try {
      const response = await fetch(`http://localhost/Unifood/database/listar_pedidos.php?filtro=${filtro}`);
      const data = await response.json();
      if (data.success) {
        setPedidos(data.pedidos);
      } else {
        setPedidos([]);
      }
    } catch {
      setPedidos([]);
    }
  };

  const buscarPedidoPorID = async (id: number) => {
    try {
      const response = await fetch(`http://localhost/Unifood/database/listar_pedidos.php?id=${id}`);
      const data = await response.json();
      if (data.success) {
        const pedido = data.pedido;
        setPedidoSelecionado({
          id: pedido.id,
          nome: pedido.nome_cliente,
          email: pedido.email_cliente,
          telefone: pedido.telefone_cliente,
          itens: pedido.itens,
          valor: parseFloat(pedido.valor_total),
          tipo_pagamento: pedido.tipo_pagamento,
          data: pedido.data,
          hora: pedido.hora,
          status: pedido.status,
          observacoes: pedido.observacoes,
        });
      } else {
        alert('Pedido não encontrado.');
      }
    } catch {
      alert('Erro ao buscar pedido.');
    }
  };

  const finalizarPedido = async (pedido: Pedido) => {
    try {
      const responseStatus = await fetch('http://localhost/Unifood/database/update_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: pedido.id, status: 'FINALIZADO' }),
      });

      const dataStatus = await responseStatus.json();

      if (dataStatus.success) {
        const responseEstoque = await fetch('http://localhost/Unifood/database/update_estoque.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            itens: pedido.itens.map(item => ({
              nome: item.nome,
              quantidade: item.quantidade
            }))
          }),
        });

        const dataEstoque = await responseEstoque.json();

        if (!dataEstoque.success) {
          alert('Status atualizado, mas houve problema ao atualizar o estoque:\n' + dataEstoque.messages.join('\n'));
        }

        buscarPedidos();
        fecharModal();
      } else {
        alert('Erro ao atualizar status do pedido.');
      }
    } catch {
      alert('Erro na conexão com o servidor.');
    }
  };

  const fecharModal = () => setPedidoSelecionado(null);

  const calcularTotalPedido = (pedido: Pedido) =>
    pedido.itens.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);

  const pedidosFiltrados = pedidos.filter(pedido => {
    const statusOk =
      statusFiltro === 'todos' ||
      (statusFiltro === 'pendente' && pedido.status === 'PENDENTE') ||
      (statusFiltro === 'finalizado' && pedido.status === 'FINALIZADO');
    return statusOk;
  });

  useEffect(() => {
    buscarPedidos();
  }, [filtro]);

  return (
    <>
      {/* Botões de Ação */}
      <div className="flex justify-between mb-4">
        <button
          onClick={() => setLeitorAberto(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-7 py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-2"
        >
          <QrCode size={32} />
          LER QR-CODE
        </button>

        <div className="relative w-fit">
          <button
            onClick={() => {
              const novoEstado = !(dropdownPeriodo || dropdownStatus);
              setDropdownPeriodo(novoEstado);
              setDropdownStatus(novoEstado);
            }}
            className="px-6 py-2 rounded-xl font-semibold bg-[#8b0000]/90 hover:bg-[#6e0000]/90 text-white flex items-center gap-2"
          >
            Filtrar <ChevronDown size={18} />
          </button>

          {(dropdownPeriodo || dropdownStatus) && (
            <div className="absolute z-50 mt-2 bg-[#8b0000] rounded-xl shadow-xl flex flex-col text-white w-56 border border-white">
              {/* Período */}
              <p className="px-4 pt-3 pb-1 text-xs text-gray-300">Período</p>
              {['dia', 'semana', 'mes'].map((item) => (
                <button
                  key={item}
                  onClick={() => setFiltro(item as 'dia' | 'semana' | 'mes')}
                  className={`px-4 py-2 text-left hover:bg-[#6e0000]/90 ${filtro === item ? 'bg-[#6e0000]/90' : ''}`}
                >
                  {item === 'dia' ? 'Hoje' : item === 'semana' ? 'Semana' : 'Mês'}
                </button>
              ))}

              <div className="border-t border-white/30 my-1"></div>

              {/* Status */}
              <p className="px-4 pt-3 pb-1 text-xs text-gray-300">Status</p>
              {['todos', 'pendente', 'finalizado'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFiltro(status as 'todos' | 'pendente' | 'finalizado')}
                  className={`px-4 py-2 text-left hover:bg-[#6e0000]/90 ${statusFiltro === status ? 'bg-[#6e0000]/90' : ''}`}
                >
                  {status === 'todos' ? 'Todos' : status === 'pendente' ? 'Pendentes' : 'Finalizados'}
                </button>
              ))}

              <div className="border-t border-white/30 my-2"></div>

              <button
                onClick={() => {
                  setDropdownPeriodo(false);
                  setDropdownStatus(false);
                }}
                className="px-4 py-2 text-center hover:bg-[#6e0000]/90 text-red-300 font-semibold"
              >
                Fechar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Lista de Pedidos */}
      <div className="relative flex-1 overflow-y-auto pr-2 grid grid-cols-1 gap-3 pb-4">
        {pedidosFiltrados.map((pedido) => (
          <div
            key={pedido.id}
            className={`p-4 rounded-xl cursor-pointer transition ${pedido.status === 'PENDENTE'
              ? 'bg-[#9e1414]/70 hover:bg-[#6e0000]/90'
              : 'bg-black/50 hover:bg-black/70'
              }`}
            onClick={() => setPedidoSelecionado(pedido)}
          >
            <div className="flex justify-between items-center mb-2">
              <p className="text-lg text-gray-300 font-semibold">{pedido.data} • {pedido.hora}</p>
              <span className={`text-x1 font-bold px-3 py-[4px] rounded-lg ${pedido.status === 'PENDENTE'
                ? 'bg-red-500/20 text-red-400'
                : 'bg-green-500/20 text-green-400'
                }`}>{pedido.status}</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white mb-1">Nº {pedido.id}</h3>
            <p className="text-white">Cliente: <span className="font-semibold">{pedido.nome}</span></p>
            <p className="text-white">
              Total: <span className="font-bold">R$ {calcularTotalPedido(pedido).toFixed(2).replace('.', ',')}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Modal Detalhes */}
      {pedidoSelecionado && (
        <div className="absolute inset-0 z-[9999] bg-black/70 flex justify-center items-center" onClick={fecharModal}>
          <div className="bg-[#661111]/95 rounded-2xl p-6 w-[95%] max-w-[600px] max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white">Nº {pedidoSelecionado.id}</h3>
              <button className="text-gray-300 hover:text-white" onClick={fecharModal}>
                <X size={28} />
              </button>
            </div>

            <div className="mb-4">
              <h3 className="text-2xl font-bold text-white mb-2">DADOS DO CLIENTE</h3>
              <p className="text-gray-200"><b>Nome:</b> {pedidoSelecionado.nome}</p>
              <p className="text-gray-200"><b>Email:</b> {pedidoSelecionado.email}</p>
              <p className="text-gray-200"><b>Telefone:</b> {pedidoSelecionado.telefone ?? 'Não informado'}</p>
            </div>

            <h3 className="text-2xl font-bold text-white mb-4">ITENS DO PEDIDO</h3>
            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
              {pedidoSelecionado.itens.map((item, idx) => (
                <div key={idx} className="flex gap-4 bg-black/40 p-3 rounded-xl">
                  <img src={item.imagem} alt={item.nome} className="w-20 h-20 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="text-white font-bold text-xl">{item.nome}</p>
                    <div className="flex gap-4 text-gray-300">
                      <p>Qtd: <span>{item.quantidade}</span></p>
                      <p>Preço: <span>R$ {item.preco.toFixed(2).replace('.', ',')}</span></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end py-4">
              <p className="text-2xl sm:text-3xl text-white font-bold">
                Total: R$ {calcularTotalPedido(pedidoSelecionado).toFixed(2).replace('.', ',')}
              </p>
            </div>

            {['FINALIZADO', 'EXCLUÍDO'].includes(pedidoSelecionado.status) ? (
              <button className="bg-gray-500 cursor-not-allowed text-white font-bold px-6 py-3 rounded-xl" disabled>
                {pedidoSelecionado.status === 'EXCLUIDO' ? 'PEDIDO EXCLUÍDO' : 'ESTE PEDIDO JÁ FOI ENTREGUE'}
              </button>
            ) : (
              <button
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl"
                onClick={() => pedidoSelecionado && finalizarPedido(pedidoSelecionado)}
              >
                ENTREGAR PEDIDO
              </button>
            )}
          </div>
        </div>
      )}

      {/* Leitor QR */}
      {leitorAberto && (
        <LeitorQR
          onScan={(result) => {
            try {
              const json = JSON.parse(result);
              if (json?.pedido_id) {
                buscarPedidoPorID(json.pedido_id);
                setLeitorAberto(false);
              } else {
                alert('QR inválido.');
              }
            } catch {
              alert('QR inválido.');
            }
          }}
          onClose={() => setLeitorAberto(false)}
        />
      )}
    </>
  );
};

export default AbaPedidos;
