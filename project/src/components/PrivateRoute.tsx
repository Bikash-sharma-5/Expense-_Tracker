import React from 'react';
import { Route, Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  element: JSX.Element;
  path: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, ...rest }) => {
  const token = localStorage.getItem('auth_token');
  
  // If no token, redirect to login
  return token ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
