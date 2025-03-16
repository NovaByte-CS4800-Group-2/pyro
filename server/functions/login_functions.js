import {hash} from './sha256.js'
import pool from './pool.js'

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

/* Finds a user's password from the database given their username. */
export async function getPassword(username){
    try {
        const [rows] = await pool.query("SELECT * from users where userName = ? LIMIT 1", [username])
        return rows[0].password
    } catch (error){
        return null // if user does not exist, there won't be a password to find 
    }
    
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