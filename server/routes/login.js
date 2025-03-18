import { Router } from "express";  // create an instance of an express router
import {checkCredentials, getProfile} from '../functions/login_functions.js'
import Login from "../functions/login_functions.js";

const router = Router();  // groups together requests


router.post('/login', async (req, res) => {  // does authentication
  const {email, password} = req.body;

  if (!email || !password) return res.status(400).json({ error: "Missing email or password" });

  const login = new Login(email, password);

  const user = await login.getProfile(); // getting the profile
  if (!user) return res.status(404).json({ error: "User not found" });

  const isValid = await login.checkCredentials();  // checking if username and password match
  if(!isValid) return res.status(401).json({ error: "Invalid credentials" });  // no existing profile

  req.session.user = user;  // store user in session if found
  return res.status(200).json(user);
})
   
router.get('/login/status', async (req, res) => {  // gets authentication status

  req.sessionStore.get(req.sessionID, (err, session) => {  // to see how everything is stored in memory
    console.log(session);
  })
  return req.session.user ? res.status(200).send(req.session.user) 
                          : res.status(401).send({ error: "Invalid credentials" })
})

export default router;


// router.post('/login', async (req, res) => {  // does authentication
//   const {email, password} = req.body;

//   if (!email || !password) return res.status(400).json({ error: "Missing email or password" });

//   const user = await getProfile(email); // getting the profile
//   if (!user) return res.status(404).json({ error: "User not found" });

//   const isValid = await checkCredentials(password, email);  // checking if username and password match
//   if(!isValid) return res.status(401).json({ error: "Invalid credentials" });  // no existing profile

//   req.session.user = user;  // store user in session if found
//   return res.status(200).json(user);
   
// })