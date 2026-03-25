const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DB_URL
}); 

pool.on('connect', () => {
  console.log('Base de datos conectada con éxito');
});

pool.on('error', (err) => {
  console.error('Error inesperado en el cliente de la BD', err);
});  

module.exports = pool;