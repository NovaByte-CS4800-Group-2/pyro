import pool from "./pool.js";

class Vote
{
    async upvote(content_id, user_id)
    {
        try {
            await pool.query("INSERT INTO votes (content_id, user_id, value) VLAUES (?, ?, 1)", [content_id, user_id])
            return true;
        } catch (error) {
            console.error("Error in upvote:", error);
            return false;
        }
    }

    async downvote(content_id, user_id)
    {
        try {
            await pool.query("INSERT INTO votes (content_id, user_id, value) VALUES(?, ?, 0)", [content_id, user_id])
            return true;

        } catch (error) {
            console.error("Error in downvote:", error);
            return false;
        }
    }

    async removeVote(content_id, user_id)
    {
        try{
            const [result] = await pool.query("DELETE FROM votes WHERE content_id = ? and user_id = ?", [content_id, user_id])
            return result.affectedRows > 0;
            
        } catch (error){
            console.error("Error in removeVote:", error);
            return false;
        }
    }
}

export default Vote; 
