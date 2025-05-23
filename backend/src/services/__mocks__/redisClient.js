const store = new Map();

module.exports = {
  on: jest.fn((event, callback) => {
    if (event === 'error') return;
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
