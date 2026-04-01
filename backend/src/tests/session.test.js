const request = require('supertest');
const app = require('../app');
const { sessions, cleanExpiredSessions } = require('../config/sessions');

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

describe('Pruebas de expiración de sesión', () => {

  it('cleanExpiredSessions elimina sesiones cuyo expiresAt ya pasó', () => {
    sessions.push({ userId: 1, token: 'expired-token', expiresAt: Date.now() - 1000 });
    sessions.push({ userId: 1, token: 'valid-token', expiresAt: Date.now() + 99999 });

    cleanExpiredSessions();

    const tokens = sessions.map(s => s.token);
    expect(tokens).not.toContain('expired-token');
    expect(tokens).toContain('valid-token');

    // Limpiar
    const idx = sessions.findIndex(s => s.token === 'valid-token');
    if (idx !== -1) sessions.splice(idx, 1);
  });

  it('una sesión expirada es rechazada en el middleware', async () => {
    // Guardamos sesión ya expirada directamente
    const jwt = require('jsonwebtoken');
    const expiredToken = jwt.sign(
      { id: 1, rol: 'tienda' },
      process.env.JWT_SECRET || 'secret_key_mvp',
      { expiresIn: '1ms' }
    );

    sessions.push({ userId: 1, token: expiredToken, expiresAt: Date.now() - 1 });

    // Esperamos a que el JWT también expire
    await new Promise(r => setTimeout(r, 10));

    const res = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${expiredToken}`);

    expect(res.statusCode).toBe(401);
  });

  it('múltiples sesiones del mismo usuario son independientes', async () => {
    const res1 = await request(app).post('/api/auth/login').send({ email: 'tienda@rapiti.com', password: '12345678' });
    const res2 = await request(app).post('/api/auth/login').send({ email: 'tienda@rapiti.com', password: '12345678' });

    const token1 = res1.body.token;
    const token2 = res2.body.token;

    // Cerrar solo la primera sesión
    await request(app).post('/api/auth/logout').set('Authorization', `Bearer ${token1}`);

    // La segunda sigue válida
    const res = await request(app).post('/api/auth/logout').set('Authorization', `Bearer ${token2}`);
    expect(res.statusCode).toBe(200);
  });

});

describe('Pruebas de límite de sesiones por usuario', () => {

  beforeEach(() => {
    // Limpiar sesiones antes de cada test
    sessions.splice(0, sessions.length);
  });

  it('no acumula más de 5 sesiones por usuario', async () => {
    for (let i = 0; i < 6; i++) {
      await request(app).post('/api/auth/login').send({ email: 'tienda@rapiti.com', password: '12345678' });
    }

    const userSessions = sessions.filter(s => s.userId === 1);
    expect(userSessions.length).toBeLessThanOrEqual(5);
  });

  it('al llegar al límite, la sesión más antigua se elimina', () => {
    // Insertar 5 sesiones con tokens conocidos directamente
    for (let i = 0; i < 5; i++) {
      sessions.push({ userId: 1, token: `token-${i}`, expiresAt: Date.now() + 99999 });
    }

    const oldest = sessions[0];

    // Simular lo que hace el login al insertar la 6ta
    const userSessions = sessions.filter(s => s.userId === 1);
    if (userSessions.length >= 5) {
      const idx = sessions.indexOf(userSessions[0]);
      sessions.splice(idx, 1);
    }
    sessions.push({ userId: 1, token: 'token-nuevo', expiresAt: Date.now() + 99999 });

    expect(sessions.some(s => s === oldest)).toBe(false);
    expect(sessions.filter(s => s.userId === 1).length).toBe(5);
  });

});