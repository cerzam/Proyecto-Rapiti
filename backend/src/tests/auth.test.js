const request = require('supertest');
const app = require('../app');

describe('POST /api/auth/login', () => {

  it('devuelve token y rol con credenciales correctas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'tienda@rapiti.com', password: '12345678' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.rol).toBe('tienda');
  });

  it('devuelve 401 con email incorrecto', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'otro@correo.com', password: '12345678' });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Credenciales inválidas');
  });

  it('devuelve 401 con contraseña incorrecta', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'tienda@rapiti.com', password: 'wrongpass' });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Credenciales inválidas');
  });

  it('devuelve 400 si el email está vacío', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: '', password: '12345678' });

    expect(res.statusCode).toBe(400);
  });

  it('devuelve 400 si la contraseña está vacía', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'tienda@rapiti.com', password: '' });

    expect(res.statusCode).toBe(400);
  });

  it('devuelve 400 si la contraseña tiene menos de 8 caracteres', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'tienda@rapiti.com', password: '123' });

    expect(res.statusCode).toBe(400);
  });

});
