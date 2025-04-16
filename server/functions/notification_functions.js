import pool from './pool.js'

class Notification
{
  static async createNotif(content_id, type, username)
  {
    try{

      const fullDate = new Date();  // Get current date
      const date = fullDate.toISOString().split('T')[0];

      const [useridObj] = await pool.query("SELECT user_id FROM content WHERE content_id = ?", [content_id]);
      const user_id = useridObj[0].user_id;
      // console.log(user_id);
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
      return results;

    }catch(error){
      console.log("Error in getUserNotifs: ", error);
    }
  }

  static async getUserTypeNotifs(user_id, type)
  {
    try{
      const [results] = await pool.query("SELECT content_id FROM notifications WHERE user_id = ? AND type = ?", [user_id, type]);

      if(results.length === 0) return [];
      return results;

    }catch(error){
      console.log("Error in getUserTypeNotifs: ", error);
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
} 

// await Notification.createNotif(1, "comment");
export default Notification;