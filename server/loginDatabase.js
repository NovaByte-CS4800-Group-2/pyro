import mysql from 'mysql2'
import {hash} from './sha256.js'

import dotenv from 'dotenv' 
dotenv.config()

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user:  process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}).promise()

/* Checks whether a username and password combination matches the database values. */
async function checkCredentials(inputPass, userName){

    const hashedString = hash(inputPass);
    if (await getPassword(userName) == (hashedString)) {
        return true; 
    }
    else {
        return false;
    }
}

/* Checks if an input username exists in the database. */
async function checkUsername (inputUsername){
    const [rows] = await pool.query("SELECT * from passTest where userName = ?", [inputUsername])
    for (let i = 0; i < rows.length; i++){  // is the loop necessary since we do not accept duplicate usernames?
        if (rows[i].userName == inputUsername){
            return true
        }
    }
    return false
}
/* Finds a user's username from the database given their password. */
async function getUsername(password){
    try{
        const hashedPassword = hash(password)
        const [rows] = await pool.query("SELECT * from passTest where password = ?", [hashedPassword])
        return rows[0].userName
        // !!! in order to actually get the results of this without "promise pending", use await before CALLING the function 
        // ex: console.log(await getUsername("password"))
    } catch (error) {
        return null // if the password is not in the table 
    }   
}

/* Finds a user's password from the database given their username. */
async function getPassword(username){
    try {
        const [rows] = await pool.query("SELECT * from passTest where userName = ? LIMIT 1", [username])
        return rows[0].password
    } catch (error){
        return null // if user does not exist, there won't be a password to find 
    }
    
}

function validatePassword(password){
    const minLength = 8; 
    const returnString = []; 
    
    if (password.length < 8) { // check for minimum length of password 
        returnString.push("Password must contain at least 8 characters.")
    } 
    if (!/[A-Z]/.test(password)){ // check for capital letters 
        returnString.push("Password must contain at least one capital letter.")
    }
    if (!/\d/.test(password)){ // check for digits
        returnString.push("Passowrd must contain at least one digit.")
    }
    if (! /[@.#$!%^&*.?]/.test(password)) { // check for symbols
        returnString.push("Password must contain at least one symbol.")
    }
    return returnString // if the string is empty, the password is valid 
}

//console.log("The username for this password is:", await getUsername("password"))
//console.log("Checking if the username 'beepBepp' exists..,", await checkUsername("beepBepp"))
//console.log("Checking if the username 'beepHadya' exists..,", await checkUsername("beepHadya"))
//console.log("Getting the password for pintoBean:", await getPassword("pintoBean"))
//console.log("Checking if pintoBean's password is 'password'", await checkCredentials("password", "pintoBean"))
console.log(validatePassword("hello")) // empty list means the password is valid 

await pool.end() // close the connection once information has been gathered