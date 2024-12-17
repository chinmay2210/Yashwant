import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Navbar from '../Navbar/AdminNavbar';
import FooterAdmin from '../Footer/footer';

const AdminPrivateRoute = () => {
  const isAdminLoggedIn = !!localStorage.getItem('token');

  if (isAdminLoggedIn) {
    return (
      <>
      <Navbar/>
      <Outlet />; 
      <FooterAdmin></FooterAdmin>
      </>

    )
  
    
  }

  // Redirect to admin login page if not signed in
  return <Navigate to="/admin_login" />;
};

export default AdminPrivateRoute;
