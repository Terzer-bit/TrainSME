import React, { useState, useEffect } from 'react';
import Menu from '../components/Menu';
import PhishingRenderer from '../components/PhishingRenderer';
import './PhishingTest.css';

export default function PhishingTest({ user, onNavigate }) {
  const [cases, setCases] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [testHistoryDetails, setTestHistoryDetails] = useState([]);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/phishing/cases')
      .then((res) => res.json())
      .then((data) => {
        setCases(data.cases || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading cases:', err);
        setLoading(false);
      });
  }, []);

  const currentCase = cases[currentIndex];

  const handleAnswer = (answer) => {
    const isCorrect = answer === currentCase.solution;
    if (isCorrect) setScore((prev) => prev + 1);

    setSelectedAnswer(answer);

    setTestHistoryDetails((prev) => [
      ...prev,
      {
        id: currentCase.id,
        subject: currentCase.subject,
        userAnswer: answer,
        solution: currentCase.solution,
        isCorrect,
        explanation: currentCase.explanation
      }
    ]);
  };

  const handleNext = async () => {
    if (currentIndex === cases.length - 1) {
      // Guardar en la base de datos
      try {
        await fetch('http://localhost:5000/api/phishing-test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user.user_id,
            score: score + (selectedAnswer === currentCase.solution ? 0 : 0),
            total_questions: cases.length,
            details: testHistoryDetails
          })
        });
      } catch (err) {
        console.error('Error saving test result:', err);
      }
      setFinished(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    }
  };

  return (
    <div className="phishing-page-wrapper">
      <Menu activeItem="phishing-test" onNavigate={onNavigate} user={user} />

      <main className="phishing-main-content">
        {loading ? (
          <div style={{ color: '#fff' }}>Loading security simulator...</div>
        ) : !finished ? (
          <>
            <div className="test-progress-bar-container">
              <span>Question {currentIndex + 1} of {cases.length}</span>
              <span>Current Score: {score}</span>
            </div>

            <div className="test-card-frame">
              <PhishingRenderer currentCase={currentCase} />
            </div>

            {!selectedAnswer ? (
              <div className="test-decision-controls">
                <button
                  className="decision-action-btn safe"
                  onClick={() => handleAnswer("Safe")}
                >
                  Legitimate (Safe)
                </button>
                <button
                  className="decision-action-btn phishing"
                  onClick={() => handleAnswer("Phishing")}
                >
                  Phishing Attack
                </button>
              </div>
            ) : (
              <div className="feedback-banner-card">
                <div
                  className={`feedback-status-badge ${
                    selectedAnswer === currentCase.solution ? 'correct' : 'incorrect'
                  }`}
                >
                  {selectedAnswer === currentCase.solution ? '✓ Correct Answer!' : '✗ Incorrect Evaluation!'}
                </div>
                <div className="feedback-explanation-body">
                  <strong>Why?</strong> {currentCase.explanation}
                </div>
                <button className="feedback-next-btn" onClick={handleNext}>
                  {currentIndex === cases.length - 1 ? 'Complete Test' : 'Next Question →'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="result-celebration-card">
            <h2>Test Completed</h2>
            <div className="score-circle-display">
              {score}/{cases.length}
            </div>
            <p style={{ color: '#aaa', margin: 0 }}>
              {score >= 8
                ? 'Outstanding! Your phishing awareness is top-tier.'
                : score >= 5
                ? 'Good effort, but stay vigilant on lookalike domains.'
                : 'High risk detected. Review phishing indicators carefully.'}
            </p>
            <button className="decision-action-btn phishing" onClick={() => onNavigate('my-results')}>
              View My History
            </button>
          </div>
        )}
      </main>
    </div>
  );
}