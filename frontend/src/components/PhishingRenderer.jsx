import React from 'react';
import './PhishingRenderer.css'; // Make sure to have the CSS

const PhishingRenderer = ({ currentCase }) => {
  if (!currentCase) {
    return <p>No email case to display.</p>;
  }

  return (
    <div className="email-case">
      <div className="email-header">
        <div className="header-top">
          <h1>{currentCase.subject}</h1>
        </div>
        <div className="sender-info">
          <div className="sender-avatar">
          {currentCase.avatar ? (
            <img src={currentCase.avatar} alt="Email visual" className="email-avatar" />
          ) : (
            <div className="avatar-placeholder"></div>
          )}
          </div>
          <div className="sender-details">
            <div className="sender-name">{currentCase.senderName}</div>
            <div className="sender-email">{currentCase.senderEmail}</div>
          </div>
          <div className="email-date">
            {currentCase.date}
          </div>
        </div>
      </div>

      <div className="email-body-area">
        <div className="email-content">
          <p>{currentCase.body}</p>
          {currentCase.image && (
            <img src={currentCase.image} alt="Email visual" className="email-image" />
          )}
          <div className="email-link">
            {currentCase.links && currentCase.links.map((link, i) => (
              <p key={i}><a  href={link.href}  target="_blank"  rel="noopener noreferrer" onClick={(e) => e.preventDefault()}> {link.text} </a></p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhishingRenderer;