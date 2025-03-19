import pool from './pool.js'

class Content 
{
  async createContent(contentID, city, username, body)
  {
    try{
      const fullDate = new Date();
      const date = fullDate.toISOString().split('T')[0];
      const subForumID = await this.getSubforumID(city);
      const userID = await this.getUserID(username);

      await pool.query("INSERT into content (content_id, subforum_id, user_id, post_date, last_edit_date, body) VALUES (?, ?, ?, ?, ?, ?)",
                      [contentID, subForumID, userID, date, date, body]);
    }catch(error){
      console.log(error);
    }
    
  }

  async getUserID(username)
  {
    try{
      const [userID] = await pool.query("SELECT user_id FROM users WHERE username = ?", [username]);
      return userID[0]?.user_id;  // returns just the id, ? is to prevent error if undefined
      
    }catch(error){
      console.log(error);
      return null;
    }
  }

  async getSubforumID(city)
  {
    try{
      const [userID] = await pool.query("SELECT subforum_id FROM subforums WHERE name = ?", [city]);
      return userID[0]?.subforum_id;  // returns just the id, ? is to prevent error if undefined
      
    }catch(error){
      console.log(error);
      return null;
    } 
  }

  async updateDate(contentID)
  {
    try{
      const fullDate = new Date();
      const date = fullDate.toISOString().split('T')[0];

      await pool.query("UPDATE content SET last_edit_date = ? WHERE content_id = ?",
                        [date, contentID]);
    }catch(error){
      console.log(error);
      return null;
    }
  }

  async updateBody(contentID, newBody)
  {
    try{
      await pool.query("UPDATE content SET body = ? WHERE content_id = ?",
                        [newBody, contentID]);
    }catch(error){
      console.log(error);
      return null;
    }
  }
}

const content = new Content();
// await content.createContent(1, "burbank", "natalie", "OMG first post!!");
// await content.updateDate(1);
await content.updateBody(1, "Upaded the post");

// console.log(await content.getUserID("natalie"))
// console.log(await content.getSubforumID("burbank"))

export default Content;