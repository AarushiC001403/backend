const mysql = require('mysql2');

const ssl =
  process.env.DB_SSL === 'true'
    ? (process.env.DB_CA_CERT ? { ca: process.env.DB_CA_CERT, rejectUnauthorized: true } : { rejectUnauthorized: false })
    : false;

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'internship_worker',
  port: Number(process.env.DB_PORT) || 3306,
  ssl
};

const pool = mysql.createPool(dbConfig);
module.exports = pool.promise();
