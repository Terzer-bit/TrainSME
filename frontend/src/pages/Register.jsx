import React, { useState } from 'react';
import './Register.css';
import logo from '../assets/logo-removebg.png';

export default function Register({ onRegisterSuccess, onNavigateToLogin }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    enterprise: 'Cookies.SA',
    password: '',
    confirm_password: ''
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.password !== formData.confirm_password) {
      setErrorMsg('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          username: formData.username,
          email: formData.email,
          enterprise: formData.enterprise,
          password: formData.password
        })
      });

      const data = await res.json();
      if (res.ok) {
        onRegisterSuccess(data);
      } else {
        setErrorMsg(data.error || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Connection error to backend server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page-container">
      <div className="register-card-box">
        <div className="register-logo-container">
          <img src={logo} alt="TrainSME Logo" className="register-brand-logo" />
        </div>

        <h2 className="register-title">Create Account</h2>
        <p className="register-subtitle">Join your organization's security awareness portal</p>

        <form onSubmit={handleSubmit} className="register-form-element">
          <div className="name-inputs-row">
            <input
              type="text"
              name="first_name"
              placeholder="Name"
              value={formData.first_name}
              onChange={handleChange}
              required
              className="register-input"
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              required
              className="register-input"
            />
          </div>

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="register-input"
          />

          <input
            type="email"
            name="email"
            placeholder="Work Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="register-input"
          />

          <input
            type="text"
            name="enterprise"
            placeholder="Enterprise (e.g. Cookies.SA)"
            value={formData.enterprise}
            onChange={handleChange}
            required
            className="register-input"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="register-input"
          />

          <input
            type="password"
            name="confirm_password"
            placeholder="Confirm Password"
            value={formData.confirm_password}
            onChange={handleChange}
            required
            className="register-input"
          />

          <button type="submit" className="register-submit-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        {errorMsg && <div className="register-error-msg">{errorMsg}</div>}

        <div className="auth-switch-box">
          <span>Already have an account? </span>
          <button className="auth-link-btn" onClick={onNavigateToLogin}>
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}