const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db/db');
const router = express.Router();

// 1. Inicio de Sesión
router.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $1',
      [username.trim()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Incorrect username or password' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.hashed_password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect username or password' });
    }

    res.json({
      message: 'Successful login',
      user_id: user.user_id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      password: password, // Mantenido en memoria para derivar claves del password manager
      enterprise: user.enterprise,
      admin: user.admin
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. Registro de Usuario (No administrador por defecto)
router.post('/api/register', async (req, res) => {
  const { first_name, last_name, username, email, password, enterprise } = req.body;

  if (!first_name || !last_name || !username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  const userEnterprise = (enterprise && enterprise.trim()) || 'Cookies.SA';

  try {
    const existing = await pool.query(
      'SELECT username, email FROM users WHERE username = $1 OR email = $2',
      [username.trim(), email.trim().toLowerCase()]
    );

    if (existing.rows.length > 0) {
      if (existing.rows[0].username === username.trim()) {
        return res.status(409).json({ error: 'Username is already taken' });
      }
      return res.status(409).json({ error: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertQuery = `
      INSERT INTO users (first_name, last_name, username, email, hashed_password, enterprise, admin)
      VALUES ($1, $2, $3, $4, $5, $6, false)
      RETURNING user_id, first_name, last_name, username, email, enterprise, admin;
    `;
    const values = [
      first_name.trim(),
      last_name.trim(),
      username.trim(),
      email.trim().toLowerCase(),
      hashedPassword,
      userEnterprise
    ];
    const result = await pool.query(insertQuery, values);

    const newUser = result.rows[0];
    res.status(201).json({
      message: 'User registered successfully',
      user_id: newUser.user_id,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      username: newUser.username,
      email: newUser.email,
      enterprise: newUser.enterprise,
      admin: newUser.admin,
      password: password
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
});

// 3. Modificar rol de administrador
router.put('/api/users/:user_id/admin', async (req, res) => {
  const { user_id } = req.params;
  const { admin } = req.body;

  if (admin === undefined) {
    return res.status(400).json({ error: 'Admin status value is required' });
  }

  try {
    const updateQuery = `
      UPDATE users
      SET admin = $1
      WHERE user_id = $2
      RETURNING user_id, username, first_name, last_name, admin;
    `;
    const result = await pool.query(updateQuery, [Boolean(admin), user_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'User admin status updated successfully',
      user: result.rows[0]
    });
  } catch (err) {
    console.error('Error updating admin status:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 4. Modificar información del usuario (Sin campo enterprise)
router.put('/api/users/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const { first_name, last_name, username, email, admin } = req.body;

  if (!first_name || !last_name || !username || !email) {
    return res.status(400).json({ error: 'First name, last name, username, and email are required.' });
  }

  try {
    // Comprobar si otro usuario ya utiliza ese username o email
    const conflict = await pool.query(
      'SELECT user_id, username, email FROM users WHERE (username = $1 OR email = $2) AND user_id != $3',
      [username.trim(), email.trim().toLowerCase(), user_id]
    );

    if (conflict.rows.length > 0) {
      if (conflict.rows[0].username === username.trim()) {
        return res.status(409).json({ error: 'Username is already in use by another account.' });
      }
      return res.status(409).json({ error: 'Email is already registered by another account.' });
    }

    const updateQuery = `
      UPDATE users
      SET first_name = $1,
          last_name = $2,
          username = $3,
          email = $4,
          admin = COALESCE($5, admin)
      WHERE user_id = $6
      RETURNING user_id, first_name, last_name, username, email, enterprise, admin;
    `;
    const values = [
      first_name.trim(),
      last_name.trim(),
      username.trim(),
      email.trim().toLowerCase(),
      admin !== undefined ? Boolean(admin) : null,
      user_id
    ];

    const result = await pool.query(updateQuery, values);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({
      message: 'User information updated successfully',
      user: result.rows[0]
    });
  } catch (err) {
    console.error('Error updating user information:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 5. Eliminar usuario permanentemente
router.delete('/api/users/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    const deleteQuery = `
      DELETE FROM users
      WHERE user_id = $1
      RETURNING user_id, username, first_name, last_name;
    `;
    const result = await pool.query(deleteQuery, [user_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({
      message: 'User deleted successfully',
      deletedUser: result.rows[0]
    });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Internal server error while deleting user.' });
  }
});

module.exports = router;