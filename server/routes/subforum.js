import { Router } from "express";  // create an instance of an express router
import pool from "../functions/pool.js"

const router = Router();  // groups together requests

/**
 * @route GET /subforums
 * @description Fetch all subforums with valid IDs (> 0)
 * @returns {Object} 200 - Array of subforum records
 * @returns {Object} 406 - Error querying subforums
 */
router.get('/subforums', async (req, res) => {

  try {
    const [rows] = await pool.query("SELECT * FROM subforums WHERE subforum_id > 0")
    return res.status(200).json({rows});
  } catch(e){
      console.log(e)
      return res.status(406).json({ error : e});
  }
})

/**
 * @route GET /get/subforum/:name
 * @description Get subforum ID by subforum name
 * @param {string} req.params.name - Subforum name
 * @returns {Object} 200 - Subforum ID
 * @returns {Object} 406 - Error retrieving subforum ID
 */
router.get('/get/subforum/:name', async (req, res) => {
  const subforumName = req.params.name;
  try {
    const [rows] = await pool.query("SELECT subforum_id FROM subforums WHERE name = ?", [subforumName]);
    const subforumId = rows[0].subforum_id;
    return res.status(200).json({subforumId});
  } catch(e){
      console.log(e)
      return res.status(406).json({ error : e});
  }
})

export default router;