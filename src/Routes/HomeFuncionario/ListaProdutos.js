import React, { useEffect, useState } from 'react';
import Dashboard from './Dashboard';

function ListaProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [erro, setErro] = useState('');
  const [modalDescricao, setModalDescricao] = useState(null);
  const [modalEditar, setModalEditar] = useState(false);
  const [editedProduto, setEditedProduto] = useState(null);

  const categorias = ['JANTINHAS', 'SALGADOS', 'BEBIDAS', 'SOBREMESAS'];
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
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error);
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
  }, []);

  useEffect(() => {
    if (editedProduto) {
      const preco = parseFloat(editedProduto.preco) || 0;
      const custo = parseFloat(editedProduto.custo) || 0;
      const lucro = preco - custo;
      setEditedProduto((prev) => ({ ...prev, lucro: lucro.toFixed(2) }));
    }
  }, [editedProduto?.preco, editedProduto?.custo]);

  return (
    <Dashboard>
      <div className="p-6 text-white overflow-x-hidden w-full">
        <h1 className="text-3xl font-bold mb-[30px] text-center">Lista de Produtos</h1>

        {erro && <p className="text-red-400 mb-4">{erro}</p>}

        <div className="grid grid-cols-1">
          {produtos.map((produto) => (
            <div
              key={produto.id}
              className="bg-[#1f2f3f] p-4 rounded shadow flex justify-between items-center flex-wrap md:flex-nowrap gap-4"
            >
              {produto.imagem ? (
                <img
                  src={`http://localhost/UNIFOOD/database/imgProdutos/${produto.imagem}`}
                  alt={produto.nome}
                  className="w-24 h-24 object-cover rounded-md border border-gray-600"
                />
              ) : (
                <div className="w-24 h-24 rounded-md border border-gray-600 bg-white" />
              )}

              <div className="flex-1">
                <p className="text-3xl font-semibold">{produto.nome}</p>
                <p className="text-2xl text-gray-400">
                  R$ {parseFloat(produto.preco).toFixed(2)}
                </p>
                <p className="text-lg text-gray-400">Quantidade: {produto.quantidade}</p>
              </div>

              <div className="flex gap-2 mt-4 md:mt-0">
                <button
                  onClick={() => setModalDescricao(produto)}
                  className="bg-blue-500 px-3 py-1 rounded"
                >
                  Descrição
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

        {modalDescricao && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
            <div className="bg-white text-black p-6 rounded shadow w-full max-w-md mx-4  ml-[20%]">
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


        {modalEditar && editedProduto && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
            <div className="bg-white text-black p-6 rounded shadow w-full max-w-[700px] mx-4 ml-[20%]">
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
                      onChange={(e) => setEditedProduto({ ...editedProduto, [key]: e.target.value })}
                      className="w-full border px-3 py-2"
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium mb-1">Unidade de Medida</label>
                  <select
                    value={editedProduto.unidade_medida}
                    onChange={(e) => setEditedProduto({ ...editedProduto, unidade_medida: e.target.value })}
                    className="w-full border px-3 py-2"
                  >
                    <option value="">Selecione a unidade</option>
                    {unidades.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Fornecedor</label>
                  <select
                    value={editedProduto.id_fornecedor || ''}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const fornecedorSelecionado = fornecedores.find(f => f.id.toString() === selectedId);
                      setEditedProduto(prev => ({
                        ...prev,
                        id_fornecedor: selectedId,
                        nome_fornecedor: fornecedorSelecionado?.nome || ''
                      }));
                    }}
                    className="w-full border px-3 py-2"
                    required
                  >
                    <option value="">Selecione o fornecedor</option>
                    {fornecedores.map(f => (
                      <option key={f.id} value={f.id}>{f.nome}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Categoria</label>
                  <select
                    value={editedProduto.categoria}
                    onChange={(e) => setEditedProduto({ ...editedProduto, categoria: e.target.value })}
                    className="w-full border px-3 py-2"
                  >
                    <option value="">Selecione a categoria</option>
                    {categorias.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
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
                  <label className="block text-sm font-medium mb-1">Nova Imagem (opcional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditedProduto({ ...editedProduto, novaImagem: e.target.files[0] })}
                    className="w-full border px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button onClick={() => setModalEditar(false)} className="bg-gray-400 px-4 py-2 rounded">Cancelar</button>
                <button onClick={salvarEdicao} className="bg-green-600 px-4 py-2 rounded text-white">Salvar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Dashboard>
  );
}

export default ListaProdutos;
