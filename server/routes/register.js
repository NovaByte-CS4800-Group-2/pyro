import { Router } from "express";
<<<<<<< HEAD
import Register from "../functions/register_functions.js";
=======
import {createProfile, getProfile, checkUsername} from '../functions/register_functions.js'
import { validatePassword } from "../functions/register_functions.js";
>>>>>>> f25b2c2130b854901c303a768233e8bdfe86c922

const router = Router();

router.post('/register', async (req, res) => {
<<<<<<< HEAD
  const {username, name, email, zipCode, password, confirmPassword, accountType} = req.body
  
  const errors = await Register.getErrors(username, password, zipCode, email, confirmPassword); 
  if(errors.length > 0) return res.status(400).json({ errors });

  await Register.createProfile(username, name, email, zipCode, password, accountType === "businessAccount" ? true : false);

  const newUser = await Register.getProfile(username);
=======
  const {username, name, email, zipCode, password, accountType} = req.body

  // if(!checkUsername(username)) return res.status(406).send({error : "Username exists"});  // duplicate username

  // const pass = validatePassword(password);
  // if(pass.length != 0) return res.status(406).send(pass); // sending the string with error messages

  await Register.createProfile(username, name, email, zipCode, password, accountType === "businessAccount" ? true : false);

  const newUser = await getProfile(username); // getting the profile
>>>>>>> f25b2c2130b854901c303a768233e8bdfe86c922
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