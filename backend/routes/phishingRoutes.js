const express = require('express');
const pool = require('../db/db');
const { getRandomCases } = require('../data/phishingCases');
const router = express.Router();

// Obtener un conjunto dinámico de casos para la prueba
router.get('/api/phishing/cases', (req, res) => {
  const cases = getRandomCases(10);
  res.json({ cases });
});

// Guardar resultado del test con desglose detallado
router.post('/api/phishing-test', async (req, res) => {
  const { user_id, score, total_questions = 10, details = [] } = req.body;

  if (!user_id || score == null) {
    return res.status(400).json({ error: 'Missing user_id or score' });
  }

  try {
    const insertQuery = `
      INSERT INTO tests (user_id, correct_answers, total_questions, details)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [user_id, score, total_questions, JSON.stringify(details)];
    const result = await pool.query(insertQuery, values);

    res.status(201).json({ message: 'Test result saved', test: result.rows[0] });
  } catch (err) {
    console.error('Error saving test result:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;