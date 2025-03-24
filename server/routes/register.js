import { Router } from "express";
import Register from "../functions/register_functions.js";

const router = Router();

router.post('/register', async (req, res) => {
  const {username, name, email, zipCode, password, confirmPassword, accountType} = req.body
  
  const errors = await Register.getErrors(username, password, zipCode, email, confirmPassword); 
  if(errors.length > 0) return res.status(400).json({ errors });

  await Register.createProfile(username, name, email, zipCode, password, accountType === "businessAccount" ? true : false);

  const newUser = await Register.getProfile(username);
  if (!newUser) return res.status(404).json({ error: "User not found" });

  req.session.user = newUser; // automatically log in the user
  res.status(201).json({ message: "Registration successful", user: req.session.user });
})

router.get('/register/status', async (req, res) => {  // gets authentication status
  req.sessionStore.get(req.sessionID, (err, session) => {  // to see how everything is stored in memory
    console.log(session);
  })
  return req.session.user ? res.status(200).send(req.session.user) 
                          : res.status(401).send({ error: "Invalid credentials" });
})

export default router;