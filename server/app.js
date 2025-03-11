import express from 'express'
import cors from "cors"

import {createProfile, getProfile, getProfiles} from './profile.js'

const app = express()

app.use(express.json()) // any json.body will be accepted and passed through req.body
app.use(cors());

// TESTING WITH THUNDER CLIENT BTW!!

app.get('/profiles', async (req, res) => {  // gets all profiles
  const profile = await getProfiles()
  res.send(profile)
})

app.get('/profiles/:userName', async (req, res) => {  // gets individual profiles based on usernames (just to test can change later)
  const userName = req.params.userName
  const profile = await getProfile(userName)
  res.send(profile)
})

app.post('/profiles', async (req, res) => {
  const {userID, username, name, email, zipCode, password, businessAccount} = req.body
  const profile = await createProfile(userID, username, name, email, zipCode, password, businessAccount)
  res.status(201).send(profile)
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

const port = 8080;
app.listen(port, () => {
  console.log('Server is running on port ' + port)
})