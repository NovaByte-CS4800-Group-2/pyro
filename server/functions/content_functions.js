import pool from './pool.js'

class Content 
{
  static async createContent(city, username, body)
  {
    try{
      const fullDate = new Date();
      const date = fullDate.toISOString().split('T')[0];
      const subForumID = await this.#getSubforumID(city);
      const userID = await this.#getUserID(username);

      const [result] = await pool.query("INSERT into content (subforum_id, user_id, post_date, last_edit_date, body) VALUES (?, ?, ?, ?, ?)",
                      [subForumID, userID, date, date, body]); // how to find content ID?
      
      const content_id = result.insertId;
      return content_id;

    }catch(error){
      console.error("Error in createContent:", error);
      return null;
    }
  }

  static async getPosts(subforum_id)
  {
    try {
      const [posts] = await pool.query("SELECT * from content where subforum_id = ?", [subforum_id]);
      return posts.length > 0 ? posts : [];

    } catch (error) {
      console.error("Error in getPosts:", error);
      return null;
    }
  }

  static async updateContent(contentID, newBody)
  {
    try{
      const fullDate = new Date();
      const date = fullDate.toISOString().split('T')[0];
      const [updateResult] = await pool.query("UPDATE content SET body = ?, last_edit_date = ? WHERE content_id = ?",
                                              [newBody, date, contentID]);

      return updateResult.affectedRows > 0;

    }catch(error){
      console.error("Error in updateContent:", error);
      return null;
    }
  }

  static async #getUserID(username)
  {
    try{
      const [userID] = await pool.query("SELECT user_id FROM users WHERE username = ?", [username]);
      return userID[0]?.user_id;  // returns just the id, ? is to prevent error if undefined
      
    }catch(error){
      console.error("Error in getUserID:", error);
      return null;
    }
  }

  static async #getSubforumID(city)
  {
    try{
      const [SubforumID] = await pool.query("SELECT subforum_id FROM subforums WHERE name = ?", [city]);
      return SubforumID[0]?.subforum_id;  // returns just the id, ? is to prevent error if undefined
      
    }catch(error){
      console.error("Error in getSubforumID:", error);
      return null;
    } 
  }
}

export default Content;