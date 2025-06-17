import React, { useEffect, useState } from 'react';
import Dashboard from './Dashboard';
import { DollarSign, FileText, X } from 'lucide-react';

interface Item {
  nome: string;
  preco: string;
  quantidade: number;
  imagem: string;
}

interface Pedido {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  itens: Item[];
  valor: number | string;
  tipo_pagamento: string;
  data: string;
  hora: string;
  status: string;
}

const Caixa: React.FC = () => {
  const [abaAtiva, setAbaAtiva] = useState<'pedidos' | 'recarga'>('pedidos');
  const [email, setEmail] = useState('');
  const [valor, setValor] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filtro, setFiltro] = useState<'dia' | 'semana' | 'mes'>('dia');
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null);

  const adicionarSaldo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !valor) {
      setErro('Preencha todos os campos.');
      setMensagem('');
      return;
    }

    try {
      const response = await fetch('http://localhost/Unifood/database/update_saldo.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, saldo: parseFloat(valor) }),
      });

      const data = await response.json();
      if (data.success) {
        setMensagem('Saldo atualizado com sucesso!');
        setErro('');
        setEmail('');
        setValor('');
      } else {
        setErro(data.message || 'Erro ao atualizar saldo.');
        setMensagem('');
      }
    } catch {
      setErro('Erro na conexão com o servidor.');
      setMensagem('');
    }
  };

  const buscarPedidos = async () => {
    try {
      const response = await fetch(`http://localhost/Unifood/database/listar_pedidos.php?filtro=${filtro}`);
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

  const atualizarStatus = async (id: number, novoStatus: string) => {
    try {
      const response = await fetch('http://localhost/Unifood/database/update_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: novoStatus }),
      });

      const data = await response.json();

      if (data.success) {
        buscarPedidos(); // Atualiza a lista após mudar o status
        fecharModal();
      } else {
        alert('Erro ao atualizar status');
      }
    } catch {
      alert('Erro na conexão com o servidor');
    }
  };


  useEffect(() => {
    if (abaAtiva === 'pedidos') buscarPedidos();
  }, [filtro, abaAtiva]);

  const fecharModal = () => {
    setPedidoSelecionado(null);
  };

  return (
    <Dashboard>
      <div className="p-6 w-full max-w-[750px] mx-auto relative">

        {/* 🔥 Cabeçalho */}
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

            <div className="overflow-x-auto rounded-2xl border border-[#ffffff22]">
              <table className="w-full text-center">
                <thead className="bg-black/60 text-[#a52a2a]">
                  <tr className="font-bold">
                    <th className="p-2">#</th>
                    <th className="p-2">Cliente</th>
                    <th className="p-2">Data</th>
                    <th className="p-2">Hora</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.length > 0 ? (
                    pedidos.map((pedido) => (
                      <tr
                        key={pedido.id}
                        className="hover:bg-[#00000022] text-white cursor-pointer"
                        onClick={() => setPedidoSelecionado(pedido)}
                      >
                        <td className="p-2">{pedido.id}</td>
                        <td className="p-2">{pedido.nome}</td>
                        <td className="p-2">{pedido.data}</td>
                        <td className="p-2">{pedido.hora}</td>
                        <td className="p-2">{pedido.status}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-4 text-gray-400">
                        Nenhum pedido encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ➕ Aba Recarga */}
        {abaAtiva === 'recarga' && (
          <div className="bg-[#661111]/90 rounded-2xl shadow-2xl p-6 border border-[#ffffff22]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <DollarSign size={28} className="text-green-400" />
                <h2 className="text-3xl font-extrabold text-white">RECARGA DE SALDO</h2>
              </div>
            </div>

            <form onSubmit={adicionarSaldo} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block mb-1 text-sm text-gray-300">Email do usuário</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@email.com"
                  className="w-full border border-[#ffffff22] rounded-xl px-4 py-2 bg-black/30 text-white"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm text-gray-300">Valor (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  placeholder="Digite o valor"
                  className="w-full border border-[#ffffff22] rounded-xl px-4 py-2 bg-black/30 text-white"
                  required
                />
              </div>
              <div className="md:col-span-3">
                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl"
                >
                  Adicionar Saldo
                </button>
              </div>
            </form>

            {(erro || mensagem) && (
              <div className={`mt-4 text-center ${erro ? 'text-red-400' : 'text-green-400'}`}>
                {erro && <p>{erro}</p>}
                {mensagem && <p>{mensagem}</p>}
              </div>
            )}
          </div>
        )}


        {/* 🔍 Modal Detalhes */}
        {pedidoSelecionado && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70"
            onClick={fecharModal}
          >
            <div
              className="bg-[#661111] rounded-2xl p-6 shadow-2xl w-[750px] max-h-[90vh] flex flex-col border border-[#ffffff22] mx-4 ml-[20%]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 🔝 Cabeçalho */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[4.5rem] font-extrabold text-white">
                  DETALHES DO PEDIDO <span className="text-red-400">#{pedidoSelecionado.id}</span>
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
                <p className="text-gray-300">
                  👤 <span className="font-semibold text-white">Nome:</span> {pedidoSelecionado.nome}
                </p>
                <p className="text-gray-300">
                  📧 <span className="font-semibold text-white">Email:</span> {pedidoSelecionado.email}
                </p>
                <p className="text-gray-300">
                  📞 <span className="font-semibold text-white">Telefone:</span> {pedidoSelecionado.telefone ?? 'Não informado'}
                </p>
              </div>

              <h3 className="text-2xl font-bold text-white mb-4">ITENS DO PEDIDO</h3>

              {/* 🔻 Itens Scrolláveis */}
              <div className="flex-1 overflow-y-auto pr-2">
                <div className="space-y-3">
                  {pedidoSelecionado.itens.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 bg-black/40 p-3 rounded-xl"
                    >
                      <img
                        src={item.imagem}
                        alt={item.nome}
                        className="w-32 h-32 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-white font-bold text-x2">{item.nome}</p>
                        <div className="flex gap-6 text-gray-300">
                          <p>Qtd: <span className="font-medium">{item.quantidade}</span></p>
                          <p>Preço: <span className="font-medium">{item.preco}</span></p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end py-4">
                <p className="text-3xl text-white font-bold">
                  Total: R$ {Number(pedidoSelecionado.valor).toFixed(2).replace('.', ',')}
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
      </div>
    </Dashboard>
  );
};

export default Caixa;
