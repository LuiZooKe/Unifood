import React, { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

function Relatorios() {
  const [dadosPagamentos, setDadosPagamentos] = useState([]);
  const [dadosVendas, setDadosVendas] = useState([]);
  const [dadosTicket, setDadosTicket] = useState([]);
  const [topProdutos, setTopProdutos] = useState([]);
  const [detalhesProdutos, setDetalhesProdutos] = useState([]);
  const [faturamento, setFaturamento] = useState(0);
  const [totalPedidos, setTotalPedidos] = useState(0);
  const [erro, setErro] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [modoTV, setModoTV] = useState(false);

  const coresPagamento = {
    PIX: "#00C49F",
    DINHEIRO: "#FFBB28",
    CARTAO: "#FF8042",
    SALDO: "#00c446"
  };

  const coresVenda = {
    PDV: "#4D96FF",
    SITE: "#FF4D6D",
  };

  const normalizeKey = (key) => (key ? key.trim().toUpperCase() : "");

  const fetchRelatorios = async (filtroSelecionado) => {
    try {
      const res = await fetch("http://localhost/UNIFOOD/database/relatorios.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filtro: filtroSelecionado }),
      });
      const data = await res.json();
      if (data.success) {
        setDadosPagamentos(
          data.pagamentos.map((item) => ({
            tipo_pagamento: normalizeKey(item.tipo_pagamento),
            quantidade: item.quantidade,
          }))
        );
        setDadosVendas(
          data.vendas.map((item) => ({
            tipo_venda: normalizeKey(item.tipo_venda),
            quantidade: item.quantidade,
          }))
        );
        setDadosTicket(data.ticket);
        setFaturamento(data.faturamento);
        setTotalPedidos(data.total_pedidos);
        setTopProdutos(data.top_produtos);
        setDetalhesProdutos(data.detalhes_produtos);
        setErro("");
      } else {
        setErro(data.message || "Erro ao carregar dados.");
        setDadosPagamentos([]);
        setDadosVendas([]);
        setDadosTicket([]);
        setTopProdutos([]);
        setDetalhesProdutos([]);
        setFaturamento(0);
        setTotalPedidos(0);
      }
    } catch (e) {
      console.error(e);
      setErro("Erro ao conectar ao servidor.");
    }
  };

  useEffect(() => {
    fetchRelatorios(filtro);
  }, [filtro]);

  // 📺 MODO TV
  if (modoTV) {
    return (
      <div className="fixed top-0 left-0 z-50 w-screen h-screen bg-black text-white overflow-auto p-6">
        <h1 className="text-4xl font-bold text-center mb-10">Visão Geral - Modo TV</h1>
        <div className="flex flex-wrap justify-center gap-10">
          <PieChart width={400} height={400}>
            <Pie data={dadosPagamentos} dataKey="quantidade" nameKey="tipo_pagamento" cx="50%" cy="50%" outerRadius={150} label>
              {dadosPagamentos.map((entry, index) => (
                <Cell key={index} fill={coresPagamento[normalizeKey(entry.tipo_pagamento)] || "#ccc"} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>

          <PieChart width={400} height={400}>
            <Pie data={dadosVendas} dataKey="quantidade" nameKey="tipo_venda" cx="50%" cy="50%" outerRadius={150} label>
              {dadosVendas.map((entry, index) => (
                <Cell key={index} fill={coresVenda[normalizeKey(entry.tipo_venda)] || "#ccc"} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>

          <BarChart width={700} height={400} data={dadosTicket}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="tipo_venda" />
            <YAxis />
            <Tooltip formatter={(v) => `R$ ${v}`} />
            <Legend />
            <Bar dataKey="ticket_medio" fill="#f87171" />
          </BarChart>
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => setModoTV(false)}
            className="mt-4 bg-red-600 px-6 py-3 text-white rounded hover:bg-red-500"
          >
            Fechar Modo TV
          </button>
        </div>
      </div>
    );
  }

  return (
    <Dashboard>
      <div className="min-h-screen bg-[#520000] text-white p-6 w-full">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex justify-between flex-wrap items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Relatórios de Pedidos Finalizados
            </h1>
            <div className="flex gap-2 items-center">
              <select
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="p-2 rounded text-black"
              >
                <option value="todos">Todos</option>
                <option value="hoje">Hoje</option>
                <option value="semana">Última Semana</option>
                <option value="mes">Último Mês</option>
              </select>
              <button
                onClick={() => setModoTV(true)}
                className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded text-white"
              >
                Modo TV
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-green-600 p-6 rounded shadow">
              <p className="text-md opacity-75">FATURAMENTO</p>
              <p className="text-5xl font-bold">R$ {faturamento.toFixed(2)}</p>
            </div>
            <div className="bg-[#6e0f0f] p-6 rounded shadow">
              <p className="text-md opacity-75">TOTAL DE PEDIDOS</p>
              <p className="text-5xl font-bold">{totalPedidos}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#6e0f0f] p-4 rounded">
              <h3 className="text-lg font-semibold my-4 text-center">Por Tipo de Pagamento</h3>
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <PieChart width={300} height={300}>
                  <Pie
                    data={dadosPagamentos}
                    dataKey="quantidade"
                    nameKey="tipo_pagamento"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                  >
                    {dadosPagamentos.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={
                          coresPagamento[normalizeKey(entry.tipo_pagamento)] || "#ccc"
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
                <BarChart width={300} height={300} data={dadosPagamentos} barCategoryGap={40} barSize={30}>
                  <XAxis dataKey="tipo_pagamento" />
                  <YAxis />
                  <Tooltip formatter={(v) => `${v} pedidos`} />
                  <Legend />
                  <Bar
                    dataKey="quantidade"
                    name="Pedidos"
                  >
                    {dadosPagamentos.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={
                          coresPagamento[normalizeKey(entry.tipo_pagamento)] || "#f87171"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </div>
            </div>

            <div className="bg-[#6e0f0f] p-4 rounded">
              <h3 className="text-lg font-semibold my-4 text-center">Por Tipo de Venda</h3>
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <PieChart width={300} height={300}>
                  <Pie
                    data={dadosVendas}
                    dataKey="quantidade"
                    nameKey="tipo_venda"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                  >
                    {dadosVendas.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={coresVenda[normalizeKey(entry.tipo_venda)] || "#ccc"}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
                <BarChart
                  width={300}
                  height={300}
                  data={dadosTicket}
                  barCategoryGap={40}
                  barSize={30}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="tipo_venda" />
                  <YAxis />
                  <Tooltip formatter={(v) => `R$ ${v}`} />
                  <Legend />
                  <Bar
                    dataKey="ticket_medio"
                    name="Ticket Médio"
                  >
                    {dadosTicket.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={
                          coresVenda[normalizeKey(entry.tipo_venda)] || "#f87171"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </div>
            </div>
          </div>

          <div className="mt-10 overflow-x-auto">
            <h3 className="text-x1 font-semibold mb-2">
              Top 10 PRODUTOS MAIS VENDIDOS
            </h3>
            <table className="min-w-full text-md bg-[#6e0f0f] rounded">
              <thead>
                <tr className="text-left bg-[#7f1d1d] text-black font-semibold">
                  <th className="p-3">Produto</th>
                  <th className="p-3">Quantidade Vendida</th>
                </tr>
              </thead>
              <tbody>
                {topProdutos.map((item, idx) => (
                  <tr key={idx} className="border-t border-[#9b1c1c]">
                    <td className="p-3 font-medium">{item.nome}</td>
                    <td className="p-3">{item.quantidade_total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 overflow-x-auto">
            <h3 className="text-X1 font-semibold mb-2">DETALHAMENTO DOS PRODUTOS</h3>
            <table className="min-w-full text-md bg-[#6e0f0f] rounded">
              <thead>
                <tr className="text-left bg-[#7f1d1d] text-black font-semibold">
                  <th className="p-3">Produto</th>
                  <th className="p-3">Preço</th>
                  <th className="p-3">Custo</th>
                  <th className="p-3">Lucro Unitário</th>
                  <th className="p-3">Quantidade</th>
                  <th className="p-3">Lucro Total</th>
                </tr>
              </thead>
              <tbody>
                {detalhesProdutos.map((item, idx) => (
                  <tr key={idx} className="border-t border-[#9b1c1c]">
                    <td className="p-3 font-medium">{item.nome}</td>
                    <td className="p-3">R$ {item.preco.toFixed(2)}</td>
                    <td className="p-3">R$ {item.custo.toFixed(2)}</td>
                    <td className="p-3">R$ {item.lucro_unitario.toFixed(2)}</td>
                    <td className="p-3">{item.quantidade_total}</td>
                    <td className="p-3">R$ {item.lucro_total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Dashboard>
  );


}

export default Relatorios;
