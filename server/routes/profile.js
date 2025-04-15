import { Router } from "express";
import Profile from "../functions/profile_functions.js";

const router = new Router();

/**
 * @route GET /username/:id
 * @description Get a user's username by their user ID
 * @param {string} req.params.id - User ID
 * @returns {Object} 200 - Username string
 * @returns {Object} 400 - Missing user ID
 * @returns {Object} 406 - Error retrieving username
 */
router.get('/username/:id', async (req, res) => {
  const { id } = req.params; 

  if(!id) return res.status(400).json({ error: "Missing user_id" });

  const username = await Profile.getUsername(id);
  if(!username) return res.status(406).json({ error : "problem getting the username"});

  return res.status(200).json({ username : username});
})

/**
 * @route GET /profile/:username
 * @description Get a user's profile by their username
 * @param {string} req.params.username - Username
 * @returns {Object} 200 - Profile object
 * @returns {Object} 400 - Missing username
 * @returns {Object} 406 - Error retrieving profile
 */
router.get('/profile/:username', async (req, res) => {

  const { username } = req.params; // read subforum_id from URL parameters

  if(!username) return res.status(400).json({ error: "Missing username" });

  const profile = await Profile.getProfile(username);
  if(!profile) return res.status(406).json({ error : "problem getting the profile"});

  return res.status(200).json({ profile : profile});
})

/**
 * @route POST /profile/editZipcode
 * @description Edit the zipcode of a user's profile
 * @param {string} req.body.zipcode - New zipcode
 * @param {string} req.body.user_id - User ID
 * @returns {Object} 200 - Success message
 * @returns {Object} 400 - Missing data
 * @returns {Object} 406 - Invalid zipcode
 */
router.post('/profile/editZipcode', async (req, res) => {
  const {zipcode, user_id} = req.body; // read user_id from req body 

  if(!zipcode) return res.status(400).json({ error: "Missing zipcode" });
  if(!user_id) return res.status(400).json({ error: "Missing userID" });

  const result = await Profile.editZipcode(zipcode, user_id)
  if(!result) return res.status(406).json({ error : "Invalid zipcode entered"});
  
  return res.status(200).json({msg: "Zipcode updated successfully"});
})

/**
 * @route POST /profile/editUsername
 * @description Edit the username of a user's profile
 * @param {string} req.body.username - New username
 * @param {string} req.body.user_id - User ID
 * @returns {Object} 200 - Success message
 * @returns {Object} 400 - Missing data
 * @returns {Object} 406 - Username already exists
 */
router.post('/profile/editUsername', async (req, res) => {
  const {username, user_id} = req.body; // read user_id from req body 

  if(!username) return res.status(400).json({ error: "Missing username" });
  if(!user_id) return res.status(400).json({ error: "Missing userID" });

  const result = await Profile.editUsername(username, user_id)
  if(!result) return res.status(406).json({ error : "Username already exists"});
  
  return res.status(200).json({msg:"Username updated successfully"});
})

export default router;