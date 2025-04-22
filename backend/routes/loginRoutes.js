const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db/db');
const router = express.Router();

router.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

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
      email: user.email,
      password: password,
      enterprise: user.enterprise,
      admin: user.admin
    });
    
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
