import React, { useState } from 'react';
import './PhishingRenderer.css';

export default function PhishingRenderer({ currentCase }) {
  const [hoveredUrl, setHoveredUrl] = useState(null);
  const [isStarred, setIsStarred] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  if (!currentCase) {
    return <div className="gmail-loading-state">Loading simulated email...</div>;
  }

  const senderInitial = currentCase.senderName ? currentCase.senderName.charAt(0).toUpperCase() : 'G';

  // Paleta de colores estándar para avatares de Gmail
  const avatarColors = ['#1a73e8', '#ea4335', '#fbbc04', '#34a853', '#673ab7', '#00897b', '#e65100'];
  const avatarColor = avatarColors[(currentCase.id || 1) % avatarColors.length];

  return (
    <div className="gmail-client-container">
      {/* 1. Barra superior de herramientas de Gmail */}
      <div className="gmail-toolbar">
        <div className="gmail-toolbar-left">
          <button className="gmail-icon-btn" title="Back to Inbox" onClick={(e) => e.preventDefault()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
          </button>
          <button className="gmail-icon-btn" title="Archive" onClick={(e) => e.preventDefault()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z"/>
            </svg>
          </button>
          <button className="gmail-icon-btn" title="Report spam" onClick={(e) => e.preventDefault()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.73 3H8.27L3 8.27v7.46L8.27 21h7.46L21 15.73V8.27L15.73 3zM12 17.3c-.72 0-1.3-.58-1.3-1.3 0-.72.58-1.3 1.3-1.3.72 0 1.3.58 1.3 1.3 0 .72-.58 1.3-1.3 1.3zm1-4.3h-2V7h2v6z"/>
            </svg>
          </button>
          <button className="gmail-icon-btn" title="Delete" onClick={(e) => e.preventDefault()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
            </svg>
          </button>
          <span className="gmail-toolbar-divider"></span>
          <button className="gmail-icon-btn" title="Mark as unread" onClick={(e) => e.preventDefault()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </button>
        </div>

        <div className="gmail-toolbar-right">
          <span className="gmail-page-indicator">1 of 1</span>
          <button className="gmail-icon-btn" title="Newer" onClick={(e) => e.preventDefault()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
          <button className="gmail-icon-btn" title="Older" onClick={(e) => e.preventDefault()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* 2. Asunto del correo y etiquetas */}
      <div className="gmail-subject-container">
        <h1 className="gmail-subject-text">{currentCase.subject}</h1>
        <div className="gmail-tag-badge">Inbox</div>
      </div>

      {/* 3. Encabezado del remitente (Google style) */}
      <div className="gmail-sender-row">
        <div className="gmail-avatar" style={{ backgroundColor: avatarColor }}>
          {senderInitial}
        </div>

        <div className="gmail-sender-details">
          <div className="gmail-sender-line">
            <span className="gmail-sender-name">{currentCase.senderName}</span>
            <span className="gmail-sender-email">&lt;{currentCase.senderEmail}&gt;</span>
          </div>

          <div className="gmail-to-me-container">
            <span className="gmail-to-me-btn" onClick={() => setShowDetails(!showDetails)}>
              to me <span className="gmail-arrow-down">▾</span>
            </span>
          </div>

          {showDetails && (
            <div className="gmail-security-pill-dropdown">
              <div><strong>from:</strong> {currentCase.senderName} &lt;{currentCase.senderEmail}&gt;</div>
              <div><strong>to:</strong> employee@cookies.sa</div>
              <div><strong>date:</strong> {currentCase.date}</div>
              <div><strong>security:</strong> Standard encryption (TLS)</div>
            </div>
          )}
        </div>

        <div className="gmail-header-right-actions">
          <span className="gmail-date-text">{currentCase.date}</span>
          <button
            className={`gmail-icon-btn star-btn ${isStarred ? 'starred' : ''}`}
            title="Star email"
            onClick={() => setIsStarred(!isStarred)}
          >
            ★
          </button>
          <button className="gmail-icon-btn" title="Reply" onClick={(e) => e.preventDefault()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"/>
            </svg>
          </button>
          <button className="gmail-icon-btn" title="More options" onClick={(e) => e.preventDefault()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* 4. Cuerpo del mensaje */}
      <div className="gmail-body-container">
        <div className="gmail-body-text">{currentCase.body}</div>

        {currentCase.linkText && (
          <div className="gmail-action-block">
            {/* El botón/enlace contiene el href real para que los inspectores nativos funcionen,
                pero el onClick previene cualquier redirección o apertura por seguridad */}
            <a
              href={currentCase.linkUrl}
              className="gmail-material-btn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onMouseEnter={() => setHoveredUrl(currentCase.linkUrl)}
              onMouseLeave={() => setHoveredUrl(null)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {currentCase.linkText}
            </a>
          </div>
        )}
      </div>

      {/* 5. Previsualización de URL estilo Google Chrome en la esquina inferior izquierda (al hacer hover) */}
      {hoveredUrl && (
        <div className="chrome-url-tooltip-bar" title={hoveredUrl}>
          {hoveredUrl}
        </div>
      )}
    </div>
  );
}