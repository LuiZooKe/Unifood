import React, { useState } from 'react';
import { DollarSign } from 'lucide-react';

const AbaRecarga: React.FC = () => {
  const [emailPrefixo, setEmailPrefixo] = useState('');
  const [valor, setValor] = useState('');
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  const aplicarMascaraValor = (valor: string) => {
    const somenteNumeros = valor.replace(/\D/g, '');
    const numero = (Number(somenteNumeros) / 100).toFixed(2);
    return numero.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleAdicionarSaldo = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailCompleto = `${emailPrefixo}@unifucamp.edu.br`;
    const valorNumerico = Number(valor.replace(/\./g, '').replace(',', '.'));

    if (!emailPrefixo || isNaN(valorNumerico) || valorNumerico <= 0) {
      setErro('Preencha os campos corretamente.');
      setMensagem('');
      return;
    }

    try {
      const response = await fetch('http://localhost/Unifood/database/update_saldo.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailCompleto, saldo: valorNumerico }),
      });

      const data = await response.json();

      if (data.success) {
        setMensagem('Saldo adicionado com sucesso!');
        setErro('');
        setEmailPrefixo('');
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

  return (
    <div className="flex items-top justify-center">
      <form
        onSubmit={handleAdicionarSaldo}
        className="bg-[#661111]/90 p-8 rounded-2xl shadow-xl md:w-[50vw] flex flex-col gap-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-5xl font-extrabold text-center text-white">RECARGA DE SALDO</h2>
          <DollarSign size={48} className="text-green-400" />
        </div>

        <div className="flex flex-col">
          <label className="block mb-1 text-x1 text-gray-300">Usuário</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={emailPrefixo}
              onChange={(e) => setEmailPrefixo(e.target.value)}
              placeholder="Digite o usuário"
              className="w-[50%] border border-[#ffffff22] rounded-xl px-4 py-2 bg-black/30 text-white"
              required
            />
            <span className="text-x2 text-white font-bold whitespace-nowrap">
              @unifucamp.edu.br
            </span>
          </div>
        </div>

        <div>
          <label className="block mb-1 text-x1 text-gray-300">Valor</label>
          <input
            type="text"
            placeholder="Digite o valor"
            value={valor}
            onChange={(e) => setValor(aplicarMascaraValor(e.target.value))}
            className="w-full border border-[#ffffff22] rounded-xl px-4 py-3 bg-black/30 text-white"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl"
        >
          ADICIONAR SALDO
        </button>

        {(erro || mensagem) && (
          <div className={`mt-4 text-center ${erro ? 'text-red-400' : 'text-green-400'}`}>
            {erro && <p>{erro}</p>}
            {mensagem && <p>{mensagem}</p>}
          </div>
        )}
      </form>
    </div>
  );
};

export default AbaRecarga;
