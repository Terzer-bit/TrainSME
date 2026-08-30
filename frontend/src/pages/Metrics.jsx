import React, { useState, useEffect } from 'react';
import Menu from '../components/Menu';
import MyResults from './MyResults';
import './Metrics.css';

export default function Metrics({ user, onNavigate }) {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' | 'asc'
  const [inspectedUserId, setInspectedUserId] = useState(null);

  useEffect(() => {
    if (!user?.enterprise) return;

    fetch(`http://localhost:5000/api/enterprise/metrics?enterprise=${encodeURIComponent(user.enterprise)}`)
      .then((res) => res.json())
      .then((data) => setEmployees(data.employees || []))
      .catch((err) => console.error(err));
  }, [user]);

  if (inspectedUserId) {
    return (
      <div className="metrics-view-layout">
        <Menu activeItem="metrics" onNavigate={onNavigate} user={user} />
        <MyResults
          user={user}
          overrideUserId={inspectedUserId}
          onBack={() => setInspectedUserId(null)}
        />
      </div>
    );
  }

  const filteredEmployees = employees
    .filter((emp) =>
      emp.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      return sortOrder === 'desc' ? b.avg_score - a.avg_score : a.avg_score - b.avg_score;
    });

  return (
    <div className="metrics-view-layout">
      <Menu activeItem="metrics" onNavigate={onNavigate} user={user} />

      <main className="metrics-content-area">
        <div className="results-section-header">
          <h1 className="results-title">Enterprise Metrics — {user?.enterprise}</h1>
        </div>

        <div className="metrics-controls-bar">
          <input
            type="text"
            placeholder="Search employee by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="employee-search-box"
          />

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="employee-sort-select"
          >
            <option value="desc">Sort: Highest Average Score First</option>
            <option value="asc">Sort: Lowest Average Score First</option>
          </select>
        </div>

        <div className="history-table-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Email</th>
                <th>Total Tests Done</th>
                <th>Avg. Score (0-10)</th>
                <th>Last Active</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => (
                <tr
                  key={emp.user_id}
                  className="history-row-clickable"
                  onClick={() => setInspectedUserId(emp.user_id)}
                >
                  <td style={{ fontWeight: 'bold' }}>{emp.username}</td>
                  <td style={{ color: '#a1a1aa' }}>{emp.email}</td>
                  <td>{emp.total_tests}</td>
                  <td>
                    <span
                      className={`badge-score ${
                        emp.avg_score >= 8 ? 'high' : emp.avg_score >= 5 ? 'medium' : 'low'
                      }`}
                    >
                      {emp.avg_score.toFixed(1)} / 10
                    </span>
                  </td>
                  <td>{emp.last_test_date ? new Date(emp.last_test_date).toLocaleDateString() : 'Never'}</td>
                  <td style={{ color: '#d9232d', fontWeight: 'bold' }}>View Results →</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}