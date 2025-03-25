import pool from "./pool.js"; 
import Content from "./content_functions.js";
import Comment from "./comment_functions.js";
import Vote from './vote_functions.js';
import Media from "./media_functions.js";

class Post
{
    static async createPost(city, username, body, files = [], file_types = []) // default values for files and file types
    {
        try {
            const post_id = await Content.createContent(city, username, body);
    
            const hasMedia = files.length > 0 ? 1 : 0;  // determine if media exists
            await pool.query("INSERT INTO posts (post_id, has_media) VALUES (?, ?)", [post_id, hasMedia]);
    
            if (hasMedia) // if media exists, store each file
            {
                const media_ids = [];
                for (let i = 0; i < files.length; i++) 
                {
                    const media_id = await Media.createMedia(post_id, files[i], file_types[i]);
                    media_ids.push(media_id);
                }
                return { post_id, media_ids };
            }
            return post_id;
    
        } catch (error) {
            console.error("Error in createPost:", error);
            return null;
        }
    }
    
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

    static async deletePost(post_id)  // deletes from comments and contents too
    {  
        try {
            await Vote.removeVotes([post_id]);
            await Comment.deleteComments(post_id);
            const [postResult] = await pool.query("DELETE FROM posts WHERE post_id = ?", [post_id]);
            const contentResult = await Content.deleteContent(post_id);
            return postResult.affectedRows > 0 && contentResult;

        } catch(error){
            console.error("Error in deletePost:", error);
            return false;
        }
    }

    static async getSubforumPosts(subforum_id)  // only returns posts NOT comments
    {
        try {
            const [rows] = 
            await pool.query("SELECT c.* FROM content c JOIN posts p ON c.content_id = p.post_id WHERE c.subforum_id = ?", 
                [subforum_id]);
            return rows.length > 0 ? rows : [];

        } catch(error){
            console.error("Error in getPosts:", error);
            return null;
        }
    }

    static async getUserPosts(user_id)  // return all posts a user made NOT comments
    {
        try {
            const [rows] = 
            await pool.query("SELECT c.* FROM content c JOIN posts p ON c.content_id = p.post_id WHERE c.user_id = ?", 
                [user_id]);
            return rows.length > 0 ? rows : [];

        } catch(error){
            console.error("Error in getPosts:", error);
            return null;
        }
    }

    static async getUserPost(post_id)  // return all posts a user made NOT comments
    {
        try {
            const [rows] = await pool.query("SELECT * FROM content WHERE content_id = ?", [post_id]);
            return rows.length > 0 ? rows : [];

        } catch(error){
            console.error("Error in getPosts:", error);
            return null;
        }
    }
}

// await Post.deletePost(14);
export default Post;