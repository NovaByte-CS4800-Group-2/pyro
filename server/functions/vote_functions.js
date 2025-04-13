import pool from "./pool.js";

class Vote
{
    /**
     * Casts or updates a vote.
     * 
     * @param {number} content_id - ID of the content (post or comment) being voted on
     * @param {number} user_id - ID of the user casting the vote
     * @param {number} value - Vote value (1 for upvote, 0 for downvote)
     * @returns {boolean} - Returns true if vote was successful, false on error
     */
    static async vote(content_id, user_id, value)
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

    /**
     * Retrieves a specific user's vote on a piece of content.
     * 
     * @param {number} content_id - ID of the content
     * @param {number} user_id - ID of the user
     * @returns {number|null} - Returns vote value (0 or 1), or null if no vote exists
     */

    static async getVote(content_id, user_id)
    {
        try {
            const [rows] = await pool.query("SELECT value from votes WHERE content_id = ? AND user_id = ?", [content_id, user_id])

            if(rows.length == 0) return null;
            return rows[0].value[0];

        } catch (error) {
            console.error("Error in getVote:", error);
            return null;
        }
    }

    /**
     * Retrieves all vote records for a piece of content.
     * 
     * @param {number} content_id - ID of the content
     * @returns {Array<Object>} - Array of vote objects or empty array on error
     */
    static async getVotes(content_id)
    {
        try {
            const [rows] = await pool.query("SELECT * from votes WHERE content_id = ?", [content_id])

            if(rows.length == 0) return null;
            return rows;

        } catch (error) {
            console.error("Error in getVotes:", error);
            return null;
        }
    }

    /**
     * Retrieves the number of upvotes for a piece of content.
     * 
     * @param {number} content_id - ID of the content
     * @returns {number} - Number of upvotes, or 0 on error
     */
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

    /**
     * Retrieves the number of downvotes for a piece of content.
     * 
     * @param {number} content_id - ID of the content
     * @returns {number} - Number of downvotes, or 0 on error
     */
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

    /**
     * Calculates the net vote score for a piece of content (upvotes - downvotes).
     * 
     * @param {number} content_id - ID of the content
     * @returns {number|null} - Net vote score, or null on error
     */
    static async getTotalVotes(content_id)
    {
        try{
            const upvotes = await this.getUpVotes(content_id);  // get upvote count
            const downvotes = await this.getDownVotes(content_id);  // get downvote count
            const total = upvotes - downvotes;
            return total;

        }catch (error) {
            console.error("Error in getVotes:", error);
            return null;
        }
    }

    /**
     * Retrieves all votes cast by a specific user.
     * 
     * @param {number} user_id - ID of the user
     * @returns {Array<Object>} - Array of vote records or empty array on error
     */
    static async getUserVotes(user_id)
    {
        try {
            const [rows] = await pool.query("SELECT * from votes WHERE user_id = ?", [user_id])
            return rows;

        } catch (error) {
            console.error("Error in getUserVotes:", error);
            return null;
        }
    }

    /**
     * Removes a specific vote by a user on a piece of content.
     * 
     * @param {number} content_id - ID of the content
     * @param {number} user_id - ID of the user
     * @returns {boolean} - True if vote was deleted, false otherwise
     */

    static async removeVote(content_id, user_id) 
    {
        try{
            const [result] = await pool.query("DELETE FROM votes WHERE content_id = ? and user_id = ?", [content_id, user_id])
            return result.affectedRows > 0;
            
        } catch (error){
            console.error("Error in removeVote:", error);
            return false;
        }
    }

    /**
     * Removes all votes associated with a list of content IDs.
     * 
     * @param {number[]} content_ids - Array of content IDs to remove votes for
     * @returns {boolean} - True if any votes were deleted, false otherwise
     */
    static async removeVotes(content_ids) 
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

export default Vote; 
