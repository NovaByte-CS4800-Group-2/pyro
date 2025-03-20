import pool from "./pool.js"; 
import {createContent} from "./content_functions.js";

class Post{

    async createPost(city, username, body, has_media){
        try {
            const post_id = await createContent(city, username, body)
            await pool.query("INSERT into posts (has_media) VALUES (?)", [post_id, has_media])
        } catch(e) {
            console.log(e)
        }
    }
}

//const post = new Post();
//await post.createPost(0); 

export default Post;