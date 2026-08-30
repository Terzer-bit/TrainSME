const express = require('express');
const pool = require('../db/db');
const router = express.Router();

// Obtener histórico de tests de un usuario específico
router.post('/api/metrics', async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'Missing user_id' });
  }

  try {
    const result = await pool.query(
      `SELECT test_id, correct_answers, total_questions, test_date, details
       FROM tests
       WHERE user_id = $1
       ORDER BY test_date DESC`,
      [user_id]
    );

    return res.json({ tests: result.rows });
  } catch (error) {
    console.error('Error fetching user metrics:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;