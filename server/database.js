import mysql from 'mysql2'

import dotenv from 'dotenv' // values for the envoirmental variables are stored in a .env file, run 'npm i dotenv' command
dotenv.config()

// pool is a collection of collections to a database
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user:  process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}).promise() // allows to use promise API version of MYSQL instead of having to use coolback version

export async function getNotes() 
{
  const [rows] = await pool.query("SELECT * FROM test1")
  console.log(rows);
  return rows
}

export async function getNote(id)
{
  const [rows] = await pool.query('SELECT * FROM test1 WHERE id = ?', [id]) // prepared statement, always use ? to be safe
  return rows[0]
}

export async function createNote(title, content) 
{
  const [result] = await pool.query('INSERT INTO test1 (title, contents) VALUES (?, ?)', [title, content])
  const id = result.insertId
  return getNote(id)
}

getNotes(); 