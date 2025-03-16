import mysql from 'mysql2'
import {hash} from './functions/sha256.js'

import dotenv from 'dotenv' 
dotenv.config()

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user:  process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}).promise()

/* Checks whether a username and password combination matches the database values. */
export async function checkCredentials(inputPass, userName){

    const hashedString = hash(inputPass);
    if (await getPassword(userName) === hashedString) {
        return true; 
    }
    else {
        return false;
    }
}

/* Checks if an input username exists in the database. */
export async function checkUsername (inputUsername){
    const [rows] = await pool.query("SELECT * from users where userName = ?", [inputUsername])
    for (let i = 0; i < rows.length; i++){  // is the loop necessary since we do not accept duplicate usernames?
        if (rows[i].userName == inputUsername){
            return true
        }
    }
    return false
}
/* Finds a user's username from the database given their password. */
export async function getUsername(password){
    try{
        const hashedPassword = hash(password)
        const [rows] = await pool.query("SELECT * from users where password = ?", [hashedPassword])
        return rows[0].userName
        // !!! in order to actually get the results of this without "promise pending", use await before CALLING the function 
        // ex: console.log(await getUsername("password"))
    } catch (error) {
        return null // if the password is not in the table 
    }   
}

/* Finds a user's password from the database given their username. */
export async function getPassword(username){
    try {
        const [rows] = await pool.query("SELECT * from users where userName = ? LIMIT 1", [username])
        return rows[0].password
    } catch (error){
        return null // if user does not exist, there won't be a password to find 
    }
    
}

export async function validatePassword(password){
    const minLength = 8; 
    const returnString = []; 
    
    if (password.length < minLength) { // check for minimum length of password 
        returnString.push("Password must contain at least 8 characters.")
    } 
    if (!/[A-Z]/.test(password)){ // check for capital letters 
        returnString.push("Password must contain at least one capital letter.")
    }
    if (!/\d/.test(password)){ // check for digits
        returnString.push("Password must contain at least one digit.")
    }
    if (! /[@.#$!%^&*.?]/.test(password)) { // check for symbols
        returnString.push("Password must contain at least one symbol.")
    }
    return returnString // if the string is empty, the password is valid 
}

console.log("The username for this password is:", await getUsername("password"))
//console.log("Checking if the username 'beepBepp' exists..,", await checkUsername("beepBepp"))
//console.log("Checking if the username 'beepHadya' exists..,", await checkUsername("beepHadya"))
//console.log("Getting the password for pintoBean:", await getPassword("pintoBean"))
//console.log("Checking if pintoBean's password is 'password'", await checkCredentials("password", "pintoBean"))
console.log(validatePassword("hello")) // empty list means the password is valid 

//await pool.end() // close the connection once information has been gathered