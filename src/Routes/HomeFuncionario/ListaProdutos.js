import React, { useEffect, useState } from 'react';
import Dashboard from './Dashboard';

function ListaProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState('');
  const [modalDescricao, setModalDescricao] = useState(null);
  const [modalEditar, setModalEditar] = useState(false);
  const [editedProduto, setEditedProduto] = useState(null);
  const [imagemFile, setImagemFile] = useState(null); // arquivo de imagem selecionado

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
    if (!editedProduto) return;

    const formData = new FormData();
    formData.append('id', editedProduto.id);
    formData.append('nome', editedProduto.nome);
    formData.append('descricao', editedProduto.descricao);
    formData.append('preco', editedProduto.preco);
    formData.append('quantidade', editedProduto.quantidade);

    if (imagemFile) {
      formData.append('imagem', imagemFile);
    }

    try {
      const res = await fetch('http://localhost/UNIFOOD/database/produtos.php?action=atualizar', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setModalEditar(false);
        setImagemFile(null);
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
  }, []);

  return (
    <Dashboard>
      <div className="p-6 text-white overflow-x-hidden w-full">
        <h1 className="text-3xl font-bold mb-4 text-center">Lista de Produtos</h1>

        {erro && <p className="text-red-400 mb-4">{erro}</p>}

        <div className="grid grid-cols-1">
          {produtos.map((produto) => (
            <div
              key={produto.id}
              className="bg-[#1f2f3f] p-4 rounded shadow flex justify-between items-center flex-wrap md:flex-nowrap gap-4"
            >
              {/* Imagem ou espaço em branco */}
              {produto.imagem ? (
                <img
                  src={`http://localhost/UNIFOOD/database/${produto.imagem}`}
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
                    setImagemFile(null); // reseta o input de arquivo ao abrir modal
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

        {/* Modal Descrição */}
        {modalDescricao && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
            <div className="bg-white text-black p-6 rounded shadow w-full max-w-md mx-4">
              <h2 className="text-xl font-bold mb-4">{modalDescricao.nome}</h2>
              <p className="mb-4">{modalDescricao.descricao}</p>
              <button
                onClick={() => setModalDescricao(null)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Fechar
              </button>
            </div>
          </div>
        )}

        {/* Modal Editar */}
        {modalEditar && editedProduto && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
            <div className="bg-white text-black p-6 rounded shadow w-full max-w-md mx-4">
              <h2 className="text-xl font-bold mb-4">Editar Produto</h2>

              <label>Nome</label>
              <input
                type="text"
                value={editedProduto.nome}
                onChange={(e) =>
                  setEditedProduto({ ...editedProduto, nome: e.target.value })
                }
                className="w-full border px-3 py-2 mb-3"
              />

              <label>Descrição</label>
              <textarea
                value={editedProduto.descricao}
                onChange={(e) =>
                  setEditedProduto({ ...editedProduto, descricao: e.target.value })
                }
                className="w-full border px-3 py-2 mb-3"
              />

              <label>Preço</label>
              <input
                type="number"
                step="0.01"
                value={editedProduto.preco}
                onChange={(e) =>
                  setEditedProduto({ ...editedProduto, preco: e.target.value })
                }
                className="w-full border px-3 py-2 mb-3"
              />

              <label>Quantidade</label>
              <input
                type="number"
                value={editedProduto.quantidade}
                onChange={(e) =>
                  setEditedProduto({ ...editedProduto, quantidade: e.target.value })
                }
                className="w-full border px-3 py-2 mb-3"
              />

              <label>Imagem</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImagemFile(e.target.files[0])}
                className="w-full mb-3"
              />

              {/* Preview da imagem atual, se houver, e se o usuário não tiver escolhido uma nova */}
              {editedProduto.imagem && !imagemFile && (
                <img
                  src={`http://localhost/UNIFOOD/database/${editedProduto.imagem}`}
                  alt="Imagem atual"
                  className="mb-3 max-h-40 object-contain"
                />
              )}

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setModalEditar(false);
                    setImagemFile(null);
                  }}
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
