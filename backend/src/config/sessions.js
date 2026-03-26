const sessions = [];

// Elimina sesiones cuyo token ya expiró
const cleanExpiredSessions = () => {
  const now = Date.now();
  let i = sessions.length;
  while (i--) {
    if (sessions[i].expiresAt <= now) {
      sessions.splice(i, 1);
    }
  }
};

module.exports = { sessions, cleanExpiredSessions };