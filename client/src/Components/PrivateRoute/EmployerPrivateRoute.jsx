import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import UserNavbar from '../Navbar/UserNavbar';
import Footer from '../Footer/StudentFooter';

const EmployerPrivateRoute = () => {
  const isEmployerLoggedIn = !!localStorage.getItem('token');

  if (isEmployerLoggedIn) {
    const role = localStorage.getItem("role")
    if(role == "Employer")
    return (
      <>
     <UserNavbar></UserNavbar>
      <Outlet />; 
      <Footer></Footer>
     
      
      </>

    )
  
    
  }

  // Redirect to admin login page if not signed in
  return <Navigate to="/admin_login" />;
};

export default EmployerPrivateRoute;
