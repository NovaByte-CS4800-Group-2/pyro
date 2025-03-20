import pool from "./pool.js"

class Comment {
    async createComment(city, username, body, post_id){
        try {
            const comment_id = await createContent(city, username, body)
            await pool.query("INSERT into comments (comment_id, post_id) VALUES (?)", [post_id, comment_id])
        } catch(e) {
            console.log(e)
        }
    }

    async editComment(content_id, newContent){
        await pool.query("UPDATE content SET body = ? WHERE content_id = ?", [content_id, newContent])
    }

    async deleteComment(content_id){
        try {
            await pool.query("DELETE FROM comment WHERE comment_id = ?", [content_id])
            await pool.query("DELETE FROM content WHERE content_id = ?", [content_id])
        } catch(e){
            console.log(e)
        }
    }
}