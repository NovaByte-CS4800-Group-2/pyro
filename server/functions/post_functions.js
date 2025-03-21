import pool from "./pool.js"; 
import Content from "./content_functions.js";

class Post{
    
    static async createPost(city, username, body, has_media){
        try {
            const post_id = await Content.createContent(city, username, body)
            await pool.query("INSERT into posts (post_id, has_media) VALUES (?, ?)", [post_id, has_media])
            return post_id;
        } catch(e) {
            console.log(e)
            return null;
        }
    }

    static async editPost(content_id, newBody){
        try{
            Content.updateContent(content_id, newBody);
            await pool.query("UPDATE content SET body = ? WHERE content_id = ?", [newBody, content_id])
        } catch (e) {
            console.log(e)
        }
    }

    static async deletePost(content_id){
        try {
            await pool.query("DELETE FROM posts WHERE post_id = ?", [content_id])
            await pool.query("DELETE FROM content WHERE content_id = ?", [content_id])
        } catch(e){
            console.log(e)
        }
    }
}

//const post = new Post();
//await post.createPost(0); 

export default Post;