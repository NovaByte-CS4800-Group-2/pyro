import pool from './pool.js'

class Matching
{
  static async createForm(user_id, type, num_rooms, num_people, young_children, adolescent_children, 
                          teenage_children, elderly, small_dog, large_dog, cat, other_pets)
  {
    try{

      const exists = await this.formExists(user_id);

      if(exists) return false;

      const fullDate = new Date();
      const date = fullDate.toISOString().split('T')[0];

      const [result] = await pool.query(`INSERT INTO matching_request_forms (user_id, type, num_rooms, num_people, date, young_children,
                                         adolescent_children, teenage_children, elderly, small_dog, large_dog, cat, other_pets) VALUES (?, ?, 
                                         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [user_id, type, num_rooms, num_people, date, young_children, 
                                         adolescent_children, teenage_children, elderly, small_dog, large_dog, cat, other_pets])
      const form_id = result.insertId;
      return form_id;                            

    }catch(error){
      console.error("Error in createForm:", error);
            return false;
    }
  }

  static async formExists(user_id)
  {
    try{
      const [result] = await pool.query("SELECT form_id FROM matching_request_forms WHERE user_id = ?", [user_id]);

      return result.length;  // true if the user already submitted the form

    }catch(error){
      console.error("Error in createForm:", error);
            return null;
    }
  }

  static async getForms(type) // returns forms that are going to be used to match
  {
    try{
      let newType = "requesting";
      if(type === "requesting") 
        newType = "offering";

      const [rows] = await pool.query("SELECT * FROM matching_request_forms WHERE type = ?", [newType]);

      if(!rows.length) return false; // there were no forms to match

      return rows;

    }catch(error){
      console.log("Error in getForms:", error)
    }
  }

  static async getForm(form_id)
  {
    try{
      const [rows] = await pool.query("SELECT * FROM matching_request_forms WHERE form_id = ?", [form_id]);

      if(!rows.length) return false; // no form existis with that id
      return rows;

    }catch(error){
      console.log("Error in getForm:", error)
    }
  }

  static async match(form_id, type)
  {
    try{
      const match_form = await this.getForm(form_id);  // form that needs to be matched
      const forms = await this.getForms(type); // forms that are going to be searched through
      if(!forms || !match_form) return false; // no forms to match

      // for(let i = 0; i < type.length; i++)
      // {
      //   for(let j = 0; j < match_form.legnth; j++)
      //   {

      //   }
      // }
    }catch(error){
      console.log("Error in match:", error)
    }
  }
}

// console.log(await Matching.getForms("requesting"));

export default Matching;