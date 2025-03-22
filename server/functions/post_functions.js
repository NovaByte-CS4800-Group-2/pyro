import pool from "./pool.js"; 
import Content from "./content_functions.js";
import Comment from "./comment_functions.js";

class Post{
    
    static async createPost(city, username, body, has_media)
    {
        try {
            const post_id = await Content.createContent(city, username, body)
            await pool.query("INSERT into posts (post_id, has_media) VALUES (?, ?)", [post_id, has_media])
            return post_id;

        } catch(error) {
            console.error("Error in createPost:", error);
            return null;
        }
    }

    static async editPost(content_id, newBody)
    {
        try{
            const result = await Content.editContent(content_id, newBody);
            return result.affectedRows > 0;

        } catch (error) {
            console.error("Error in editPost:", error);
            return false;
        }
    }

    static async deletePost(post_id)  // delets from comments and contents too
    {  
        try {
            const [postResult] = await pool.query("DELETE FROM posts WHERE post_id = ?", [post_id]);
            const contentResult = await Content.deleteContent(post_id);
            const commentResult = await Comment.deleteComments(post_id);
            return postResult.affectedRows > 0 && contentResult && commentResult;

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

    static async getUserPosts(user_id)  // return all posts a user made
    {
        try {
            const [rows] = await pool.query("SELECT * FROM content WHERE user_id = ?", [user_id]);
            return rows.length > 0 ? rows : [];

        } catch(error){
            console.error("Error in getPosts:", error);
            return null;
        }
    }
}

// console.log(await Post.getSubforumPosts(1))
export default Post;