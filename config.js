const mysql = require('mysql2');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Aarushi@2025', 
  database: 'internship_worker',
  port: 3306
};

const pool = mysql.createPool(dbConfig);

module.exports = pool.promise(); 