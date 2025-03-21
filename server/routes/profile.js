import { Router } from "express";
import Profile from "../functions/profile_functions.js";


const router = new Router();

router.get('/username/:id', async (req, res) => {
  const { id } = req.params; // read subforum_id from URL parameters

  if(!id) return res.status(400).json({ error: "Missing user_id" });

  const username = await Profile.getUsername(id);
  if(!username) return res.status(406).json({ error : "problem getting the username"});

  return res.status(200).json({ username : username});
})

export default router;