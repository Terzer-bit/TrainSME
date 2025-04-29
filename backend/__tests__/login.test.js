// __tests__/login.test.js
const request = require('supertest');
const app = require('../app'); // No server start here, app is exported
const pool = require('../db/db');
const bcrypt = require('bcryptjs'); // Make sure bcrypt is imported

jest.mock('../db/db');
jest.mock('bcryptjs'); // Ensure bcrypt is properly mocked

describe('POST /api/login', () => {
  it('should return a successful login response with correct credentials', async () => {
    // Mock database response
    const mockUser = { user_id: 1, username: 'testuser', hashed_password: 'hashedPassword' };
    pool.query.mockResolvedValueOnce({ rows: [mockUser] });

    // Mock bcrypt comparison success
    bcrypt.compare.mockResolvedValue(true); // Mock bcrypt to return true for password comparison

    const response = await request(app)
      .post('/api/login')
      .send({ username: 'testuser', password: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Successful login');
  });

  it('should return 401 for incorrect username', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] }); // Simulate no user found

    const response = await request(app)
      .post('/api/login')
      .send({ username: 'wronguser', password: 'password123' });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Incorrect username or password');
  });

  it('should return 401 for incorrect password', async () => {
    const mockUser = { user_id: 1, username: 'testuser', hashed_password: 'hashedPassword' };
    pool.query.mockResolvedValueOnce({ rows: [mockUser] });

    bcrypt.compare.mockResolvedValue(false); // Simulate password mismatch

    const response = await request(app)
      .post('/api/login')
      .send({ username: 'testuser', password: 'wrongpassword' });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Incorrect username or password');
  });
});
