import pool from './pool.js'

class Register
{
    static async createProfile(user_id, username, name, zipCode, businessAccount)
    {
        try{
            await pool.query("INSERT into users (user_id, username, name, zip_code, business_account) VALUES (?, ?, ?, ?, ?)",
                              [user_id, username, name, zipCode, businessAccount]);
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

    static async getErrors(_username, _password, _zipCode, confirmPassword)
    {
        const returnString = []; 
        const user = await this.validateUsername(_username);
        const zip = this.validateZipCode(_zipCode);

        if(user)
            returnString.push("Username already exisits")
        if(!zip)
            returnString.push("Zipcode must be a valid five digit number")
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

    static validateZipCode(zipCode) {return (zipCode.length === 0 || /^\d{5}$/.test(zipCode));}
}

export default Register;