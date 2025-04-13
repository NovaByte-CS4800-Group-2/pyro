import { Router } from "express";
import Register from "../functions/register_functions.js";

const router = Router();

router.post('/register', async (req, res) => {
  const {user_id, username, name, zipCode, password, confirmPassword, accountType} = req.body
  
  const errors = await Register.getErrors(username, password, zipCode, confirmPassword); 
  if(errors.length > 0) return res.status(400).json({ errors });

  await Register.createProfile(user_id, username, name, zipCode, accountType === "businessAccount" ? true : false);

  const newUser = await Register.getProfile(username);
  if (!newUser) return res.status(404).json({ error: "User not found" });

  return res.status(201).json({ newUser });
})

export default router;