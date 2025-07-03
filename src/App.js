import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; //  Importa o Toaster
import './App.css';

import Home from './Routes/Home/Home';
import Login from './Routes/Login/Login';
import EsqueciSenha from './Routes/Login/EsqueciSenha';
import Cadastro from './Routes/Login/Cadastro';
import Funcionario from './Routes/HomeFuncionario/HomeFuncionario';
import CadastroFuncionario from './Routes/HomeFuncionario/CadastroFuncionario';
import CadastroProduto from './Routes/HomeFuncionario/CadastroProduto';
import ListaFuncionario from './Routes/HomeFuncionario/ListaFuncionario';
import ListaProdutos from './Routes/HomeFuncionario/ListaProdutos';
import CadastroFornecedor from './Routes/HomeFuncionario/CadastroFornecedor';
import ListaFornecedores from './Routes/HomeFuncionario/ListaFornecedores';
import Relatorios from './Routes/HomeFuncionario/Relatorios';
import Caixa from './Routes/HomeFuncionario/Caixa/Caixa.tsx';
import RedefinirSenha from './Routes/Login/RedefinirSenha';
import SaibaMais from './Routes/Home/SaibaMais';

import PrivateRoute from './components/PrivateRoute';
import FunRoute from './components/FunRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <>
      {/*  Ativa os Toasts */}
      <Toaster
        position="bottom-center"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />

      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/saibamais" element={<SaibaMais />} />
          <Route path="/login" element={<Login />} />
          <Route path="/esqueci-senha" element={<EsqueciSenha />} />
          <Route path="/redefinir-senha" element={<RedefinirSenha />} />
          <Route path="/cadastro" element={<Cadastro />} />

          {/* Rotas de admin/funcionario */}
          <Route path="/funcionario" element={
            <FunRoute>
              <Funcionario />
            </FunRoute>
          } />
          <Route path="/cadastrar-funcionario" element={
            <AdminRoute>
              <CadastroFuncionario />
            </AdminRoute>
          } />
          <Route path="/cadastrar-produto" element={
            <FunRoute>
              <CadastroProduto />
            </FunRoute>
          } />
          <Route path="/lista-produtos" element={
            <FunRoute>
              <ListaProdutos />
            </FunRoute>
          } />
          <Route path="/lista-funcionarios" element={
            <AdminRoute>
              <ListaFuncionario />
            </AdminRoute>
          } />
          <Route path="/cadastrar-fornecedor" element={
            <FunRoute>
              <CadastroFornecedor />
            </FunRoute>
          } />
          <Route path="/lista-fornecedores" element={
            <FunRoute>
              <ListaFornecedores />
            </FunRoute>
          } />
          <Route path="/caixa" element={
            <FunRoute>
              <Caixa />
            </FunRoute>
          } />
          <Route path="/relatorios" element={
            <FunRoute>
              <Relatorios />
            </FunRoute>
          } />
        </Routes>
      </Router>
    </>
  );
}

export default App;
