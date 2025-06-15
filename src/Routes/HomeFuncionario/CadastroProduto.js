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
  const [fornecedores, setFornecedores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [showModalCategoria, setShowModalCategoria] = useState(false);
  const [novaCategoria, setNovaCategoria] = useState('');

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

  useEffect(() => {
    const fetchFornecedores = async () => {
      try {
        const res = await fetch('http://localhost/UNIFOOD/database/fornecedores.php?action=listar');
        const data = await res.json();
        if (data.success) {
          setFornecedores(data.fornecedores);
        }
      } catch {
        console.error('Erro ao buscar fornecedores');
      }
    };

    const fetchCategorias = async () => {
      try {
        const res = await fetch('http://localhost/UNIFOOD/database/categorias.php?action=listar');
        const data = await res.json();
        if (data.success) {
          setCategorias(data.categorias);
        }
      } catch {
        console.error('Erro ao buscar categorias');
      }
    };

    fetchFornecedores();
    fetchCategorias();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imagem') {
      setProduto({ ...produto, imagem: files[0] });
    } else if (name === 'categoria' && value === 'nova') {
      setShowModalCategoria(true);
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
    } catch {
      setErro('Erro na conexão com o servidor.');
      setMensagem('');
    }
  };

  const salvarNovaCategoria = async () => {
    if (!novaCategoria.trim()) return;

    try {
      const res = await fetch('http://localhost/UNIFOOD/database/categorias.php?action=cadastrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: novaCategoria })
      });
      const data = await res.json();
      if (data.success) {
        setCategorias(prev => [...prev, { id: data.id, nome: novaCategoria }]);
        setProduto(prev => ({ ...prev, categoria: novaCategoria }));
        setNovaCategoria('');
        setShowModalCategoria(false);
      } else {
        alert(data.message || 'Erro ao cadastrar categoria');
      }
    } catch {
      alert('Erro na conexão');
    }
  };

  const ordenarCategorias = (lista) => {
    const estoque = lista.find(c => c.nome.toUpperCase() === 'ESTOQUE');
    const restantes = lista
      .filter(c => c.nome.toUpperCase() !== 'ESTOQUE')
      .sort((a, b) => a.nome.localeCompare(b.nome));
    return estoque ? [...restantes, estoque] : restantes;
  };

  return (
    <Dashboard>
      <div className="flex items-center justify-center w-full relative">
        <form
          onSubmit={handleSubmit}
          className="bg-[#520000] w-full max-w-5xl rounded-xl shadow-lg p-10 grid grid-cols-1 md:grid-cols-2 gap-6 text-white"
        >
          <h1 className="text-4xl font-bold col-span-1 md:col-span-2 text-center mb-4 tracking-wide">
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

          <div>
            <label className="block mb-1">Fornecedor</label>
            <select
              name="id_fornecedor"
              value={produto.id_fornecedor}
              onChange={(e) => {
                const selectedId = e.target.value;
                const selectedFornecedor = fornecedores.find(f => f.id.toString() === selectedId);
                setProduto(prev => ({
                  ...prev,
                  id_fornecedor: selectedId,
                  nome_fornecedor: selectedFornecedor?.nome || ''
                }));
              }}
              className="w-full border p-2 rounded text-black"
              required
            >
              <option value="">Selecione o fornecedor</option>
              {fornecedores.map(f => (
                <option key={f.id} value={f.id}>{f.nome}</option>
              ))}
            </select>
          </div>

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
              {ordenarCategorias(categorias).map((cat) => (
                <option key={cat.id} value={cat.nome}>
                  {cat.nome}
                </option>
              ))}
              <option value="nova">➕ Nova Categoria</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Imagem</label>
            <input
              type="file"
              name="imagem"
              onChange={handleChange}
              className="w-full border p-2 rounded text-black bg-white"
              accept="image/*"
            />
          </div>

          <div>
            <label className="block mb-1">Lucro (R$ e %)</label>
            <input
              value={`R$ ${produto.lucroRS || '0.00'} (${produto.lucroPorcentagem || '0.00'}%)`}
              disabled
              className="w-full border p-2 rounded text-black bg-gray-200"
            />
          </div>

          {mensagem && (
            <p className="col-span-2 text-green-400 text-center font-bold">{mensagem}</p>
          )}
          {erro && (
            <p className="col-span-2 text-red-400 text-center font-bold">{erro}</p>
          )}

          <button
            type="submit"
            className="col-span-2 bg-green-600 hover:bg-green-700 py-3 px-6 rounded text-white font-semibold"
          >
            Cadastrar Produto
          </button>
        </form>

        {/* Modal Nova Categoria */}
        {showModalCategoria && (
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#520000] text-white p-8 rounded-xl shadow-lg w-full max-w-md">
              <h2 className="text-3xl font-bold mb-6 text-center tracking-wide">
                Nova Categoria
              </h2>
              <input
                type="text"
                value={novaCategoria}
                onChange={(e) => setNovaCategoria(e.target.value)}
                placeholder="Nome da categoria"
                className="w-full border border-gray-400 p-2 rounded mb-6 text-black bg-white"
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowModalCategoria(false)}
                  className="bg-gray-500 px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  onClick={salvarNovaCategoria}
                  className="bg-green-600 px-4 py-2 rounded text-white hover:bg-green-700"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
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
      className="w-full border p-2 rounded text-black bg-white"
      {...rest}
    />
  </div>
);

export default CadastroProduto;
