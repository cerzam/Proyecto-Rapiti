const { createClient } = require('redis');

const client = createClient({
  url: 'redis://localhost:6379'
});

client.connect()
  .then(() => console.log("Redis conectado"))
  .catch(err => console.error("Error Redis:", err));

module.exports = client;