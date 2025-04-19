import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PasswordManager.css';
import Menu from '../components/Menu'
import Service from '../components/Service.jsx';

function PasswordManager() {

  return (
    <div>
      <div className="phishing-test-page">
        <Menu />
        <Service />
      </div>
    </div>
  );
}

export default PasswordManager;
