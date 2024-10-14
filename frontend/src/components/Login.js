import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom';
import '../styles/Login.css'; 
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Sending login request
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
      // Store token in localStorage
      localStorage.setItem('token', res.data.token);
      
      // Check the user role and navigate accordingly
      if (res.data.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
      <h2 className="login-title">JTalentify</h2>
      <h4 className="login-projectname">Login to Employee Skill and Competency Tracking System</h4>
      
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="login-input"
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="login-input"
        />
        <button type="submit" className="login-button">Login</button>
        <p className="signup-prompt">
        Don't have account? Let's <Link to="/register" className="signup-link">Register</Link>
      </p>
      </form>
    </div>
  );
};

export default Login;
