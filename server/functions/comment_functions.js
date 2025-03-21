import pool from "./pool.js"

class Comment 
{
    async createComment(city, username, body, post_id)
    {
        try {
            const comment_id = await createContent(city, username, body)
            await pool.query("INSERT into comments (comment_id, post_id) VALUES (?, ?)", [comment_id, post_id])
        } catch(error) {
            console.error("Error in createComment:", error);
            return null;
        }
    }

    async editComment(content_id, newContent)
    {
        try {
            const [result] = await pool.query("UPDATE content SET body = ? WHERE content_id = ?", [newContent, content_id]);
            return result.affectedRows > 0;

        } catch (error) {
            console.error("Error in editComment:", error);
            return false;
        }
    }

    async deleteComment(content_id)
    {
        try {
            const [deleteCommentResult] = await pool.query("DELETE FROM comments WHERE comment_id = ?", [content_id]);
            const [deleteContentResult] = await pool.query("DELETE FROM content WHERE content_id = ?", [content_id]);

            return deleteCommentResult.affectedRows > 0 && deleteContentResult.affectedRows > 0;

        } catch(error){
            console.error("Error in deleteComment:", error);
            return false;
        }
    }
}

export default Comment;