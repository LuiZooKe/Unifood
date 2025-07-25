import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const FunRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('usuarioLogado') === 'true';
  const tipoUsuario = parseInt(localStorage.getItem('tipo_usuario'), 10);

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (tipoUsuario !== 0 && tipoUsuario !== 3) return <Navigate to="/" />;

  return children;
};

FunRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FunRoute;
