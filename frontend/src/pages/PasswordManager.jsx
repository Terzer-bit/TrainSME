import React, { useState, useEffect } from 'react';
import Menu from '../components/Menu';
import Service from '../components/Service';
import PasswordModal from '../components/PasswordModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './PasswordManager.css';

export default function PasswordManager({ user, onNavigate }) {
  const [services, setServices] = useState([]);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, mode: 'create', service: '' });
  const [revealedModal, setRevealedModal] = useState({ isOpen: false, text: '', service: '' });

  const fetchServices = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/password-manager/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.user_id })
      });
      const data = await res.json();
      setServices(data.services || []);
    } catch (err) {
      console.error(err);
      toast.error('Error fetching vault services');
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Copia rápida descifrando directamente
  const handleQuickCopy = async (serviceName) => {
    try {
      const masterPassword = localStorage.getItem('password');
      const res = await fetch('http://localhost:5000/api/password-manager/see', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: serviceName,
          user_id: user.user_id,
          password: masterPassword
        })
      });

      const data = await res.json();
      if (res.ok) {
        navigator.clipboard.writeText(data.subkey);
        toast.success(`Password for ${serviceName} copied to clipboard! 📋`);
      } else {
        toast.error(data.error || 'Failed to decrypt password');
      }
    } catch (err) {
      console.error(err);
      toast.error('Decryption request failed');
    }
  };

  // Ver contraseña en modal
  const handleSee = async (serviceName) => {
    try {
      const masterPassword = localStorage.getItem('password');
      const res = await fetch('http://localhost:5000/api/password-manager/see', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: serviceName,
          user_id: user.user_id,
          password: masterPassword
        })
      });

      const data = await res.json();
      if (res.ok) {
        setRevealedModal({ isOpen: true, text: data.subkey, service: serviceName });
      } else {
        toast.error(data.error || 'Failed to decrypt');
      }
    } catch (err) {
      console.error(err);
      toast.error('Decryption failed');
    }
  };

  // Eliminar servicio
  const handleDelete = async (serviceName) => {
    if (!window.confirm(`Delete password entry for ${serviceName}?`)) return;

    try {
      const res = await fetch('http://localhost:5000/api/password-manager/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service: serviceName, user_id: user.user_id })
      });

      if (res.ok) {
        toast.info(`Deleted ${serviceName}`);
        fetchServices();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Guardar (crear o actualizar)
  const handleModalConfirm = async ({ service, password, length }) => {
    const masterPassword = localStorage.getItem('password');
    const endpoint = modalConfig.mode === 'create' 
      ? 'http://localhost:5000/api/password-manager/add' 
      : 'http://localhost:5000/api/password-manager/update';
    
    const method = modalConfig.mode === 'create' ? 'POST' : 'PUT';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service,
          user_id: user.user_id,
          password: masterPassword,
          custom_password: password,
          length
        })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(modalConfig.mode === 'create' ? 'Service added successfully!' : 'Password updated!');
        setModalConfig({ isOpen: false, mode: 'create', service: '' });
        fetchServices();
      } else {
        toast.error(data.error || 'Operation failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Request failed');
    }
  };

  return (
    <div className="vault-page-layout">
      <Menu activeItem="password-manager" onNavigate={onNavigate} user={user} />

      <main className="vault-content-area">
        <h1 className="vault-header-title">AES-256-GCM Password Manager</h1>
        <p className="vault-header-desc">Zero-knowledge encrypted corporate credential storage</p>

        <div className="vault-actions-toolbar">
          <button
            className="vault-add-btn"
            onClick={() => setModalConfig({ isOpen: true, mode: 'create', service: '' })}
          >
            + Add New Account
          </button>
        </div>

        <div className="vault-services-list">
          {services.map((s) => (
            <Service
              key={s.service_id}
              serviceName={s.service_name}
              onCopy={handleQuickCopy}
              onSee={handleSee}
              onRegenerate={(srv) => setModalConfig({ isOpen: true, mode: 'update', service: srv })}
              onDelete={handleDelete}
            />
          ))}
          {services.length === 0 && (
            <p style={{ color: '#666', marginTop: '40px' }}>No passwords stored yet. Click '+ Add New Account' above.</p>
          )}
        </div>

        <PasswordModal
          isOpen={modalConfig.isOpen}
          mode={modalConfig.mode}
          initialService={modalConfig.service}
          onClose={() => setModalConfig({ isOpen: false, mode: 'create', service: '' })}
          onConfirm={handleModalConfirm}
        />

        {/* Modal de visualización */}
        {revealedModal.isOpen && (
          <div className="pwd-modal-overlay">
            <div className="pwd-modal-card" style={{ textAlign: 'center' }}>
              <h3>Password for {revealedModal.service}</h3>
              <div style={{ background: '#fff', color: '#000', padding: '12px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: 'bold' }}>
                {revealedModal.text}
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '16px' }}>
                <button
                  className="pwd-btn-confirm"
                  onClick={() => {
                    navigator.clipboard.writeText(revealedModal.text);
                    toast.success('Copied!');
                    setRevealedModal({ isOpen: false, text: '', service: '' });
                  }}
                >
                  Copy & Close
                </button>
                <button className="pwd-btn-cancel" onClick={() => setRevealedModal({ isOpen: false, text: '', service: '' })}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <ToastContainer position="top-right" autoClose={2000} theme="dark" />
      </main>
    </div>
  );
}