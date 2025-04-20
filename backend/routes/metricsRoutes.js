const express = require('express');
const pool = require('../db/db');
const router = express.Router();

router.post('/api/metrics', async (req, res) => {
    const { user_id } = req.body;
  
    if (!user_id) {
      return res.status(400).json({ error: 'Missing user_id' });
    }
  
    try {
      const result = await pool.query(
        `SELECT test_id, correct_answers, test_date
         FROM tests
         WHERE user_id = $1`,
        [user_id]
      );
  
      return res.json({ tests: result.rows });
    } catch (error) {
      console.error('Error fetching services:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  module.exports = router;