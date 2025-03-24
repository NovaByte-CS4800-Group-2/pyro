import pool from './pool.js'
import {hash} from './sha256.js'
import Register from './register_functions.js'

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
            const dup = await Register.duplicateEmail(newEmail);
            const format = Register.validateEmail(newEmail);
            if(dup) return "An account associated with this email already exists";
            if(!format) return "Invalid email format";

            await pool.query("UPDATE users SET email = ? WHERE user_id = ?", [newEmail, user_id])
            return "";
        } catch (error){
            console.log("Error in editEmail", error)
            return false;
        }
    }

    static async editPassword(newPassword, user_id){
        try {
            const passErrors = Register.validatePassword(newPassword)
            if(passErrors.length != 0) return passErrors;

            const password = hash(newPassword)
            await pool.query("UPDATE users SET password = ? WHERE user_id = ?", [password, user_id])
            return passErrors;

        } catch (error){
            console.log("Error in editPassword:", error)
            return false;
        }
    }

    static async editZipcode(newZipcode, user_id){
        try {
            if(!Register.validateZipCode(newZipcode)) return false;

            await pool.query("UPDATE users SET zip_code = ? WHERE user_id = ?", [newZipcode, user_id])
            return true;
        } catch (error){
            console.log("Error in editZipcode:", error)
            return false;
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

}

const check = await Profile.editUsername("natalie", 1);
if(!check)
{
    console.log("correctly denied")
}
export default Profile;