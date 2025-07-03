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

  // Mapeamento de cores para pagamentos - garanta maiúsculas sem espaços
  const coresPagamento = {
    PIX: "#00C49F",
    DINHEIRO: "#FFBB28",
    CARTAO: "#FF8042",
  };

  // Cores para tipo de venda
  const coresVenda = {
    PDV: "#4D96FF",
    SITE: "#FF4D6D",
  };

  // Função para normalizar chaves de cor: maiúsculas + trim
  const normalizeKey = (key) => (key ? key.trim().toUpperCase() : "");

  const fetchRelatorios = async (filtroSelecionado) => {
    try {
      const res = await fetch(
        "http://localhost/UNIFOOD/database/relatorios.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filtro: filtroSelecionado }),
        }
      );
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
        setErro(data.message || "Erro ao carregar dados do relatório.");
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
      setDadosPagamentos([]);
      setDadosVendas([]);
      setDadosTicket([]);
      setTopProdutos([]);
      setDetalhesProdutos([]);
      setFaturamento(0);
      setTotalPedidos(0);
    }
  };

  useEffect(() => {
    fetchRelatorios(filtro);
  }, [filtro]);

  return (
    <Dashboard>
      <div className="p-6 text-white overflow-x-hidden w-full">
        <h1 className="text-3xl font-bold mb-[30px] text-center">
          Relatórios de Pedidos Finalizados
        </h1>

        <div className="mb-4 flex justify-center gap-4 flex-wrap">
          <select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="text-black p-2 rounded"
          >
            <option value="todos">Todos</option>
            <option value="hoje">Hoje</option>
            <option value="semana">Última Semana</option>
            <option value="mes">Último Mês</option>
          </select>
        </div>

        {/* Resumo topo */}
        <div className="flex justify-center gap-4 flex-wrap mb-8">
          <div className="bg-green-600 p-4 rounded shadow text-center min-w-[150px]">
            <p className="text-xl font-bold">Faturamento</p>
            <p className="text-2xl">R$ {faturamento.toFixed(2)}</p>
          </div>
          <div className="bg-blue-600 p-4 rounded shadow text-center min-w-[150px]">
            <p className="text-xl font-bold">Total Pedidos</p>
            <p className="text-2xl">{totalPedidos}</p>
          </div>
        </div>

        {/* Gráficos */}
        <div className="flex flex-col md:flex-row justify-center gap-10 flex-wrap items-center">
          {/* Pagamento */}
          <div className="relative min-h-[400px]">
            <PieChart width={400} height={400}>
              <Pie
                data={
                  dadosPagamentos.length > 0
                    ? dadosPagamentos
                    : [{ tipo_pagamento: "Sem Dados", quantidade: 1 }]
                }
                dataKey="quantidade"
                nameKey="tipo_pagamento"
                cx="50%"
                cy="50%"
                outerRadius={150}
                label={dadosPagamentos.length > 0}
              >
                {(dadosPagamentos.length > 0
                  ? dadosPagamentos
                  : [{ tipo_pagamento: "Sem Dados", quantidade: 1 }]
                ).map((entry, index) => {
                  const cor = dadosPagamentos.length > 0
                    ? coresPagamento[normalizeKey(entry.tipo_pagamento)] || "#8884d8"
                    : "#ffffff";
                  return <Cell key={`cell-pag-${index}`} fill={cor} />;
                })}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
            {dadosPagamentos.length === 0 && (
              <span className="absolute inset-0 flex justify-center items-center text-black text-xl">
                Sem dados para este período.
              </span>
            )}
          </div>

          {/* Tipo de venda */}
          <div className="relative min-h-[400px]">
            <PieChart width={400} height={400}>
              <Pie
                data={
                  dadosVendas.length > 0
                    ? dadosVendas
                    : [{ tipo_venda: "Sem Dados", quantidade: 1 }]
                }
                dataKey="quantidade"
                nameKey="tipo_venda"
                cx="50%"
                cy="50%"
                outerRadius={150}
                label={dadosVendas.length > 0}
              >
                {(dadosVendas.length > 0
                  ? dadosVendas
                  : [{ tipo_venda: "Sem Dados", quantidade: 1 }]
                ).map((entry, index) => {
                  const cor = dadosVendas.length > 0
                    ? coresVenda[normalizeKey(entry.tipo_venda)] || "#8884d8"
                    : "#ffffff";
                  return <Cell key={`cell-venda-${index}`} fill={cor} />;
                })}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
            {dadosVendas.length === 0 && (
              <span className="absolute inset-0 flex justify-center items-center text-black text-xl">
                Sem dados para este período.
              </span>
            )}
          </div>
        </div>

        {/* Ticket médio */}
        <div className="w-full max-w-[800px] bg-[#1f2f3f] rounded p-4 mt-8 mx-auto">
          <h3 className="text-center text-xl font-bold mb-4">
            Ticket Médio por Canal
          </h3>
          <div className="flex justify-center">
            <BarChart width={700} height={400} data={dadosTicket}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tipo_venda" />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
              <Legend />
              <Bar dataKey="ticket_medio" fill="#8884d8" name="Ticket Médio">
                {dadosTicket.map((entry, index) => (
                  <Cell
                    key={`cell-bar-${index}`}
                    fill={entry.tipo_venda === "PDV" ? "#4D96FF" : "#FF4D6D"}
                  />
                ))}
              </Bar>
            </BarChart>
          </div>
          {dadosTicket.length === 0 && (
            <p className="text-center text-white mt-4">
              Sem dados para este período.
            </p>
          )}
        </div>

        {/* Top 10 produtos */}
        <div className="w-full mt-10 overflow-x-auto">
          <h3 className="text-center text-xl font-bold mb-4">
            Top 10 Produtos Mais Vendidos
          </h3>
          <table className="w-full text-left border border-white">
            <thead>
              <tr>
                <th className="border px-2 py-1">Produto</th>
                <th className="border px-2 py-1">Quantidade Vendida</th>
              </tr>
            </thead>
            <tbody>
              {topProdutos.map((item, idx) => (
                <tr key={idx}>
                  <td className="border px-2 py-1">{item.nome}</td>
                  <td className="border px-2 py-1">{item.quantidade_total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tabela detalhada produtos */}
        <div className="w-full mt-10 overflow-x-auto">
          <h3 className="text-center text-xl font-bold mb-4">
            Detalhamento de Produtos
          </h3>
          <table className="w-full text-left border border-white">
            <thead>
              <tr>
                <th className="border px-2 py-1">Produto</th>
                <th className="border px-2 py-1">Preço</th>
                <th className="border px-2 py-1">Custo</th>
                <th className="border px-2 py-1">Lucro Unitário</th>
                <th className="border px-2 py-1">Quantidade Vendida</th>
                <th className="border px-2 py-1">Lucro Total</th>
              </tr>
            </thead>
            <tbody>
              {detalhesProdutos.map((item, idx) => (
                <tr key={idx}>
                  <td className="border px-2 py-1">{item.nome}</td>
                  <td className="border px-2 py-1">R$ {item.preco.toFixed(2)}</td>
                  <td className="border px-2 py-1">R$ {item.custo.toFixed(2)}</td>
                  <td className="border px-2 py-1">
                    R$ {item.lucro_unitario.toFixed(2)}
                  </td>
                  <td className="border px-2 py-1">{item.quantidade_total}</td>
                  <td className="border px-2 py-1">R$ {item.lucro_total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Dashboard>
  );
}

export default Relatorios;
