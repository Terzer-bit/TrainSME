import React from 'react';
import './UserProfileModal.css';

export default function UserProfileModal({ isOpen, user, onClose }) {
  if (!isOpen || !user) return null;

  const initials = user.first_name && user.last_name
    ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    : user.username.substring(0, 2).toUpperCase();

  const fullName = user.first_name && user.last_name
    ? `${user.first_name} ${user.last_name}`
    : user.username;

  return (
    <div className="user-modal-overlay" onClick={onClose}>
      <div className="user-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="user-modal-header">
          <h3 className="user-modal-title">Employee Profile</h3>
          <button className="user-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="user-modal-avatar-section">
          <div className="user-modal-avatar-circle">{initials}</div>
          <h2 className="user-modal-fullname">{fullName}</h2>
          <span className={`user-role-badge ${user.admin ? 'admin' : 'employee'}`}>
            {user.admin ? '🛡️ Administrator' : '👤 Standard Employee'}
          </span>
        </div>

        <div className="user-info-fields-list">
          <div className="user-info-field-row">
            <span className="field-label">Username</span>
            <span className="field-value">@{user.username}</span>
          </div>

          <div className="user-info-field-row">
            <span className="field-label">Work Email</span>
            <span className="field-value">{user.email}</span>
          </div>

          <div className="user-info-field-row">
            <span className="field-label">Enterprise Organization</span>
            <span className="field-value">{user.enterprise}</span>
          </div>

          <div className="user-info-field-row">
            <span className="field-label">Account Identifier</span>
            <span className="field-value">#USR-{user.user_id}</span>
          </div>
        </div>

        <div className="user-modal-footer">
          <button className="user-modal-dismiss-btn" onClick={onClose}>
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
}