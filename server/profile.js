// make functions to update each and then use them here
// this way, we can use them all in this one

import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: "localhost", 
    user: "root", 
    password: "",
    database: "notes_app"
}).promise() // allows to use promise API version of MYSQL instead of having to use coolback version

export async function createProfile (username, name, email, zipCode, password, businessAccount){
    try{
        await pool.query("INSERT into users (username, name, email, password, zip_code, business_account) VALUES (?, ?, ?, ?, ?, ?)",
                          [username, name, email, zipCode, password, businessAccount])
    }
    catch (error){
        console.log(error)
    }
}

export async function getProfiles(){
    try{
        const [rows] = await pool.query("SELECT * from notes_app.users")
        console.log(rows);
        return rows
    }
    catch (error) {
        console.log(error)
    }
}

export async function getProfile(username){
    try{
        const [rows] = await pool.query("SELECT * from users where username = ?", [username])
        return rows
    }
    catch (error) {
        console.log(error)
    }
}

createProfile("newUser", "user@gmail.com", 92102, "saiid", 0)
// console.log(await getProfile("jess"))
