import {hash} from './sha256.js'
import pool from './pool.js'

class Login
{
    constructor(email, password)
    {
        this.email = email;
        this.password = hash(password);
    }

    updateInfo(email, password)
    {
        this.email = email;
        this.password = hash(password);
    }

    async checkCredentials()
    {
        const storedPassword = await this.getPassword();
        return storedPassword && storedPassword === this.password;
    }

    async getPassword()
    {
        try {
            const [rows] = await pool.query("SELECT * from users where email = ? LIMIT 1", [this.email])
            return rows[0].password
        } catch (error){
            return null // if user does not exist, there won't be a password to find 
        } 
    }

    async getProfile()
    {
        try{
            const [rows] = await pool.query("SELECT * from users where email = ?", [this.email])
            return rows
        }
        catch (error) {
            console.log(error)
        }
    }
}

export default Login;

/* Checks whether a username and password combination matches the database values. */
export async function checkCredentialsUsername(inputPass, userName){

    const hashedString = hash(inputPass);
    if (await getPassword(userName) === hashedString) {
        return true; 
    }
    else {
        return false;
    }
}

export async function checkCredentials(inputPass, email){

    const hashedString = hash(inputPass);
    if (await getPassword(email) === hashedString) {
        return true; 
    }
    else {
        return false;
    }
}

export async function getPassword(email){
    try {
        const [rows] = await pool.query("SELECT * from users where email = ? LIMIT 1", [email])
        return rows[0].password
    } catch (error){
        return null // if user does not exist, there won't be a password to find 
    } 
}

/* Finds a user's password from the database given their username. */
export async function getPasswordUsername(username){
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

export async function getProfile(email){

    try{
        const [rows] = await pool.query("SELECT * from users where email = ?", [email])
        return rows
    }
    catch (error) {
        console.log(error)
    }

}