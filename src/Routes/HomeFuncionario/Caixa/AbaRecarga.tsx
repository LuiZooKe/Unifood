import React, { useState } from 'react';
import { DollarSign, X } from 'lucide-react';

const AbaRecarga: React.FC = () => {
  const [emailPrefixo, setEmailPrefixo] = useState('');
  const [valor, setValor] = useState('');
  const [nomeCliente, setNomeCliente] = useState('');
  const [emailCompleto, setEmailCompleto] = useState('');
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [modalVisivel, setModalVisivel] = useState(false);

  const aplicarMascaraValor = (valor: string) => {
    const somenteNumeros = valor.replace(/\D/g, '');
    const numero = (Number(somenteNumeros) / 100).toFixed(2);
    return numero.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleAbrirConfirmacao = async (e: React.FormEvent) => {
    e.preventDefault();

    const valorNumerico = Number(valor.replace(/\./g, '').replace(',', '.'));

    if (!emailPrefixo || isNaN(valorNumerico) || valorNumerico <= 0) {
      setErro('Preencha os campos corretamente.');
      setMensagem('');
      return;
    }

    const email = `${emailPrefixo}@unifucamp.edu.br`;
    setEmailCompleto(email);

    try {
      const response = await fetch(`http://localhost/UNIFOOD/database/get_perfil.php?email=${email}`);

      if (!response.ok) {
        throw new Error('Erro na conexão com o servidor');
      }

      const data = await response.json();

      if (data.success) {
        setNomeCliente(data.dados.nome);
        setErro('');
        setModalVisivel(true);
      } else {
        setErro(data.message || 'Cliente não encontrado.');
        setMensagem('');
      }
    } catch (error) {
      console.error(error);
      setErro('Erro na conexão com o servidor.');
      setMensagem('');
    }
  };

  const handleConfirmarRecarga = async () => {
    const valorNumerico = Number(valor.replace(/\./g, '').replace(',', '.'));

    try {
      const response = await fetch('http://localhost/UNIFOOD/database/update_saldo.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailCompleto, saldo: valorNumerico }),
      });

      if (!response.ok) {
        throw new Error('Erro na conexão com o servidor');
      }

      const data = await response.json();

      if (data.success) {
        setMensagem('Saldo adicionado com sucesso!');
        setErro('');
        setEmailPrefixo('');
        setValor('');
        setNomeCliente('');
        setEmailCompleto('');
      } else {
        setErro(data.message || 'Erro ao atualizar saldo.');
        setMensagem('');
      }
    } catch (error) {
      console.error(error);
      setErro('Erro na conexão com o servidor.');
      setMensagem('');
    }

    setModalVisivel(false);
  };

  return (
    <div className="flex items-top justify-center">
      <form
        onSubmit={handleAbrirConfirmacao}
        className="bg-[#661111]/90 p-8 rounded-2xl shadow-xl md:w-[50vw] flex flex-col gap-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-5xl font-extrabold text-center text-white">RECARGA DE SALDO</h2>
          <DollarSign size={48} className="text-green-400" />
        </div>

        <div className="flex flex-col">
          <label className="block mb-1 text-lg text-gray-300">Cliente</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={emailPrefixo}
              onChange={(e) => setEmailPrefixo(e.target.value)}
              placeholder="usuário"
              className="w-[75%] border border-[#ffffff22] rounded-xl px-4 py-2 bg-black/30 text-white"
              required
            />
            <span className="text-lg text-white font-bold whitespace-nowrap">
              @unifucamp.edu.br
            </span>
          </div>
        </div>

        <div>
          <label className="block mb-1 text-lg text-gray-300">Valor</label>
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

      {/*  Modal de Confirmação */}
      {modalVisivel && (
        <div
          className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-md flex items-center justify-center"
          onClick={() => setModalVisivel(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-xl p-8 w-[92%] max-w-[500px] flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/*  Botão Fechar */}
            <button
              onClick={() => setModalVisivel(false)}
              className="absolute top-6 right-6 text-gray-500 hover:text-red-500"
            >
              <X className="w-10 h-10" />
            </button>

            {/*  Título Centralizado */}
            <h3 className="text-[4rem] leading-none font-extrabold mb-8 text-center text-black">
              CONFIRMAR <br /> RECARGA
            </h3>

            {/*  Dados */}
            <div className="w-full mb-10">
              <p className="text-[1.5rem] text-black mb-3 text-center">
                <span className="font-bold">Cliente:</span> {nomeCliente}
              </p>
              <p className="text-[1.5rem] text-black mb-3 text-center">
                <span className="font-bold">Email:</span> {emailCompleto}
              </p>
              <p className="text-[1.5rem] text-black text-center">
                <span className="font-bold">Valor:</span> R$ {valor}
              </p>
            </div>

            {/*  Botões */}
            <div className="flex gap-4 w-full">
              <button
                onClick={() => setModalVisivel(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-black font-bold py-4 rounded-xl text-2xl"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarRecarga}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl text-2xl"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AbaRecarga;
