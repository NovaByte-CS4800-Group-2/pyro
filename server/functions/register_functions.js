import {hash} from './sha256.js'
import pool from './pool.js'


class Register
{
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
                              [this.username, this.name, this.email, hashedPassword, this.zipCode, this.businessAccount]);
            return true;
        }
        catch (error){
            console.error("Error in createProfile:", error);
            return false;
        }
    }

    async getProfiles()
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

    async getProfile()
    {
        try{
            const [rows] = await pool.query("SELECT * from users where username = ?", [this.username])
            return rows.length > 0 ? rows[0] : null;
        }
        catch (error) {
            console.error("Error in getProfile:", error);
            return null;
        }
    }

    async getErrors(confirmPassword)
    {
        const returnString = []; 
        const user = await this.#validateUsername();
        const pass = this.#validatePassword();
        const zip = this.#validateZipCode();
        const email = this.#validateEmail();
        const dupEmail = await this.#duplicateEmail();

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
        if(this.password != confirmPassword)
            returnString.push("Passwords do not match")
        
        return returnString
    }

    /* Checks if an input username exists in the database. */
    async #validateUsername()
    {
        try {
            const [rows] = await pool.query("SELECT 1 FROM users WHERE username = ? LIMIT 1", [this.username]);
            return rows.length > 0; // true if username exists, false otherwise

        } catch (error) {
            console.error("Error in validateUsername:", error);
            return false;
        }
    }

    async #duplicateEmail()
    {
        try {
            const [rows] = await pool.query("SELECT 1 FROM users WHERE email = ? LIMIT 1", [this.email]);
            return rows.length > 0; // True if email exists, false otherwise

        } catch (error) {
            console.error("Error in duplicateEmail:", error);
            return false;
        }
    }

    #validateEmail()
    {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // basic regex to check for email format
        return ( this.email.length === 0 || (emailRegex.test(this.email) && this.email.endsWith('.com')));
    }

    #validatePassword()
    {
    const minLength = 8; 
    const returnString = []; 

    if(this.password.length === 0)
        return returnString;
    
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

    #validateZipCode() {return (this.zipCode.length === 0 || /^\d{5}$/.test(this.zipCode));}
}

export default Register;