import express from 'express'
import cors from "cors"

import {getNotes, getNote, createNote} from './database.js'

const app = express()

app.use(express.json()) // any json.body will be accepted and passed through req.body
app.use(cors());

app.get('/notes', async (req, res) => {
  const notes = await getNotes()
  res.send(notes)
})

app.get('/notes/:id', async (req, res) => {
  const id = req.params.id
  const note = await getNote(id)
  res.send(note)
})

app.post('/notes', async (req, res) => {
  const {title, content} = req.body
  const note = await createNote(title, content)
  res.status(201).send(note)
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

const port = 8080;
app.listen(port, () => {
  console.log('Server is running on port ' + port)
})