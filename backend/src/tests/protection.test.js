const request = require('supertest');
const app = require('../app');

// Obtiene un token válido haciendo login
const obtenerToken = async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'tienda@rapiti.com', password: '12345678' });
  return res.body.token;
};

// ─── GET /api/productos ───────────────────────────────────────────────────────

describe('GET /api/productos — protección por autenticación', () => {

  it('devuelve 401 sin token', async () => {
    const res = await request(app).get('/api/productos');
    expect(res.statusCode).toBe(401);
  });

  it('devuelve 401 con token inválido', async () => {
    const res = await request(app)
      .get('/api/productos')
      .set('Authorization', 'Bearer tokenfalso123');
    expect(res.statusCode).toBe(401);
  });

  it('devuelve 401 con header mal formado', async () => {
    const res = await request(app)
      .get('/api/productos')
      .set('Authorization', 'tokensinbearer');
    expect(res.statusCode).toBe(401);
  });

  it('devuelve 200 con token válido', async () => {
    const token = await obtenerToken();
    const res = await request(app)
      .get('/api/productos')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

});

// ─── POST /api/productos ──────────────────────────────────────────────────────

describe('POST /api/productos — protección por rol', () => {

  it('devuelve 401 sin token', async () => {
    const res = await request(app)
      .post('/api/productos')
      .send({ nombre: 'Producto', precio: 10.0, tienda_id: 1 });
    expect(res.statusCode).toBe(401);
  });

  it('devuelve 200 con token válido y rol tienda', async () => {
    const token = await obtenerToken();
    const res = await request(app)
      .post('/api/productos')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Producto', precio: 10.0, tienda_id: 1 });
    // 200 o 201 según el controlador
    expect([200, 201]).toContain(res.statusCode);
  });

  it('devuelve 400 con datos inválidos aunque tenga token', async () => {
    const token = await obtenerToken();
    const res = await request(app)
      .post('/api/productos')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: '', precio: -5, tienda_id: 'abc' });
    expect(res.statusCode).toBe(400);
  });

});

// ─── GET /api/auth/verify ─────────────────────────────────────────────────────

describe('GET /api/auth/verify — validación de sesión activa', () => {

  it('devuelve 401 sin token', async () => {
    const res = await request(app).get('/api/auth/verify');
    expect(res.statusCode).toBe(401);
  });

  it('devuelve 200 con token válido', async () => {
    const token = await obtenerToken();
    const res = await request(app)
      .get('/api/auth/verify')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.valid).toBe(true);
  });

});
