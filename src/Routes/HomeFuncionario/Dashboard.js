import React, { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

function Dashboard({ children }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const [produtosAberto, setProdutosAberto] = useState(false);
  const [funcionariosAberto, setFuncionariosAberto] = useState(false);
  const [fornecedoresAberto, setFornecedoresAberto] = useState(false); // Novo estado
  const navigate = useNavigate();

  const tipoUsuario = Number(localStorage.getItem('tipo_usuario'));

  const handleLogout = () => {
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('tipo_usuario');
    navigate('/login');
  };

  return (
    <div className="w-screen min-h-screen overflow-hidden flex main">
      {!menuAberto && (
        <div className="lg:hidden fixed top-4 left-4 z-30">
          <button
            onClick={() => setMenuAberto(true)}
            className="bg-gray-800 text-white p-2 rounded"
          >
            <Menu size={24} />
          </button>
        </div>
      )}

      <aside
        className={`fixed lg:static top-0 left-0 min-h-screen w-[300px] bg-[#520000] text-white p-4 z-20 transform transition-transform duration-300 ease-in-out
        ${menuAberto ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {menuAberto && (
          <button
            onClick={() => setMenuAberto(false)}
            className="lg:hidden absolute pt-[9px] top-4 right-4 text-white p-2 hover:bg-gray-700 rounded z-30"
          >
            <X size={24} />
          </button>
        )}

        <div className="text-center mt-4 mb-8">
          <h2 className="text-3xl font-bold">MENU</h2>
        </div>

        <nav className="flex flex-col space-y-3">
          {tipoUsuario === 0 && (
            <div>
              <button
                onClick={() => setFuncionariosAberto(!funcionariosAberto)}
                className="w-full flex items-center justify-between hover:bg-gray-700 p-2 rounded focus:outline-none"
              >
                <span>Funcionários</span>
                <ChevronDown
                  size={20}
                  className={`transform transition-transform duration-300 ${funcionariosAberto ? 'rotate-180' : ''
                    }`}
                />
              </button>
              {funcionariosAberto && (
                <div className="ml-4 mt-2 flex flex-col space-y-2">
                  <a href="/lista-funcionarios" className="hover:bg-gray-700 p-2 rounded">
                    Lista de Funcionários
                  </a>
                  <a href="/cadastrar-funcionario" className="hover:bg-gray-700 p-2 rounded">
                    Cadastrar Funcionário
                  </a>
                </div>
              )}
            </div>
          )}

          <div>
            <button
              onClick={() => setProdutosAberto(!produtosAberto)}
              className="w-full flex items-center justify-between hover:bg-gray-700 p-2 rounded focus:outline-none"
            >
              <span>Produtos</span>
              <ChevronDown
                size={20}
                className={`transform transition-transform duration-300 ${produtosAberto ? 'rotate-180' : ''
                  }`}
              />
            </button>
            {produtosAberto && (
              <div className="ml-4 mt-2 flex flex-col space-y-2">
                <a href="/lista-produtos" className="hover:bg-gray-700 p-2 rounded">
                  Lista de Produtos
                </a>
                <a href="/cadastrar-produto" className="hover:bg-gray-700 p-2 rounded">
                  Cadastrar Produto
                </a>
              </div>
            )}
          </div>

          {/* Menu Fornecedores */}
          <div>
            <button
              onClick={() => setFornecedoresAberto(!fornecedoresAberto)}
              className="w-full flex items-center justify-between hover:bg-gray-700 p-2 rounded focus:outline-none"
            >
              <span>Fornecedores</span>
              <ChevronDown
                size={20}
                className={`transform transition-transform duration-300 ${fornecedoresAberto ? 'rotate-180' : ''
                  }`}
              />
            </button>
            {fornecedoresAberto && (
              <div className="ml-4 mt-2 flex flex-col space-y-2">
                <a href="/lista-fornecedores" className="hover:bg-gray-700 p-2 rounded">
                  Lista de Fornecedores
                </a>
                <a href="/cadastrar-fornecedor" className="hover:bg-gray-700 p-2 rounded">
                  Cadastrar Fornecedor
                </a>
              </div>
            )}
          </div>

          <a href="/caixa" className="hover:bg-gray-700 p-2 rounded">
            Caixa
          </a>

          <a href="/relatorios" className="hover:bg-gray-700 p-2 rounded">
            Relatórios
          </a>

          <button
            onClick={handleLogout}
            className="text-left hover:bg-gray-700 p-2 rounded focus:outline-none"
          >
            Sair
          </button>
        </nav>
      </aside>

      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}

Dashboard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Dashboard;
