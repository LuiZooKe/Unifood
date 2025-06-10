import React, { useEffect, useState } from 'react';
import Dashboard from './Dashboard';
import { IMaskInput } from 'react-imask';

function ListaFuncionarios() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [erro, setErro] = useState('');
  const [modalDetalhes, setModalDetalhes] = useState(null);
  const [modalEditar, setModalEditar] = useState(false);
  const [editedFuncionario, setEditedFuncionario] = useState(null);

  const fetchFuncionarios = async () => {
    try {
      const res = await fetch('http://localhost/UNIFOOD/database/funcionarios.php?action=listar');
      const data = await res.json();
      if (data.success) setFuncionarios(data.funcionarios);
      else setErro(data.message);
    } catch {
      setErro('Erro ao carregar funcionários.');
    }
  };

  const deletarFuncionario = async (id) => {
    if (!window.confirm('Deseja realmente deletar este funcionário?')) return;
    try {
      const res = await fetch('http://localhost/UNIFOOD/database/funcionarios.php?action=deletar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) fetchFuncionarios();
      else alert(data.message);
    } catch {
      alert('Erro ao deletar funcionário.');
    }
  };

  const salvarEdicao = async () => {
    try {
      const res = await fetch('http://localhost/UNIFOOD/database/funcionarios.php?action=atualizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedFuncionario),
      });
      const data = await res.json();
      if (data.success) {
        setModalEditar(false);
        fetchFuncionarios();
      } else {
        alert(data.message);
      }
    } catch {
      alert('Erro ao atualizar funcionário.');
    }
  };

  // Função para bloquear digitação manual no input date (permite só seleção via picker)
  const bloquearInputManual = (e) => {
    const teclasPermitidas = [
      'Tab', 'Shift', 'Control', 'Alt',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Escape',
      'Home', 'End'
    ];
    if (!teclasPermitidas.includes(e.key)) {
      e.preventDefault();
    }
  };

  // Função simples para formatar CPF: 00000000000 => 000.000.000-00
  const formatarCPF = (cpf) => {
    if (!cpf) return '';
    const cpfLimpo = cpf.replace(/\D/g, '');
    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  useEffect(() => {
    fetchFuncionarios();
  }, []);

  return (
    <Dashboard>
      <div className="p-6 text-white overflow-x-hidden w-full">
        <h1 className="text-3xl font-bold mb-[30px] text-center">Lista de Funcionários</h1>

        {erro && <p className="text-red-400 mb-4">{erro}</p>}

        <div className="grid grid-cols-1 gap-4">
          {funcionarios.map((func) => (
            <div
              key={func.id}
              className="bg-[#1f2f3f] p-4 rounded shadow flex justify-between items-center flex-wrap md:flex-nowrap gap-4"
            >
              <div className="flex-1">
                <p className="text-2xl font-semibold">{func.nome}</p>
                <p className="text-lg text-gray-400">Email: {func.email}</p>
              </div>
              <div className="flex gap-2 mt-4 md:mt-0">
                <button onClick={() => setModalDetalhes(func)} className="bg-blue-500 px-3 py-1 rounded">Detalhes</button>
                <button onClick={() => { setEditedFuncionario(func); setModalEditar(true); }} className="bg-yellow-500 px-3 py-1 rounded">Editar</button>
                <button onClick={() => deletarFuncionario(func.id)} className="bg-red-600 px-3 py-1 rounded">Excluir</button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal de detalhes */}
        {modalDetalhes && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
            <div className="bg-white text-black p-6 rounded shadow w-full max-w-[500px] mx-4">
              <h3 className="text-3xl font-bold mb-4">{modalDetalhes.nome}</h3>
              <p><strong>Email:</strong> {modalDetalhes.email}</p>
              <p><strong>CPF:</strong> {formatarCPF(modalDetalhes.cpf)}</p>
              <p><strong>Nascimento:</strong> {modalDetalhes.data_nascimento}</p>
              <p><strong>Endereço:</strong> {modalDetalhes.logradouro}, {modalDetalhes.numero}, {modalDetalhes.bairro}, {modalDetalhes.cidade}</p>
              <p><strong>Telefone:</strong> {modalDetalhes.telefone}</p>
              <p><strong>Admissão:</strong> {modalDetalhes.data_admissao}</p>
              <p><strong>Cargo:</strong> {modalDetalhes.cargo}</p>
              <p><strong>Salário:</strong> R$ {modalDetalhes.salario}</p>
              <button onClick={() => setModalDetalhes(null)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Fechar</button>
            </div>
          </div>
        )}

        {/* Modal de edição */}
        {modalEditar && editedFuncionario && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
            <div className="bg-white text-black p-6 rounded shadow w-full max-w-2xl mx-4">
              <h3 className="text-3xl font-bold mb-4">Editar Funcionário</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  ['Nome', 'nome'],
                  ['Email', 'email'],
                  ['CPF', 'cpf', '000.000.000-00'],
                  ['Data de Nascimento', 'data_nascimento'],
                  ['Logradouro', 'logradouro'],
                  ['Número', 'numero'],
                  ['Bairro', 'bairro'],
                  ['Cidade', 'cidade'],
                  ['Telefone', 'telefone', '(00) 00000-0000'],
                  ['Data de Admissão', 'data_admissao'],
                  ['Cargo', 'cargo'],
                  ['Salário', 'salario']
                ].map(([label, key, mask]) => {
                  const isDate = key.includes('data');
                  return (
                    <div key={key}>
                      <label className="block text-sm font-medium mb-1">{label}</label>
                      {mask ? (
                        <IMaskInput
                          mask={mask}
                          value={editedFuncionario[key] || ''}
                          onAccept={(value) => setEditedFuncionario({ ...editedFuncionario, [key]: value })}
                          className="w-full border px-3 py-2"
                        />
                      ) : isDate ? (
                        <input
                          type="date"
                          value={editedFuncionario[key] || ''}
                          onChange={(e) => setEditedFuncionario({ ...editedFuncionario, [key]: e.target.value })}
                          onKeyDown={bloquearInputManual} // bloqueia digitação manual
                          className="w-full border px-3 py-2"
                        />
                      ) : (
                        <input
                          type="text"
                          value={editedFuncionario[key] || ''}
                          onChange={(e) => setEditedFuncionario({ ...editedFuncionario, [key]: e.target.value })}
                          className="w-full border px-3 py-2"
                        />
                      )}
                    </div>
                  );
                })}
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

export default ListaFuncionarios;
