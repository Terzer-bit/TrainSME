import React, { useState } from 'react';
import './Login.css';
import logo from '../assets/logo-removebg.png';

export default function Login({ onLoginSuccess, onNavigateToRegister }) {
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
        <div className="login-logo-container">
          <img src={logo} alt="TrainSME Logo" className="login-brand-logo" />
        </div>

        <p className="app-brand-subtitle">Security Awareness & Vault Management</p>

        <form onSubmit={handleSubmit} className="login-form-element">
          <input
            type="text"
            placeholder="Username or Email"
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

        <div className="auth-switch-box">
          <span>Don't have an account? </span>
          <button className="auth-link-btn" onClick={onNavigateToRegister}>
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}