import { Router } from "express";  // create an instance of an express router
import Matching from "../functions/matching_functions.js";

const router = Router();  // groups together requests


router.post('/create/matching/form', async(req, res) => {
  const {user_id, type, num_rooms, num_people, young_children, adolescent_children, 
         teenage_children, elderly, small_dog, large_dog, cat, other_pets} = req.body;
  
  const id = await Matching.createForm(user_id, type, num_rooms, num_people, young_children, adolescent_children, 
                                       teenage_children, elderly, small_dog, large_dog, cat, other_pets);

  if(!id) return res.status(406).json({ error: "unable to create form"});

  res.status(201).json({ id:id });

})


export default router;