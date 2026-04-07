const request = require('supertest');
const app = require('../app');
const { recoveryTokens } = require('../config/recovery-tokens');

// Limpia los tokens entre tests para evitar interferencias
beforeEach(() => {
  recoveryTokens.length = 0;
});

// ─── FORGOT PASSWORD ──────────────────────────────────────────────────────────

describe('POST /api/auth/forgot-password', () => {

  it('responde 200 con mensaje no revelador cuando el email existe', async () => {
    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'tienda@rapiti.com' });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Si ese correo está registrado, recibirás las instrucciones.');
    expect(res.body._devToken).toBeDefined();
  });

  it('responde 200 con el mismo mensaje cuando el email NO existe', async () => {
    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'noexiste@correo.com' });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Si ese correo está registrado, recibirás las instrucciones.');
    expect(res.body._devToken).toBeUndefined();
  });

  it('el token generado es hexadecimal de 64 caracteres (32 bytes)', async () => {
    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'tienda@rapiti.com' });

    expect(res.body._devToken).toMatch(/^[a-f0-9]{64}$/);
  });

  it('devuelve 400 si el email está vacío', async () => {
    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: '' });

    expect(res.statusCode).toBe(400);
  });

  it('devuelve 400 si el email tiene formato inválido', async () => {
    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'no-es-un-email' });

    expect(res.statusCode).toBe(400);
  });

  it('reemplaza un token previo si se solicita de nuevo', async () => {
    await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'tienda@rapiti.com' });

    const tokenAntes = recoveryTokens[0]?.token;

    await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'tienda@rapiti.com' });

    expect(recoveryTokens.length).toBe(1);
    expect(recoveryTokens[0].token).not.toBe(tokenAntes);
  });

});

// ─── RESET PASSWORD ───────────────────────────────────────────────────────────

describe('POST /api/auth/reset-password', () => {

  const obtenerToken = async () => {
    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'tienda@rapiti.com' });
    return res.body._devToken;
  };

  it('cambia la contraseña correctamente con token válido', async () => {
    const token = await obtenerToken();

    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ token, password: 'nuevaPass123' });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Contraseña actualizada correctamente.');
  });

  it('el token queda invalidado tras el uso (uso único)', async () => {
    const token = await obtenerToken();

    await request(app)
      .post('/api/auth/reset-password')
      .send({ token, password: 'nuevaPass123' });

    const res2 = await request(app)
      .post('/api/auth/reset-password')
      .send({ token, password: 'otraPass456' });

    expect(res2.statusCode).toBe(400);
    expect(res2.body.message).toBe('El enlace no es válido o ya expiró.');
  });

  it('devuelve 400 con token inexistente', async () => {
    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ token: 'tokenfalso123', password: 'nuevaPass123' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('El enlace no es válido o ya expiró.');
  });

  it('devuelve 400 con token expirado', async () => {
    const token = await obtenerToken();

    // Forzar expiración del token
    recoveryTokens[0].expiresAt = Date.now() - 1000;

    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ token, password: 'nuevaPass123' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('El enlace no es válido o ya expiró.');
  });

  it('devuelve 400 si la contraseña tiene menos de 8 caracteres', async () => {
    const token = await obtenerToken();

    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ token, password: 'corta' });

    expect(res.statusCode).toBe(400);
  });

  it('devuelve 400 si el token está vacío', async () => {
    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ token: '', password: 'nuevaPass123' });

    expect(res.statusCode).toBe(400);
  });

  it('permite login con la nueva contraseña tras el reset', async () => {
    const token = await obtenerToken();

    await request(app)
      .post('/api/auth/reset-password')
      .send({ token, password: 'nuevaPass123' });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'tienda@rapiti.com', password: 'nuevaPass123' });

    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body).toHaveProperty('token');
  });

});
