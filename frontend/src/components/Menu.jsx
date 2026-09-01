import React, { useState } from 'react';
import UserProfileModal from './UserProfileModal';
import './Menu.css';

export default function Menu({ activeItem, onNavigate, user }) {
  const [showProfileModal, setShowProfileModal] = useState(false);

  const initials = user?.first_name && user?.last_name
    ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    : user?.username ? user.username.substring(0, 2).toUpperCase() : 'US';

  const displayName = user?.first_name && user?.last_name
    ? `${user.first_name} ${user.last_name}`
    : user?.username;

  return (
    <>
      <aside className="menu">
        {/* Sección de perfil con evento onClick para abrir el modal */}
        <div
          className="user-profile interactive-profile"
          onClick={() => setShowProfileModal(true)}
          title="Click to view full user details"
        >
          <div className="user-avatar-circle">{initials}</div>
          <div className="user-info">
            <div className="username">{displayName}</div>
            <span className="user-badge">
              {user?.admin ? 'Admin' : 'Employee'} • {user?.enterprise}
            </span>
          </div>
          <span className="profile-open-indicator">⚙️</span>
        </div>

        <ul className="menu-items">
          <li
            className={`menu-item ${activeItem === 'home' || activeItem === 'phishing-test' ? 'active' : ''}`}
            onClick={() => onNavigate('home')}
          >
            <span className="menu-item-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </span>
            Phishing simulator
          </li>

          <li
            className={`menu-item ${activeItem === 'analyze-file' ? 'active' : ''}`}
            onClick={() => onNavigate('analyze-file')}
          >
            <span className="menu-item-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <circle cx="11.5" cy="14.5" r="2.5"/>
                <path d="M13.5 16.5L16 19"/>
              </svg>
            </span>
            Analyze file
          </li>

          <li
            className={`menu-item ${activeItem === 'password-manager' ? 'active' : ''}`}
            onClick={() => onNavigate('password-manager')}
          >
            <span className="menu-item-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </span>
            Password manager
          </li>

          <li
            className={`menu-item ${activeItem === 'my-results' ? 'active' : ''}`}
            onClick={() => onNavigate('my-results')}
          >
            <span className="menu-item-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </span>
            My results
          </li>

          {user?.admin && (
            <li
              className={`menu-item ${activeItem === 'metrics' ? 'active' : ''}`}
              onClick={() => onNavigate('metrics')}
            >
              <span className="menu-item-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
              </span>
              Metrics
            </li>
          )}
        </ul>

        <button className="sign-out-button" onClick={() => onNavigate('signout')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sign Out
        </button>
      </aside>

      <UserProfileModal
        isOpen={showProfileModal}
        user={user}
        onClose={() => setShowProfileModal(false)}
      />
    </>
  );
}