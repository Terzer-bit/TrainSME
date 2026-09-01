const express = require('express');
const pool = require('../db/db');
const router = express.Router();

router.get('/api/enterprise/metrics', async (req, res) => {
  const { enterprise } = req.query;

  if (!enterprise) {
    return res.status(400).json({ error: 'Missing enterprise query parameter' });
  }

  try {
    const query = `
      SELECT 
        u.user_id, 
        u.username, 
        u.first_name,
        u.last_name,
        u.email, 
        u.enterprise, 
        u.admin,
        COUNT(t.test_id)::int AS total_tests,
        COALESCE(ROUND(AVG(t.correct_answers * 10.0 / NULLIF(t.total_questions, 0)), 1), 0.0)::float AS avg_score,
        MAX(t.test_date) AS last_test_date
      FROM users u
      LEFT JOIN tests t ON u.user_id = t.user_id
      WHERE u.enterprise = $1
      GROUP BY u.user_id, u.username, u.first_name, u.last_name, u.email, u.enterprise, u.admin
      ORDER BY avg_score DESC;
    `;

    const result = await pool.query(query, [enterprise]);
    res.json({ employees: result.rows });
  } catch (err) {
    console.error('Error fetching enterprise metrics:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;