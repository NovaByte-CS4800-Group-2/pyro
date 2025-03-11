import mysql from 'mysql2'
import {hash} from './sha256.js'

import dotenv from 'dotenv' 
dotenv.config()

const hashString = hash("hello");

const pool = mysql.createPool({
    host: "localhost", 
    user: "root", 
    password: "Server123",
    database: "notes_app"
}).promise()

export async function comparePasswords(string){

    const hashedString = hash(string);
    console.log(hashedString);
    const [rows] = await pool.query("SELECT * from passTest where userName = ?", [hashedString]);
    console.log(rows)
}

comparePasswords("pintoBean")


// compare passwords
// compare usernames 
// get username based on password 
// get password based on username