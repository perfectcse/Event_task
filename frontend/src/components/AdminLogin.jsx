// 📁 frontend/src/components/AdminLogin.jsx
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AdminLogin.css';

const AdminLogin = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', formData);
      localStorage.setItem('token', res.data.token);
      toast.success('Login successful!');
      onLogin(); // trigger parent state change
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>🔐 Admin Login</h2>
        <input type="email" name="email" placeholder="Admin Email" required onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
