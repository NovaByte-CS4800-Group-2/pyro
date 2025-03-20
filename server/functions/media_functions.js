import pool from './pool.js'

class Media 
{
  async createMedia(fileURL, filetype)
  {
    try{
      const file = "null"

      if (filetype == "image") {
        file = this.file; 
        const response = await fetch(file);
        file = await response.blob(); // converts the image into the blob file to be stored
      }
      else if (filetype == "video") {

      }

      const post_id = await this.getPostID();
      const file_type = this.filetype;
      const [result] = await pool.query("INSERT into media (post_id, file, file_type) VALUES (?, ?, ?)",
                      [post_id, file, file_type]); 
      const media_id = result.insertId;

      
      console.log(content_id);
    }catch(error){
      console.log(error);
    }
  }

  async editMedia(imageFile, post_id)
  {
    try{
      const [userID] = await pool.query("UPDATE media SET file = ? WHERE post_id = ?", [imageFile, post_id]);
      return userID[0]?.subforum_id;  // returns just the id, ? is to prevent error if undefined
      
    }catch(error){
      console.log(error);
      return null;
    } 
  }

  async getMedia(post_id){
    const [media] = pool.query("SELECT * FROM media WHERE post_id = ?", [post_id])
    console.log(media);
    return media;
  }

}

const content = new Content();
await content.createMedia("Los Angeles", "kait", "Some random message")


export default Media;