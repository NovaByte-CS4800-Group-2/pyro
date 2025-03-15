import express from 'express'
import cors from "cors"  // a way for browsers and servers to interact
import cookieParser from 'cookie-parser' // parsing the cookies
import session from 'express-session' // for handeling sessions

import {createProfile, getProfile, getProfiles} from './profile.js'

const app = express()

app.use(express.json()); // any json.body will be accepted and passed through req.body
app.use(cookieParser('novaByte'));  // argument is the 'secret' variable for signing cookies

app.use(session({
  secret: 'novaByte',  // used to sign the cookie, change it to something secure 
  saveUninitialized: false, // false to not save unmodified data to the session store (doesn't save multiple sessions for the same user)
  resave: false, // forcing a session to be saved back to the session store if true, false if otherwise
  cookie: {
    maxAge: 60000 * 60, // (1 hour) how long we want the cookies to live, how long user can be logged in
  }, 
   
}))
// app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000',  // Adjust this to your frontend URL
  credentials: true  // Allow sending cookies across origins
}))

// TESTING WITH THUNDER CLIENT BTW!!

app.get('/profiles', async (req, res) => {  // gets all profiles
  console.log(req.cookies);  // grab cookies from req object and display in to the console
  console.log(req.signedCookies.hello);  // screte key is needed to access signd cookies
  if(req.signedCookies.hello && req.signedCookies.hello == 'world')  // check if field exists and value matches
  {
    const profile = await getProfiles()
    return res.send(profile)   
  }
  return res.send({msg : "Sorry, You need the correct cookie"}) 

})

app.get('/profiles/:userName', async (req, res) => {  // gets individual profiles based on usernames (just to test can change later)

  console.log(req.session);
  console.log(req.sessionID);
  req.sessionStore.get(req.sessionID, (err, sessionData) => { // retrieves session data from the session store using the session ID
    if(err) {
      console.log(err); // logs any error if the session retrieval fails
      throw err;
    }
    console.log(sessionData) // logs the actual session data stored for the user
  });

  const userName = req.params.userName
  const profile = await getProfile(userName)
  res.send(profile)
})

app.post('/profiles', async (req, res) => {
  const {username, name, email, zipCode, password, businessAccount} = req.body
  const profile = await createProfile(username, name, email, zipCode, password, businessAccount)
  res.status(201).send(profile)
})

app.get('/', (req, res) => {  // base URL

  console.log(req.session);  // log session information (cookie properties)
  console.log(req.sessionID);  // log session id
  req.session.visited = true;  // stops new session id's from being generated for each visit

  res.cookie('hello', 'world', {maxAge: 60000 * 60 * 2, signed: true}) // set cookie when user vists this end point
  res.status(201).send({msg: "hello!"})
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

const port = 8080;
app.listen(port, () => {
  console.log('Server is running on port ' + port)
})