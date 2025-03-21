import { Router } from "express";  // create an instance of an express router
import pool from "../functions/pool.js"


const router = Router();  // groups together requests

router.get('/subforums', async (req, res) => {

  try {
    const [rows] = await pool.query("SELECT * FROM subforums")
    return res.status(200).json({rows});
  } catch(e){
      console.log(e)
      return res.status(406).json({ error : e});
  }
})

export default router;