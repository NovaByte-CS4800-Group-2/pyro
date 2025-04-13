import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()  // Load environment variables from .env file


/**
 * Creates a MySQL connection pool using environment variables.
 * 
 * This setup allows your application to efficiently manage multiple 
 * concurrent database connections. The use of `.promise()` enables 
 * async/await support by switching from the callback-based API 
 * to a promise-based one.
 */
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user:  process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}).promise() // Enables usage of async/await by returning promise-based query methods

export default pool;