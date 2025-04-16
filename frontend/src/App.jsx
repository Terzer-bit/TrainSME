import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import PhishingTest from './pages/PhishingTest';
import PasswordManager from './pages/PasswordManager';
import Metrics from './pages/Metrics';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/phishing-test" element={<PhishingTest />} />
        <Route path="/password-manager" element={<PasswordManager />} />
        <Route path="/metrics" element={<Metrics />} />
      </Routes>
    </Router>
  );
}

export default App;