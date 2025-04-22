import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import Menu from '../components/Menu'
import SpotlightCard from '../utils/SpotlightCard';

function Home() {

  const navigate = useNavigate();

  return (
    <div className="page">
      <Menu />
      <div className="content-area">
        <div className="welcome-section">
          <h2 className="welcome-title">Welcome to TrainSME</h2>
          <p className="welcome-description">
            The simple way to test your phishing awareness while keeping your passwords under control.
          </p>
          <button className="start-test-button" onClick={() => navigate("/phishing-test")}>Start a new test</button>
        </div>

        <div className="what-is-trainsme-section">
          <h2 className="what-is-trainsme-title">What is TrainSME?</h2>
          <p className="what-is-trainsme-text">
            TrainSME is a web application designed to assess and strengthen your employees' cybersecurity awareness.
          </p>
        </div>

        <div className="main-features-section">
          <h2 className="main-features-title">Main features</h2>
          <div className="card-container">

            <SpotlightCard>
              <h3 className="card-title">Phishing tests</h3>
              <p className="card-description">Evaluate and improve your phishing awareness through a user-friendly and educational testing tool.</p>
            </SpotlightCard>

            <SpotlightCard>
              <h3 className="card-title">Password manager</h3>
              <p className="card-description">Secure your passwords and say goodbye to the stress of remembering them. Stronger passwords, simpler management</p>
            </SpotlightCard>

            <SpotlightCard>
              <h3 className="card-title">Insight made simple</h3>
              <p className="card-description">Simple metrics that track your test progress and improvement. See your progress at a glance with easy-to-understand stats.</p>
            </SpotlightCard>

          </div>
        </div>

        <div className="footer-section">
          © 2025 TrainSME - All Rights Reserved
        </div>
      </div>
    </div>
  );
}

export default Home;