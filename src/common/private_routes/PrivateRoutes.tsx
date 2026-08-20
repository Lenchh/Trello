import { JSX } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export function PrivateRoutes(): JSX.Element {
  const token = localStorage.getItem('token');

  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
