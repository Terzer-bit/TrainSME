import React, { useState, useEffect } from 'react';
import './PasswordModal.css';

export default function PasswordModal({
  isOpen,
  mode = 'create', // 'create' | 'update'
  initialService = '',
  onClose,
  onConfirm
}) {
  const [serviceName, setServiceName] = useState(mode === 'create' ? '' : initialService);
  const [passwordValue, setPasswordValue] = useState('');
  const [length, setLength] = useState(16);

  // Reiniciar estado cada vez que se abre o cambian las props
  useEffect(() => {
    if (isOpen) {
      setServiceName(mode === 'create' ? '' : initialService);
      setPasswordValue('');
      setLength(16);
    }
  }, [isOpen, mode, initialService]);

  if (!isOpen) return null;

  const handleGenerateRandom = () => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_-+=<>?';

    let result = '';
    result += lowercase[Math.floor(Math.random() * lowercase.length)];
    result += uppercase[Math.floor(Math.random() * uppercase.length)];
    result += numbers[Math.floor(Math.random() * numbers.length)];
    result += symbols[Math.floor(Math.random() * symbols.length)];

    const charset = lowercase + uppercase + numbers + symbols;
    for (let i = result.length; i < length; i++) {
      result += charset[Math.floor(Math.random() * charset.length)];
    }

    const shuffled = result.split('').sort(() => 0.5 - Math.random()).join('');
    setPasswordValue(shuffled);
  };

  const handleConfirm = () => {
    if (mode === 'create' && !serviceName.trim()) {
      alert('Please enter a service name.');
      return;
    }
    onConfirm({
      service: mode === 'create' ? serviceName.trim() : initialService,
      password: passwordValue,
      length
    });
  };

  return (
    <div className="pwd-modal-overlay" onClick={onClose}>
      <div className="pwd-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="pwd-modal-header">
          <h3 className="pwd-modal-title">
            {mode === 'create' ? 'Add new service password' : `Regenerate password for ${initialService}`}
          </h3>
          <button className="pwd-modal-close-icon" onClick={onClose}>✕</button>
        </div>

        {mode === 'create' && (
          <div className="pwd-input-group">
            <label className="pwd-label">Service name *</label>
            <input
              type="text"
              placeholder="e.g. GitHub, AWS, Google Cloud"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="pwd-input-field"
              autoFocus
            />
          </div>
        )}

        <div className="pwd-input-group">
          <label className="pwd-label">Password (type manually or generate)</label>
          <div className="pwd-input-with-button">
            <input
              type="text"
              placeholder="Enter or generate password"
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
              className="pwd-input-field"
            />
            <button type="button" className="pwd-generate-btn" onClick={handleGenerateRandom}>
              Generate
            </button>
          </div>
        </div>

        <div className="pwd-slider-wrapper">
          <div className="pwd-slider-header">
            <span>Character length: <strong>{length}</strong></span>
            <span>(8 - 32)</span>
          </div>
          <input
            type="range"
            min="8"
            max="32"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="pwd-slider"
          />
        </div>

        <div className="pwd-modal-actions">
          <button className="pwd-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="pwd-btn-confirm" onClick={handleConfirm}>
            {mode === 'create' ? 'Save Service' : 'Update Password'}
          </button>
        </div>
      </div>
    </div>
  );
}