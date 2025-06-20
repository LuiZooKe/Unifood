import React, { useState } from 'react';
import Dashboard from '../Dashboard';
import { QrCode, DollarSign } from 'lucide-react';
import AbaPedidos from './AbaPedidos.tsx';
import AbaRecarga from './AbaRecarga.tsx';
import ModalDetalhes from './ModalDetalhes.tsx'
import AbaPDV from './AbaPDV.tsx';

const Caixa: React.FC = () => {
  const [abaAtiva, setAbaAtiva] = useState<'pedidos' | 'PDV' | 'recarga'>('pedidos');

  return (
    <Dashboard>
      <div className="p-4 sm:p-6 w-full max-w-[1200px] mx-auto h-[calc(100vh-48px)] flex flex-col">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-[#661111]/90 rounded-2xl shadow-2xl p-4 sm:p-6 border border-[#ffffff22] mb-4 min-h-[12rem]">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <h1 className="text-[clamp(2rem,6vw,4rem)] font-extrabold text-white">CAIXA</h1>
            <div className="flex gap-2">
              {['pedidos', 'PDV', 'recarga'].map((aba) => (
                <button
                  key={aba}
                  onClick={() => setAbaAtiva(aba as 'pedidos' | 'PDV' | 'recarga')}
                  className={`px-4 py-2 rounded-xl font-semibold transition ${abaAtiva === aba
                    ? 'bg-white text-[#8b0000]'
                    : 'bg-[#8b0000]/90 hover:bg-[#6e0000]/90 text-white'
                    }`}
                >
                  {aba === 'pedidos'
                    ? 'Pedidos'
                    : aba === 'recarga'
                      ? 'Recarga'
                      : 'PDV'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Conteúdo da Aba */}
        {abaAtiva === 'pedidos' && <AbaPedidos />}
        {abaAtiva === 'recarga' && <AbaRecarga />}
        {abaAtiva === 'PDV' && <AbaPDV />}
      </div>
    </Dashboard>
  );
};

export default Caixa;
