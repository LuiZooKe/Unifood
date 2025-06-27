import React, { useEffect, useState } from 'react';
import Dashboard from './Dashboard';

function ListaProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState('TODAS');
  const [erro, setErro] = useState('');
  const [modalDescricao, setModalDescricao] = useState(null);
  const [modalEditar, setModalEditar] = useState(false);
  const [editedProduto, setEditedProduto] = useState(null);
  const [filtro, setFiltro] = useState('PRODUTOS');
  const [pesquisaNome, setPesquisaNome] = useState('');


  const unidades = ['KG', 'LITRO', 'UNIDADE'];

  const fetchProdutos = async () => {
    try {
      const res = await fetch('http://localhost/UNIFOOD/database/produtos.php?action=listar');
      const data = await res.json();
      if (data.success) {
        setProdutos(data.produtos);
      } else {
        setErro(data.message);
      }
    } catch {
      setErro('Erro ao carregar produtos.');
    }
  };

  const fetchFornecedores = async () => {
    try {
      const res = await fetch('http://localhost/UNIFOOD/database/fornecedores.php?action=listar');
      const data = await res.json();
      if (data.success) {
        setFornecedores(data.fornecedores);
      }
    } catch {
      console.error('Erro ao carregar fornecedores');
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
      console.error('Erro ao carregar categorias');
    }
  };

  const deletarProduto = async (id) => {
    if (!window.confirm('Deseja realmente deletar este produto?')) return;
    try {
      const res = await fetch('http://localhost/UNIFOOD/database/produtos.php?action=deletar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) fetchProdutos();
      else alert(data.message);
    } catch {
      alert('Erro ao deletar produto.');
    }
  };

  const salvarEdicao = async () => {
    const formData = new FormData();
    formData.append('id', editedProduto.id);
    formData.append('nome', editedProduto.nome);
    formData.append('descricao', editedProduto.descricao);
    formData.append('preco', editedProduto.preco);
    formData.append('custo', editedProduto.custo);
    formData.append('quantidade', editedProduto.quantidade);
    formData.append('nome_fornecedor', editedProduto.nome_fornecedor);
    formData.append('id_fornecedor', editedProduto.id_fornecedor);
    formData.append('lucro', editedProduto.lucro);
    formData.append('unidade_medida', editedProduto.unidade_medida);
    formData.append('categoria', editedProduto.categoria);
    if (editedProduto.novaImagem) {
      formData.append('imagem', editedProduto.novaImagem);
    }

    try {
      const res = await fetch('http://localhost/UNIFOOD/database/produtos.php?action=atualizar', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setModalEditar(false);
        fetchProdutos();
      } else {
        alert(data.message);
      }
    } catch {
      alert('Erro ao atualizar produto.');
    }
  };

  useEffect(() => {
    fetchProdutos();
    fetchFornecedores();
    fetchCategorias();
  }, []);

  useEffect(() => {
    if (editedProduto) {
      const preco = parseFloat(editedProduto.preco) || 0;
      const custo = parseFloat(editedProduto.custo) || 0;
      const lucro = preco - custo;
      setEditedProduto((prev) => ({ ...prev, lucro: lucro.toFixed(2) }));
    }
  }, [editedProduto?.preco, editedProduto?.custo]);

  const produtosFiltrados = produtos.filter((p) => {
    if (filtro === 'ESTOQUE') return p.categoria === 'ESTOQUE';
    if (filtro === 'PRODUTOS') {
      const categoriaOk = filtroCategoria === 'TODAS' || p.categoria === filtroCategoria;
      const nomeOk = p.nome.toLowerCase().includes(pesquisaNome.toLowerCase());

      return p.categoria !== 'ESTOQUE' && categoriaOk && nomeOk;
    }

    return true;
  });


  return (
    <Dashboard>
      <div className="p-6 text-white overflow-x-hidden w-full">
        <h1 className="text-3xl font-bold mb-4 text-center">Lista de Produtos</h1>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <button
            className={`px-6 py-2 rounded font-semibold ${filtro === 'PRODUTOS' ? 'bg-blue-600' : 'bg-gray-600 hover:bg-gray-700'
              }`}
            onClick={() => setFiltro('PRODUTOS')}
          >
            PRODUTOS
          </button>
          <button
            className={`px-6 py-2 rounded font-semibold ${filtro === 'ESTOQUE' ? 'bg-blue-600' : 'bg-gray-600 hover:bg-gray-700'
              }`}
            onClick={() => setFiltro('ESTOQUE')}
          >
            ESTOQUE
          </button>
        </div>

        {filtro === 'PRODUTOS' && (
          <>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <button
                className={`px-4 py-1 rounded ${filtroCategoria === 'TODAS' ? 'bg-blue-700 text-white' : 'bg-gray-700 text-gray-300'}`}
                onClick={() => setFiltroCategoria('TODAS')}
              >
                TODAS
              </button>
              {categorias
                .filter(c => c.nome !== 'ESTOQUE')
                .map(c => (
                  <button
                    key={c.id}
                    className={`px-4 py-1 rounded ${filtroCategoria === c.nome ? 'bg-blue-700 text-white' : 'bg-gray-700 text-gray-300'}`}
                    onClick={() => setFiltroCategoria(c.nome)}
                  >
                    {c.nome}
                  </button>
                ))}
            </div>

            {/* Barra de pesquisa */}
            <div className="flex justify-center mb-6">
              <input
                type="text"
                placeholder="Pesquisar por nome..."
                className="px-4 py-2 rounded text-black"
                value={pesquisaNome}
                onChange={(e) => setPesquisaNome(e.target.value)}
              />
            </div>
          </>
        )}


        {erro && <p className="text-red-400 mb-4 text-center">{erro}</p>}

        <div className="grid grid-cols-1 gap-4">
          {produtosFiltrados.map((produto) => (
            <div
              key={produto.id}
              className="bg-[#1f2f3f] p-4 rounded shadow flex justify-between items-center flex-wrap md:flex-nowrap gap-4"
            >
              <div className="flex gap-4 items-center w-full md:w-auto">
                {produto.imagem ? (
                  <img
                    src={`http://localhost/UNIFOOD/database/imgProdutos/${produto.imagem}`}
                    alt={produto.nome}
                    className="w-24 h-24 object-cover rounded-md border border-gray-600"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-md border border-gray-600 bg-white" />
                )}

                <div className="flex-1 min-w-[150px]">
                  <p className="text-2xl font-semibold mb-2">{produto.nome}</p>
                  <p className="text-xl text-gray-400">
                    R$ {parseFloat(produto.preco).toFixed(2)}
                  </p>
                  <p className="text-md text-gray-400">Quantidade: {produto.quantidade}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => setModalDescricao(produto)}
                  className="bg-blue-500 px-3 py-1 rounded"
                >
                  Descrição
                </button>

                <button
                  onClick={() => {
                    const quantidadeAtual = parseInt(produto.quantidade) || 0;
                    const novaQuantidade = window.prompt("Adicionar ao estoque (quantidade):", "1");
                    const quantidadeAdicional = parseInt(novaQuantidade);
                    if (!isNaN(quantidadeAdicional) && quantidadeAdicional > 0) {
                      const formData = new FormData();
                      formData.append('id', produto.id);
                      formData.append('quantidade', quantidadeAtual + quantidadeAdicional);
                      fetch('http://localhost/UNIFOOD/database/produtos.php?action=atualizar_estoque_rapido', {
                        method: 'POST',
                        body: formData,
                      })
                        .then(res => res.json())
                        .then(data => {
                          if (data.success) {
                            fetchProdutos();
                          } else {
                            alert(data.message);
                          }
                        })
                        .catch(() => alert("Erro ao adicionar estoque."));
                    }
                  }}
                  className="bg-green-500 px-3 py-1 rounded"
                >
                  + Estoque
                </button>
                <button
                  onClick={() => {
                    setEditedProduto(produto);
                    setModalEditar(true);
                  }}
                  className="bg-yellow-500 px-3 py-1 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => deletarProduto(produto.id)}
                  className="bg-red-600 px-3 py-1 rounded"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal de descrição */}
        {modalDescricao && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white text-black p-6 rounded shadow w-full max-w-[600px] mx-4 max-h-[90vh] overflow-auto">
              <h3 className="text-3xl font-bold mb-4">{modalDescricao.nome}</h3>
              {modalDescricao.imagem && (
                <img
                  src={`http://localhost/UNIFOOD/database/imgProdutos/${modalDescricao.imagem}`}
                  alt={modalDescricao.nome}
                  className="w-full h-48 object-cover rounded mb-4"
                />
              )}
              <div className="space-y-2">
                <p><strong>Descrição:</strong> {modalDescricao.descricao}</p>
                <p><strong>Preço:</strong> R$ {parseFloat(modalDescricao.preco).toFixed(2)}</p>
                <p><strong>Custo:</strong> R$ {parseFloat(modalDescricao.custo).toFixed(2)}</p>
                <p><strong>Lucro:</strong> R$ {(parseFloat(modalDescricao.preco) - parseFloat(modalDescricao.custo)).toFixed(2)}</p>
                <p><strong>Quantidade:</strong> {modalDescricao.quantidade}</p>
                <p><strong>Unidade:</strong> {modalDescricao.unidade_medida}</p>
                <p><strong>Categoria:</strong> {modalDescricao.categoria}</p>
                <p><strong>Fornecedor:</strong> {modalDescricao.nome_fornecedor}</p>
              </div>
              <button
                onClick={() => setModalDescricao(null)}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-6 w-full"
              >
                Fechar
              </button>
            </div>
          </div>
        )}

        {/* Modal de edição */}
        {modalEditar && editedProduto && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white text-black p-6 rounded shadow w-full max-w-[700px] mx-4 max-h-[90vh] overflow-auto">
              <h3 className="text-3xl font-bold mb-6">Editar Produto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  ['Nome', 'nome'],
                  ['Descrição', 'descricao'],
                  ['Preço', 'preco'],
                  ['Custo', 'custo'],
                  ['Quantidade', 'quantidade'],
                ].map(([label, key]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium mb-1">{label}</label>
                    <input
                      type="text"
                      value={editedProduto[key] || ''}
                      onChange={(e) =>
                        setEditedProduto({ ...editedProduto, [key]: e.target.value })
                      }
                      className="w-full border px-3 py-2"
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium mb-1">Unidade de Medida</label>
                  <select
                    value={editedProduto.unidade_medida}
                    onChange={(e) =>
                      setEditedProduto({ ...editedProduto, unidade_medida: e.target.value })
                    }
                    className="w-full border px-3 py-2"
                  >
                    {unidades.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Fornecedor</label>
                  <select
                    value={editedProduto.id_fornecedor || ''}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const fornecedorSelecionado = fornecedores.find(
                        (f) => f.id.toString() === selectedId
                      );
                      setEditedProduto((prev) => ({
                        ...prev,
                        id_fornecedor: selectedId,
                        nome_fornecedor: fornecedorSelecionado?.nome || '',
                      }));
                    }}
                    className="w-full border px-3 py-2"
                    required
                  >
                    {fornecedores.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative space-y-1 z-50">
                  <label className="block text-sm font-medium">Categoria</label>
                  <button
                    type="button"
                    className="w-full border p-2 rounded text-left bg-white"
                    onClick={() =>
                      setCategorias(prev =>
                        prev.map(c => ({ ...c, editando: false, nomeEditado: c.nome }))
                      ) || setEditedProduto(prev => ({ ...prev, expandirCategoria: !prev.expandirCategoria }))
                    }
                  >
                    {editedProduto.categoria || 'Selecione a categoria'}
                  </button>

                  {editedProduto.expandirCategoria && (
                    <>
                      {/* Captura clique fora */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() =>
                          setEditedProduto(prev => ({ ...prev, expandirCategoria: false }))
                        }
                      />

                      {/* Dropdown visível e fixo abaixo do botão */}
                      <div
                        className="absolute left-0 right-0 bg-white border mt-1 rounded shadow text-black max-h-60 overflow-y-auto p-2 space-y-1 z-50"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {categorias.map(cat => (
                          <div key={cat.id} className="flex items-center gap-2 hover:bg-gray-100 p-1 rounded">
                            {cat.editando ? (
                              <input
                                value={cat.nomeEditado}
                                onChange={(e) => {
                                  const novoNome = e.target.value.toUpperCase();
                                  setCategorias(prev =>
                                    prev.map(c =>
                                      c.id === cat.id ? { ...c, nomeEditado: novoNome } : c
                                    )
                                  );
                                }}
                                className="flex-1 border p-1 rounded uppercase"
                                style={{ textTransform: 'uppercase' }}
                              />
                            ) : (
                              <span
                                className="flex-1 cursor-pointer"
                                onClick={() =>
                                  setEditedProduto(prev => ({
                                    ...prev,
                                    categoria: cat.nome,
                                    expandirCategoria: false
                                  }))
                                }
                              >
                                {cat.nome}
                              </span>
                            )}

                            {cat.editando ? (
                              <>
                                <button
                                  className="text-green-600 font-bold"
                                  onClick={async () => {
                                    try {
                                      const res = await fetch('http://localhost/UNIFOOD/database/categorias.php?action=editar', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ id: cat.id, nome: cat.nomeEditado })
                                      });
                                      const data = await res.json();
                                      if (data.success) {
                                        setCategorias(prev =>
                                          prev.map(c =>
                                            c.id === cat.id ? { ...c, nome: cat.nomeEditado, editando: false } : c
                                          )
                                        );
                                      }
                                    } catch {
                                      alert('Erro ao salvar');
                                    }
                                  }}
                                >💾</button>
                                <button
                                  className="text-gray-600 font-bold"
                                  onClick={() =>
                                    setCategorias(prev =>
                                      prev.map(c =>
                                        c.id === cat.id ? { ...c, editando: false, nomeEditado: c.nome } : c
                                      )
                                    )
                                  }
                                >❌</button>
                              </>
                            ) : (
                              <>
                                <button
                                  className="text-yellow-600 font-bold"
                                  onClick={() =>
                                    setCategorias(prev =>
                                      prev.map(c =>
                                        c.id === cat.id ? { ...c, editando: true, nomeEditado: c.nome } : c
                                      )
                                    )
                                  }
                                >✏️</button>
                                <button
                                  className="text-red-600 font-bold"
                                  onClick={async () => {
                                    if (window.confirm('Deseja excluir esta categoria?')) {
                                      try {
                                        const res = await fetch('http://localhost/UNIFOOD/database/categorias.php?action=deletar', {
                                          method: 'POST',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({ id: cat.id })
                                        });
                                        const data = await res.json();
                                        if (data.success) {
                                          setCategorias(prev => prev.filter(c => c.id !== cat.id));
                                          if (editedProduto.categoria === cat.nome) {
                                            setEditedProduto(prev => ({ ...prev, categoria: '' }));
                                          }
                                        }
                                      } catch {
                                        alert('Erro ao excluir');
                                      }
                                    }
                                  }}
                                >🗑️</button>
                              </>
                            )}
                          </div>
                        ))}

                        {/* Adicionar nova categoria */}
                        <div className="flex items-center gap-2 mt-2">
                          <input
                            type="text"
                            placeholder='Nova Categoria'
                            value={editedProduto.novaCategoria || ''}
                            onChange={(e) =>
                              setEditedProduto(prev => ({ ...prev, novaCategoria: e.target.value.toUpperCase() }))
                            }
                            className="flex-1 border p-1 rounded uppercase"
                            style={{ textTransform: 'uppercase' }}
                          />
                          <button
                            className="text-green-600 font-bold"
                            onClick={async () => {
                              const nome = editedProduto.novaCategoria?.trim();
                              if (!nome) return;
                              try {
                                const res = await fetch('http://localhost/UNIFOOD/database/categorias.php?action=cadastrar', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ nome })
                                });
                                const data = await res.json();
                                if (data.success) {
                                  setCategorias(prev => [...prev, { id: data.id, nome }]);
                                  setEditedProduto(prev => ({
                                    ...prev,
                                    categoria: nome,
                                    novaCategoria: '',
                                    expandirCategoria: false
                                  }));
                                } else {
                                  alert(data.message || 'Erro ao cadastrar');
                                }
                              } catch {
                                alert('Erro na conexão');
                              }
                            }}
                          >➕</button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Lucro (R$)</label>
                  <input
                    type="text"
                    value={editedProduto.lucro || ''}
                    readOnly
                    className="w-full border px-3 py-2 bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Nova Imagem (opcional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setEditedProduto({ ...editedProduto, novaImagem: e.target.files[0] })
                    }
                    className="w-full border px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setModalEditar(false)}
                  className="bg-gray-400 px-4 py-2 rounded"
                >
                  Cancelar
                </button>
                <button
                  onClick={salvarEdicao}
                  className="bg-green-600 px-4 py-2 rounded text-white"
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

export default ListaProdutos;
