import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import PhishingTest from './pages/PhishingTest';
import AnalyzeFile from './pages/AnalyzeFile';
import PasswordManager from './pages/PasswordManager';
import MyResults from './pages/MyResults';
import Metrics from './pages/Metrics';

export default function App() {
  const [currentView, setCurrentView] = useState('login');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user_id = localStorage.getItem('user_id');
    const username = localStorage.getItem('username');
    const first_name = localStorage.getItem('first_name');
    const last_name = localStorage.getItem('last_name');
    const email = localStorage.getItem('email');
    const enterprise = localStorage.getItem('enterprise');
    const admin = localStorage.getItem('admin') === 'true';

    if (user_id && username) {
      setUser({ user_id, username, first_name, last_name, email, enterprise, admin });
      setCurrentView('home');
    }
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('user_id', userData.user_id);
    localStorage.setItem('username', userData.username);
    localStorage.setItem('first_name', userData.first_name || '');
    localStorage.setItem('last_name', userData.last_name || '');
    localStorage.setItem('email', userData.email);
    localStorage.setItem('password', userData.password);
    localStorage.setItem('enterprise', userData.enterprise);
    localStorage.setItem('admin', userData.admin);

    setCurrentView('home');
  };

  const handleNavigate = (view) => {
    if (view === 'signout') {
      localStorage.clear();
      setUser(null);
      setCurrentView('login');
      return;
    }
    setCurrentView(view);
  };

  if (!user) {
    if (currentView === 'register') {
      return (
        <Register
          onRegisterSuccess={handleAuthSuccess}
          onNavigateToLogin={() => setCurrentView('login')}
        />
      );
    }
    return (
      <Login
        onLoginSuccess={handleAuthSuccess}
        onNavigateToRegister={() => setCurrentView('register')}
      />
    );
  }

  return (
    <div style={{ display: 'flex', width: '100vw', minHeight: '100vh', background: '#000000' }}>
      {currentView === 'home' && <Home user={user} onNavigate={handleNavigate} />}
      {currentView === 'phishing-test' && <PhishingTest user={user} onNavigate={handleNavigate} />}
      {currentView === 'analyze-file' && <AnalyzeFile user={user} onNavigate={handleNavigate} />}
      {currentView === 'password-manager' && <PasswordManager user={user} onNavigate={handleNavigate} />}
      {currentView === 'my-results' && <MyResults user={user} onNavigate={handleNavigate} />}
      {currentView === 'metrics' && <Metrics user={user} onNavigate={handleNavigate} />}
    </div>
  );
}