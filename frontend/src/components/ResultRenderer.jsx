import React, { useEffect, useState } from 'react';
import './ResultRenderer.css';

const ResultRenderer = ({ score = 0 }) => {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const target = (score / 10) * 100; // Convert score out of 10 to percentage
    const interval = setInterval(() => {
      setPercentage((prev) => {
        if (prev < target) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 10);
    return () => clearInterval(interval);
  }, [score]);

  const getColor = (percentage) => {
    const value = (percentage / 100) * 10; // convert back to a 0-10 scale
    if (value < 5) return '#D90101';
    if (value <= 7) return '#EBBD00';
    return '#15C900';
  };
  

  const strokeDasharray = 2 * Math.PI * 60; // Circumference of the circle
  const strokeDashoffset = strokeDasharray - (percentage / 100) * strokeDasharray;

  return (
<div className="result-container">
  <div className="score-card">
    <h2 className="result-title">Test results</h2>
    <div className="circle-wrapper">
      <svg width="150" height="150" viewBox="0 0 150 150">
        <circle
          cx="75"
          cy="75"
          r="60"
          stroke="#e6e6e6"
          strokeWidth="10"
          fill="none"
        />
        <circle
          cx="75"
          cy="75"
          r="60"
          stroke={getColor(percentage)}
          strokeWidth="10"
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <div className="score-text-centered">
        {score*10}%
      </div>
    </div>
    <p className="summary-text">You answered {score} out of 10 cases correctly</p>
    <div style={{ color: getColor(percentage) }} className="feedback-text">
      {score < 5 && "Don't give up, keep practicing!"}
      {score >= 5 && score <= 7 && "Good job! Keep practicing to improve."}
      {score > 7 && score < 10 && "Great job! You're almost there!"}
      {score === 10 && "Awesome work, you nailed it! 👑"}
    </div>
  </div>
</div>

  );
};

export default ResultRenderer;
