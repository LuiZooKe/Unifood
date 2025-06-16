import React, { useState } from 'react';
import { X } from 'lucide-react';
import Pagamento from './Pagamento.tsx';
import Pix from './Pix.tsx';
import PagamentoConfirm from './PagamentoConfirm.tsx';

interface Produto {
  nome: string;
  preco: string;
  imagem: string;
  quantidade: number;
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
  itens: Produto[];
  calcularTotal: () => string;
  onAlterarQuantidade: (nome: string, novaQuantidade: number) => void;
  onRemover: (nome: string) => void;
  usuario: Usuario;
  atualizarUsuario: (usuarioAtualizado: Usuario) => void;
  limparCarrinho: () => void;
}

const ModalCarrinho: React.FC<ModalCarrinhoProps> = ({
  aberto,
  onFechar,
  itens,
  calcularTotal,
  onAlterarQuantidade,
  onRemover,
  usuario,
  atualizarUsuario,
  limparCarrinho,
}) => {
  const [pagamentoAberto, setPagamentoAberto] = useState(false);
  const [pixAberto, setPixAberto] = useState(false);
  const [confirmacaoAberta, setConfirmacaoAberta] = useState(false);

  if (!aberto) return null;

  const finalizarPagamento = async (metodo: 'pix' | 'cartao' | 'saldo') => {
  const total = parseFloat(calcularTotal().replace(',', '.'));

  if (metodo === 'cartao' && !usuario.numero_cartao) {
    alert('Nenhum cartão cadastrado.');
    return;
  }

  if (metodo === 'saldo' && (usuario.saldo || 0) < total) {
    alert('Saldo insuficiente.');
    return;
  }

  try {
    const res = await fetch('http://localhost/UNIFOOD/database/finalizar_pedido.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: usuario.nome,
        email: usuario.email,
        itens: itens,
        valor_total: total,
        tipo_pagamento: metodo,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert('Pedido finalizado com sucesso!');

      // 🔥 Atualiza saldo no usuário
      const usuarioAtualizado = { ...usuario, saldo: data.novo_saldo };
      atualizarUsuario(usuarioAtualizado);
      localStorage.setItem('dadosUsuario', JSON.stringify(usuarioAtualizado));

      // 🔥 E aqui FECHA TUDO e LIMPA
      setPagamentoAberto(false);
      setPixAberto(false);
      setConfirmacaoAberta(true);
      onFechar(); // Fecha também o modal do carrinho
      limparCarrinho();

    } else {
      alert('Erro ao finalizar pedido: ' + data.message);
    }
  } catch (error) {
    console.error('Erro na conexão:', error);
    alert('Erro na conexão com o servidor.');
  }
};


  return (
    <div
      className={`
        fixed inset-0 z-[9999]
        flex items-center justify-center
        md:inset-auto md:top-28 md:right-[3.5rem] md:items-start md:justify-end
        bg-black/70 backdrop-blur-xl md:bg-transparent
        md:rounded-3xl shadow-2xl
      `}
      onClick={onFechar}
    >
      <div
        className="
          bg-white/95 backdrop-blur-md
          w-[90%] max-w-[500px] h-[90%]
          md:w-[380px] md:h-auto 
          rounded-3xl shadow-xl 
          overflow-auto relative 
          px-6 py-8
        "
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onFechar}
          className="absolute top-6 right-6 text-gray-500 hover:text-red-500"
        >
          <X className="w-10 h-10 sm:w-12 sm:h-12" />
        </button>

        <h2 className="text-center font-extrabold text-gray-800 leading-tight">
          <span className="block text-[clamp(2.5rem,6vw,4rem)]">CARRINHO 🛒</span>
        </h2>

        {itens.length === 0 ? (
          <p className="text-center text-gray-700">Seu carrinho está vazio.</p>
        ) : (
          <div className="space-y-4 max-h-[50vh] md:max-h-[60vh] overflow-y-auto pr-2">
            {itens.map((item) => (
              <div
                key={item.nome}
                className="flex gap-4 bg-white rounded-xl p-4 shadow"
              >
                <img
                  src={item.imagem}
                  alt={item.nome}
                  className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] object-cover rounded-lg flex-shrink-0"
                />

                <div className="flex flex-col justify-between w-full">
                  <div className="flex flex-col justify-end flex-grow">
                    <h4 className="font-bold text-gray-800 leading-tight text-[clamp(1.5rem,3vw,2.5rem)] break-words">
                      {item.nome}
                    </h4>
                    <p className="text-gray-600 mt-1 text-[clamp(1.25rem,2.5vw,2rem)]">
                      Preço: <span className="font-semibold">{item.preco}</span>
                    </p>
                  </div>

                  <div className="flex flex-col items-end mt-4 gap-2">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => onAlterarQuantidade(item.nome, item.quantidade - 1)}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-xl font-bold"
                      >
                        −
                      </button>
                      <span className="text-2xl font-semibold">{item.quantidade}</span>
                      <button
                        onClick={() => onAlterarQuantidade(item.nome, item.quantidade + 1)}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-xl font-bold"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => onRemover(item.nome)}
                      className="text-red-600 hover:text-red-800 text-lg font-medium"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {itens.length > 0 && (
          <div className="mt-10 pt-6 border-t border-gray-300 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
            <p className="text-2xl font-bold text-gray-800">
              TOTAL: <span className="text-green-600">R$ {calcularTotal()}</span>
            </p>
            <button
              onClick={() => setPagamentoAberto(true)}
              className="
                bg-green-600 hover:bg-green-700 
                text-white font-bold text-2xl 
                py-4 px-8 rounded-xl 
                shadow-md hover:shadow-xl 
                transition-all
              "
            >
              Finalizar Compra
            </button>
          </div>
        )}
      </div>

      <Pagamento
        visivel={pagamentoAberto}
        onFechar={() => setPagamentoAberto(false)}
        onPix={() => {
          setPagamentoAberto(false);
          setPixAberto(true);
        }}
        onSaldo={() => finalizarPagamento('saldo')}
        onCartao={() => finalizarPagamento('cartao')}
      />

      <Pix
        visivel={pixAberto}
        onFechar={() => setPixAberto(false)}
        onConfirmar={() => finalizarPagamento('pix')}
      />

      <PagamentoConfirm
        visivel={confirmacaoAberta}
        onFechar={() => setConfirmacaoAberta(false)}
      />

    </div>
  );
};

export default ModalCarrinho;
