const request = require('supertest');
const app = require('../server.js');  // Adjust relative path if needed

describe('GET /', () => {
  it('responds with 200', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });
});
