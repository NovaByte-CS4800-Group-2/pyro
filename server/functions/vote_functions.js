import pool from "./pool.js";

class Vote
{
    static async vote(content_id, user_id, value)  // a user votes (1 -> up, 0 -> down)
    {
        try {
            await 
            pool.query("INSERT INTO votes (content_id, user_id, value) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value)", 
                [content_id, user_id, value]);
            return true;
            
        } catch (error) {
            console.error("Error in upvote:", error);
            return false;
        }
    }

    static async getVote(content_id, user_id)
    {
        try {
            const [rows] = await pool.query("SELECT value from votes WHERE content_id = ? AND user_id = ?", [content_id, user_id])

            if(rows.length == 0) return false;

            return rows;

        } catch (error) {
            console.error("Error in getVotes:", error);
            return null;
        }
    }

    static async getVotes(content_id)  // get all votes for a content
    {
        try {
            const [rows] = await pool.query("SELECT * from votes WHERE content_id = ?", [content_id])
            return rows;

        } catch (error) {
            console.error("Error in getVotes:", error);
            return null;
        }
    }

    static async getUpVotes(content_id)
    {
        try {
            const [rows] = await pool.query("SELECT value from votes WHERE content_id = ? AND value = 1", [content_id])
            return rows.length;

        } catch (error) {
            console.error("Error in getVotes:", error);
            return null;
        }
    }

    static async getDownVotes(content_id)
    {
        try {
            const [rows] = await pool.query("SELECT value from votes WHERE content_id = ? AND value = 0", [content_id])
            return rows.length;

        } catch (error) {
            console.error("Error in getVotes:", error);
            return null;
        }
    }

    static async getUserVotes(user_id)  // get all votes from a user
    {
        try {
            const [rows] = await pool.query("SELECT * from votes WHERE user_id = ?", [user_id])
            return rows;

        } catch (error) {
            console.error("Error in getUserVotes:", error);
            return null;
        }
    }

    static async removeVote(content_id, user_id)  // a user removes a single vote
    {
        try{
            const [result] = await pool.query("DELETE FROM votes WHERE content_id = ? and user_id = ?", [content_id, user_id])
            return result.affectedRows > 0;
            
        } catch (error){
            console.error("Error in removeVote:", error);
            return false;
        }
    }

    static async removeVotes(content_ids)  // remove all votes associated with comment/post
    {
        try{
            const [result] = await pool.query("DELETE FROM votes WHERE content_id IN (?)", [content_ids])
            return result.affectedRows > 0;
            
        } catch (error){
            console.error("Error in removeVote:", error);
            return false;
        }
    }
}


// console.log(await Vote.getVote(1, 1));
// await Vote.vote(19, 1, 0);
// await Vote.vote(19, 2, 0);
// await Vote.vote(19, 3, 0);
// await Vote.vote(19, 4, 1);
// await Vote.removeVotes(14, [14]);
export default Vote; 
