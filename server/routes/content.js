import { Router } from "express";  // create an instance of an express router
import Content from "../functions/content_functions.js";

const router = Router();  // groups together requests
const content = new Content();

router.post('/content', async(req, res) => {
  const {contentID, city, username, body} = req.body;

  if (!contentID || !city || !username || !body) 
    return res.status(400).json({ error: "Missing an argument" });

  await content.createContent(contentID, city, username, body)

  res.status(201).send({msg: "content created succesfully"})
})

router.post('/content/edit', async(req, res) => {
  const {contentID, body} = req.body;

  if (!body || !contentID) return res.status(400).json({ error: "Missing body" });

  content.updateDate(contentID);
  content.updateBody(contentID, body);

  res.status(201).send({msg: "content edited succesfully"})
})

export default router;