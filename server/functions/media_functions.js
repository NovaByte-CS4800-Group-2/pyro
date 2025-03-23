import pool from './pool.js'

class Media 
{
  static async createMedia(post_id, file, filetype)
  {
    try{

      const [result] = await pool.query("INSERT into media (post_id, file, file_type) VALUES (?, ?, ?)",
                      [post_id, file, filetype]); 
      const media_id = result.insertId;
      return media_id; 

    }catch(error){
      console.log(error);
    }
  }

  static async editMedia(newFile, post_id, media_id)
  {
    try{
      await pool.query("UPDATE media SET file = ? WHERE post_id = ? AND media_id = ?", [newFile, post_id, media_id]);
      
    }catch(error){
      console.log(error);
      return null;
    } 
  }

  static async getMedia(post_id){
    const [media] = pool.query("SELECT * FROM media WHERE post_id = ?", [post_id])
    console.log(media);
    return media;
  }

}

export default Media;