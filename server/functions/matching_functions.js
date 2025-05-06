import pool from './pool.js'
import dotenv from 'dotenv';
dotenv.config();

/**
 * Class for managing wildfire evacuation housing match requests.
 * Handles form creation, retrieval, deletion, and matching logic.
 */
class Matching
{

  /**
   * Creates a new matching form for a user if one doesn't already exist.
   *
   * @param {number} user_id - ID of the user submitting the form.
   * @param {string} type - Type of form ("offering" or "requesting").
   * @param {number} num_rooms - Number of rooms available or needed.
   * @param {number} num_people - Number of people to accommodate or needing accommodation.
   * @param {number} young_children - Number of young children.
   * @param {number} adolescent_children - Number of adolescent children.
   * @param {number} teenage_children - Number of teenage children.
   * @param {number} elderly - Number of elderly individuals.
   * @param {number} small_dog - Number of small dogs.
   * @param {number} large_dog - Number of large dogs.
   * @param {number} cat - Number of cats.
   * @param {number} other_pets - Number of other pets.
   * @returns {Promise<number|boolean>} - The ID of the newly created form, or `false` if the form already exists or an error occurred.
   */
  static async createForm(user_id, email, zipcode, max_distance, type, num_rooms, num_people, young_children, adolescent_children, 
                          teenage_children, elderly, small_dog, large_dog, cat, other_pets)
  {
    try{
      const exists = await this.formExists(user_id);

      if(exists) return false;

      const fullDate = new Date();  // generate current date
      const date = fullDate.toISOString().split('T')[0];

      const [result] = await pool.query(`INSERT INTO matching_request_forms (user_id, email, zipcode, max_distance, type, num_rooms, num_people, date, young_children,
                                         adolescent_children, teenage_children, elderly, small_dog, large_dog, cat, other_pets) VALUES (?, ?, 
                                         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [user_id, email, zipcode, max_distance, type, num_rooms, num_people, date, young_children, 
                                         adolescent_children, teenage_children, elderly, small_dog, large_dog, cat, other_pets])
      const form_id = result.insertId;
      return form_id;                            

    }catch(error){
      console.error("Error in createForm:", error);
            return false;
    }
  }

  /**
   * Checks if a user already has a form submitted.
   *
   * @param {number} user_id - ID of the user.
   * @returns {Promise<boolean|null>} - `true` if the form exists, `false` otherwise, or `null` if error.
   */
  static async formExists(user_id)
  {
    try{
      const [result] = await pool.query("SELECT form_id FROM matching_request_forms WHERE user_id = ?", [user_id]);

      return result.length; 

    }catch(error){
      console.error("Error in createForm:", error);
            return null;
    }
  }

  /**
   * Retrieves all forms of the opposite type for potential matches.
   *
   * @param {string} type - The type of the current user's form ("offering" or "requesting").
   * @returns {Promise<Array<Object>|boolean>} - Array of matching form data, or `false` if none found or error.
   */
  static async getForms(type)
  {
    try{
      let newType = "requesting";  // decide whch types of forms we are searching through
      if(type === "requesting") 
        newType = "offering";

      const [rows] = await pool.query(`SELECT form_id, email, zipcode, max_distance, user_id, num_rooms, num_people, young_children, adolescent_children, 
        teenage_children, elderly, small_dog, large_dog, cat, other_pets FROM matching_request_forms 
        WHERE type = ?`, [newType]);

      if(!rows.length) return false; // there were no forms to match

      return rows;

    }catch(error){
      console.log("Error in getForms:", error)
    }
  }

  /**
   * Retrieves a specific form by its ID.
   *
   * @param {number} form_id - The ID of the form to retrieve.
   * @returns {Promise<Object|boolean>} - The form data object, or `false` if not found or error.
   */
  static async getForm(form_id)
  {
    try{

      const [rows] = await pool.query(`SELECT form_id, email, zipcode, max_distance, num_rooms, num_people, young_children, adolescent_children, 
        teenage_children, elderly, small_dog, large_dog, cat, other_pets FROM matching_request_forms 
        WHERE form_id = ?`, [form_id]);  // only retrieve relevant info

      if(!rows.length) return false; // no form existis with that id
      return rows[0];

    }catch(error){
      console.log("Error in getForm:", error)
    }
  }

    /**
   * Retrieves a specific form by its user's ID.
   *
   * @param {number} user_id - The ID of the user whose form is to be retrieved.
   * @returns {Promise<Object|boolean>} - The form data object, or `false` if not found or error.
   */
    static async getUserForm(user_id)
    {
      try{
  
        const [rows] = await pool.query(`SELECT user_id, form_id, type, num_rooms, num_people, young_children, adolescent_children, 
          teenage_children, elderly, small_dog, large_dog, cat, other_pets FROM matching_request_forms 
          WHERE user_id = ?`, [user_id]);  // only retrieve relevant info
  
        if(!rows.length) return false; // no form exists with that id
        return rows[0];
  
      }catch(error){
        console.log("Error in getUserForm:", error)
      }
    }

  /**
   * Finds potential matching forms based on compatibility scoring.
   *
   * @param {number} form_id - The ID of the form to match.
   * @param {string} type - The type of the original form ("offering" or "requesting").
   * @returns {Promise<Array<Object>|boolean>} - Array of matched forms, or `false` if none found or error.
   */
  static async match(form_id, type) {
    try {
      const match_form = await this.getForm(form_id);  // form that needs to be matched
      const forms = await this.getForms(type); // forms that are going to be searched through
      if (!forms || !match_form) return false; // no forms to match
  
      const matches = [];
  
      for (const form of forms) {
        const apiKey = process.env.ZIPCODE_API_KEY;
        if (!apiKey) {
          console.error("ZIPCODE_API_KEY is not defined in the environment.");
          return false;
        }
        const url = `https://www.zipcodeapi.com/rest/${apiKey}/distance.json/${match_form["zipcode"]}/${form["zipcode"]}/mile`;

        let distance = 0;
        try {
          const response = await fetch(url);
          const data = await response.json();
  
          console.log("ZIP API response:", data);
  
          if (data.error_msg) {
            console.log(`API Error between ${match_form["zipcode"]} and ${form["zipcode"]}: ${data.error_msg}`);
            continue;
          }
  
          distance = data.distance;
          console.log(`Distance between ${match_form["zipcode"]} and ${form["zipcode"]}:`, distance);

          let max_distace = match_form["max_distance"];
          if(type === "offering")
            max_distace = form["max_distance"];

          if (distance > max_distace) continue;  // Skip forms too far away
  
        } catch (err) {
          console.log(`Failed to get distance for zipcodes ${match_form["zipcode"]} and ${form["zipcode"]}:`, err);
          continue; // skip this form if distance couldn't be fetched
        }
  
        let score = 0;
        for (const key in form) {
          if (key !== "form_id" && key !== "zipcode" && key !== "max_distance" && type === "offering") {
            if (form[key] <= match_form[key]) score++;
          } else if (key !== "form_id" && key !== "zipcode" && key !== "max_distance" && type === "requesting") {
            if (form[key] >= match_form[key]) score++;
          }
        }
  
        if (score > 7) matches.push(form);  // threshold for the match
      }
  
      console.log("done matching!!!");
      if (matches.length === 0) return false;  // no matches were found
      return matches;
  
    } catch (error) {
      console.log("Error in match:", error);
      return false;
    }
  }

  /**
   * Deletes a specific form by ID.
   *
   * @param {number} form_id - ID of the form to delete.
   * @returns {Promise<boolean>} - `true` if deletion was successful, `false` otherwise.
   */
  static async deleteForm(form_id)
  {
    try{
      const [result] = await pool.query("DELETE FROM matching_request_forms WHERE form_id = ?", [form_id])
            return result.affectedRows > 0;
    }catch(error){
      console.log("error in deleteForm:", error);
      return false;
    }
  }

  /**
   * Deletes multiple forms by their IDs.
   *
   * @param {Array<number>} form_ids - Array of form IDs to delete.
   * @returns {Promise<boolean>} - `true` if deletion was successful, `false` otherwise.
   */
  static async deleteForms(form_ids) 
  {
    try{
      const [result] = await pool.query("DELETE FROM matching_request_forms WHERE form_id IN (?)", [form_ids])
            return result.affectedRows == form_ids.length;
    }catch(error){
      console.log("error in deleteForms:", error);
      return false;
    }
  }
}

export default Matching;