import pool from "./pool.js"
import Content from "./content_functions.js";

class Comment 
{
    static async createComment(city, username, body, post_id)
    {
        try {
            const comment_id = await createContent(city, username, body)
            await pool.query("INSERT into comments (comment_id, post_id) VALUES (?, ?)", [comment_id, post_id])
        } catch(error) {
            console.error("Error in createComment:", error);
            return null;
        }
    }

    static async deleteComment(content_id)
    {
        try {
            const [deleteCommentResult] = await pool.query("DELETE FROM comments WHERE comment_id = ?", [content_id]);
            const deleteContentResult = await Content.deleteContent(content_id);

            return deleteCommentResult.affectedRows > 0 && deleteContentResult;

        } catch(error){
            console.error("Error in deleteComment:", error);
            return false;
        }
    }

    static async getComments(post_id)
    {
        try {
            const [commentIdsRows] = await pool.query("SELECT comment_id FROM comments WHERE post_id = ?", [post_id])
            if (commentIdsRows.length === 0) return []; // no comments for the given post_id

            const commentIds = commentIdsRows.map(row => row.comment_id);  // extract the comment_id values
            const [contentRows] = await pool.query("SELECT * FROM content WHERE content_id IN (?)", [commentIds]);

            console.log(contentRows);
            return contentRows;

        } catch(error){
            console.error("Error in getComments:", error);
            return null;
        }
    }
}

await Comment.getComments(3);

export default Comment;