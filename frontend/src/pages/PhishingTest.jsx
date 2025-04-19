// PhishingTest.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PhishingTest.css';
import Menu from '../components/Menu';
import PhishingRenderer from '../components/PhishingRenderer';
import Modal from '../components/Modal';
import { emailCases } from '../utils/cases';
import ResultRenderer from '../components/ResultRenderer';

function PhishingTest() {

  const [testCases, setTestCases] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [userInfo, setUserInfo] = useState({
      user_id: '',
      username: '',
      email: ''
    });
  const [finished, setFinished] = useState(false);

  const navigate = useNavigate();
  
  // Helper to get 10 random, non-repeating cases
  function getRandomSubset(arr, count) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // Run once on mount
  useEffect(() => {
    setFinished(false);
    const cases = getRandomSubset(emailCases, 10);
    setTestCases(cases);

    const user_id = localStorage.getItem('user_id');
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    if (username && email) {
      setUserInfo({ user_id, username, email });
    }
  }, []);

  const currentCase = testCases[currentIndex];

  const handleAnswer = (answer) => {
    const isCorrect = answer === currentCase.solution;

    if (isCorrect) setScore(prev => prev + 1);
    setSelectedAnswer(answer);
    setShowModal(true);
  };

  // Insert test results to the database and activate the results component
  const handleResults = async () => {
    setFinished(true);
    const user_id = parseInt(userInfo.user_id);
    const res = await fetch('http://localhost:5000/api/phishing-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, score })
    });
  }

  const handleNext = () => {
    if (currentIndex === testCases.length - 1) {
      handleResults();
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
    }
    setShowModal(false);
  };  

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="phishing-test-page">
      <Menu />
      {!finished ? (
        <div className="phishing-test-content">
          <div className="email-container">
            <PhishingRenderer currentCase={currentCase} />
          </div>


          {!selectedAnswer ? (
            <div className="decision-buttons">
              <button className="decision-button safe-button" onClick={() => handleAnswer("Safe")}>Safe</button>
              <button className="decision-button phishing-button" onClick={() => handleAnswer("Phishing")}>Phishing</button>
            </div>
          ) : (
            <div className="feedback-section">
              <p className={selectedAnswer === currentCase.solution ? 'correct-answer' : 'incorrect-answer'}>
                {selectedAnswer === currentCase.solution ? 'Correct!' : 'Incorrect!'}
              </p>
              <button className="decision-button phishing-button" onClick={handleNext}>Next</button>
            </div>
          )}
          {showModal && (
            <Modal
              explanation={currentCase.explanation}
              onClose={handleCloseModal}
            />
          )}

        </div>
      ):(
        <ResultRenderer score={score} />
      )}  
    </div>
  );
}

export default PhishingTest;