const request = require('supertest');
const app = require('../src/app'); // juste l'app express

describe('API Routes', () => {
  test('GET /api/status retourne 200', async () => {
    const res = await request(app).get('/api/status');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('GET /api/services retourne liste', async () => {
    const res = await request(app).get('/api/services');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
