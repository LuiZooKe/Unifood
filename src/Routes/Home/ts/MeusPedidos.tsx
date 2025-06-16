import React, { useEffect, useState } from 'react';

interface Pedido {
  id: number;
  nome_cliente: string;
  email_cliente: string;
  itens: { nome: string; preco: string; quantidade: number }[];
  valor_total: number;
  tipo_pagamento: string;
  data_pedido: string;
}

interface MeusPedidosProps {
  usuario: { email: string };
}

const MeusPedidos: React.FC<MeusPedidosProps> = ({ usuario }) => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  useEffect(() => {
    if (usuario.email) {
      fetch('http://localhost/UNIFOOD/database/listar_pedidos.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: usuario.email }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setPedidos(data.pedidos);
          } else {
            alert(data.message);
          }
        });
    }
  }, [usuario.email]);

  return (
    <div className="p-6">
      <h2 className="text-4xl font-bold mb-6">Meus Pedidos</h2>
      {pedidos.length === 0 ? (
        <p>Você ainda não realizou nenhum pedido.</p>
      ) : (
        pedidos.map(pedido => (
          <div
            key={pedido.id}
            className="border border-gray-300 rounded-xl p-4 mb-4"
          >
            <p><strong>Data:</strong> {new Date(pedido.data_pedido).toLocaleString()}</p>
            <p><strong>Pagamento:</strong> {pedido.tipo_pagamento}</p>
            <p><strong>Total:</strong> R$ {pedido.valor_total.toFixed(2)}</p>
            <p className="mt-2 font-semibold">Itens:</p>
            <ul className="list-disc pl-5">
              {pedido.itens.map((item, idx) => (
                <li key={idx}>
                  {item.nome} - {item.quantidade}x ({item.preco})
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default MeusPedidos;
