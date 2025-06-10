import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import RedefinirSenha from './Routes/Login/RedefinirSenha';
import SaibaMais from './Routes/Home/SaibaMais';

import PrivateRoute from './components/PrivateRoute';
import FunRoute from './components/FunRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        } />
        <Route path="/saibamais" element={
          <PrivateRoute>
            <SaibaMais />
          </PrivateRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />
        <Route path="/redefinir-senha" element={<RedefinirSenha />} />
        <Route path="/cadastro" element={<Cadastro />} />
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
        <Route path="lista-produtos" element={
          <FunRoute>
            <ListaProdutos />
          </FunRoute>
        } />
        <Route path="/lista-funcionarios" element={
          <AdminRoute>
            <ListaFuncionario />
          </AdminRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
