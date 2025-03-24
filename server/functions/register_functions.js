import {hash} from './sha256.js'
import pool from './pool.js'


class Register
{
    static async createProfile(username, name, email, zipCode, password, businessAccount)
    {
        try{
            const hashedPassword = hash(password);
            await pool.query("INSERT into users (username, name, email, password, zip_code, business_account) VALUES (?, ?, ?, ?, ?, ?)",
                              [username, name, email, hashedPassword, zipCode, businessAccount]);
            return true;
        }
        catch (error){
            console.error("Error in createProfile:", error);
            return false;
        }
    }

    static async getProfiles()
    {
        try{
            const [rows] = await pool.query("SELECT * from users")
            return rows.length > 0 ? rows : null;
        }
        catch (error) {
            console.error("Error in getProfiles:", error);
            return null;
        }
    }

    static async getProfile(username)
    {
        try{
            const [rows] = await pool.query("SELECT * from users where username = ?", [username])
            return rows.length > 0 ? rows[0] : null;
        }
        catch (error) {
            console.error("Error in getProfile:", error);
            return null;
        }
    }

    static async getErrors(_username, _password, _zipCode, _email, confirmPassword)
    {
        const returnString = []; 
        const user = await this.validateUsername(_username);
        const pass = this.validatePassword(_password);
        const zip = this.validateZipCode(_zipCode);
        const email = this.validateEmail(_email);
        const dupEmail = await this.duplicateEmail(_email);

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
        if(_password != confirmPassword)
            returnString.push("Passwords do not match")
        
        return returnString
    }

    /* Checks if an input username exists in the database. */
    static async validateUsername(username)
    {
        try {
            const [rows] = await pool.query("SELECT 1 FROM users WHERE username = ? LIMIT 1", [username]);
            return rows.length > 0; // true if username exists, false otherwise

        } catch (error) {
            console.error("Error in validateUsername:", error);
            return false;
        }
    }

    static async duplicateEmail(email)
    {
        try {
            const [rows] = await pool.query("SELECT 1 FROM users WHERE email = ? LIMIT 1", [email]);
            return rows.length > 0; // True if email exists, false otherwise

        } catch (error) {
            console.error("Error in duplicateEmail:", error);
            return false;
        }
    }

    static validateEmail(email)
    {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // basic regex to check for email format
        return (email.length === 0 || (emailRegex.test(email) && email.endsWith('.com')));
    }

    static validatePassword(password)
    {
    const minLength = 8; 
    const returnString = []; 

    if(password.length === 0)
        return returnString;
    
    if (password.length < minLength)  // check for minimum length of password 
        returnString.push("Password must contain at least 8 characters.")
     
    if (!/[A-Z]/.test(password)) // check for capital letters 
        returnString.push("Password must contain at least one capital letter.")
    
    if (!/\d/.test(password)) // check for digits
        returnString.push("Password must contain at least one digit.")
    
    if (! /[@.#$!%^&*.?]/.test(password))  // check for symbols
        returnString.push("Password must contain at least one symbol.")
    
    return returnString // if the string is empty, the password is valid 
    }

    static validateZipCode(zipCode) {return (zipCode.length === 0 || /^\d{5}$/.test(zipCode));}
}

export default Register;