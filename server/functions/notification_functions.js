import pool from './pool.js'
import Content from './content_functions.js';
import Vote from './vote_functions.js';
import Profile from './profile_functions.js';

class Notification
{
  static async createNotif(content_id, type, username)
  {
    try{

      const fullDate = new Date();  // Get current date
      const date = fullDate.toISOString().split('T')[0];
      let contentid = content_id;

      if (type === "comment"){
        const [rows] = await pool.query("SELECT post_id FROM comments WHERE comment_id = ?", [content_id]);
        contentid = rows[0].post_id;
      }
    
      const [useridObj] = await pool.query("SELECT user_id FROM content WHERE content_id = ?", [contentid]);
      const user_id = useridObj[0].user_id;

      const [result] = await pool.query("INSERT INTO notifications (user_id, username, content_id, date, type, `read`) VALUES (?, ?, ?, ?, ?, 0)", [user_id, username, content_id, date, type]);
      const notification_id = result.insertId;  // Extract and return the notification_id that is generated
      return notification_id;

    }catch(error){
      console.log("Error in createNotif: ", error);
    }
  }

  static async getUserNotifs(user_id)
  {
    try{
      const [results] = await pool.query("SELECT * FROM notifications WHERE user_id = ?", [user_id]);

      if(results.length === 0) return [];
      return results.reverse();

    }catch(error){
      console.log("Error in getUserNotifs: ", error);
    }
  }

  static async getNotificationContent(notifications)
  {
    let contents = [];
    try{

      for (const notification of notifications) // goes through each notification
      {
        const content = await Content.getContent(notification["content_id"]);
        if(notification["type"] === "vote")
        {
          const vote = await Vote.getVote(notification["content_id"], notification["user_id"]);
          content.vote = vote; // Add vote info as a property
        }
        else if(notification["type"] === "comment")
        {
          console.log(content);
          const [rows] = await pool.query("SELECT post_id FROM comments WHERE comment_id = ?", [notification["content_id"]]);
          if (rows.length > 0) 
          {
            const post_id = rows[0].post_id;
            const post = await Content.getContent(post_id);
            content.post = post.body;
            // console.log(post.body);
          }
        }
        contents.push(content);
      }

      if(contents.length === 0) return [];
      // console.log(contents);
      return contents;

    }catch(error){
      console.log("Error in getNotificationContent: ", error);
      return [];
    }
  }

  static async removeNotif(content_id, type)
  {
    try{
      const [deletedResult] = await pool.query("DELETE FROM notifications WHERE content_id = ? AND type = ?", [content_id, type]);
      return deletedResult.affectedRows > 0;

    }catch(error){
      console.log("Error in removeNotif: ", error);
    }
  }

  static async markRead(user_id)
  {
    try{
      const [updateResult] = await pool.query("UPDATE notifications SET `read` = 1 WHERE user_id = ? AND `read` = 0",
                                              [user_id]);

      return updateResult.affectedRows > 0;

    }catch(error){
      console.error("Error in updateContent:", error);
      return null;
    }
  }

  static async sameUser(user_id, username)
  {
    const [rows] = await pool.query("SELECT user_id FROM users WHERE username = ?", [username])
    const userId = rows[0].user_id;

    if(userId === user_id) return true;
    return false;
  }
} 

// await Notification.createNotif(1, "comment");
export default Notification;