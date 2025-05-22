const request = require('supertest');
const app = require('../server'); // relative path from src/__tests__

describe('GET /', () => {
  it('should respond with 200 status code', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });
});
