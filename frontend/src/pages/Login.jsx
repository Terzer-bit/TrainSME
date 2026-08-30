import React, { useState } from 'react';
import './Login.css';
import logo from '../assets/Logo4-removebg.svg';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('user_id', data.user_id);
        localStorage.setItem('username', data.username);
        localStorage.setItem('email', data.email);
        localStorage.setItem('password', data.password);
        localStorage.setItem('enterprise', data.enterprise);
        localStorage.setItem('admin', data.admin);

        onLoginSuccess(data);
      } else {
        setErrorMsg(data.error || 'Authentication error');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Connection error to backend server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-card-box">
        {/* Logo como título principal */}
        <div className="login-logo-container">
          <img src={logo} alt="TrainSME Logo" className="login-brand-logo" />
        </div>

        <p className="app-brand-subtitle">Security Awareness & Vault Management</p>

        <form onSubmit={handleSubmit} className="login-form-element">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {errorMsg && <div className="login-error-msg">{errorMsg}</div>}
      </div>
    </div>
  );
}