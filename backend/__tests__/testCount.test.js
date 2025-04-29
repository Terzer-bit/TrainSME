const request = require('supertest');
const app = require('../app'); // Your express app

// Mock the database
jest.mock('../db/db', () => ({
  query: jest.fn(), // Mock the query method
}));

const { query } = require('../db/db'); // Import the mocked query function

describe('Integration test for /api/phishing-test and /api/metrics', () => {
  const userId = 2;

  it('should insert 5 tests and verify total count increases accordingly', async () => {
    // Initial mock response: no tests in DB for user_id 2
    query.mockResolvedValueOnce({
      rows: [] // No tests initially, should return an empty array
    });

    // Call the /api/metrics endpoint to verify initial count
    const initialCount = await request(app)
      .post('/api/metrics')
      .send({ user_id: userId });
    expect(initialCount.statusCode).toBe(200);
    expect(initialCount.body.tests.length).toBe(0); // No tests initially

    // Mock inserting 5 test records in the database
    query.mockResolvedValueOnce({
      rows: [{ test_id: 1, correct_answers: 1, test_date: '2021-01-01' }]
    }).mockResolvedValueOnce({
      rows: [{ test_id: 2, correct_answers: 2, test_date: '2021-01-02' }]
    }).mockResolvedValueOnce({
      rows: [{ test_id: 3, correct_answers: 3, test_date: '2021-01-03' }]
    }).mockResolvedValueOnce({
      rows: [{ test_id: 4, correct_answers: 4, test_date: '2021-01-04' }]
    }).mockResolvedValueOnce({
      rows: [{ test_id: 5, correct_answers: 5, test_date: '2021-01-05' }]
    });

    const testScores = [1, 2, 3, 4, 5];
    for (let score of testScores) {
      const response = await request(app)
        .post('/api/phishing-test')
        .send({ user_id: userId, score });

      expect(response.statusCode).toBe(201);
      expect(response.body.test).toHaveProperty('correct_answers', score);
    }

    // Now mock the response for /api/metrics with 5 inserted tests
    query.mockResolvedValueOnce({
      rows: [
        { test_id: 1, correct_answers: 1, test_date: '2021-01-01' },
        { test_id: 2, correct_answers: 2, test_date: '2021-01-02' },
        { test_id: 3, correct_answers: 3, test_date: '2021-01-03' },
        { test_id: 4, correct_answers: 4, test_date: '2021-01-04' },
        { test_id: 5, correct_answers: 5, test_date: '2021-01-05' }
      ]
    });

    // Fetch metrics after inserting the tests
    const metricsResponse = await request(app)
      .post('/api/metrics')
      .send({ user_id: userId });

    expect(metricsResponse.statusCode).toBe(200);
    expect(metricsResponse.body.tests.length).toBe(5); // Should return 5 tests
  });
});
