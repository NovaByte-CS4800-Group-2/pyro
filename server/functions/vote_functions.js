import pool from "./pool.js";

class Vote{
    async upvote(content_id, user_id){
        try {
            await pool.query("INSERT INTO votes (content_id, user_id, value), (?, ?, 1)", [content_id, user_id])
        } catch (e) {
            console.log(e)
        }
    }

    async downvote(content_id, user_id){
        try {
            await pool.query("INSERT INTO votes (content_id, user_id, value), (?, ?, 0)", [content_id, user_id])
        } catch (e) {
            console.log(e)
        }
    }
}