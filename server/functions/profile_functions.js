import pool from './pool.js'
import {hash} from './sha256.js'

class Profile {

    static async addImage(file, user_id)
    { // where should i add the update image section
        try {
            await pool.query("UPDATE users SET profile_picture = ? WHERE user_id = ?", [file, user_id]);
            return true;
        } catch(error){
            console.error("Error in addImage:", error);
            return false;
        }
    }

    static async updateImage(file, user_id){
        try {
            await pool.query("UPDATE users SET profile_picture = ? WHERE user_id = ?", [file, user_id]);
            return true;
        } catch (error) {
            console.error("Error in editImage:", error);
        }
    }

    static async editUsername(user_id, newUsername)
    {
        try{
            await pool.query("UPDATE users SET username = ? WHERE user_id = ?", [newUsername, user_id])
            return result.affectedRows > 0; // Returns true if a row was updated
        } catch (error){
            console.error("Error in changeUsername:", error);
            return false;
        }
    }

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

    static async editEmail(newEmail, user_id){
        try {
            await pool.query("UPDATE users SET email = ? WHERE user_id = ?", [newEmail, user_id])
        } catch (error){
            console.log("Error in editEmail", error)
        }
    }

    static async editPassword(newPassword, user_id){
        try {
            const password = hash(newPassword)
            await pool.query("UPDATE users SET password = ? WHERE user_id = ?", [password, user_id])
        } catch (error){
            console.log("Error in editPassword:", error)
        }
    }

    static async editZipcode(newZipcode, user_id){
        try {
            await pool.query("UPDATE users SET zip_code = ? WHERE user_id = ?", [newZipcode, user_id])
        } catch (error){
            console.log("Error in editZipcode:", error)
        }
    }

}
export default Profile;