import pool from "./pool.js";

class Vote{
    async upvote(content_id, user_id){
        try {
            await pool.query("INSERT INTO votes (content_id, user_id, value) VLAUES (?, ?, 1)", [content_id, user_id])
        } catch (e) {
            console.log(e)
        }
    }

    async downvote(content_id, user_id){
        try {
            await pool.query("INSERT INTO votes (content_id, user_id, value) VALUES(?, ?, 0)", [content_id, user_id])
        } catch (e) {
            console.log(e)
        }
    }
}
export default Vote; 
// const vote = new Vote(); 
// await vote.downvote(1,12);