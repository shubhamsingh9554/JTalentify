import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ activeSection, setActiveSection, toggleDarkMode, isDarkMode }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <h2 className="navbar-title">JTalentify</h2>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
     
    </nav>
  );
};

export default Navbar;
