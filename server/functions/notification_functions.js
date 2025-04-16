import pool from './pool.js'

class Notification
{
  static async createNotif(user_id, content_id, type)
  {
    try{
      const [result] = await pool.query("INSERT INTO notifications (user_id, content_id, type, read) VALUES (?, ?, ?, 0)", [user_id, content_id, type]);
      const notification_id = result.insertId;  // Extract and return the notification_id that is generated
      return notification_id;

    }catch(error){
      console.log("Error in createNotif: ", errror);
    }
  }

  static async getUserNotifs(user_id)
  {
    try{
      const [results] = await pool.query("SELECT content_id, type FROM notifications WHERE user_id = ?", [user_id]);

      if(results.length === 0) return [];
      return results;

    }catch(error){
      console.log("Error in getUserNotifs: ", errror);
    }
  }

  static async getUserTypeNotifs(user_id, type)
  {
    try{
      const [results] = await pool.query("SELECT content_id FROM notifications WHERE user_id = ? AND type = ?", [user_id, type]);

      if(results.length === 0) return [];
      return results;

    }catch(error){
      console.log("Error in getUserTypeNotifs: ", errror);
    }
  }

  static async removeNotif(notification_id)
  {
    try{
      const [deletedResult] = await pool.query("DELETE FROM notifications WHERE notification_id = ?", [notification_id]);
      return deletedResult.affectedRows > 0;

    }catch(error){
      console.log("Error in removeNotif: ", errror);
    }
  }
} 

export default Notification;