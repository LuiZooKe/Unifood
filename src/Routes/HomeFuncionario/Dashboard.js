import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';  // <-- Importa useNavigate

function Dashboard({ children }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const navigate = useNavigate();  // <-- Hook para navegação

  const handleLogout = () => {
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('tipo_usuario'); // limpa também o tipo se usar
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen relative main">
      {!menuAberto && (
        <div className="md:hidden fixed top-4 left-4 z-30">
          <button
            onClick={() => setMenuAberto(true)}
            className="bg-gray-800 text-white p-2 rounded"
          >
            <Menu size={24} />
          </button>
        </div>
      )}

      <aside
        className={`fixed md:static top-0 left-0 h-full w-[300px] bg-gray-800 text-white p-4 z-20 transform transition-transform duration-300 ease-in-out
        ${menuAberto ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {menuAberto && (
          <button
            onClick={() => setMenuAberto(false)}
            className="md:hidden absolute pt-[9px] top-4 right-4 text-white p-2 hover:bg-gray-700 rounded z-30"
          >
            <X size={24} />
          </button>
        )}

        <div className="text-center mt-4 mb-8">
          <h2 className="text-3xl font-bold">MENU</h2>
        </div>

        <nav className="flex flex-col space-y-3">
          <a href="/cadastrar-funcionario" className="hover:bg-gray-700 p-2 rounded">Cadastrar Funcionário</a>
          <a href="#" className="hover:bg-gray-700 p-2 rounded">Produtos</a>
          <a href="#" className="hover:bg-gray-700 p-2 rounded">Relatórios</a>
          {/* Aqui substituí o link "Sair" por um botão com logout */}
          <button
            onClick={handleLogout}
            className="text-left hover:bg-gray-700 p-2 rounded focus:outline-none"
          >
            Sair
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}

Dashboard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Dashboard;
