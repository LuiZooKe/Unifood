import React, { useEffect, useState } from 'react';
import Dashboard from './Dashboard';
import { IMaskInput } from 'react-imask';

function ListaFornecedores() {
  const [fornecedores, setFornecedores] = useState([]);
  const [erro, setErro] = useState('');
  const [modalDetalhes, setModalDetalhes] = useState(null);
  const [modalEditar, setModalEditar] = useState(false);
  const [editedFornecedor, setEditedFornecedor] = useState(null);

  const fetchFornecedores = async () => {
    try {
      const res = await fetch('http://localhost/UNIFOOD/database/fornecedores.php?action=listar');
      const data = await res.json();
      if (data.success) setFornecedores(data.fornecedores);
      else setErro(data.message);
    } catch {
      setErro('Erro ao carregar fornecedores.');
    }
  };

  const deletarFornecedor = async (id) => {
    if (!window.confirm('Deseja realmente deletar este fornecedor?')) return;
    try {
      const res = await fetch('http://localhost/UNIFOOD/database/fornecedores.php?action=deletar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) fetchFornecedores();
      else notify.error(data.message);
    } catch {
      notify.error('Erro ao deletar fornecedor.');
    }
  };

  const salvarEdicao = async () => {
    try {
      const dadosLimpos = {
        id: editedFornecedor.id, // 👈 garante que o ID seja enviado!
        nome: editedFornecedor.nome?.trim() || '',
        email: editedFornecedor.email?.trim() || '',
        cpf: editedFornecedor.cpf ? editedFornecedor.cpf.replace(/\D/g, '') : '',
        cnpj: editedFornecedor.cnpj ? editedFornecedor.cnpj.replace(/\D/g, '') : '',
        logradouro: editedFornecedor.logradouro?.trim() || '',
        numero: editedFornecedor.numero?.trim() || '',
        bairro: editedFornecedor.bairro?.trim() || '',
        cidade: editedFornecedor.cidade?.trim() || '',
        telefone: editedFornecedor.telefone ? editedFornecedor.telefone.replace(/\D/g, '') : ''
      };

      const res = await fetch('http://localhost/UNIFOOD/database/fornecedores.php?action=atualizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosLimpos),
      });

      const data = await res.json();
      if (data.success) {
        setModalEditar(false);
        fetchFornecedores();
      } else {
        notify.error(data.message);
      }
    } catch {
      notify.error('Erro ao atualizar fornecedor.');
    }
  };

  useEffect(() => {
    fetchFornecedores();
  }, []);

  return (
    <Dashboard>
      <div className="p-6 text-white overflow-x-hidden w-full">
        <h1 className="text-3xl font-bold mb-[30px] text-center">Lista de Fornecedores</h1>

        {erro && <p className="text-red-400 mb-4">{erro}</p>}

        <div className="grid grid-cols-1 gap-4">
          {fornecedores.map((f) => (
            <div
              key={f.id}
              className="bg-[#1f2f3f] p-4 rounded shadow flex justify-between items-center flex-wrap md:flex-nowrap gap-4"
            >
              <div className="flex-1">
                <p className="text-2xl font-semibold">{f.nome}</p>
                <p className="text-lg text-gray-400">Email: {f.email}</p>
              </div>
              <div className="flex gap-2 mt-4 md:mt-0">
                <button onClick={() => setModalDetalhes(f)} className="bg-blue-500 px-3 py-1 rounded">Detalhes</button>
                <button onClick={() => { setEditedFornecedor(f); setModalEditar(true); }} className="bg-yellow-500 px-3 py-1 rounded">Editar</button>
                <button onClick={() => deletarFornecedor(f.id)} className="bg-red-600 px-3 py-1 rounded">Excluir</button>
              </div>
            </div>
          ))}
        </div>

        {modalDetalhes && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
            <div className="bg-white text-black p-6 rounded shadow w-full max-w-[700px] mx-4 ml-[20%]">
              <h3 className="text-3xl font-bold mb-4">{modalDetalhes.nome}</h3>
              <p><strong>Email:</strong> {modalDetalhes.email}</p>
              <p><strong>CPF:</strong> {modalDetalhes.cpf}</p>
              <p><strong>CNPJ:</strong> {modalDetalhes.cnpj}</p>
              <p><strong>Endereço:</strong> {modalDetalhes.logradouro}, {modalDetalhes.numero}, {modalDetalhes.bairro}, {modalDetalhes.cidade}</p>
              <p><strong>Telefone:</strong> {modalDetalhes.telefone}</p>
              <button onClick={() => setModalDetalhes(null)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Fechar</button>
            </div>
          </div>
        )}

        {modalEditar && editedFornecedor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
            <div className="bg-white text-black p-6 rounded shadow w-full max-w-[700px] mx-4 ml-[20%]">
              <h3 className="text-3xl font-bold mb-4">Editar Fornecedor</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  ['Nome', 'nome'],
                  ['Email', 'email'],
                  ['CPF', 'cpf', '000.000.000-00', 'bloqueado'],
                  ['CNPJ', 'cnpj', '00.000.000/0000-00', 'bloqueado'],
                  ['Logradouro', 'logradouro'],
                  ['Número', 'numero'],
                  ['Bairro', 'bairro'],
                  ['Cidade', 'cidade'],
                  ['Telefone', 'telefone', '(00) 00000-0000'],
                ].map(([label, key, mask, disableIf]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium mb-1">{label}</label>
                    {mask ? (
                      <IMaskInput
                        mask={mask}
                        value={editedFornecedor[key] || ''}
                        onAccept={(value) => setEditedFornecedor({ ...editedFornecedor, [key]: value })}
                        disabled={disableIf === 'bloqueado'}
                        className="w-full border px-3 py-2 bg-white disabled:bg-gray-200"
                      />
                    ) : (
                      <input
                        type="text"
                        value={editedFornecedor[key] || ''}
                        onChange={(e) => setEditedFornecedor({ ...editedFornecedor, [key]: e.target.value })}
                        disabled={disableIf === 'bloqueado'}
                        className="w-full border px-3 py-2 bg-white disabled:bg-gray-200"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button onClick={() => setModalEditar(false)} className="bg-gray-400 px-4 py-2 rounded">
                  Cancelar
                </button>
                <button onClick={salvarEdicao} className="bg-green-600 px-4 py-2 rounded text-white">
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

export default ListaFornecedores;
