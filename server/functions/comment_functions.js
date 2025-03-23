import pool from "./pool.js"
import Content from "./content_functions.js";
import Vote from './vote_functions.js';

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

    static async deleteComment(comment_id)  // a single comment is deleted
    {
        try {
            const deletedVotes = await Vote.removeVotes([comment_id]);
            const [deleteCommentResult] = await pool.query("DELETE FROM comments WHERE comment_id = ?", [comment_id]);
            const deleteContentResult = await Content.deleteContent(comment_id);

            return deleteCommentResult.affectedRows > 0 && deleteContentResult && deletedVotes;

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
            if (commentRows.length === 0) 
            {
                console.log("No comments found to delete.");
                return true; // no comments to delete, return true
            }

            // delete from comments and content
            const commentIds = Content.getIds(commentRows);  // extract the id's
            const deletedVotes = await Vote.removeVotes(commentIds);
            const [deleteCommentResult] = await pool.query("DELETE FROM comments WHERE post_id = ? ", [post_id]);
            const deleteContentResult = await Content.deleteContents(commentIds); 

            return deleteCommentResult.affectedRows > 0 && deleteContentResult && deletedVotes;

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
// await Comment.createComment("General", "natalie", "ooga booga", 14);
// await Comment.createComment("General", "natalie", "TYPE SHIT", 14);
// await Comment.createComment("General", "natalie", "YUHHHHHHHHH", 14);
// await Comment.createComment("General", "natalie", "WE IN THIS BITCH", 14);
// await Comment.deleteComment(19);

export default Comment;