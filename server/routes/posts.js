import { Router } from "express";  // create an instance of an express router
import Post from "../functions/post_functions.js";

const router = Router();  // groups together requests

/**
 * @route POST /post
 * @description Create a new post in a subforum (city)
 * @param {string} req.body.city - The subforum/city the post is being created in
 * @param {string} req.body.username - The username of the post creator
 * @param {string} req.body.body - The text content of the post
 * @returns {Object} 201 - Contains created post ID
 * @returns {Object} 400 - Missing required field
 */
router.post('/post', async (req, res) => {
  const {city, username, body} = req.body;

  if(!city) return res.status(400).json({ error: "Missing city" });
  if(!username) return res.status(400).json({ error: "Missing username" });
  if(!body) return res.status(400).json({ error: "Missing body" });

  const id = await Post.createPost(city, username, body);
  return res.status(201).json({id: id});
})

/**
 * @route POST /post/edit
 * @description Edit the body of a post
 * @param {number} req.body.content_id - ID of the post to edit
 * @param {string} req.body.newBody - New body content
 * @returns {Object} 201 - Success message
 * @returns {Object} 400 - Missing values
 * @returns {Object} 406 - Problem editing post
 */
router.post('/post/edit', async (req, res) => {
  const {content_id, newBody} = req.body;

  if(!newBody || !content_id) return res.status(400).json({ error: "Missing value" });

  const result = await Post.editPost(content_id, newBody);
  if(!result) return res.status(406).json({ error : "problem editing post"});

  return res.status(201).json({msg: "Succesfully edited post"});
})

/**
 * @route DELETE /post/delete
 * @description Delete a post by ID
 * @param {number} req.params.content_id - ID of the post to delete
 * @returns {Object} 201 - Success message
 * @returns {Object} 400 - Missing content ID
 */
router.delete('/post/delete/:id', async (req, res) => {
  const {id} = req.params;

  if(!id) return res.status(400).json({ error: "Missing content_id" });

  await Post.deletePost(id);
  return res.status(201).json({msg: "Succesfully deleted post"});
})

/**
 * @route GET /get/post/:id
 * @description Retrieve a single post by its ID
 * @param {string} req.params.id - The ID of the post to retrieve
 * @returns {Object} 200 - The post object
 */
router.get('/get/post/:id', async (req, res) => {  // get single post
  const { id } = req.params; // read subforum_id from URL parameters

  const post = await Post.getUserPost(id);
  return res.status(200).json({post});
})

/**
 * @route GET /post/:id
 * @description Retrieve all posts from a specific subforum (city)
 * @param {string} req.params.id - The subforum ID
 * @returns {Object} 200 - An array of posts
 */
router.get('/post/:id', async (req, res) => {  // get all posts from subforum
  const { id } = req.params; // read subforum_id from URL parameters

  const posts = await Post.getSubforumPosts(id);
  return res.status(200).json({posts});
})

/**
 * @route GET /userPosts/:id
 * @description Retrieve all posts by a specific user
 * @param {string} req.params.id - The user's username or ID
 * @returns {Object} 200 - Array of posts
 * @returns {Object} 400 - Missing ID
 * @returns {Object} 406 - Error fetching posts or no posts found
 */
router.get('/userPosts/:id', async (req, res) => {  // get all user posts
  const { id } = req.params; // read id from URL parameters

  if(!id) return res.status(400).json({ error: "Missing username" });
  const posts = await Post.getUserPosts(id);

  if(!posts || posts.length === 0) return res.status(406).json({ error : "problem getting the posts"});
  return res.status(200).json({posts});
})

export default router;