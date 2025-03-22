import pool from "./pool.js"
import Content from "./content_functions.js";

class Comment 
{
    static async createComment(city, username, body, post_id)  // a single comment created
    {
        try {
            const comment_id = await Content.createContent(city, username, body)
            await pool.query("INSERT into comments (comment_id, post_id) VALUES (?, ?)", [comment_id, post_id])
        } catch(error) {
            console.error("Error in createComment:", error);
            return null;
        }
    }

    static async editComment(content_id, newBody)
    {
        try{
            const result = await Content.editContent(content_id, newBody);
            return result.affectedRows > 0;

        } catch (error) {
            console.error("Error in editComment:", error);
            return false;
        }
    }

    static async deleteComment(content_id)  // a single comment is deleted
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

    static async deleteComments(post_id)  // use when a post is deleted to remove all associated commments
    {
        try {
            // select the comments
            const [commentRows] = await pool.query("SELECT comment_id FROM comments WHERE post_id = ?", [post_id])
            const commentIds = Content.getIds(commentRows);  // extract the id's

            if (commentIds.length === 0) 
            {
                console.log("No comments found to delete.");
                return []; // no comments to delete, return empty array
            }

            // delete from comments and content
            const [deleteCommentResult] = await pool.query("DELETE FROM comments WHERE post_id = ? ", [post_id]);
            const deleteContentResult = await Content.deleteContents(commentIds); 

            return deleteCommentResult.affectedRows > 0 && deleteContentResult;

        } catch(error){
            console.error("Error in deleteComment:", error);
            return false;
        }
    }

    static async getComments(post_id)  // returns all the comments for a post
    {
        try {
            const [commentIdsRows] = await pool.query("SELECT comment_id FROM comments WHERE post_id = ?", [post_id])
            if (commentIdsRows.length === 0) return []; // no comments for the given post_id

            const commentIds = Content.getIds(commentIdsRows);
            const [contentRows] = await pool.query("SELECT * FROM content WHERE content_id IN (?)", [commentIds]);

            return contentRows;

        } catch(error){
            console.error("Error in getComments:", error);
            return null;
        }
    }
}

// await Comment.getComments(3);
// await Comment.createComment("pomona", "natalie", "ooga booga", 1);
// await Comment.deleteComments(1);

export default Comment;