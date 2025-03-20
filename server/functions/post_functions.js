import pool from "./pool.js"; 

class Post{

    async createPost(has_media){
        try {
            await pool.query("INSERT into posts (has_media) VALUES (?)", [has_media])
        } catch(e) {
            console.log(e)
        }
    }
}

const post = new Post();
await post.createPost(0); 

export default Post;