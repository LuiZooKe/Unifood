import React, { useState, useEffect } from 'react';
import Dashboard from './Dashboard';

function CadastroProduto() {
  const [produto, setProduto] = useState({
    nome: '',
    descricao: '',
    preco: '',
    custo: '',
    quantidade: '',
    imagem: null,
    id_fornecedor: '',
    nome_fornecedor: '',
    categoria: '',
    unidade_medida: '',
    lucroRS: '',
    lucroPorcentagem: ''
  });

  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  const categorias = ['JANTINHAS', 'SALGADOS', 'BEBIDAS', 'SOBREMESAS'];
  const unidades = ['KG', 'LITRO', 'UNIDADE'];

  useEffect(() => {
    const preco = parseFloat(produto.preco);
    const custo = parseFloat(produto.custo);
    if (!isNaN(preco) && !isNaN(custo) && custo > 0) {
      const lucroRS = preco - custo;
      const lucroPorcentagem = (lucroRS / custo) * 100;
      setProduto((prev) => ({
        ...prev,
        lucroRS: lucroRS.toFixed(2),
        lucroPorcentagem: lucroPorcentagem.toFixed(2)
      }));
    }
  }, [produto.preco, produto.custo]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imagem') {
      setProduto({ ...produto, imagem: files[0] });
    } else {
      setProduto({ ...produto, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(produto).forEach(([key, value]) => {
      if (key === 'lucroRS') formData.append('lucro', value);
      else if (key !== 'lucroPorcentagem') formData.append(key, value);
    });

    try {
      const response = await fetch('http://localhost/UNIFOOD/database/register_produto.php', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        setMensagem('Produto cadastrado com sucesso!');
        setErro('');
        setProduto({
          nome: '', descricao: '', preco: '', custo: '', quantidade: '', imagem: null,
          id_fornecedor: '', nome_fornecedor: '', categoria: '', unidade_medida: '',
          lucroRS: '', lucroPorcentagem: ''
        });
      } else {
        setErro(data.message || 'Erro ao cadastrar produto.');
        setMensagem('');
      }
    } catch (err) {
      setErro('Erro na conexão com o servidor.');
      setMensagem('');
    }
  };

  return (
    <Dashboard>
      <form onSubmit={handleSubmit} className="w-full max-w-6xl mx-auto bg-[#520000] text-white p-8 rounded-xl shadow-md grid grid-cols-1 md:grid-cols-2 gap-4">
        <h1 className="text-3xl font-bold col-span-1 md:col-span-2 text-center mb-4">
          Cadastro Produto
        </h1>

        <Input label="Nome" name="nome" value={produto.nome} onChange={handleChange} />
        <Input label="Descrição" name="descricao" value={produto.descricao} onChange={handleChange} />
        <Input label="Preço (R$)" name="preco" value={produto.preco} onChange={handleChange} type="number" step="0.01" />
        <Input label="Custo (R$)" name="custo" value={produto.custo} onChange={handleChange} type="number" step="0.01" />
        <Input label="Quantidade" name="quantidade" value={produto.quantidade} onChange={handleChange} type="number" />

        <div>
          <label className="block mb-1">Unidade de Medida</label>
          <select
            name="unidade_medida"
            value={produto.unidade_medida}
            onChange={handleChange}
            className="w-full border p-2 rounded text-black"
            required
          >
            <option value="">Selecione a unidade</option>
            {unidades.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>

        <Input label="ID do Fornecedor" name="id_fornecedor" value={produto.id_fornecedor} onChange={handleChange} />
        <Input label="Nome do Fornecedor" name="nome_fornecedor" value={produto.nome_fornecedor} onChange={handleChange} />

        <div>
          <label className="block mb-1">Categoria</label>
          <select
            name="categoria"
            value={produto.categoria}
            onChange={handleChange}
            className="w-full border p-2 rounded text-black"
            required
          >
            <option value="">Selecione uma categoria</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Imagem</label>
          <input type="file" name="imagem" onChange={handleChange} className="w-full border p-2 rounded text-black bg-white" accept="image/*" />
        </div>

        <div>
          <label className="block mb-1">Lucro (R$ e %)</label>
          <input
            value={`R$ ${produto.lucroRS || '0.00'} (${produto.lucroPorcentagem || '0.00'}%)`}
            disabled
            className="w-full border p-2 rounded text-black bg-gray-200"
          />
        </div>

        {mensagem && <p className="col-span-2 text-green-400 text-center font-bold">{mensagem}</p>}
        {erro && <p className="col-span-2 text-red-400 text-center font-bold">{erro}</p>}

        <button type="submit" className="col-span-2 bg-green-600 hover:bg-green-700 py-3 px-6 rounded text-white font-semibold">
          Cadastrar Produto
        </button>
      </form>
    </Dashboard>
  );
}

const Input = ({ label, name, value, onChange, type = 'text', ...rest }) => (
  <div>
    <label htmlFor={name} className="block mb-1">{label}</label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className="w-full border p-2 rounded text-black"
      {...rest}
    />
  </div>
);

export default CadastroProduto;
