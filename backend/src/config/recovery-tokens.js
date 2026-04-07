const recoveryTokens = [];

const EXPIRATION_MS = 15 * 60 * 1000; // 15 minutos

const cleanExpiredRecoveryTokens = () => {
  const now = Date.now();
  let i = recoveryTokens.length;
  while (i--) {
    if (recoveryTokens[i].expiresAt <= now) {
      recoveryTokens.splice(i, 1);
    }
  }
};

module.exports = { recoveryTokens, cleanExpiredRecoveryTokens, EXPIRATION_MS };
