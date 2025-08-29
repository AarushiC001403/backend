require('dotenv').config();
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');


const USE_SSL = process.env.DB_SSL === 'true';

// If you uploaded Aiven's CA as a Secret File on Render, e.g. /etc/ssl/aiven/ca.pem
const CA_PATH = process.env.DB_SSL_CA_PATH || '/etc/ssl/aiven/ca.pem';

let ssl;
if (USE_SSL) {
  try {
    const ca = fs.readFileSync(CA_PATH, 'utf8');
    ssl = { ca, minVersion: 'TLSv1.2', rejectUnauthorized: true };
  } catch {
    // fallback if CA not present — still enforce TLS
    ssl = { minVersion: 'TLSv1.2', rejectUnauthorized: true };
  }
}

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
  ssl: process.env.DB_SSL === 'true'
    ? { ca: fs.readFileSync(path.join(__dirname, 'ca.pem')), rejectUnauthorized: true }
    : false
};

const pool = mysql.createPool(dbConfig);
module.exports = pool.promise();
