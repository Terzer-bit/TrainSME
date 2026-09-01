import React, { useState, useEffect } from 'react';
import Menu from '../components/Menu';
import MyResults from './MyResults';
import EditUserModal from '../components/EditUserModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Metrics.css';

export default function Metrics({ user, onNavigate }) {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('name-asc'); // 'name-asc' | 'name-desc' | 'score-desc' | 'score-asc'
  const [inspectedUserId, setInspectedUserId] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const fetchEmployees = () => {
    if (!user?.enterprise) return;

    fetch(`http://localhost:5000/api/enterprise/metrics?enterprise=${encodeURIComponent(user.enterprise)}`)
      .then((res) => res.json())
      .then((data) => setEmployees(data.employees || []))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchEmployees();
  }, [user]);

  // Guardar edición del usuario desde el modal
  const handleSaveUser = async (updatedData) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${updatedData.user_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });

      const data = await res.json();
      if (res.ok) {
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.user_id === updatedData.user_id
              ? { ...emp, ...data.user }
              : emp
          )
        );
        toast.success(`User @${data.user.username} updated successfully!`);
        setEditingEmployee(null);

        // Si el admin editó su propio perfil, actualizamos localStorage
        if (updatedData.user_id === user.user_id) {
          localStorage.setItem('username', data.user.username);
          localStorage.setItem('first_name', data.user.first_name);
          localStorage.setItem('last_name', data.user.last_name);
          localStorage.setItem('email', data.user.email);
          localStorage.setItem('admin', String(data.user.admin));
        }
      } else {
        toast.error(data.error || 'Failed to update user');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error updating user information');
    }
  };

  // Eliminar usuario permanentemente
  const handleDeleteUser = async (targetUserId, empUsername) => {
    if (targetUserId === user.user_id) {
      toast.error("You cannot delete your own active administrator account.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/users/${targetUserId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await res.json();
      if (res.ok) {
        setEmployees((prev) => prev.filter((emp) => emp.user_id !== targetUserId));
        toast.info(`Employee @${empUsername} has been permanently deleted.`);
        setEditingEmployee(null);
      } else {
        toast.error(data.error || 'Failed to delete employee account.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error deleting user');
    }
  };

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

  // Filtrado y ordenación con soporte A-Z, Z-A y puntuación
  const filteredEmployees = employees
    .filter((emp) => {
      const fullName = `${emp.last_name || ''} ${emp.first_name || ''}`.toLowerCase();
      const username = (emp.username || '').toLowerCase();
      const email = (emp.email || '').toLowerCase();
      const query = searchQuery.toLowerCase();
      return fullName.includes(query) || username.includes(query) || email.includes(query);
    })
    .sort((a, b) => {
      const nameA = (a.last_name && a.first_name ? `${a.last_name}, ${a.first_name}` : a.username || '').toLowerCase();
      const nameB = (b.last_name && b.first_name ? `${b.last_name}, ${b.first_name}` : b.username || '').toLowerCase();

      if (sortOrder === 'name-asc') {
        return nameA.localeCompare(nameB);
      } else if (sortOrder === 'name-desc') {
        return nameB.localeCompare(nameA);
      } else if (sortOrder === 'score-desc') {
        return b.avg_score - a.avg_score;
      } else if (sortOrder === 'score-asc') {
        return a.avg_score - b.avg_score;
      }
      return 0;
    });

  return (
    <div className="metrics-view-layout">
      <Menu activeItem="metrics" onNavigate={onNavigate} user={user} />

      <main className="metrics-content-area">
        <div className="results-section-header">
          <h1 className="results-title">Enterprise Metrics & Access Management</h1>
          <p style={{ color: '#71717a', margin: '4px 0 0 0' }}>Organization: {user?.enterprise}</p>
        </div>

        <div className="metrics-controls-bar">
          <input
            type="text"
            placeholder="Search by name, last name, username or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="employee-search-box"
          />

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="employee-sort-select"
          >
            <option value="name-asc">Sort: Employee Name (A → Z)</option>
            <option value="name-desc">Sort: Employee Name (Z → A)</option>
            <option value="score-desc">Sort: Highest Average Score First</option>
            <option value="score-asc">Sort: Lowest Average Score First</option>
          </select>
        </div>

        <div className="history-table-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>Employee (Last Name, Name)</th>
                <th>Work Email</th>
                <th>Total Tests</th>
                <th>Avg. Score (0-10)</th>
                <th>Last Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => {
                const formattedName = emp.last_name && emp.first_name
                  ? `${emp.last_name}, ${emp.first_name}`
                  : emp.username;

                return (
                  <tr
                    key={emp.user_id}
                    className="history-row-clickable"
                    onClick={() => setInspectedUserId(emp.user_id)}
                  >
                    <td style={{ fontWeight: 'bold' }}>
                      {formattedName}
                      <span className="username-subtext">@{emp.username}</span>
                    </td>
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
                    
                    {/* Botones de acción: Editar y Ver Resultados */}
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="table-actions-group">
                        <button
                          className="action-btn-edit"
                          title="Edit employee details"
                          onClick={() => setEditingEmployee(emp)}
                        >
                          ✎ Edit
                        </button>
                        <button
                          className="action-btn-view"
                          title="View test performance history"
                          onClick={() => setInspectedUserId(emp.user_id)}
                        >
                          Results →
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: '#71717a', padding: '24px' }}>
                    No employees found matching the search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal de edición y eliminación de usuario */}
        <EditUserModal
          isOpen={!!editingEmployee}
          employee={editingEmployee}
          onClose={() => setEditingEmployee(null)}
          onSave={handleSaveUser}
          onDelete={handleDeleteUser}
        />

        <ToastContainer position="top-right" autoClose={2500} theme="dark" />
      </main>
    </div>
  );
}