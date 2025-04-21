import pool from './pool.js'
import Content from './content_functions.js';
import Vote from './vote_functions.js';

class Notification
{
  static async createNotif(user_id, type, username, content_id)
  {
    try{

      const fullDate = new Date();  // Get current date
      const date = fullDate.toISOString().split('T')[0];

      const [result] = await pool.query("INSERT INTO notifications (user_id, username, content_id, date, type, `read`) VALUES (?, ?, ?, ?, ?, 0)", [user_id, username, content_id, date, type]);
      const notification_id = result.insertId;  // Extract and return the notification_id that is generated
      return notification_id;

    }catch(error){
      console.log("Error in createNotif: ", error);
    }
  }

  static async createMatchingNotif(form_id, email)
  {
    try{
      // find user_id from the form_id
      const [useridObj] = await pool.query("SELECT user_id FROM matching_request_forms WHERE form_id = ?", [form_id]);
      const user_id = useridObj[0].user_id;

      const notification_id = await this.createNotif(user_id, "matching", email, form_id);
      return notification_id;

    }catch(error){
      console.log("Error in createMatchingNotif: ", error);
    }
  }

  static async createVoteNotif(content_id, user_id)
  {
    try{
      // find user_id from the content_id
      const [useridObj] = await pool.query("SELECT user_id FROM content WHERE content_id = ?", [content_id]);
      const userId = useridObj[0].user_id;

      if(user_id === userId) return -1;

      const [usernameObj] = await pool.query("SELECT username FROM users WHERE user_id = ?", [user_id]);
      const username = usernameObj[0].username;

      const notification_id = await this.createNotif(userId, "vote", username, content_id);
      return notification_id;

    }catch(error){
      console.log("Error in createVoteNotif: ", error);
    }
  }

  static async createCommentNotif(comment_id, username)
  {
    try{

      // find the post id that the comment belongs to
      const [rows] = await pool.query("SELECT post_id FROM comments WHERE comment_id = ?", [comment_id]);
      const content_id = rows[0].post_id;
    
      // from there find the user_id for the post
      const [useridObj] = await pool.query("SELECT user_id FROM content WHERE content_id = ?", [content_id]);
      const user_id = useridObj[0].user_id;
      console.log("user_id", user_id)
      const sameUser = await this.sameUser(user_id, username);
      if(sameUser) return -1;

      const notification_id = await this.createNotif(user_id, "comment", username, comment_id);
      return notification_id;

    }catch(error){
      console.log("Error in createCommentNotif: ", error);
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
        if(notification["type"] === "matching") continue;
        
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

  static async unreadNotifications(user_id)
  {
    const [unread] = await pool.query("SELECT `read` FROM notifications WHERE `read` = 0 AND user_id = ? LIMIT 1", [user_id]);
    return unread.length > 0;
  }
} 

// console.log(await Notification.createMatchingNotif(1, "jess@gmail.com"));
// console.log(await Notification.createCommentNotif(30, "Ananas"));
// console.log(await Notification.createVoteNotif(5, "Ananas"));

export default Notification;
