import React, { useEffect, useState } from 'react';
import Dashboard from './Dashboard';
import { QrCode, X, DollarSign, ChevronDown } from 'lucide-react';
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
  const [statusFiltro, setStatusFiltro] = useState<'todos' | 'pendente' | 'finalizado'>('todos');
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null);
  const [leitorAberto, setLeitorAberto] = useState(false);
  const [email, setEmail] = useState('');
  const [valor, setValor] = useState('');
  const [dropdownPeriodo, setDropdownPeriodo] = useState(false);
  const [dropdownStatus, setDropdownStatus] = useState(false);

  const formatarMoeda = (valor: string) => {
    const numero = valor.replace(/\D/g, '');
    const numeroFormatado = (Number(numero) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
    return numeroFormatado;
  };

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

  const handleAdicionarSaldo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !valor) {
      alert('Preencha todos os campos');
      return;
    }

    try {
      const response = await fetch('http://localhost/Unifood/database/adicionar_saldo.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, valor }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Saldo adicionado com sucesso!');
        setEmail('');
        setValor('');
      } else {
        alert(data.message || 'Erro ao adicionar saldo');
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

  const pedidosFiltrados = pedidos.filter(pedido => {
    const statusOk =
      statusFiltro === 'todos' ||
      (statusFiltro === 'pendente' && pedido.status === 'PENDENTE') ||
      (statusFiltro === 'finalizado' && pedido.status === 'FINALIZADO');
    return statusOk;
  });

  return (
    <Dashboard>
      <div className="p-4 sm:p-6 w-full max-w-[1200px] mx-auto h-[calc(100vh-48px)] flex flex-col">

        {/* 🔥 Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-[#661111]/90 rounded-2xl shadow-2xl p-4 sm:p-6 border border-[#ffffff22] mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <h1 className="text-[clamp(2rem,6vw,4rem)] font-extrabold text-white">
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
                  {aba === 'pedidos' ? 'Pedidos' : 'Recarga'}
                </button>
              ))}
            </div>
          </div>

          {abaAtiva === 'pedidos' && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 py-4 sm:gap-4">
              {/* Dropdown Período */}
              <div className="relative w-fit">
                <button
                  onClick={() => {
                    setDropdownPeriodo(!dropdownPeriodo);
                    setDropdownStatus(false);
                  }}
                  className="px-[1.3rem] py-2 rounded-xl font-semibold bg-[#8b0000]/90 hover:bg-[#6e0000]/90 text-white flex items-center gap-2"
                >
                  Período <ChevronDown size={18} />
                </button>
                {dropdownPeriodo && (
                  <div
                    className="absolute z-50 mt-2 bg-[#8b0000] rounded-xl shadow-xl flex flex-col text-white
      w-full border border-white"
                  >
                    {['dia', 'semana', 'mes'].map((item) => (
                      <button
                        key={item}
                        onClick={() => {
                          setFiltro(item as 'dia' | 'semana' | 'mes');
                          setDropdownPeriodo(false);
                        }}
                        className={`px-4 py-2 hover:bg-[#6e0000]/90 text-left ${filtro === item ? 'bg-[#6e0000]/90' : ''
                          }`}
                      >
                        {item === 'dia' ? 'Hoje' : item === 'semana' ? 'Semana' : 'Mês'}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Dropdown Status */}
              <div className="relative w-fit">
                <button
                  onClick={() => {
                    setDropdownStatus(!dropdownStatus);
                    setDropdownPeriodo(false);
                  }}
                  className="px-[2rem] py-2 rounded-xl font-semibold bg-[#8b0000]/90 hover:bg-[#6e0000]/90 text-white flex items-center gap-2"
                >
                  Status <ChevronDown size={18} />
                </button>
                {dropdownStatus && (
                  <div
                    className="absolute z-50 mt-2 bg-[#8b0000] rounded-xl shadow-xl flex flex-col text-white
      w-full border border-white"
                  >
                    {['todos', 'pendente', 'finalizado'].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setStatusFiltro(status as 'todos' | 'pendente' | 'finalizado');
                          setDropdownStatus(false);
                        }}
                        className={`px-4 py-2 hover:bg-[#6e0000]/90 text-left ${statusFiltro === status ? 'bg-[#6e0000]/90' : ''
                          }`}
                      >
                        {status === 'todos' ? 'Todos' : status === 'pendente' ? 'Pendentes' : 'Finalizados'}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => setLeitorAberto(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-7 py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-2"
              >
                <QrCode size={48} />
                LER QR-CODE
              </button>
            </div>
          )}
        </div>

        {/* 🔥 Conteúdo */}
        {abaAtiva === 'pedidos' ? (
          <div className="relative flex-1 overflow-y-auto pr-2 grid grid-cols-1 gap-3 pb-4">
            {pedidosFiltrados.map((pedido) => (
              <div
                key={pedido.id}
                className={`p-4 rounded-xl cursor-pointer transition ${pedido.status === 'PENDENTE'
                  ? 'bg-[#8b0000]/90 hover:bg-[#6e0000]/90'
                  : 'bg-black/50 hover:bg-black/70'
                  }`}
                onClick={() => setPedidoSelecionado(pedido)}
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-base text-gray-300 font-medium">
                    {pedido.data} • {pedido.hora}
                  </p>
                  <span
                    className={`text-sm font-bold px-3 py-[4px] rounded-lg ${pedido.status === 'PENDENTE'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-green-500/20 text-green-400'
                      }`}
                  >
                    {pedido.status}
                  </span>
                </div>

                <h3 className="text-2xl font-extrabold text-white mb-1">
                  Nº {pedido.id}
                </h3>

                <p className="text-white">
                  Cliente: <span className="font-semibold">{pedido.nome}</span>
                </p>

                <p className="text-white">
                  Total:{' '}
                  <span className="font-bold">
                    R$ {calcularTotalPedido(pedido).toFixed(2).replace('.', ',')}
                  </span>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <form
              onSubmit={handleAdicionarSaldo}
              className="bg-[#661111]/90 p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col gap-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <DollarSign size={32} className="text-green-400" />
                <h2 className="text-4xl font-extrabold text-white">RECARGA DE SALDO</h2>
              </div>

              <input
                type="email"
                placeholder="Email do usuário"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[#ffffff22] rounded-xl px-4 py-3 bg-black/30 text-white"
                required
              />

              <input
                type="text"
                placeholder="Valor"
                value={valor}
                onChange={(e) => setValor(formatarMoeda(e.target.value))}
                className="w-full border border-[#ffffff22] rounded-xl px-4 py-3 bg-black/30 text-white"
                required
              />

              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl"
              >
                ADICIONAR SALDO
              </button>
            </form>
          </div>
        )}

        {/* 🔥 Modal de Detalhes */}
        {pedidoSelecionado && (
          <div
            className="absolute inset-0 z-[9999] bg-black/70 flex justify-center items-center"
            onClick={fecharModal}
          >
            <div
              className="bg-[#661111]/95 rounded-2xl p-6 w-[95%] max-w-[600px] max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
                  Nº {pedidoSelecionado.id}
                </h3>
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

              {pedidoSelecionado.status === 'FINALIZADO' ? (
                <button
                  className="bg-gray-500 cursor-not-allowed text-white font-bold px-6 py-3 rounded-xl"
                  disabled
                >
                  ESTE PEDIDO JÁ FOI ENTREGUE
                </button>
              ) : (
                <button
                  className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl"
                  onClick={() => atualizarStatus(pedidoSelecionado.id, 'FINALIZADO')}
                >
                  ENTREGAR PEDIDO
                </button>
              )}
            </div>
          </div>
        )}

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
