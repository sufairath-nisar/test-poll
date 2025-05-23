const request = require('supertest');
const app = require('../server');

jest.mock('../services/redisClient.js', () => {
  const store = new Map();

  return {
    on: jest.fn((event, callback) => {
      if (event === 'error') {
          return;
      }
    }),
    get: jest.fn((key) => Promise.resolve(store.get(key) || null)),
    set: jest.fn((key, value) => {
      store.set(key, value);
      return Promise.resolve('OK');
    }),
    incr: jest.fn((key) => {
      let current = parseInt(store.get(key) || '0', 10);
      current += 1;
      store.set(key, current.toString());
      return Promise.resolve(current);
    }),
    expire: jest.fn(() => Promise.resolve(1)),
    del: jest.fn((key) => {
      store.delete(key);
      return Promise.resolve(1);
    }),
  };
});

describe('Poll lifecycle integration test', () => {
   let token;
 
  it('should get anonymous JWT token', async () => {
    console.log('Starting anonymous token test');
    const res = await request(app).post('/api/auth/anon');
    console.log('Response received:', res.statusCode);
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

 it('should create a poll', async () => {
    const createRes = await request(app)
      .post('/api/polls')
      .set('Authorization', `Bearer ${token}`)
      .send({
        question: 'Sample?',
        options: ['Yes', 'No'],
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      });

    console.log('Create poll status:', createRes.statusCode);
    console.log('Create poll response body:', createRes.body);
  });

});

