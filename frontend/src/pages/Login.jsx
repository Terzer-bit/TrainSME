import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logo from '../assets/Logo4-removebg.svg';
import loginIcon from '../assets/log-in-neg.svg';
import Particles from '../utils/Particles';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Login successful');

        localStorage.setItem('user_id', data.user_id);
        localStorage.setItem('username', data.username);
        localStorage.setItem('email', data.email);
        localStorage.setItem('password', data.password);
        localStorage.setItem('enterprise', data.enterprise);
        localStorage.setItem('admin', data.admin);

        navigate('/home')
      } else {
        setMessage(data.error || 'Authentication error');
      }
    } catch (err) {
      console.error('Failed to log in', err);
      setMessage('Internal server error');
    }
  };

  return (
    <div className="login-page">
      <Particles
        particleColors={["#b9fcfe", "#84c9e7", "#5392e0"]}
        particleCount={200}
        particleSpread={10}
        speed={0.1}
        particleBaseSize={100}
        moveParticlesOnHover={true}
        alphaParticles={false}
        disableRotation={false}
        className="particles-background"
      />
      <div className="login-container">
        <div className="logo-container">
          <img src={logo} alt="TrainSME Logo" className="logo" />
        </div>
        <h2 className="login-title">Sign in</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <button type="submit" className="submit-button">
            <span>Sign In</span> <span><img src={loginIcon} alt="Log in icon" className="icon" /></span>
          </button>
        </form>
        <div className="rowContainer">
          <p className="register-text">Don't have an account?</p>
          <a href="" className="register-link">Register</a>
        </div>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default Login;