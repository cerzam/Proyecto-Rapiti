const request = require('supertest');
const app = require('../app');

describe('Pruebas de sesión (multisesión)', () => {

  let token = '';

  // 🔹 LOGIN
  it('Debe iniciar sesión correctamente', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'tienda@rapiti.com',
        password: '12345678'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();

    token = res.body.token;
  });

  // 🔹 LOGOUT
  it('Debe cerrar sesión correctamente', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Sesión cerrada correctamente');
  });

  // 🔹 TOKEN INVALIDADO
  it('No debe permitir usar un token después de logout', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Sesión inválida');
  });

});