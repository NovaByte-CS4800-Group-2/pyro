import pool from './pool.js'

class Profile {

    // edit email, edit edit password, edit zipcode, edit/update image

    async addImage(imageURL, user_id){ // where should i add the update image section
        const response = await fetch(imageURL);
        const blob = await response.blob();
        await pool.query("UPDATE users SET blob = ? WHERE user_id = ?", [blob, user_id]);
        console.log(blob)
        return blob;
    }
}