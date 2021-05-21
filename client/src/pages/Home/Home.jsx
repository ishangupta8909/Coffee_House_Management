import React, { useEffect } from "react";
import NavBar from "../../components/Navbar/Navbar";
import { Link } from "react-router-dom";

export default function Home() {
  useEffect(()=>{
    document.body.style.overflow = 'hidden';
    return ()=>{document.body.style.overflow = 'auto';}
  }, []);
  return (
    <div>
      <NavBar />
      
      <div className = "background-image"></div>
      <div className = "login-card">
        <p>Login as:</p>
        <Link to="/employee/login">Employee</Link>
        <Link to="/customer/login">Customer</Link>
      </div>
      </div>
  );
}
