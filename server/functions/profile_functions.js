import pool from './pool.js'

class Profile {

    // edit email, edit edit password, edit zipcode, edit/update image

    async addImage(file, user_id){ // where should i add the update image section
        await pool.query("UPDATE users SET blob = ? WHERE user_id = ?", [file, user_id]);
        console.log(blob)
        return blob;
    }
}