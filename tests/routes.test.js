import request from 'supertest';
import app from '../src/app.js'; // Remarquez le .js obligatoire avec ESModules

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
