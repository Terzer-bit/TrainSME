import React from 'react';
import './TestDetailModal.css';

export default function TestDetailModal({ test, onClose }) {
  if (!test) return null;

  const details = Array.isArray(test.details) ? test.details : [];

  return (
    <div className="detail-modal-overlay">
      <div className="detail-modal-card">
        <div className="detail-modal-header">
          <h3 className="detail-modal-title">
            Test Breakdown — Score: {test.correct_answers}/{test.total_questions || 10}
          </h3>
          <button className="detail-modal-close-btn" onClick={onClose}>✕ Close</button>
        </div>

        <div className="detail-modal-body">
          {details.length === 0 ? (
            <p style={{ color: '#888', textAlign: 'center' }}>No question details saved for this legacy test entry.</p>
          ) : (
            details.map((item, idx) => (
              <div
                key={idx}
                className={`question-breakdown-card ${item.isCorrect ? 'correct' : 'incorrect'}`}
              >
                <div className="q-header-row">
                  <span>Case #{idx + 1}: {item.subject || 'Email Inspection'}</span>
                  <span className={item.isCorrect ? 'q-badge-correct' : 'q-badge-incorrect'}>
                    {item.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#aaa' }}>
                  Your answer: <strong>{item.userAnswer}</strong> | Correct answer: <strong>{item.solution}</strong>
                </div>
                {item.explanation && (
                  <div className="q-explanation">
                    <strong>Feedback:</strong> {item.explanation}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}