import { Router } from "express";  // create an instance of an express router
import Vote from "../functions/vote_functions.js";

const router = Router();  // groups together requests

/**
 * @route POST /vote
 * @description Submit or update a vote on a post or comment
 * @body {number} content_id - ID of the content (post or comment)
 * @body {number} user_id - ID of the user submitting the vote
 * @body {number} value - Vote value (e.g., 1 for upvote, -1 for downvote, 0 for neutral)
 * @returns {Object} 201 - Vote submitted
 * @returns {Object} 400/406 - Error response
 */
router.post('/vote', async(req, res) =>{
  const {content_id, user_id, value} = req.body;

  if(!content_id || !user_id || (!value && value != 0)) return res.status(400).json({ error: "Missing value" });

  const voting = await Vote.vote(content_id, user_id, value);
  if(!voting) return res.status(406).json({ errror: "Unable to vote"});
  res.status(201).json({ msg: "successfully voted"})
})

/**
 * @route DELETE /remove/votes
 * @description Remove votes by an array of content IDs (used when deleting posts/comments)
 * @body {number[]} content_ids - Array of content IDs to remove votes from
 * @returns {Object} 201 - Votes removed
 * @returns {Object} 400/406 - Error response
 */
router.delete('/remove/votes', async(req, res) =>{  // NOTE: wantes an array of ids (used for removing from comment/post)
  const {content_ids} = req.body;

  if(!content_ids) return res.status(400).json({ error: "Missing content IDS" });

  const deleted = await Vote.removeVotes(content_ids);
  if(!deleted) return res.status(406).json({ errror: "Unable to remove votes"});
  res.status(201).json({ msg: "successfully removed votes"})
})

/**
 * @route DELETE /remove/vote/:content/:user
 * @description Remove a single user's vote from a specific content item
 * @param {string} content - Content ID
 * @param {string} user - User ID
 * @returns {Object} 201 - Vote removed
 * @returns {Object} 400/406 - Error response
 */
router.delete('/remove/vote/:content/:user', async(req, res) =>{ 
  const {content, user} = req.params;

  if(!content || !user) return res.status(400).json( { error: "Missing values" });

  const deleted = await Vote.removeVote(content, user);
  if(!deleted) return res.status(406).json({ errror: "Unable to remove vote"});
  res.status(201).json({ msg: "successfully removed vote"})
})

/**
 * @route GET /content/votes/:id
 * @description Get all votes for a specific content ID
 * @param {string} id - Content ID
 * @returns {Object} 200 - List of votes
 */
router.get('/content/votes/:id', async(req, res) => {  // dont think we really need this?
  const { id } = req.params;

  if(!id) return res.status(400).json( { error: "Missing id" });
  const votes = await Vote.getVotes(id);
  res.status(200).json({ votes: votes})
})

/**
 * @route GET /single/vote/:content/:user
 * @description Get a single vote by a user on a content item
 * @param {string} content - Content ID
 * @param {string} user - User ID
 * @returns {Object} 200 - Vote object
 */
router.get('/single/vote/:content/:user', async(req, res) => { 
  const { content, user } = req.params;

  if(!content || !user) return res.status(400).json( { error: "Missing values" });
  const vote = await Vote.getVote(content, user);
  res.status(200).json({ vote: vote})
})

/**
 * @route GET /user/votes/:id
 * @description Get all votes submitted by a user
 * @param {string} id - User ID
 * @returns {Object} 200 - List of votes
 */
router.get('/user/votes/:id', async(req, res) => {  
  const { id } = req.params;

  if(!id) return res.status(400).json( { error: "Missing id" });
  const votes = await Vote.getUserVotes(id);
  res.status(200).json({ votes: votes})
})

/**
 * @route GET /content/total/votes/:id
 * @description Get the total score (sum of votes) for a piece of content
 * @param {string} id - Content ID
 * @returns {Object} 200 - Total vote score
 */
router.get('/content/total/votes/:id', async(req, res) => {
  const { id } = req.params;

  if(!id) return res.status(400).json( { error: "Missing id" });
  const votes = await Vote.getTotalVotes(id);
  res.status(200).json({ totalVotes: votes})
})

export default router;