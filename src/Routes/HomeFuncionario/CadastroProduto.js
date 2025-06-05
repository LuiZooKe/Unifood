import React, { useState, useRef } from 'react';
import './Funcionario.css';
import Dashboard from './Dashboard';

function CadastroProduto() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [imagem, setImagem] = useState(null);
  const [erros, setErros] = useState([]);
  const [sucesso, setSucesso] = useState('');

  // Ref para o input file
  const inputFileRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const novosErros = [];
    if (!nome.trim()) novosErros.push('O nome do produto é obrigatório.');
    if (!descricao.trim()) novosErros.push('A descrição é obrigatória.');
    if (!preco || isNaN(preco) || Number(preco) <= 0) novosErros.push('Informe um preço válido.');
    if (!quantidade || isNaN(quantidade) || Number(quantidade) < 0) novosErros.push('Informe uma quantidade válida.');
    // A imagem NÃO é obrigatória conforme seu pedido, então não valida aqui

    if (novosErros.length > 0) {
      setErros(novosErros);
      setSucesso('');
      return;
    }

    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('descricao', descricao);
    formData.append('preco', preco);
    formData.append('quantidade', quantidade);
    if (imagem) formData.append('imagem', imagem); // adiciona só se tiver imagem

    try {
      const response = await fetch('http://localhost/UNIFOOD/database/register_produto.php', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setSucesso('Produto cadastrado com sucesso!');
        setNome('');
        setDescricao('');
        setPreco('');
        setQuantidade('');
        setImagem(null);
        setErros([]);

        // Limpa o campo input file visualmente
        if (inputFileRef.current) {
          inputFileRef.current.value = '';
        }
      } else {
        setErros([data.message || 'Erro ao cadastrar produto.']);
        setSucesso('');
      }
    } catch (error) {
      console.error('Erro ao enviar:', error);
      setErros(['Erro na conexão com o servidor.']);
      setSucesso('');
    }
  };

  return (
    <Dashboard>
      <form onSubmit={handleSubmit} className="flex items-center justify-center">
        <div className="bg-[#520000] rounded-md p-8 shadow-xl w-full">
          <h1 className="text-white text-3xl font-semibold mb-6 text-center">Cadastro de Produto</h1>

          <label className="block text-gray-300 mb-2" htmlFor="nome">Nome</label>
          <input
            id="nome"
            type="text"
            placeholder="Nome do produto"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full p-3 mb-4 rounded border border-gray-500"
          />

          <label className="block text-gray-300 mb-2" htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            placeholder="Descrição do produto"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full p-3 mb-4 rounded border border-gray-500"
          />

          <label className="block text-gray-300 mb-2" htmlFor="preco">Preço (R$)</label>
          <input
            id="preco"
            type="number"
            step="0.01"
            placeholder="Preço do produto"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            className="w-full p-3 mb-4 rounded border border-gray-500"
          />

          <label className="block text-gray-300 mb-2" htmlFor="quantidade">Quantidade</label>
          <input
            id="quantidade"
            type="number"
            placeholder="Quantidade em estoque"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            className="w-full p-3 mb-4 rounded border border-gray-500"
          />

          <label className="block text-gray-300 mb-2" htmlFor="imagem">Imagem do Produto</label>
          <input
            id="imagem"
            type="file"
            accept="image/*"
            ref={inputFileRef}
            onChange={(e) => setImagem(e.target.files[0])}
            className="w-full p-3 mb-6 rounded border border-gray-500 text-gray-300"
          />

          {erros.length > 0 && (
            <ul className="text-red-500 mb-4 list-disc pl-5">
              {erros.map((erro, index) => (
                <li key={index}>{erro}</li>
              ))}
            </ul>
          )}

          {sucesso && (
            <p className="text-green-500 mb-4 text-center font-semibold">{sucesso}</p>
          )}

          <button
            type="submit"
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded transition-colors"
          >
            Cadastrar Produto
          </button>
        </div>
      </form>
    </Dashboard>
  );
}

export default CadastroProduto;
