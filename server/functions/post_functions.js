import pool from "./pool.js"; 
import Content from "./content_functions.js";

class Post{
    
    static async createPost(city, username, body, has_media){
        try {
            const post_id = await Content.createContent(city, username, body)
            await pool.query("INSERT into posts (post_id, has_media) VALUES (?, ?)", [post_id, has_media])
            return post_id;

        } catch(error) {
            console.error("Error in createPost:", error);
            return null;
        }
    }

    static async editPost(content_id, newBody){
        try{
            const result = await Content.editContent(content_id, newBody);
            return result.affectedRows > 0;

        } catch (error) {
            console.error("Error in editPost:", error);
            return false;
        }
    }

    static async deletePost(content_id){
        try {
            const [postResult] = await pool.query("DELETE FROM posts WHERE post_id = ?", [content_id]);
            const contentResult = await Content.deleteContent(content_id);
            return postResult.affectedRows > 0 && contentResult;

        } catch(error){
            console.error("Error in deletePost:", error);
            return false;
        }
    }

    static async getPosts(subforum_id)
    {
        try {
            const [rows] = await pool.query("SELECT * FROM content WHERE subforum_id = ?", [subforum_id])
            return rows.length > 0 ? rows : [];
            
        } catch(error){
            console.error("Error in getPosts:", error);
            return null;
        }
    }
}

export default Post;