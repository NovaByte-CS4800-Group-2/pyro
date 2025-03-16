import { Router } from "express";  // create an instance of an express router
import {checkCredentials} from '../functions/login_functions.js'
import {getProfile} from '../functions/register_functions.js'

const router = Router();  // groups together requests


router.post('/login', async (req, res) => {  // does authentication
  const {username, password} = req.body;

  if (!username || !password) return res.status(400).json({ error: "Missing username or password" });

  const isValid = await checkCredentials(password, username);  // checking if username and password match
  if(!isValid) return res.status(401).json({ error: "Invalid credentials" });  // no existing profile

  const user = await getProfile(username); // getting the profile
  if (!user) return res.status(404).json({ error: "User not found" });

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