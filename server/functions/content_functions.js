import pool from './pool.js'

/**
 * Class representing content in the application.
 * Handles creation, editing, deletion, and retrieval of content data (e.g. posts, comments).
 */
class Content 
{

  /**
   * Creates a new content entry in the database.
   * 
   * @param {string} city - The name of the subforum (city) where the content is being posted.
   * @param {string} username - The username of the person creating the content.
   * @param {string} body - The textual content/body of the post or comment.
   * @returns {Promise<number|null>} - The newly created content ID, or `null` if an error occurred.
   */
  static async createContent(city, username, body)
  {
    try{
      const fullDate = new Date();  // Get current date
      const postDate = fullDate.toISOString().split('T')[0];
      const subForumID = await this.getSubforumID(city);
      const userID = await this.getUserID(username);

      const [result] = await pool.query("INSERT into content (subforum_id, user_id, post_date, last_edit_date, body) VALUES (?, ?, ?, ?, ?)",
                      [subForumID, userID, postDate, null, body]);
      
      const content_id = result.insertId;  // Extract and return the content_id that is generated
      return content_id;

    }catch(error){
      console.error("Error in createContent:", error);
      return null;
    }
  }

  /**
   * Updates the body of an existing content item.
   * 
   * @param {number} contentID - The ID of the content to update.
   * @param {string} newBody - The new body/content to replace the old one.
   * @returns {Promise<boolean|null>} - `true` if update was successful, `false` if no rows affected, or `null` on error.
   */
  static async editContent(contentID, newBody)
  {
    try{
      const fullDate = new Date();
      const date = fullDate.toISOString().split('T')[0];  // Insert a last_edit_date into the table
      const [updateResult] = await pool.query("UPDATE content SET body = ?, last_edit_date = ? WHERE content_id = ?",
                                              [newBody, date, contentID]);

      return updateResult.affectedRows > 0;

    }catch(error){
      console.error("Error in updateContent:", error);
      return null;
    }
  }

  /**
   * Deletes a single content item from the database.
   * 
   * @param {number} contentID - The ID of the content to delete.
   * @returns {Promise<boolean>} - `true` if deletion was successful, `false` otherwise.
   */
  static async deleteContent(contentID)
  {
    try{
      const [deletedResult] = await pool.query("DELETE FROM content WHERE content_id = ?", [contentID]);
      return deletedResult.affectedRows > 0;

    }catch(error){
      console.error("Error in deleteContent:", error);
      return false;
    }
  }

  /**
   * Deletes multiple content items from the database.
   * 
   * @param {Array<number>} contentIDs - An array of content IDs to delete.
   * @returns {Promise<boolean>} - `true` if at least one row was deleted, `false` otherwise.
   */
  static async deleteContents(contentIDs)
  {
    if (!contentIDs.length) return false;

    try{
      const [deletedResult] = await pool.query("DELETE FROM content WHERE content_id IN (?)", [contentIDs]);
      return deletedResult.affectedRows > 0;

    }catch(error){
      console.error("Error in deleteContent:", error);
      return false;
    }
  }

  /**
   * Retrieves the user ID corresponding to a given username.
   * 
   * @param {string} username - The username whose ID is to be retrieved.
   * @returns {Promise<number|null>} - The user ID or `null` if not found or error occurred.
   */
  static async getUserID(username)
  {
    try{
      const [userID] = await pool.query("SELECT user_id FROM users WHERE username = ?", [username]);
      return userID[0]?.user_id;  // returns just the id, ? is to prevent error if undefined
      
    }catch(error){
      console.error("Error in getUserID:", error);
      return null;
    }
  }

  /**
   * Retrieves the subforum ID corresponding to a given city name.
   * 
   * @param {string} city - The name of the subforum (city).
   * @returns {Promise<number|null>} - The subforum ID or `null` if not found or error occurred.
   */
  static async getSubforumID(city)
  {
    try{
      const [SubforumID] = await pool.query("SELECT subforum_id FROM subforums WHERE name = ?", [city]);
      return SubforumID[0]?.subforum_id;  // returns just the id, ? is to prevent error if undefined
      
    }catch(error){
      console.error("Error in getSubforumID:", error);
      return null;
    } 
  }

  /**
     * Retrieves a single content by its content ID.
     * @param {number} content_id - The content ID
     * @returns {Object[]|null} - Content row or null on error
     */
  static async getContent(content_id)
  {
      try {
          const [rows] = await pool.query("SELECT * FROM content WHERE content_id = ?", [content_id]);
          return rows[0];

      } catch(error){
          console.error("Error in getPosts:", error);
          return null;
      }
  }

  /**
   * Extracts and returns an array of `comment_id` values from a list of row objects.
   * 
   * @param {Array<Object>} idRows - An array of objects containing `comment_id` keys.
   * @returns {Array<number>} - An array of comment IDs.
   */
  static getIds(idRows) 
    {
        return idRows.map(row => row.comment_id);
    }
}

export default Content;