import pool from "./pool.js"; 
import Content from "./content_functions.js";
import Comment from "./comment_functions.js";
import Vote from './vote_functions.js';


/**
 * The Post class handles operations related to posts,
 * including creation, editing, deletion, and retrieval of posts.
 * Posts are content entries that may also contain media.
 */
class Post
{
    /**
     * Creates a new post.
     * - Creates a content entry
     * - Inserts a post entry linked to the content
     * 
     * @param {string} city - The subforum/city the post is being created in
     * @param {string} username - The username of the creator
     * @param {string} body - The text content of the post
     * @param {boolean} has_media - True if media is present, false otherwise
     * @returns {number|null} - Returns post ID or null on error
     */
    static async createPost(city, username, body)
    {
        try {
            const post_id = await Content.createContent(city, username, body);
            await pool.query("INSERT INTO posts (post_id, has_media) VALUES (?, ?)", [post_id, 0]);
            return post_id;
    
        } catch (error) {
            console.error("Error in createPost:", error);
            return null;
        }
    }
    
    static async addPostMedia(imageURLs, post_id){
        try {

            await pool.query("UPDATE posts SET has_media = ?, mediaURLs = ? WHERE post_id = ?", [1, imageURLs, post_id]);
            return post_id;
        } catch (e){
            console.log("Error in addPost Media:", e)
        }
    }
    /**
     * Edits the body content of a post.
     * @param {number} content_id - ID of the content/post
     * @param {string} newBody - New content to replace the existing body
     * @returns {boolean|null} - True if update successful, false or null otherwise
     */
    static async editPost(content_id, newBody)
    {
        try{
            const result = await Content.editContent(content_id, newBody);
            return result;

        } catch (error) {
            console.error("Error in editPost:", error);
            return false;
        }
    }

    /**
     * Deletes a post and all its related content:
     * - Votes
     * - Comments (and their votes/content)
     * - The post's own content entry
     * 
     * @param {number} post_id - ID of the post to delete
     * @returns {boolean} - True if deletion successful
     */
    static async deletePost(post_id)
    {  
        try {
            await Vote.removeVotes([post_id]);  // deleting post votes
            await Comment.deleteComments(post_id);  // deletes comments (votes and content ssociated with it as well)
            const [postResult] = await pool.query("DELETE FROM posts WHERE post_id = ?", [post_id]);  // delete the post
            const contentResult = await Content.deleteContent(post_id);  // delete post content
            return postResult.affectedRows > 0 && contentResult;

        } catch(error){
            console.error("Error in deletePost:", error);
            return false;
        }
    }

    /**
     * Retrieves all posts from a given subforum (excluding comments).
     * @param {number} subforum_id - The subforum to get posts from
     * @returns {Array|null} - Array of post rows or null on error
     */
    static async getSubforumPosts(subforum_id) 
    {
        try {
            const [rows] = 
            await pool.query("SELECT c.* FROM content c JOIN posts p ON c.content_id = p.post_id WHERE c.subforum_id = ?",
                [subforum_id]);  // query into 2 tables instead of having two seperate statements
            if(rows.length === 0) return [];
            return rows.reverse();

        } catch(error){
            console.error("Error in getPosts:", error);
            return null;
        }
    }

    /**
     * Retrieves all posts (not comments) made by a specific user.
     * @param {number} user_id - ID of the user
     * @returns {Array|null} - Array of post rows or null on error
     */
    static async getUserPosts(user_id)
    {
        try {
            const [rows] = 
            await pool.query("SELECT c.* FROM content c JOIN posts p ON c.content_id = p.post_id WHERE c.user_id = ?", 
                [user_id]);
            if(rows.length === 0) return [];
            return rows.reverse();

        } catch(error){
            console.error("Error in getPosts:", error);
            return null;
        }
    }

    /**
     * Retrieves a single post by its post ID.
     * @param {number} post_id - The post/content ID
     * @returns {Object[]|null} - Post content row or null on error
     */
    static async getUserPost(post_id)
    {
        try {
            const [rows] = await pool.query("SELECT * FROM content WHERE content_id = ?", [post_id]);
            return rows[0];

        } catch(error){
            console.error("Error in getPosts:", error);
            return null;
        }
    }

    static async getPostMedia(post_id)
    {
        try {
            const [row] = await pool.query("SELECT mediaURLs from posts WHERE post_id =?", [post_id]);
            if (row.length ==0 ){
                //console.log("No post with post_id", post_id)
                return []
            }
            const mediaURLs = row[0].mediaURLs;
            if (!mediaURLs || mediaURLs.trim() === "") {
                //console.log("No media URLs found.");
                return []; // Return an empty array if the value is empty or invalid
              }
            const URLS = JSON.parse(row[0].mediaURLs)
            return URLS
        } catch (e){
            //console.log("Error in getPostMedia:", e)
        }
    }
}

export default Post;