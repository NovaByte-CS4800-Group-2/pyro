// make functions to update each and then use them here
// this way, we can use them all in this one
// !!! there willl probably be an error if you try to run this but im working on it!

import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user:  process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}).promise() // allows to use promise API version of MYSQL instead of having to use coolback version


export async function createProfile (userID, username, name, email, zipCode, password, businessAccount){
    try{
        await pool.query("INSERT into pyroDB.users (user_id, username, name, email, password, zip_code, business_account) VALUES (?, ?, ?, ?, ?, ?, ?)",
                          [userID, username, name, email, zipCode, password, businessAccount])
    }
    catch (error){
        console.log(error)
    }
}

export async function getProfiles(){
    try{
        const [rows] = await pool.query("SELECT * from pyroDB.users")
        console.log(rows);
        return rows
    }
    catch (error) {
        console.log(error)
    }
}

export async function getProfile(username){
    try{
        const [rows] = await pool.query("SELECT * from pyroDB.users where username = ?", [username])
        return rows
    }
    catch (error) {
        console.log(error)
    }
}

getProfiles()
// console.log(await getProfile("jess"))
// await pool.end()
