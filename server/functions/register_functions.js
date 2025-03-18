import {hash} from './sha256.js'
import pool from './pool.js'

export async function createProfile (username, name, email, zipCode, password, businessAccount){
    try{
        password = hash(password)
        await pool.query("INSERT into users (username, name, email, password, zip_code, business_account) VALUES (?, ?, ?, ?, ?, ?)",
                          [username, name, email, password, zipCode, businessAccount])
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