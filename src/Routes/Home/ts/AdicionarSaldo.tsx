import React, { useState } from 'react';

interface Usuario {
  email: string;
  saldo: number;
}

interface AdicionarSaldoProps {
  visivel: boolean;
  onAdicionar: (valor: number) => void;
  usuario: Usuario;
  atualizarUsuario: (usuarioAtualizado: Usuario) => void;
}

const AdicionarSaldo: React.FC<AdicionarSaldoProps> = ({
  visivel,
  onAdicionar,
  usuario,
  atualizarUsuario,
}) => {
  const [valor, setValor] = useState('');

  if (!visivel) return null;

  const formatarParaBRL = (valor: string) => {
    const numeros = valor.replace(/\D/g, '');
    const numero = (parseInt(numeros, 10) || 0) / 100;
    return numero.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    });
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const somenteNumeros = e.target.value.replace(/\D/g, '');
    const valorFormatado = formatarParaBRL(somenteNumeros);
    setValor(valorFormatado);
  };

  const atualizarSaldoDoBanco = async () => {
    try {
      const res = await fetch(
        `http://localhost/UNIFOOD/database/get_perfil.php?email=${usuario.email}`
      );
      const data = await res.json();
      if (data.success) {
        const dadosAtualizados = {
          ...data.dados,
          saldo: parseFloat(data.dados.saldo) || 0,
        };
        atualizarUsuario(dadosAtualizados);
        localStorage.setItem('dadosUsuario', JSON.stringify(dadosAtualizados));
      }
    } catch (error) {
      console.error('Erro ao buscar dados do banco:', error);
    }
  };

  const handleAdicionar = async () => {
    const numeros = valor.replace(/\D/g, '');
    const valorNumerico = parseFloat(numeros) / 100;

    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      alert('Informe um valor válido!');
      return;
    }

    if (valorNumerico > 9999) {
      alert('O valor máximo permitido é R$ 9.999,00');
      return;
    }

    const novoSaldo = (Number(usuario.saldo) || 0) + valorNumerico;

    try {
      const res = await fetch('http://localhost/UNIFOOD/database/update_saldo.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: usuario.email,
          saldo: novoSaldo,
        }),
      });

      const data = await res.json();

      if (data.success) {
        onAdicionar(valorNumerico);
        const dadosAtualizados = { ...usuario, saldo: novoSaldo };
        atualizarUsuario(dadosAtualizados);
        localStorage.setItem('dadosUsuario', JSON.stringify(dadosAtualizados));

        await atualizarSaldoDoBanco();

        alert(
          `Saldo adicionado com sucesso! Novo saldo: R$ ${novoSaldo
            .toFixed(2)
            .replace('.', ',')}`
        );
        setValor('');
      } else {
        alert('Erro ao atualizar saldo: ' + data.message);
      }
    } catch (error) {
      console.error('Erro ao atualizar saldo:', error);
      alert('Erro na conexão com o servidor');
    }
  };

  return (
    <div className="w-full bg-white/40 backdrop-blur-md rounded-2xl shadow-md p-4">
      <h2 className="text-5xl font-bold mb-4 text-center">ADICIONAR SALDO</h2>

      <div className="flex flex-col gap-3">
        <input
          type="text"
          value={valor}
          onChange={handleInput}
          placeholder="R$ 0,00"
          className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-green-600 text-black"
        />

        <button
          onClick={handleAdicionar}
          className="w-full py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md"
        >
          Adicionar
        </button>
      </div>
    </div>
  );
};

export default AdicionarSaldo;
