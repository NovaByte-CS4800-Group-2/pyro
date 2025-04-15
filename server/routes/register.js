import { Router } from "express";
import Register from "../functions/register_functions.js";

const router = Router();


/**
 * @route POST /register
 * @description Registers a new user account.
 * @body {string} user_id - Unique identifier for the user
 * @body {string} username - Desired username
 * @body {string} name - Full name of the user
 * @body {string} zipCode - ZIP code for the user
 * @body {string} password - User's chosen password
 * @body {string} confirmPassword - Repeated password to confirm match
 * @body {string} accountType - Type of account (e.g., "businessAccount")
 * 
 * @returns {201 Created} - Returns the newly created user profile
 * @returns {400 Bad Request} - Returns if validation errors are found
 * @returns {404 Not Found} - Returns if user creation was successful but retrieval fails
 */
router.post('/register', async (req, res) => {
  const {user_id, username, name, zipCode, password, confirmPassword, accountType} = req.body
  
  // Validate user input (username existence, zip code format, password match)
  const errors = await Register.getErrors(username, password, zipCode, confirmPassword); 
  if(errors.length > 0) return res.status(400).json({ errors });

  // Attempt to create a new user profile
  await Register.createProfile(user_id, username, name, zipCode, accountType === "businessAccount" ? true : false);

  // Retrieve the newly created user profile
  const newUser = await Register.getProfile(username);
  if (!newUser) return res.status(404).json({ error: "User not found" });

  return res.status(201).json({ newUser });
})

export default router;