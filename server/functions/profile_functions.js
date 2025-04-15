import pool from './pool.js'
import Register from './register_functions.js'

class Profile 
{
    /**
     * Changes a user's username if it's not taken.
     * @param {string} newUsername - The new username the user wants to change to
     * @param {number} user_id - User id for the user
     * @returns {boolean} - Return true if username is valid, false otherwise
     */
    static async editUsername(newUsername, user_id)
    {
        try{
            const dup = await Register.validateUsername(newUsername);
            if(dup) return false;

            await pool.query("UPDATE users SET username = ? WHERE user_id = ?", [newUsername, user_id])
            return true; 
        } catch (error){
            console.error("Error in changeUsername:", error);
            return false;
        }
    }

    /**
     * Gets a user's current username.
     * @param {number} user_id - User id for the user
     * @returns {string|null} - Returns the username if it exists, null if undefined
     */
    static async getUsername(user_id)
    {
        try{
            const [username] = await pool.query("SELECT username FROM users WHERE user_id = ?", [user_id]);
            return username[0]?.username;  // returns just the id, ? is to prevent error if undefined

          }catch(error){
            console.error("Error in getUsername:", error);
            return null;
          }
    }

    /**
     * Updates the user's ZIP code if valid.
     * @param {string} newZipcode - The updated zipcode of the user
     * @param {number} user_id - User id for the user
     * @returns {boolean} - Return true if zipcode is valid, false otherwise
     */
    static async editZipcode(newZipcode, user_id)
    {
        try {
            if(!Register.validateZipCode(newZipcode)) return false;

            await pool.query("UPDATE users SET zip_code = ? WHERE user_id = ?", [newZipcode, user_id])
            return true;
        } catch (error){
            console.log("Error in editZipcode:", error)
            return false;
        }
    }

    /**
     * Retrieves a user's full profile by username.
     * @param {string} username - The username of the user
     * @returns {Object|null} -  Return the profile if it exists, null otherwise
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
}

export default Profile;