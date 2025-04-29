const request = require('supertest');
const pool = require('../db/db');
const app = require('../app'); // Assuming the Express app is in this file

jest.mock('../db/db');  // Mocking the DB connection

describe('POST /api/metrics', () => {
  it('should return test metrics for a valid user_id', async () => {
    const user_id = 1;
    const mockTests = [
      { test_id: 1, correct_answers: 8, test_date: '2022-01-01' },
      { test_id: 2, correct_answers: 10, test_date: '2022-02-01' },
    ];

    pool.query.mockResolvedValueOnce({ rows: mockTests });

    const response = await request(app)
      .post('/api/metrics')
      .send({ user_id });

    expect(response.status).toBe(200);
    expect(response.body.tests).toEqual(mockTests);
  });

  it('should return 400 if user_id is missing', async () => {
    const response = await request(app)
      .post('/api/metrics')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Missing user_id');
  });

  it('should return 500 if there is a database error', async () => {
    pool.query.mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app)
      .post('/api/metrics')
      .send({ user_id: 1 });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Internal server error');
  });
});
