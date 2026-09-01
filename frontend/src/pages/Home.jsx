import React from 'react';
import Menu from '../components/Menu';
import './Home.css';

export default function Home({ user, onNavigate }) {
  return (
    <div className="home-page-layout">
      <Menu activeItem="home" onNavigate={onNavigate} user={user} />

      <div className="home-scroll-container">
        <section className="hero-banner-section">
          <h1 className="hero-main-title">Welcome to TrainSME</h1>
          <p className="hero-lead-text">
            Strengthen your cybersecurity reflexes against advanced social engineering attacks, inspect suspicious attachments for hidden malware, and maintain credentials vaulted with AES-256-GCM encryption.
          </p>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="hero-cta-btn" onClick={() => onNavigate('phishing-test')}>
              Start a new phishing test
            </button>
            <button
              className="hero-cta-btn"
              style={{ backgroundColor: '#18181b', color: '#fff', border: '1px solid #3f3f46' }}
              onClick={() => onNavigate('analyze-file')}
            >
              Inspect a suspicious file →
            </button>
          </div>
        </section>

        <section className="interactive-features-scroll-wrapper">
          <h2 className="section-headline">Security Suite Highlights</h2>

          <div className="features-interactive-timeline">
            {/* Feature 1: Phishing */}
            <div className="feature-interactive-card">
              <div className="feature-icon-container">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <div className="feature-text-block">
                <h3 className="feature-heading">Dynamic Phishing Simulator</h3>
                <p className="feature-description">
                  Experience authentic Gmail-style corporate attack scenarios, including domain spoofing, typosquatting, credential harvesting, and urgent invoice fraud with immediate pedagogical feedback.
                </p>
              </div>
            </div>

            {/* Feature 2: File Inspector */}
            <div className="feature-interactive-card">
              <div className="feature-icon-container">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <circle cx="11.5" cy="14.5" r="2.5"/>
                  <path d="M13.5 16.5L16 19"/>
                </svg>
              </div>
              <div className="feature-text-block">
                <h3 className="feature-heading">Static File & Malware Inspector</h3>
                <p className="feature-description">
                  Safely upload and evaluate suspicious email attachments. Features true MIME verification, Shannon entropy calculation for packed payloads, and VBA macro/PDF exploit pattern detection.
                </p>
              </div>
            </div>

            {/* Feature 3: Password Manager */}
            <div className="feature-interactive-card">
              <div className="feature-icon-container">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  <circle cx="12" cy="16" r="1"/>
                </svg>
              </div>
              <div className="feature-text-block">
                <h3 className="feature-heading">AES-256-GCM Zero-Knowledge Vault</h3>
                <p className="feature-description">
                  Generate high-entropy passwords with custom length controls. Every secret is authenticated and encrypted on-the-fly with derived keys without storing plaintexts in the database.
                </p>
              </div>
            </div>

            {/* Feature 4: Actionable Metrics */}
            <div className="feature-interactive-card">
              <div className="feature-icon-container">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3v18h18"/>
                  <path d="M18 17V9"/>
                  <path d="M13 17V5"/>
                  <path d="M8 17v-3"/>
                </svg>
              </div>
              <div className="feature-text-block">
                <h3 className="feature-heading">Comprehensive Analytics & Calendar</h3>
                <p className="feature-description">
                  Track individual testing milestones, analyze failed attack vectors with per-question breakdowns, and monitor organization-wide awareness levels in real time.
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="home-footer">
          TrainSME Security Suite — Protecting enterprises against modern social engineering
        </footer>
      </div>
    </div>
  );
}