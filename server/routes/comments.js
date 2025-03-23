import {Router} from "express";
import Comment from "../functions/comment_functions";

const router = new Router(); 

router.post('/createComment', async (req, res) => {
    const { city, username, body, post_id } = req.body; 
  
    if(!city || !username || !body || !post_id) return res.status(400).json({ error: "Missing information" });
  
    const result = await Comment.createComment(city, username, body, post_id);
    if(!result) return res.status(406).json({ error : "problem creating comment"});
  
    return res.status(200).json({ msg: "Comment successfully created!"});
  })