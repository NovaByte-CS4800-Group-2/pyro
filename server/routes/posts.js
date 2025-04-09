import { Router } from "express";  // create an instance of an express router
import Post from "../functions/post_functions.js";


const router = Router();  // groups together requests

router.post('/post', async (req, res) => {
  const {city, username, body} = req.body;

  if(!city || !username || !body)
    return res.status(400).json({ error: "Missing value" });

  const id = await Post.createPost(city, username, body);

  // if(!id) return res.status(406).json({ error : "problem getting the id"});

  return res.status(201).json({id: id});
})

router.get('/get/post/:id', async (req, res) => {  // get single post
  const { id } = req.params; // read subforum_id from URL parameters

  // if(!id) return res.status(400).json({ error: "Missing post_id" });

  const post = await Post.getUserPost(id);

  // if(!post || post.length === 0) return res.status(406).json({ error : "problem getting the post"});

  return res.status(200).json({post});
})

router.get('/post/:id', async (req, res) => {  // get all posts from subforum
  const { id } = req.params; // read subforum_id from URL parameters

  // if(!id) return res.status(400).json({ error: "Missing subforum_id" });

  const posts = await Post.getSubforumPosts(id);

  // if(!posts || posts.length === 0) return res.status(406).json({ error : "problem getting the posts"});

  return res.status(200).json({posts});
})

router.get('/userPosts/:id', async (req, res) => {  // get all user posts
  const { id } = req.params; // read id from URL parameters

  if(!id) return res.status(400).json({ error: "Missing username" });

  const posts = await Post.getUserPosts(id);

  if(!posts || posts.length === 0) return res.status(406).json({ error : "problem getting the posts"});

  return res.status(200).json({posts});
})

router.post('/post/edit', async (req, res) => {
  const {content_id, newBody} = req.body;

  if(!newBody || !content_id) return res.status(400).json({ error: "Missing value" });

  const result = await await Post.editPost(content_id, newBody);
  if(!result) return res.status(406).json({ error : "problem editing post"});

  return res.status(201).json({msg: "Succesfully edited post"});
})

router.post('/post/delete', async (req, res) => {
  const {content_id} = req.body;

  if(!content_id) return res.status(400).json({ error: "Missing content_id" });

  await Post.deletePost(content_id);

  return res.status(201).json({msg: "Succesfully deleted post"});
})

export default router;