const express = require('express');
const pool = require('../db/db');
const { generateRandomSubkey, cipherSubkeyGCM, decipherSubkeyGCM } = require('../utils/crypto');
const router = express.Router();

// Listar servicios de un usuario
router.post('/api/password-manager/services', async (req, res) => {
  const { user_id } = req.body;
  if (!user_id) return res.status(400).json({ error: 'Missing user_id' });

  try {
    const result = await pool.query(
      `SELECT service_id, service_name, created_at, updated_at
       FROM services
       WHERE user_id = $1
       ORDER BY service_name ASC`,
      [user_id]
    );

    return res.json({ services: result.rows });
  } catch (error) {
    console.error('Error fetching services:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Guardar servicio nuevo
router.post('/api/password-manager/add', async (req, res) => {
  const { service, user_id, password, custom_password, length = 16 } = req.body;

  if (!service || !user_id || !password) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const plaintextSubkey = custom_password && custom_password.trim().length > 0
    ? custom_password.trim()
    : generateRandomSubkey(Number(length));

  try {
    const { cipheredSubkey, iv, salt, authTag } = cipherSubkeyGCM(password, plaintextSubkey);

    const insertQuery = `
      INSERT INTO services (service_name, user_id, salt, iv, auth_tag, subkey)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING service_id, service_name;
    `;
    const values = [service.trim(), user_id, salt, iv, authTag, cipheredSubkey];
    const result = await pool.query(insertQuery, values);

    res.status(201).json({ message: 'Service saved', service: result.rows[0], generatedPassword: plaintextSubkey });
  } catch (err) {
    console.error('Error adding service:', err);
    if (err.code === '23505') {
      return res.status(409).json({ error: 'A service with this name already exists.' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Editar servicio (Renombrar nombre y/o actualizar contraseña)
router.put('/api/password-manager/update', async (req, res) => {
  const { old_service, service, new_service, user_id, password, custom_password, length = 16 } = req.body;

  const targetServiceName = (old_service || service || '').trim();
  const updatedServiceName = (new_service || service || old_service || '').trim();

  if (!targetServiceName || !user_id) {
    return res.status(400).json({ error: 'Missing target service name or user_id' });
  }

  if (!updatedServiceName) {
    return res.status(400).json({ error: 'Service name cannot be empty' });
  }

  try {
    // 1. Obtener el servicio actual
    const existing = await pool.query(
      'SELECT service_id, service_name, salt, iv, auth_tag, subkey FROM services WHERE service_name = $1 AND user_id = $2',
      [targetServiceName, user_id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const currentRecord = existing.rows[0];

    // 2. Si se renombra, verificar que el nuevo nombre no esté ya en uso
    if (updatedServiceName.toLowerCase() !== targetServiceName.toLowerCase()) {
      const conflict = await pool.query(
        'SELECT service_id FROM services WHERE LOWER(service_name) = LOWER($1) AND user_id = $2 AND service_id != $3',
        [updatedServiceName, user_id, currentRecord.service_id]
      );
      if (conflict.rows.length > 0) {
        return res.status(409).json({ error: `A service named "${updatedServiceName}" already exists.` });
      }
    }

    // 3. Determinar si se actualiza la contraseña o se mantiene la actual
    let newSalt = currentRecord.salt;
    let newIv = currentRecord.iv;
    let newAuthTag = currentRecord.auth_tag;
    let newSubkey = currentRecord.subkey;
    let generatedPassword = null;

    // Si se envió una nueva contraseña (no vacía)
    if (custom_password && custom_password.trim().length > 0) {
      if (!password) {
        return res.status(400).json({ error: 'Master password is required to encrypt the new password' });
      }
      const plaintext = custom_password.trim();
      const encrypted = cipherSubkeyGCM(password, plaintext);
      newSalt = encrypted.salt;
      newIv = encrypted.iv;
      newAuthTag = encrypted.authTag;
      newSubkey = encrypted.cipheredSubkey;
      generatedPassword = plaintext;
    }

    // 4. Actualizar en base de datos
    const updateQuery = `
      UPDATE services
      SET service_name = $1,
          salt = $2,
          iv = $3,
          auth_tag = $4,
          subkey = $5,
          updated_at = NOW()
      WHERE service_id = $6
      RETURNING service_id, service_name, updated_at;
    `;
    const values = [updatedServiceName, newSalt, newIv, newAuthTag, newSubkey, currentRecord.service_id];
    const result = await pool.query(updateQuery, values);

    res.status(200).json({
      message: 'Service updated successfully',
      service: result.rows[0],
      updatedPassword: generatedPassword
    });
  } catch (err) {
    console.error('Error updating service:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Ver y descifrar contraseña
router.post('/api/password-manager/see', async (req, res) => {
  const { service, user_id, password } = req.body;

  if (!service || !user_id || !password) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const selectQuery = `
      SELECT salt, iv, auth_tag, subkey 
      FROM services 
      WHERE service_name = $1 AND user_id = $2
      LIMIT 1;
    `;
    const result = await pool.query(selectQuery, [service, user_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found for this user' });
    }

    const { salt, iv, auth_tag, subkey: cipheredSubkey } = result.rows[0];
    const decryptedSubkey = decipherSubkeyGCM(password, salt, iv, auth_tag, cipheredSubkey);

    res.status(200).json({ subkey: decryptedSubkey });
  } catch (err) {
    console.error('Error decrypting service password:', err);
    res.status(500).json({ error: 'Decryption failed. Invalid master password or corrupted data.' });
  }
});

// Eliminar servicio
router.delete('/api/password-manager/delete', async (req, res) => {
  const { service, user_id } = req.body;

  if (!service || !user_id) {
    return res.status(400).json({ error: 'Missing user_id or service name' });
  }

  try {
    const deleteQuery = `DELETE FROM services WHERE service_name = $1 AND user_id = $2 RETURNING *;`;
    const result = await pool.query(deleteQuery, [service, user_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Service not found or already deleted' });
    }

    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (err) {
    console.error('Error deleting service:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;