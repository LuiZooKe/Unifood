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
        if (data.success) setFornecedores(data.fornecedores);
      } catch {
        console.error('Erro ao buscar fornecedores');
      }
    };

    const fetchCategorias = async () => {
      try {
        const res = await fetch('http://localhost/UNIFOOD/database/categorias.php?action=listar');
        const data = await res.json();
        if (data.success) setCategorias(data.categorias);
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
        notify.error(data.message || 'Erro ao cadastrar categoria');
      }
    } catch {
      notify.error('Erro na conexão');
    }
  };

  const ordenarCategorias = (lista) => {
    const estoque = lista.find(c => c.nome.toUpperCase() === 'ESTOQUE');
    const restantes = lista.filter(c => c.nome.toUpperCase() !== 'ESTOQUE').sort((a, b) => a.nome.localeCompare(b.nome));
    return estoque ? [...restantes, estoque] : restantes;
  };

  return (
    <Dashboard>
      <div className="flex items-center justify-center w-full relative">
        <form
          onSubmit={handleSubmit}
          className="bg-[#520000] w-full max-w-5xl rounded-xl shadow-lg px-4 py-8 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-white"
        >
          <h1 className="text-3xl sm:text-4xl font-bold col-span-full text-center mb-4 break-words tracking-wide">
            Cadastro Produto
          </h1>

          <Input label="Nome" name="nome" value={produto.nome} onChange={handleChange} />
          <Input label="Descrição" name="descricao" value={produto.descricao} onChange={handleChange} />
          <Input label="Preço (R$)" name="preco" value={produto.preco} onChange={handleChange} type="number" step="0.01" />
          <Input label="Custo (R$)" name="custo" value={produto.custo} onChange={handleChange} type="number" step="0.01" />
          <Input label="Quantidade" name="quantidade" value={produto.quantidade} onChange={handleChange} type="number" />

          <div className="space-y-1">
            <label className="block text-sm font-medium">Unidade de Medida</label>
            <select
              name="unidade_medida"
              value={produto.unidade_medida}
              onChange={handleChange}
              className="w-full border p-2 rounded text-black"
              required
            >
              <option value="" disabled hidden>Selecione uma unidade</option>
              {unidades.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium">Fornecedor</label>
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
              className="w-full border p-2 rounded text-black bg-white"
              required
            >
              <option value="" disabled hidden>Selecione um fornecedor</option>
              {fornecedores.map(f => (
                <option key={f.id} value={f.id}>{f.nome}</option>
              ))}
            </select>
          </div>


          <div className="space-y-1 relative">
            <label className="block text-sm font-medium">Categoria</label>

            <div>
              <button
                type="button"
                className="w-full border p-2 rounded text-left text-black bg-white"
                onClick={() => setShowModalCategoria(prev => !prev)}
              >
                {produto.categoria || 'Selecione uma categoria'}
              </button>
            </div>

            {showModalCategoria && (
              <div className="absolute z-50 w-full max-h-72 overflow-y-auto  overflow-x-hidden bg-white border mt-1 rounded shadow text-black p-2 space-y-1">
                {ordenarCategorias(categorias).map((cat) => (
                  <div
                    key={cat.id}
                    className="cursor-pointer hover:bg-gray-100 p-1 rounded uppercase"
                    onClick={() => {
                      setProduto(prev => ({ ...prev, categoria: cat.nome }));
                      setShowModalCategoria(false);
                    }}
                  >
                    {cat.nome}
                  </div>
                ))}

                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    value={novaCategoria}
                    onChange={(e) => setNovaCategoria(e.target.value.toUpperCase())}
                    placeholder="Nova categoria"
                    className="flex-1 border p-1 rounded uppercase"
                    style={{ textTransform: 'uppercase' }}
                  />
                  <button
                    className="text-green-600 font-bold"
                    onClick={salvarNovaCategoria}
                  >➕</button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium">Imagem</label>
            <input
              type="file"
              name="imagem"
              onChange={handleChange}
              className="w-full border p-2 rounded text-black bg-white"
              accept="image/*"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium">Lucro (R$ e %)</label>
            <input
              value={`R$ ${produto.lucroRS || '0.00'} (${produto.lucroPorcentagem || '0.00'}%)`}
              disabled
              className="w-full border p-2 rounded text-black bg-gray-200"
            />
          </div>

          {mensagem && (
            <p className="col-span-full text-green-400 text-center font-bold">{mensagem}</p>
          )}
          {erro && (
            <p className="col-span-full text-red-400 text-center font-bold">{erro}</p>
          )}

          <button
            type="submit"
            className="col-span-full bg-green-600 hover:bg-green-700 py-3 px-6 rounded text-white font-semibold"
          >
            Cadastrar Produto
          </button>
        </form>
      </div>
    </Dashboard>
  );
}

const Input = ({ label, name, value, onChange, type = 'text', ...rest }) => (
  <div className="space-y-1">
    <label htmlFor={name} className="block text-sm font-medium">{label}</label>
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
