import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; 
import '../styles/Register.css'; 

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name, email, password, department: '', role,
    };
    try {
      if (role === 'admin') {
        await axios.post('http://localhost:5000/api/auth/admin/register', payload);
      } else {
        await axios.post('http://localhost:5000/api/auth/employee/register', payload);
      }
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Register</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="register-input"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="register-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="register-input"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="register-select"
        >
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="register-button">Register</button>
      </form>
      <p className="login-prompt">
        Already have an account? <Link to="/login" className="login-link">Login</Link>
      </p>
    </div>
  );
};

export default Register;
