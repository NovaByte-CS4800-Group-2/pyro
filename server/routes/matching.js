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

router.get('/get/match/:id/:type', async(req, res) => {
  const {id, type} = req.params;

  if(!id || !type) return res.status(400).json({ error: "missing paramters"});

  const matches = await Matching.match(id, type);

  if(!matches) return res.status(204).json({ msg: "there were no matches found"});

  return res.status(200).json({ matches: matches })
})

router.delete('/delete/single/form/:id', async(req, res) => {
  const {id} = req.params;

  if(!id) return res.status(400).json({ error: "missing id"});

  const deleted = await Matching.deleteForm(id);

  if(!deleted) return res.status(406).json({ errror: "Unable to delete form"});

  return res.status(200).json({ msg: "form succesfully deleted" })
})

router.delete('/delete/multiple/forms', async(req, res) => {  // for when forms are matched
  const {ids} = req.body;

  if(!ids) return res.status(400).json({ error: "missing ids"});

  const deleted = await Matching.deleteForms(ids);

  if(!deleted) return res.status(406).json({ errror: "Unable to delete fors"});

  return res.status(200).json({ msg: "forms succesfully deleted" })
})

export default router;