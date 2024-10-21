
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; 
import '../styles/Register.css'; 

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');
  const [adminCode, setAdminCode] = useState(''); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name, email, password, department: '', role,
    };

    try {
      if (role === 'admin') {
        // Check if the admin code is correct
        if (adminCode !== '5066') {
          alert('Invalid admin code.');
          return;
        }
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
      <h2 className='login-title'>JTalentify</h2>
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
          onChange={(e) => {
            setRole(e.target.value);
            if (e.target.value !== 'admin') setAdminCode(''); // Reset admin code if not admin
          }}
          className="register-select"
        >
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>
        {role === 'admin' && (
          <input
            type="text"
            placeholder="Admin Code"
            value={adminCode}
            onChange={(e) => setAdminCode(e.target.value)}
            className="register-input"
          />
        )}
        <button type="submit" className="register-button">Register</button>
      </form>
      <p className="login-prompt">
        Already have an account? <Link to="/login" className="login-link">Login</Link>
      </p>
    </div>
  );
};

export default Register;
