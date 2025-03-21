import pool from './pool.js'

class Profile {

    // edit email, edit edit password, edit zipcode, edit/update image

    async addImage(file, user_id){ // where should i add the update image section
        try {
            await pool.query("UPDATE users SET blob = ? WHERE user_id = ?", [file, user_id]);
            console.log(blob)
            return blob;
        } catch(e){
            console.log(e)
        }
    }

    async changeUsername(user_id, newUsername){
        try{
            await pool.query("UPDATE users SET username = ? WHERE user_id = ?", [newUsername, user_id])
        } catch (e){
            console.log(e)
        }
    }
}

export default Profile;