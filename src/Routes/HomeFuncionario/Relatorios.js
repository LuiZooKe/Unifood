import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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
  const navigate = useNavigate();
  const [dadosPagamentos, setDadosPagamentos] = useState([]);
  const [dadosVendas, setDadosVendas] = useState([]);
  const [dadosTicket, setDadosTicket] = useState([]);
  const [topProdutos, setTopProdutos] = useState([]);
  const [detalhesProdutos, setDetalhesProdutos] = useState([]);
  const [faturamento, setFaturamento] = useState(0);
  const [totalPedidos, setTotalPedidos] = useState(0);
  const [erro, setErro] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [slideAtual, setSlideAtual] = useState(0);
  const [modoTV, setModoTV] = useState(false);
  const relatorioRef = useRef(null);
  const caminhoBaseImagens = "http://localhost/UNIFOOD/database/imgProdutos/";

  const ativarModoTV = () => {
    const el = relatorioRef.current;
    if (el && el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el && el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen(); // Safari
    } else if (el && el.msRequestFullscreen) {
      el.msRequestFullscreen(); // IE11
    }
    setModoTV(true);
  };

  const sairModoTV = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    setModoTV(false);
  };

  const coresPagamento = {
    CARTAO: "#f97316",    // Laranja suave (orange-500)
    DINHEIRO: "#facc15",  // Amarelo ouro (yellow-400)
    PIX: "#10b981",       // Verde jade (emerald-500) → Mais elegante que o atual
    SALDO: "#a78bfa",     // Roxo lavanda (purple-400) → Mantém a identidade, com suavidade
  };

  const coresVenda = {
    PDV: "#3b82f6",       // Azul real (blue-500) → Brilhante e equilibrado
    SITE: "#ef4444",      // Vermelho cereja (red-500) → Vibrante e com boa leitura
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

  return (
    <Dashboard>
      <div
        ref={relatorioRef}
        className={`min-h-screen bg-[#520000] text-white p-6 w-full relative ${modoTV ? "z-[9999] overflow-auto" : ""
          }`}
      >
        <div className="max-w-[1200px] mx-auto">
          <div className="relative h-[80px]">
            <div className="absolute top-0 left-0 right-0 z-[9999] bg-[#520000] py-4 px-1 flex justify-between flex-wrap items-center shadow-lg rounded">

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
                {modoTV ? (
                  <button
                    onClick={sairModoTV}
                    className="bg-red-700 hover:bg-red-600 px-4 py-2 rounded text-white"
                  >
                    ❌ Sair
                  </button>
                ) : (
                  <button
                    onClick={ativarModoTV}
                    className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded text-white"
                  >
                    MODO TV 📺
                  </button>
                )}
              </div>
            </div>
          </div>


          {/* Primeira linha com 2 blocos: Faturamento e Total de Pedidos */}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {/* Lucro Líquido */}
            <div className="bg-green-700 p-6 rounded shadow relative overflow-hidden h-full flex flex-col justify-center">
              <p className="text-md opacity-75 mb-2">LUCRO LÍQUIDO</p>
              <div className="flex items-center h-full">
                <p className="text-4xl font-bold">
                  R$ {detalhesProdutos.reduce((acc, item) => acc + item.lucro_total, 0).toFixed(2)}
                </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-yellow-900/10 pointer-events-none" />
            </div>

            {/* Ticket Médio */}
            <div className="bg-yellow-600 p-6 rounded shadow relative overflow-hidden h-full flex flex-col justify-center">
              <p className="text-md opacity-75 mb-2">TICKET MÉDIO</p>
              <div className="flex justify-around items-center space-x-4">
                {dadosTicket.map((ticket, idx) => (
                  <div key={idx} className="text-center">
                    <p className="text-sm font-semibold tracking-wide">
                      {normalizeKey(ticket.tipo_venda)}
                    </p>
                    <p className="text-3xl font-bold">
                      R$ {ticket.ticket_medio.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-900/10 pointer-events-none" />
            </div>

            {/* Produtos Mais Vendidos (Carrossel) */}
            <div className="col-span-2 row-span-2 rounded shadow overflow-hidden relative">
              <p className="absolute mt-6 left-1/2 transform -translate-x-1/2 text-white text-x2 opacity-75 font-bold z-10 tracking-wide whitespace-nowrap">
                PRODUTOS MAIS VENDIDOS
              </p>

              <Slider
                dots={false}
                infinite
                speed={800}
                slidesToShow={1}
                slidesToScroll={1}
                autoplay
                autoplaySpeed={5000}
                arrows={false}
                beforeChange={(_, next) => setSlideAtual(next)}
              >
                {topProdutos
                  .filter((item) => item.quantidade_total > 0)
                  .slice(0, 10)
                  .map((item, idx) => {
                    const info = detalhesProdutos.find((p) => p.nome === item.nome);
                    return (
                      <div key={idx} className="relative w-full h-[190px]">
                        <img
                          src={`${caminhoBaseImagens}${info?.imagem || "placeholder.jpg"}`}
                          alt={item.nome}
                          className="w-full h-full object-cover brightness-[.65]"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center bg-black bg-opacity-30 px-2">
                          <p className="text-[2.5rem] font-bold drop-shadow">{item.nome}</p>
                          <p className="text-[1.5rem] font-bold drop-shadow">Vendidos: {item.quantidade_total}</p>
                        </div>
                      </div>
                    );
                  })}
              </Slider>

              {/* Bloco de informações adicionais do produto atual */}
              {(() => {
                const produtoNome = topProdutos.filter(p => p.quantidade_total > 0).slice(0, 10)[slideAtual]?.nome;
                const produto = detalhesProdutos.find(p => p.nome === produtoNome);

                return produto ? (
                  <div className="bg-[#450000] text-white px-6 py-4 text-sm sm:text-base flex flex-wrap sm:flex-nowrap justify-between gap-4">
                    <p><strong>Preço Unitário:</strong> R$ {produto.preco.toFixed(2)}</p>
                    <p><strong>Lucro Unitário:</strong> R$ {produto.lucro_unitario.toFixed(2)}</p>
                    <p><strong>Margem:</strong> {(produto.lucro_unitario / produto.preco * 100).toFixed(1)}%</p>
                  </div>
                ) : (
                  <div className="bg-[#450000] text-white px-6 py-4">
                    <p>Sem dados disponíveis para este produto.</p>
                  </div>
                );
              })()}
            </div>

            {/* Produto com Maior Lucro */}
            <div className="bg-blue-600 text-white p-6 rounded shadow h-full flex flex-col justify-center">
              <p className="text-md opacity-75 mb-2">MAIOR LUCRO</p>
              {(() => {
                const produto = [...detalhesProdutos].sort((a, b) => b.lucro_total - a.lucro_total)[0];
                return produto ? (
                  <div className="text-[1.5rem] space-y-1">
                    <div className="flex justify-between">
                      <p className="font-semibold">{produto.nome}</p>
                      <p>Total: R$ {produto.lucro_total.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between">
                      <p>Vendidos: {produto.quantidade_total}</p>
                      <p>Margem: {(produto.lucro_unitario / produto.preco * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                ) : <p className="text-sm">Sem dados</p>;
              })()}
            </div>

            {/* Produto Menos Vendido */}
            <div className="bg-red-700 text-white p-6 rounded shadow h-full flex flex-col justify-center">
              <p className="text-md opacity-75 mb-2">MENOS VENDIDO</p>
              {(() => {
                const produto = [...detalhesProdutos]
                  .filter(p => p.quantidade_vendida > 0)
                  .sort((a, b) => a.quantidade_vendida - b.quantidade_vendida)[0];
                return produto ? (
                  <div className="text-[1.5rem] space-y-1">
                    <div className="flex justify-between">
                      <p className="font-semibold">{produto.nome}</p>
                      <p>Total: R$ {(produto.preco * produto.quantidade_vendida).toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between">
                      <p>Vendidos: {produto.quantidade_vendida}</p>
                      <p>Margem: {(produto.lucro_unitario / produto.preco * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                ) : <p className="text-sm">Sem dados</p>;
              })()}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#6e0f0f] p-4 rounded">
              <h3 className="text-x1 font-semibold mt-4 text-center">Por Tipo de Pagamento</h3>
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
                  <Legend
                    iconType="plainline"
                    formatter={() => 'Nº Pedidos'}
                  />
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
              <h3 className="text-x1 font-semibold mt-4 text-center">Por Tipo de Venda</h3>
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
                  <Legend
                    iconType="plainline"
                    formatter={() => 'Ticket Médio'}
                  />
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

          {/* Tabela TOP 10 PRODUTOS MAIS VENDIDOS */}
          <div className="mt-10 overflow-x-auto">
            <h3 className="text-x1 font-semibold mb-2">Top 10 PRODUTOS MAIS VENDIDOS</h3>
            <table className="min-w-full text-md bg-[#6e0f0f] rounded">
              <thead>
                <tr className="text-left bg-[#7f1d1d] text-black font-semibold">
                  <th className="p-3">Produto</th>
                  <th className="p-3">Quantidade Vendida</th>
                </tr>
              </thead>
              <tbody>
                {topProdutos
                  .filter((item) => item.quantidade_total > 0) // ← evita produtos com zero
                  .slice(0, 10) // ← limita a 10
                  .map((item, idx) => (
                    <tr key={idx} className="border-t border-[#9b1c1c]">
                      <td className="p-3 font-medium">{item.nome}</td>
                      <td className="p-3">{item.quantidade_total}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 overflow-x-auto">
            <h3 className="text-x1 font-semibold mb-2">DETALHAMENTO DOS PRODUTOS</h3>
            <table className="min-w-full text-md bg-[#6e0f0f] rounded">
              <thead>
                <tr className="text-left bg-[#7f1d1d] text-black font-semibold">
                  <th className="p-3">Produto</th>
                  <th className="p-3">Preço</th>
                  <th className="p-3">Custo</th>
                  <th className="p-3">Lucro Unitário</th>
                  <th className="p-3">Fornecedor</th>
                  <th className="p-3">Qtd. em Estoque</th>
                  <th className="p-3">Qtd. Vendida</th>
                  <th className="p-3">Lucro Total</th>
                </tr>
              </thead>
              <tbody>
                {detalhesProdutos.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-t border-[#9b1c1c] cursor-pointer hover:bg-[#8b1f1f] transition"
                    onClick={() => {
                      localStorage.setItem("produtoSelecionado", item.nome);
                      navigate("/lista-produtos");
                    }}
                    title="Clique para ver/editar o produto na Lista"
                  >
                    <td className="p-3 font-medium">{item.nome}</td>
                    <td className="p-3">R$ {item.preco.toFixed(2)}</td>
                    <td className="p-3">R$ {item.custo.toFixed(2)}</td>
                    <td className="p-3">R$ {item.lucro_unitario.toFixed(2)}</td>
                    <td className="p-3">{item.nome_fornecedor}</td>
                    <td className="p-3">{item.quantidade_estoque}</td>
                    <td className="p-3">{item.quantidade_vendida}</td>
                    <td className="p-3">R$ {item.lucro_total.toFixed(2)}</td>
                  </tr>
                ))}

                <tr className="bg-[#7f1d1d] text-white font-bold border-t border-white">
                  <td colSpan={7} className="p-3 text-right">Lucro Líquido Total</td>
                  <td className="p-3">
                    R$ {detalhesProdutos.reduce((acc, item) => acc + item.lucro_total, 0).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Dashboard>
  );


}

export default Relatorios;
