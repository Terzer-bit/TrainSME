import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Home from './pages/Home';
import PhishingTest from './pages/PhishingTest';
import PasswordManager from './pages/PasswordManager';
import MyResults from './pages/MyResults';
import Metrics from './pages/Metrics';

export default function App() {
  const [currentView, setCurrentView] = useState('login');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user_id = localStorage.getItem('user_id');
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    const enterprise = localStorage.getItem('enterprise');
    const admin = localStorage.getItem('admin') === 'true';

    if (user_id && username) {
      setUser({ user_id, username, email, enterprise, admin });
      setCurrentView('home');
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
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

  if (!user || currentView === 'login') {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div style={{ display: 'flex', width: '100vw', minHeight: '100vh', background: '#000000' }}>
      {currentView === 'home' && <Home user={user} onNavigate={handleNavigate} />}
      {currentView === 'phishing-test' && <PhishingTest user={user} onNavigate={handleNavigate} />}
      {currentView === 'password-manager' && <PasswordManager user={user} onNavigate={handleNavigate} />}
      {currentView === 'my-results' && <MyResults user={user} onNavigate={handleNavigate} />}
      {currentView === 'metrics' && <Metrics user={user} onNavigate={handleNavigate} />}
    </div>
  );
}