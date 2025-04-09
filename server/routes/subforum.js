import { Router } from "express";  // create an instance of an express router
import pool from "../functions/pool.js"


const router = Router();  // groups together requests

router.get('/subforums', async (req, res) => {

  try {
    const [rows] = await pool.query("SELECT * FROM subforums WHERE subforum_id > 0")
    return res.status(200).json({rows});
  } catch(e){
      console.log(e)
      return res.status(406).json({ error : e});
  }
})

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