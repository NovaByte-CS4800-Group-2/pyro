import { Router } from "express";  // create an instance of an express router
import Post from "../functions/post_functions.js";


const router = Router();  // groups together requests

router.post('/post', async (req, res) => {
  const {city, username, body, has_media} = req.body;

  if(!city || !username || !body || has_media === undefined || has_media === null)
    return res.status(400).json({ error: "Missing value" });

  const id = await Post.createPost(city, username, body, has_media);

  if(id === undefined || id === null) return res.status(406).json({ error : "problem getting the id"});

  return res.status(201).json({id: id});
})

router.post('/post/edit', async (req, res) => {
  const {content_id, newBody} = req.body;

  if(!newBody || content_id === undefined || content_id === null)
    return res.status(400).json({ error: "Missing value" });

  await Post.editPost(content_id, newBody);

  return res.status(201).json({msg: "Succesfully edited post"});
})

router.post('/post/delete', async (req, res) => {
  const {content_id} = req.body;

  if(content_id === undefined || content_id === null) return res.status(400).json({ error: "Missing content_id" });

  await Post.deletePost(content_id);

  return res.status(201).json({msg: "Succesfully deleted post"});
})

export default router;