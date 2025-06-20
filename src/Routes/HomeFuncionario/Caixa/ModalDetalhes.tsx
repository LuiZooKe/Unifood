import React from 'react';
import { X } from 'lucide-react';

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

interface ModalDetalhesProps {
  pedido: Pedido;
  onClose: () => void;
  onFinalizar: (pedido: Pedido) => void;
}

const ModalDetalhes: React.FC<ModalDetalhesProps> = ({ pedido, onClose, onFinalizar }) => {
  const calcularTotalPedido = (pedido: Pedido) =>
    pedido.itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  return (
    <div className="absolute inset-0 z-[9999] bg-black/70 flex justify-center items-center" onClick={onClose}>
      <div
        className="bg-[#661111]/95 rounded-2xl p-6 w-[95%] max-w-[600px] max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white">Nº {pedido.id}</h3>
          <button className="text-gray-300 hover:text-white" onClick={onClose}>
            <X size={28} />
          </button>
        </div>

        <div className="mb-4">
          <h3 className="text-2xl font-bold text-white mb-2">DADOS DO CLIENTE</h3>
          <p className="text-gray-200"><b>Nome:</b> {pedido.nome}</p>
          <p className="text-gray-200"><b>Email:</b> {pedido.email}</p>
          <p className="text-gray-200"><b>Telefone:</b> {pedido.telefone ?? 'Não informado'}</p>
        </div>

        <h3 className="text-2xl font-bold text-white mb-4">ITENS DO PEDIDO</h3>
        <div className="flex-1 overflow-y-auto pr-2 space-y-3">
          {pedido.itens.map((item, idx) => (
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
            Total: R$ {calcularTotalPedido(pedido).toFixed(2).replace('.', ',')}
          </p>
        </div>

        {pedido.status === 'FINALIZADO' ? (
          <button
            className="bg-gray-500 cursor-not-allowed text-white font-bold px-6 py-3 rounded-xl"
            disabled
          >
            ESTE PEDIDO JÁ FOI ENTREGUE
          </button>
        ) : (
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl"
            onClick={() => onFinalizar(pedido)}
          >
            ENTREGAR PEDIDO
          </button>
        )}
      </div>
    </div>
  );
};

export default ModalDetalhes;
