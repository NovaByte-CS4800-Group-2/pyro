import { Router } from "express";
import Profile from "../functions/profile_functions.js";


const router = new Router();

router.get('/username/:id', async (req, res) => {
  const { id } = req.params; 

  if(!id) return res.status(400).json({ error: "Missing user_id" });

  const username = await Profile.getUsername(id);
  if(!username) return res.status(406).json({ error : "problem getting the username"});

  return res.status(200).json({ username : username});
})

router.get('/profile/:username', async (req, res) => {

  const { username } = req.params; // read subforum_id from URL parameters

  if(!username) return res.status(400).json({ error: "Missing username" });

  const profile = await Profile.getProfile(username);
  if(!profile) return res.status(406).json({ error : "problem getting the profile"});

  return res.status(200).json({ profile : profile});
})

router.get('/userProfile/:id', async (req, res) => {
  const { user_id } = req.params; // read user_id from req params 

  if(!user_id) return res.status(400).json({ error: "Missing user ID" });

  const profile = await Profile.getProfile(user_id);
  if(!profile) return res.status(406).json({ error : "problem getting the profile information"});

  return res.status(200).json({ profile : profile});
})

router.post('/profile/editEmail', async (req, res) => {
  //onst email = req.params;
  const {email, user_id} = req.body; // read user_id from req params 

  if(!email) return res.status(400).json({ error: "Missing email" });
  if(!user_id) return res.status(400).json({ error: "Missing userID" });

  const result = await Profile.editEmail(email, user_id)
  if(!result) return res.status(406).json({ error : "problem updating email"});
  
  return res.status(200).json({msg: "Email updated successfully"});
})

router.post('/profile/editZipcode', async (req, res) => {
  const {zipcode, user_id} = req.body; // read user_id from req body 

  if(!zipcode) return res.status(400).json({ error: "Missing zipcode" });
  if(!user_id) return res.status(400).json({ error: "Missing userID" });

  const result = await Profile.editZipcode(zipcode, user_id)
  if(!result) return res.status(406).json({ error : "problem updating zipcode"});
  
  return res.status(200).json({msg: "Zipcode updated successfully"});
})

router.post('/profile/editPassword', async (req, res) => {
  const {password, user_id} = req.body; // read user_id from req body 

  if(!password) return res.status(400).json({ error: "Missing password" });
  if(!user_id) return res.status(400).json({ error: "Missing userID" });

  const result = await Profile.editPassword(password, user_id)
  if(!result) return res.status(406).json({ error : "problem updating password"});
  
  return res.status(200).json({msg:"Password updated successfully"});
})
export default router;