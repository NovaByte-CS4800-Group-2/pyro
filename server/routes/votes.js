import { Router } from "express";  // create an instance of an express router
import Vote from "../functions/vote_functions.js";


const router = Router();  // groups together requests


router.post('/vote', async(req, res) =>{
  const {content_id, user_id, value} = req.body;

  if(!content_id || !user_id || (!value && value != 0)) return res.status(400).json({ error: "Missing value" });

  const voting = await Vote.vote(content_id, user_id, value);

  if(!voting) return res.status(406).json({ errror: "Unable to vote"});

  res.status(201).json({ msg: "successfully voted"})
})

router.delete('/remove/votes', async(req, res) =>{  // NOTE: wantes an array of ids (used for removing from comment/post)
  const {content_ids} = req.body;

  if(!content_ids) return res.status(400).json({ error: "Missing content IDS" });

  const deleted = await Vote.removeVotes(content_ids);

  if(!deleted) return res.status(406).json({ errror: "Unable to remove votes"});

  res.status(201).json({ msg: "successfully removed votes"})
})

router.delete('/remove/vote/:content/:user', async(req, res) =>{ 
  const {content, user} = req.params;

  if(!content || !user) return res.status(400).json( { error: "Missing values" });

  const deleted = await Vote.removeVote(content, user);

  if(!deleted) return res.status(406).json({ errror: "Unable to remove vote"});

  res.status(201).json({ msg: "successfully removed vote"})
})

router.get('/content/votes/:id', async(req, res) => {  // dont think we really need this?
  const { id } = req.params;

  if(!id) return res.status(400).json( { error: "Missing id" });

  const votes = await Vote.getVotes(id);

  res.status(200).json({ votes: votes})
})

router.get('/single/vote/:content/:user', async(req, res) => {  // rn returns the buffer, dont know how to return only 1 or 0
  const { content, user } = req.params;

  if(!content || !user) return res.status(400).json( { error: "Missing values" });

  const vote = await Vote.getVote(content, user);

  if(vote === false) return res.status(406).json({ error: "no vote exists"})
  res.status(200).json({ vote: vote})
})

router.get('/user/votes/:id', async(req, res) => {  
  const { id } = req.params;

  if(!id) return res.status(400).json( { error: "Missing id" });

  const votes = await Vote.getUserVotes(id);

  res.status(200).json({ votes: votes})
})

router.get('/content/down/votes/:id', async(req, res) => {
  const { id } = req.params;

  if(!id) return res.status(400).json( { error: "Missing id" });

  const votes = await Vote.getDownVotes(id);

  res.status(200).json({ amount: votes})
})

router.get('/content/up/votes/:id', async(req, res) => {
  const { id } = req.params;

  if(!id) return res.status(400).json( { error: "Missing id" });

  const votes = await Vote.getUpVotes(id);

  res.status(200).json({ amount: votes})
})

export default router;