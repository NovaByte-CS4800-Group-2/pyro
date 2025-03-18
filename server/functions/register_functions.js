import {hash} from './sha256.js'
import pool from './pool.js'


class Register
{
    constructor(username, name, email, zipCode, password, businessAccount)
    {
        this.username = username;
        this.name = name;
        this.email = email;
        this.zipCode = zipCode;
        this.password = password;
        this.businessAccount = businessAccount;
    }

    updateinfo(username, name, email, zipCode, password, businessAccount)
    {
        this.username = username;
        this.name = name;
        this.email = email;
        this.zipCode = zipCode;
        this.password = password;
        this.businessAccount = businessAccount;
    }

    async createProfile()
    {
        try{
            const hashedPassword = hash(this.password);
            await pool.query("INSERT into users (username, name, email, password, zip_code, business_account) VALUES (?, ?, ?, ?, ?, ?)",
                              [this.username, this.name, this.email, hashedPassword, this.zipCode, this.businessAccount])
        }
        catch (error){
            console.log(error)
        }
    }

    async getProfiles()
    {
        try{
            const [rows] = await pool.query("SELECT * from users")
            console.log(rows);
            return rows
        }
        catch (error) {
            console.log(error)
        }
    }


    async getProfile()
    {
        try{
            const [rows] = await pool.query("SELECT * from users where username = ?", [this.username])
            return rows
        }
        catch (error) {
            console.log(error)
        }
    }

    /* Checks if an input username exists in the database. */
    async validateUsername()
    {
        const [rows] = await pool.query("SELECT * from users where userName = ?", [this.username]);

        // Check if there are rows returned
        if (rows.length > 0) 
            return true;  // Username already exists  
        return false;  // If no rows, username doesn't exist
    }


    validatePassword()
    {
    const minLength = 8; 
    const returnString = []; 
    
    if (this.password.length < minLength)  // check for minimum length of password 
        returnString.push("Password must contain at least 8 characters.")
     
    if (!/[A-Z]/.test(this.password)) // check for capital letters 
        returnString.push("Password must contain at least one capital letter.")
    
    if (!/\d/.test(this.password)) // check for digits
        returnString.push("Password must contain at least one digit.")
    
    if (! /[@.#$!%^&*.?]/.test(this.password))  // check for symbols
        returnString.push("Password must contain at least one symbol.")
    
    return returnString // if the string is empty, the password is valid 
    }


    validateEmail()
    {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // basic regex to check for email format
        return emailRegex.test(this.email) && this.email.endsWith('.com');
    }

    async duplicateEmail()
    {
        const [rows] = await pool.query("SELECT * from users where email = ?", [this.email]);

        // Check if there are rows returned
        if (rows.length > 0) 
            return true; 
        return false; 
    }

    validateZipCode() {return /^\d{5}$/.test(this.zipCode);}

    async getErrors()
    {
        const returnString = []; 
        const user = await this.validateUsername();
        const pass = this.validatePassword();
        const zip = this.validateZipCode();
        const email = this.validateEmail();
        const dupEmail = await this.duplicateEmail();

        if(user)
            returnString.push("Username already exisits")
        if(!zip)
            returnString.push("Zipcode must be a valid five digit number")
        if(!email)
            returnString.push("Invalid email format")
        if(dupEmail)
            returnString.push("An account with this email already exists")
        if (pass.length > 0) 
            returnString.push(...pass)
        
        return returnString
    }
}

export default Register;

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