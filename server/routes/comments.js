import {Router} from "express";
import Comment from "../functions/comment_functions.js";

const router = new Router(); 

/**
 * @route POST /createComment
 * @description Create a new comment under a specific post
 * @param {string} req.body.city - The city/subforum where the comment is posted
 * @param {string} req.body.username - The username of the comment creator
 * @param {string} req.body.body - The text content of the comment
 * @param {number} req.body.post_id - The ID of the post being commented on
 * @returns {Object} 200 - JSON object with created comment ID
 * @returns {Object} 400 - Missing information
 * @returns {Object} 406 - Error creating comment
 */
router.post('/createComment', async (req, res) => {
    const { city, username, body, post_id } = req.body; 
  
    if(!city || !username || !body || !post_id) return res.status(400).json({ error: "Missing information" });
  
    const id = await Comment.createComment(city, username, body, post_id);
    if(!id) return res.status(406).json({ error : "problem creating comment"});
  
    return res.status(200).json({ id: id });
})

/**
 * @route POST /edit/comment
 * @description Edit the body of an existing comment
 * @param {number} req.body.content_id - The ID of the comment to edit
 * @param {string} req.body.newBody - The new text content of the comment
 * @returns {Object} 200 - Success message
 * @returns {Object} 400 - Missing information
 * @returns {Object} 406 - Error editing comment
 */
router.post('/edit/comment', async (req, res) => {
  const { content_id, newBody } = req.body; 

  if(!content_id || !newBody) return res.status(400).json({ error: "Missing information" });

  const result = await Comment.editComment(content_id, newBody);
  if(!result) return res.status(406).json({ error : "problem editing comment"});

  return res.status(200).json({ msg: "Comment successfully edited!"});
})

/**
 * @route DELETE /delete/comment
 * @description Delete a comment by its ID
 * @param {number} req.params.comment_id - The ID of the comment to delete
 * @returns {Object} 200 - Success message
 * @returns {Object} 400 - Missing comment ID
 * @returns {Object} 406 - Error deleting comment
 */
router.delete('/delete/comment/:comment_id', async (req, res) => {
  const { comment_id } = req.params; 

  if(!comment_id) return res.status(400).json({ error: "Missing comment_id" });

  const result = await Comment.deleteComment(comment_id);
  if(!result) return res.status(406).json({ error : "problem deleting comment"});

  return res.status(200).json({ msg: "Comment successfully deleted!"});
})

/**
 * @route GET /comments/for/post/:post_id
 * @description Retrieve all comments for a specific post
 * @param {number} req.params.post_id - The ID of the post
 * @returns {Object} 200 - JSON object with array of comments
 * @returns {Object} 400 - Missing post ID
 * @returns {Object} 406 - Error retrieving comments
 */
router.get('/comments/for/post/:post_id', async (req, res) => {
  const { post_id } = req.params;

  if(!post_id) return res.status(400).json({ error: "Missing post_id" });
  console.log("Getting POST comments");
  const result = await Comment.getComments(post_id);
  if(!result) return res.status(406).json({ error : "problem getting comments"});

  return res.status(200).json({ comments: result});
})

/**
 * @route GET /userComments/:id
 * @description Retrieve all comments by a specific user
 * @param {string} req.params.id - The user's ID
 * @returns {Object} 200 - Array of comments
 * @returns {Object} 400 - Missing ID
 */
router.get('/userComments/:id', async (req, res) => {  // get all user posts
  const { id } = req.params; // read id from URL parameters

  if(!id) return res.status(400).json({ error: "Missing userId" });
  const comments = await Comment.getUserComments(id);
  console.log("Getting USER comments");
  return res.status(200).json({comments:comments});
})

/**
 * @route GET /getComment/:comment_id
 * @description Retrieve a single comment by its ID
 * @param {number} req.params.comment_id - The ID of the comment
 * @returns {Object} 200 - JSON object with comment details
 * @returns {Object} 400 - Missing comment ID
 * @returns {Object} 406 - Error retrieving comment
 */
router.get('/getComment/:comment_id', async (req, res) => {
  const { comment_id } = req.params;

  if(!comment_id) return res.status(400).json({ error: "Missing comment_id" });

  const result = await Comment.getComment(comment_id);
  if(!result) return res.status(406).json({ error : "problem getting comment"});
  return res.status(200).json({ comment: result});
})
export default router;

