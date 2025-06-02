import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Routes/Home/Home';
import Login from './Routes/Login/Login';
import Cadastro from './Routes/Login/Cadastro';
import Funcionario from './Routes/HomeFuncionario/HomeFuncionario';
import CadastroFuncionario from './Routes/HomeFuncionario/CadastroFuncionario';

import PrivateRoute from './components/PrivateRoute';
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
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/funcionario" element={
          <AdminRoute>
            <Funcionario />
          </AdminRoute>
        } />
        <Route path="/cadastrar-funcionario" element={
          <AdminRoute>
            <CadastroFuncionario />
          </AdminRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
