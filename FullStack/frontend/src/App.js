import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import ContactUs from './components/ContactUs';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import EmployeeProfile from './components/EmployeeProfile';
const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/profile" element={<EmployeeProfile />} />
        <Route path="/contact" element={<ContactUs />} />
        
    
      </Routes>
    </Router>
  );
};

export default App;
