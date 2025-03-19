import pool from './pool.js'

class Media 
{
  async createMedia(filepath, filetype)
  {
    try{
      const post_id = await this.getPostID();
      const file = this.file; 
      const file_type = this.file_type;

      const [result] = await pool.query("INSERT into media (post_id, file, file_type) VALUES (?, ?, ?)",
                      [post_id, filepath, file_type]); 
      const media_id = result.insertId;

      console.log(content_id);
    }catch(error){
      console.log(error);
    }
  }

  async editPostImage(imageURL, post_id)
  {
    try{
      const [userID] = await pool.query("UPDATE SET  subforum_id FROM subforums WHERE name = ?", [city]);
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

  async getPostID(user_id, media_id){
    const result = await pooll.query; 
  }
}

const content = new Content();
// await content.createContent(1, "burbank", "natalie", "OMG first post!!");
// await content.updateDate(1);
//await content.updateBody(1, "Upaded the post");

// console.log(await content.getUserID("natalie"))
// console.log(await content.getSubforumID("burbank"))
await content.createMedia("Los Angeles", "kait", "Some random message")


export default Media;