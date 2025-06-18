import React, { useState } from 'react';
import { IMaskInput } from 'react-imask';
import { notify } from '../../../utils/notify';

interface Cartao {
  numero: string;
  nome: string;
  validade: string;
  cvv: string;
}

interface Usuario {
  email: string;
}

interface AdicionarCartaoProps {
  visivel: boolean;
  onAdicionar: (cartao: Cartao) => void;
  usuario: Usuario;
}

const AdicionarCartao: React.FC<AdicionarCartaoProps> = ({
  visivel,
  onAdicionar,
  usuario,
}) => {
  const [numero, setNumero] = useState('');
  const [nome, setNome] = useState('');
  const [validade, setValidade] = useState('');
  const [cvv, setCvv] = useState('');

  if (!visivel) return null;

  const handleAdicionar = async () => {
    if (!usuario.email) {
      notify.error('Erro: Email do usuário não informado.');
      return;
    }

    if (!numero || !nome || !validade || !cvv) {
      notify.error('Preencha todos os campos do cartão.');
      return;
    }

    const dadosCartao = {
      numero,
      nome,
      validade,
      cvv,
    };

    console.log('Enviando para o backend:', {
      email: usuario.email,
      numero_cartao: numero,
      nome_cartao: nome,
      validade_cartao: validade,
      cvv_cartao: cvv,
    });

    try {
      const res = await fetch('http://localhost/UNIFOOD/database/update_cartao.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: usuario.email,
          numero_cartao: numero,
          nome_cartao: nome,
          validade_cartao: validade,
          cvv_cartao: cvv,
        }),
      });

      const data = await res.json();

      if (data.success) {
        onAdicionar(dadosCartao);
        notify.success('Cartão cadastrado com sucesso!');
        setNumero('');
        setNome('');
        setValidade('');
        setCvv('');
      } else {
        notify.error('Erro ao cadastrar cartão: ' + data.message);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      notify.error('Erro na conexão com o servidor');
    }
  };

  return (
    <div className="w-full bg-white/40 backdrop-blur-md rounded-2xl shadow-md p-4">
      <h2 className="text-5xl font-bold mb-4 text-center">Adicionar Cartão</h2>

      <div className="flex flex-col gap-3">
        <IMaskInput
          mask="0000 0000 0000 0000"
          value={numero}
          onAccept={(value) => setNumero(value as string)}
          placeholder="Número do Cartão"
          className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-red-600 text-black"
        />

        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome no Cartão"
          className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-red-600 text-black"
        />

        <div className="flex gap-3">
          <IMaskInput
            mask="00/00"
            value={validade}
            onAccept={(value) => setValidade(value as string)}
            placeholder="Validade (MM/AA)"
            className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-red-600 text-black"
          />

          <IMaskInput
            mask="000"
            value={cvv}
            onAccept={(value) => setCvv(value as string)}
            placeholder="CVV"
            className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-red-600 text-black"
          />
        </div>

        <button
          onClick={handleAdicionar}
          className="w-full py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md"
        >
          Adicionar Cartão
        </button>
      </div>
    </div>
  );
};

export default AdicionarCartao;
