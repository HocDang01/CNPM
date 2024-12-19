import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children, role }) {
  const token = localStorage.getItem('access_token');
  const userRole = localStorage.getItem('role');

  console.log("User Role:", userRole);  // Kiểm tra role trong localStorage
  console.log("Required Role:", role); // Kiểm tra role được truyền vào PrivateRoute

  if (!token || userRole !== role) {
    return <Navigate to="/403" />;
  }

  return children;
}

export default PrivateRoute;