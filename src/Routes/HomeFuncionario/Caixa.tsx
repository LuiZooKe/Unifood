import React, { useEffect, useState } from 'react';
import Dashboard from './Dashboard';
import { DollarSign, FileText, QrCode, X } from 'lucide-react';
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

const Caixa: React.FC = () => {
  const [abaAtiva, setAbaAtiva] = useState<'pedidos' | 'recarga'>('pedidos');
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filtro, setFiltro] = useState<'dia' | 'semana' | 'mes'>('dia');
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null);
  const [leitorAberto, setLeitorAberto] = useState(false);

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

  const atualizarStatus = async (id: number, novoStatus: string) => {
    try {
      const response = await fetch('http://localhost/Unifood/database/update_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: novoStatus }),
      });

      const data = await response.json();

      if (data.success) {
        buscarPedidos();
        fecharModal();
      } else {
        alert('Erro ao atualizar status');
      }
    } catch {
      alert('Erro na conexão com o servidor');
    }
  };

  const fecharModal = () => {
    setPedidoSelecionado(null);
  };

  useEffect(() => {
    if (abaAtiva === 'pedidos') buscarPedidos();
  }, [filtro, abaAtiva]);

  const calcularTotalPedido = (pedido: Pedido) => {
    return pedido.itens.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
  };

  return (
    <Dashboard>
      <div className="p-6 w-full max-w-[750px] mx-auto relative">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h1 className="text-[clamp(3rem,10vw,6rem)] font-extrabold text-white leading-tight">
            CAIXA
          </h1>
          <div className="flex gap-2">
            {['pedidos', 'recarga'].map((aba) => (
              <button
                key={aba}
                onClick={() => setAbaAtiva(aba as 'pedidos' | 'recarga')}
                className={`px-4 py-2 rounded-xl font-semibold transition ${abaAtiva === aba
                  ? 'bg-white text-[#8b0000]'
                  : 'bg-[#8b0000]/90 hover:bg-[#6e0000]/90 text-white'
                  }`}
              >
                {aba === 'pedidos' ? 'Pedidos' : 'Recarga de Saldo'}
              </button>
            ))}
          </div>
        </div>

        {/* 🗂️ Aba Pedidos */}
        {abaAtiva === 'pedidos' && (
          <div className="bg-[#661111]/90 rounded-2xl shadow-2xl p-6 border border-[#ffffff22]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FileText size={28} className="text-red-400" />
                <h2 className="text-3xl font-extrabold text-white">PEDIDOS</h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setLeitorAberto(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold text-xl flex items-center gap-2"
                >
                  <QrCode size={24} /> LER QR-CODE
                </button>
                {['dia', 'semana', 'mes'].map((item) => (
                  <button
                    key={item}
                    onClick={() => setFiltro(item as 'dia' | 'semana' | 'mes')}
                    className={`px-4 py-2 rounded-xl font-semibold transition ${filtro === item
                      ? 'bg-white text-[#8b0000]'
                      : 'bg-[#8b0000]/90 hover:bg-[#6e0000]/90 text-white'
                      }`}
                  >
                    {item === 'dia' ? 'Hoje' : item === 'semana' ? 'Semana' : 'Mês'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
              {pedidos.map((pedido) => (
                <div
                  key={pedido.id}
                  className={`p-4 rounded-xl flex flex-col gap-2 cursor-pointer
                    ${pedido.status === 'PENDENTE'
                      ? 'bg-[#8b0000]/90 hover:bg-[#6e0000]/90'
                      : 'bg-black/40 hover:bg-black/60'
                    }`}
                  onClick={() => setPedidoSelecionado(pedido)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-white">
                      Pedido #{pedido.id}
                    </h3>
                    <p className="text-white text-lg">{pedido.data} - {pedido.hora}</p>
                  </div>
                  <p className="text-white">👤 {pedido.nome}</p>
                  <p className="text-white">
                    💰 Total: <span className="font-bold">R$ {calcularTotalPedido(pedido).toFixed(2).replace('.', ',')}</span>
                  </p>
                  <p className={`font-bold ${pedido.status === 'PENDENTE' ? 'text-yellow-400' : 'text-green-400'}`}>
                    {pedido.status}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🔍 Modal detalhes do pedido */}
        {pedidoSelecionado && (
          <div
            className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center"
            onClick={fecharModal}
          >
            <div
              className="bg-[#1a1a1a] rounded-2xl p-6 w-[95%] max-w-[600px] max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-4xl font-extrabold text-white">
                  Pedido #{pedidoSelecionado.id}
                </h3>
                <button
                  className="text-gray-400 hover:text-white"
                  onClick={fecharModal}
                >
                  <X size={28} />
                </button>
              </div>

              <div className="mb-4">
                <h3 className="text-2xl font-bold text-white mb-2">DADOS DO CLIENTE</h3>
                <p className="text-gray-300">👤 <b>Nome:</b> {pedidoSelecionado.nome}</p>
                <p className="text-gray-300">📧 <b>Email:</b> {pedidoSelecionado.email}</p>
                <p className="text-gray-300">📞 <b>Telefone:</b> {pedidoSelecionado.telefone ?? 'Não informado'}</p>
              </div>

              <h3 className="text-2xl font-bold text-white mb-4">ITENS DO PEDIDO</h3>
              <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                {pedidoSelecionado.itens.map((item, idx) => (
                  <div key={idx} className="flex gap-4 bg-black/40 p-3 rounded-xl">
                    <img src={item.imagem} alt={item.nome} className="w-24 h-24 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="text-white font-bold text-xl">{item.nome}</p>
                      <div className="flex gap-6 text-gray-300">
                        <p>Qtd: <span className="font-medium">{item.quantidade}</span></p>
                        <p>Preço: <span className="font-medium">R$ {item.preco.toFixed(2).replace('.', ',')}</span></p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end py-4">
                <p className="text-3xl text-white font-bold">
                  Total: R$ {calcularTotalPedido(pedidoSelecionado).toFixed(2).replace('.', ',')}
                </p>
              </div>

              <button
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl"
                onClick={() => atualizarStatus(pedidoSelecionado.id, 'FINALIZADO')}
              >
                ENTREGAR PEDIDO
              </button>
            </div>
          </div>
        )}

        {/* 📷 Leitor QR */}
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
      </div>
    </Dashboard>
  );
};

export default Caixa;
