// __tests__/phishingTest.test.js

const request = require('supertest');
const pool = require('../db/db');
const app = require('../app'); // Assuming your Express app is in 'app.js'

jest.mock('../db/db'); // Mocking the DB connection

describe('Phishing Test API Tests', () => {
  // POST /api/phishing-test
  describe('POST /api/phishing-test', () => {
    it('should successfully save a test result', async () => {
      const user_id = 1;
      const score = 8;

      const mockInsertResult = {
        rows: [{
          user_id,
          correct_answers: score,
        }]
      };

      pool.query.mockResolvedValueOnce(mockInsertResult);

      const response = await request(app)
        .post('/api/phishing-test')
        .send({ user_id, score });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Test result saved');
      expect(response.body.test.user_id).toBe(user_id);
      expect(response.body.test.correct_answers).toBe(score);
    });

    it('should return 400 if user_id or score is missing', async () => {
      const response = await request(app)
        .post('/api/phishing-test')
        .send({ user_id: 1 }); // Missing score

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Missing user_id or score');
    });

    it('should return 500 if there is a database error', async () => {
      pool.query.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .post('/api/phishing-test')
        .send({ user_id: 1, score: 8 });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal server error');
    });
  });
});
