import pool from './pool.js'

class Profile {

    // edit email, edit edit password, edit zipcode, edit/update image

    static async addImage(file, user_id)
    { // where should i add the update image section
        try {
            await pool.query("UPDATE users SET blob = ? WHERE user_id = ?", [file, user_id]);
            console.log(blob)
            return true;
        } catch(error){
            console.error("Error in addImage:", error);
            return false;
        }
    }

    static async changeUsername(user_id, newUsername)
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
}

export default Profile;