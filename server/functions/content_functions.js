import pool from './pool.js'

class Content 
{
  async updateInfo(contentID, city, name, postDate, lastEditDate, body)
  {
    this.contentID = contentID;

    const subForumID = await this.getSubforumID(city);
    this.subForumID = subForumID;
    console.log(this.subForumID);

    const userID = await this.getUserID(name);
    this.userID = userID;
    console.log(this.userID);
    
    this.postDate = postDate;
    this.lastEditDate = lastEditDate;
    this.body = body;
  }
  async createContent()
  {
    try{
      await pool.query("INSERT into content (content_id, subforum_id, user_id, post_date, last_edit_date, body) VALUES (?, ?, ?, ?, ?, ?)",
                      [this.contentID, this.subForumID, this.userID, this.postDate, this.lastEditDate, this.body]);
    
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

  async getSubforumID(name)
  {
    try{
      const [userID] = await pool.query("SELECT subforum_id FROM subforums WHERE name = ?", [name]);
      return userID[0]?.subforum_id;  // returns just the id, ? is to prevent error if undefined
      
    }catch(error){
      console.log(error);
      return null;
    }
  }
}

const content = new Content();
await content.updateInfo(1, "burbank", "natalie", "2023-12-20", "2023-12-20", "OMG first post!!");
await content.createContent();

// console.log(await content.getUserID("natalie"))
// console.log(await content.getSubforumID("burbank"))

export default Content;