import React, { useState } from 'react';
import './Service.css';

export default function Service({ serviceName, onCopy, onSee, onRegenerate, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="service-card">
      <div className="service-card-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="service-left-area">
          <div className="service-icon-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <span className="service-title-text">{serviceName}</span>
        </div>

        <div className="service-quick-actions" onClick={(e) => e.stopPropagation()}>
          {/* Botón de copia rápida */}
          <button
            className="quick-icon-btn copy"
            title="Copy password to clipboard"
            onClick={() => onCopy(serviceName)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
          </button>

          {/* Botón de eliminar */}
          <button
            className="quick-icon-btn delete"
            title="Delete service"
            onClick={() => onDelete(serviceName)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
          
          <span className="expand-indicator">{isExpanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {isExpanded && (
        <div className="service-expanded-drawer">
          <button className="drawer-btn regenerate" onClick={() => onRegenerate(serviceName)}>
            Edit service / Generate new password
          </button>
          <button className="drawer-btn see" onClick={() => onSee(serviceName)}>
            See password
          </button>
        </div>
      )}
    </div>
  );
}