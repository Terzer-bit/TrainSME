import React, { useState, useEffect } from 'react';
import Menu from '../components/Menu';
import TestDetailModal from '../components/TestDetailModal';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './MyResults.css';

export default function MyResults({ user, onNavigate, overrideUserId = null, onBack = null }) {
  const [tests, setTests] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [currentCalMonth, setCurrentCalMonth] = useState(new Date().getMonth());
  const [currentCalYear, setCurrentCalYear] = useState(new Date().getFullYear());

  const targetUserId = overrideUserId || user.user_id;

  useEffect(() => {
    fetch('http://localhost:5000/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: targetUserId })
    })
      .then((res) => res.json())
      .then((data) => {
        const testList = data.tests || [];
        setTests(testList);

        // Formato anual
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const counts = months.map((m) => ({ name: m, tests: 0 }));

        testList.forEach((t) => {
          const d = new Date(t.test_date);
          counts[d.getMonth()].tests += 1;
        });

        setChartData(counts);
      })
      .catch((err) => console.error(err));
  }, [targetUserId]);

  // Días con test en el mes seleccionado
  const daysWithTests = new Set(
    tests
      .filter((t) => {
        const d = new Date(t.test_date);
        return d.getMonth() === currentCalMonth && d.getFullYear() === currentCalYear;
      })
      .map((t) => new Date(t.test_date).getDate())
  );

  const daysInMonth = new Date(currentCalYear, currentCalMonth + 1, 0).getDate();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="results-page-layout">
      {!overrideUserId && <Menu activeItem="my-results" onNavigate={onNavigate} user={user} />}

      <main className="results-content-scroll">
        <div className="results-section-header">
          {onBack && (
            <button className="cal-nav-btn" style={{ marginBottom: '10px' }} onClick={onBack}>
              ← Back to Employee List
            </button>
          )}
          <h1 className="results-title">
            {overrideUserId ? `Test History — Employee #${overrideUserId}` : 'My Test Results'}
          </h1>
        </div>

        <div className="results-top-grid">
          {/* Gráfico Anual */}
          <div className="results-card-container">
            <h3 className="card-inner-title">Annual Activity</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" />
                <YAxis stroke="#71717a" allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', color: '#fff' }}
                />
                <Bar dataKey="tests" fill="#d9232d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Calendario */}
          <div className="results-card-container">
            <div className="calendar-widget-header">
              <span style={{ fontWeight: 'bold', color: '#fff' }}>
                {monthNames[currentCalMonth]} {currentCalYear}
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  className="cal-nav-btn"
                  onClick={() => setCurrentCalMonth((prev) => (prev === 0 ? 11 : prev - 1))}
                >
                  ←
                </button>
                <button
                  className="cal-nav-btn"
                  onClick={() => setCurrentCalMonth((prev) => (prev === 11 ? 0 : prev + 1))}
                >
                  →
                </button>
              </div>
            </div>

            <div className="calendar-days-grid">
              {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => (
                <div key={d} className="cal-day-label">{d}</div>
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const hasTest = daysWithTests.has(dayNum);
                return (
                  <div key={dayNum} className={`cal-cell ${hasTest ? 'has-test' : ''}`}>
                    {dayNum}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tabla de Historial */}
        <div className="history-table-wrapper">
          <h3 className="card-inner-title">Historical Tests Breakdown (Click row to inspect)</h3>
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Score</th>
                <th>Performance</th>
                <th>Questions</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((t) => {
                const pct = (t.correct_answers / (t.total_questions || 10)) * 100;
                const badgeClass = pct >= 80 ? 'high' : pct >= 50 ? 'medium' : 'low';
                return (
                  <tr
                    key={t.test_id}
                    className="history-row-clickable"
                    onClick={() => setSelectedTest(t)}
                  >
                    <td>{new Date(t.test_date).toLocaleString()}</td>
                    <td>{t.correct_answers} / {t.total_questions || 10}</td>
                    <td>
                      <span className={`badge-score ${badgeClass}`}>{pct.toFixed(0)}%</span>
                    </td>
                    <td style={{ color: '#d9232d', fontWeight: 'bold' }}>Inspect Details →</td>
                  </tr>
                );
              })}
              {tests.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', color: '#71717a' }}>
                    No tests completed yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {selectedTest && (
          <TestDetailModal test={selectedTest} onClose={() => setSelectedTest(null)} />
        )}
      </main>
    </div>
  );
}