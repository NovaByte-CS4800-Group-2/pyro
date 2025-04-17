import pool from "./pool.js"
import Content from "./content_functions.js";
import Vote from './vote_functions.js';


/**
 * Class representing a comment.
 * Provides methods to create, edit, delete, and retrieve comments.
 */
class Comment 
{
    /**
     * Create a new comment for a post.
     * 
     * @param {string} city - The city where the comment is made.
     * @param {string} username - The username of the person creating the comment.
     * @param {string} body - The body of the comment.
     * @param {number} post_id - The ID of the post the comment is associated with.
     * @returns {number|null} - The ID of the newly created comment or null in case of an error.
     */
    static async createComment(city, username, body, post_id)
    {
        try {
            const comment_id = await Content.createContent(city, username, body)
            await pool.query("INSERT into comments (comment_id, post_id) VALUES (?, ?)", [comment_id, post_id])
            return comment_id;  // Return comment id that is generated
        } catch(error) {
            console.error("Error in createComment:", error);
            return null;
        }
    }

    /**
     * Edit an existing comment's body.
     * 
     * @param {number} content_id - The ID of the content (comment) to be edited.
     * @param {string} newBody - The new body of the comment.
     * @returns {boolean} - `true` if the comment was successfully updated, `false` if an error occurred.
     */

    static async editComment(content_id, newBody)
    {
        try{
            const result = await Content.editContent(content_id, newBody);  // Only need to edit content associated with comments
            return result;

        } catch (error) {
            console.error("Error in editComment:", error);
            return false;
        }
    }

    /**
     * Delete a single comment by its ID.
     * Also removes associated votes and content.
     * 
     * @param {number} comment_id - The ID of the comment to be deleted.
     * @returns {boolean} - `true` if the comment was successfully deleted, `false` if an error occurred.
     */
    static async deleteComment(comment_id)  // a single comment is deleted
    {
        try {
            await Vote.removeVotes([comment_id]);  // Delete all votes for the comment
            const [deleteCommentResult] = await pool.query("DELETE FROM comments WHERE comment_id = ?", [comment_id]);  // Delete comment
            const deleteContentResult = await Content.deleteContent(comment_id);  // Delete content associated with comment

            return deleteCommentResult.affectedRows > 0 && deleteContentResult;  // False no comments to delete, true otherwise

        } catch(error){
            console.error("Error in deleteComment:", error);
            return false;
        }
    }

    /**
     * Delete all comments associated with a specific post.
     * 
     * @param {number} post_id - The ID of the post for which all comments should be deleted.
     * @returns {boolean} - `true` if all comments were successfully deleted, `false` if an error occurred.
     */
    static async deleteComments(post_id) 
    {
        try {
            // Select the comments
            const [commentRows] = await pool.query("SELECT comment_id FROM comments WHERE post_id = ?", [post_id])
            if (commentRows.length === 0) 
            {
                console.log("No comments found to delete.");
                return true; // No comments to delete, return true
            }

            // Delete from comments and content
            const commentIds = Content.getIds(commentRows);  // Extract the id's
            const deletedVotes = await Vote.removeVotes(commentIds);
            const [deleteCommentResult] = await pool.query("DELETE FROM comments WHERE post_id = ? ", [post_id]);
            const deleteContentResult = await Content.deleteContents(commentIds); 
            console.log(deleteCommentResult.affectedRows > 0 && deleteContentResult && deletedVotes)

            return deleteCommentResult.affectedRows > 0 && deleteContentResult && deletedVotes;

        } catch(error){
            console.error("Error in deleteComment:", error);
            return false;
        }
    }

    /**
     * Retrieve all comments for a specific post.
     * 
     * @param {number} post_id - The ID of the post to fetch comments for.
     * @returns {Array|null} - An array of content objects representing the comments, or `null` if an error occurred.
     */
    static async getComments(post_id) 
    {
        try {
            const [commentIdsRows] = await pool.query("SELECT comment_id FROM comments WHERE post_id = ?", [post_id])
            if (commentIdsRows.length === 0) return []; // no comments for the given post_id

            const commentIds = Content.getIds(commentIdsRows);  // extract comment_id's
            const [contentRows] = await pool.query("SELECT * FROM content WHERE content_id IN (?)", [commentIds]);

            return contentRows;

        } catch(error){
            console.error("Error in getComments:", error);
            return null;
        }
    }

    /**
     * Retrieve a single comment by its ID.
     * 
     * @param {number} comment_id - The ID of the comment to retrieve.
     * @returns {Array|null} - An array representing the content of the comment, or `null` if an error occurred.
     */
    static async getComment(comment_id)
    {
        try {
            const [contentRows] = await pool.query("SELECT * FROM content WHERE content_id = ?", [comment_id]);
            return contentRows;

        } catch(error){
            console.error("Error in getComments:", error);
            return null;
        }
    }
}


//console.log(await Comment.createComment("General", "jess", "new comment!", 57))
export default Comment;
