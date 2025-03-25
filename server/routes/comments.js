import {Router} from "express";
import Comment from "../functions/comment_functions.js";

const router = new Router(); 

router.post('/createComment', async (req, res) => {
    const { city, username, body, post_id } = req.body; 
  
    if(!city || !username || !body || !post_id) return res.status(400).json({ error: "Missing information" });
  
    const id = await Comment.createComment(city, username, body, post_id);
    if(!id) return res.status(406).json({ error : "problem creating comment"});
  
    return res.status(200).json({ id: id });
})

router.post('/editComment', async (req, res) => {
  const { content_id, newBody } = req.body; 

  if(!content_id || !newBody) return res.status(400).json({ error: "Missing information" });

  const result = await Comment.editComment(content_id, newBody);
  if(!result) return res.status(406).json({ error : "problem editing comment"});

  return res.status(200).json({ msg: "Comment successfully edited!"});
})

router.post('/deleteComment', async (req, res) => {
  const { comment_id } = req.body; 

  if(!comment_id) return res.status(400).json({ error: "Missing comment_id" });

  const result = await Comment.deleteComment(comment_id);
  if(!result) return res.status(406).json({ error : "problem deleting comment"});

  return res.status(200).json({ msg: "Comment successfully deleted!"});
})

router.get('/comments/for/post/:post_id', async (req, res) => {
  const { post_id } = req.params;

  if(!post_id) return res.status(400).json({ error: "Missing post_id" });

  const result = await Comment.getComments(post_id);
  if(!result) return res.status(406).json({ error : "problem getting comments"});

  return res.status(200).json({ comments: result});
})


router.get('/getComment/:comment_id', async (req, res) => {
  const { comment_id } = req.params;

  if(!comment_id) return res.status(400).json({ error: "Missing comment_id" });

  const result = await Comment.getComment(comment_id);
  if(!result) return res.status(406).json({ error : "problem getting comment"});

  return res.status(200).json({ comment: result});
})
export default router;