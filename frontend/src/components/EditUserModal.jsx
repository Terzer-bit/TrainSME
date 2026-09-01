import React, { useState, useEffect } from 'react';
import './EditUserModal.css';

export default function EditUserModal({ isOpen, employee, onClose, onSave, onDelete }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    admin: false
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (employee) {
      setFormData({
        first_name: employee.first_name || '',
        last_name: employee.last_name || '',
        username: employee.username || '',
        email: employee.email || '',
        admin: Boolean(employee.admin)
      });
      setErrorMsg('');
      setShowDeleteConfirm(false);
    }
  }, [employee]);

  if (!isOpen || !employee) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.first_name.trim() || !formData.last_name.trim() || !formData.username.trim() || !formData.email.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setLoading(true);
    try {
      await onSave({
        user_id: employee.user_id,
        ...formData
      });
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update user.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(employee.user_id, employee.username);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to delete user.');
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const employeeFullName = employee.first_name && employee.last_name
    ? `${employee.first_name} ${employee.last_name}`
    : `@${employee.username}`;

  return (
    <>
      <div className="edit-user-modal-overlay" onClick={onClose}>
        <div className="edit-user-modal-card" onClick={(e) => e.stopPropagation()}>
          <div className="edit-user-modal-header">
            <h3 className="edit-user-modal-title">
              Edit Employee #{employee.user_id}
            </h3>
            <button className="edit-user-modal-close" onClick={onClose}>✕</button>
          </div>

          <form onSubmit={handleSubmit} className="edit-user-form">
            <div className="edit-user-names-row">
              <div className="edit-input-group">
                <label className="edit-label">First Name *</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  className="edit-input"
                />
              </div>
              <div className="edit-input-group">
                <label className="edit-label">Last Name *</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  className="edit-input"
                />
              </div>
            </div>

            <div className="edit-input-group">
              <label className="edit-label">Username *</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="edit-input"
              />
            </div>

            <div className="edit-input-group">
              <label className="edit-label">Work Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="edit-input"
              />
            </div>

            <div className="edit-admin-toggle-wrapper">
              <label className="edit-admin-checkbox-label">
                <input
                  type="checkbox"
                  name="admin"
                  checked={formData.admin}
                  onChange={handleChange}
                  className="edit-admin-checkbox"
                />
                <span className="edit-admin-label-text">
                  Grant Administrator Privileges (Full Metrics & User Access)
                </span>
              </label>
            </div>

            {errorMsg && <div className="edit-error-banner">{errorMsg}</div>}

            <div className="edit-user-modal-actions">
              <button
                type="button"
                className="edit-btn-danger"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={loading || deleting}
              >
                Delete User
              </button>

              <div className="edit-right-actions">
                <button
                  type="button"
                  className="edit-btn-cancel"
                  onClick={onClose}
                  disabled={loading || deleting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="edit-btn-save"
                  disabled={loading || deleting}
                >
                  {loading ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteConfirm && (
        <div className="delete-confirm-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="delete-confirm-card" onClick={(e) => e.stopPropagation()}>
            <div className="delete-warning-icon">⚠️</div>
            <h3 className="delete-confirm-title">Delete Employee Account?</h3>
            <p className="delete-confirm-text">
              Are you sure you want to permanently delete <strong>{employeeFullName}</strong> (<code>@{employee.username}</code>)?
            </p>
            <p className="delete-sub-warning">
              This action cannot be undone. All test results, metrics, and vaulted passwords associated with this user will be permanently removed.
            </p>

            <div className="delete-confirm-actions">
              <button
                type="button"
                className="btn-cancel-delete"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-confirm-delete"
                onClick={handleConfirmDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Yes, Delete Employee'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}