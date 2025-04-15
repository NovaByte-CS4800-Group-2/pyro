import pool from './pool.js'


/**
 * Class representing user registration and profile operations.
 */
class Register
{
    /**
   * Creates a new user profile in the database.
   *
   * @param {string} user_id - The unique identifier for the user.
   * @param {string} username - The desired username.
   * @param {string} name - The user's name.
   * @param {string} zipCode - The user's ZIP code.
   * @param {boolean} businessAccount - Whether the user is creating a business account.
   * @returns {Promise<boolean>} - Returns true if insertion is successful, otherwise false.
   */
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

    /**
   * Retrieves a specific user profile based on username.
   *
   * @param {string} username - The username to search for.
   * @returns {Promise<Object|null>} - The user record if found, otherwise null.
   */
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

    /**
   * Validates registration form inputs and returns a list of error messages, if any.
   *
   * @param {string} _username - The username to validate.
   * @param {string} _password - The user password input.
   * @param {string} _zipCode - The ZIP code to validate.
   * @param {string} confirmPassword - The repeated password to confirm match.
   * @returns {Promise<string[]>} - A list of validation error messages.
   */
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

    /**
   * Checks if a username already exists in the database.
   *
   * @param {string} username - The username to check.
   * @returns {Promise<boolean>} - True if username exists, false otherwise.
   */
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

    /**
   * Validates whether a ZIP code is a 5-digit number.
   *
   * @param {string} zipCode - The ZIP code to validate.
   * @returns {boolean} - True if valid or empty, false otherwise.
   */
    static validateZipCode(zipCode) {return (zipCode.length === 0 || /^\d{5}$/.test(zipCode));}
}

export default Register;