const express = require('express');
const pool = require('../db/db');
const router = express.Router();

router.post('/api/phishing-test', async (req, res) => {
    const { user_id, score } = req.body;
  
    if (!user_id || score == null) {
      return res.status(400).json({ error: 'Missing user_id or score' });
    }
  
    try {
      const insertQuery = `
        INSERT INTO tests (user_id, correct_answers)
        VALUES ($1, $2)
        RETURNING *;
      `;
      const values = [user_id, score];
      const result = await pool.query(insertQuery, values);
  
      res.status(201).json({ message: 'Test result saved', test: result.rows[0] });
      
    } catch (err) {
      console.error('Error saving test result:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

module.exports = router;