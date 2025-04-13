import { Router } from "express";  // create an instance of an express router
import Matching from "../functions/matching_functions.js";

const router = Router();  // groups together requests

/**
 * @route POST /create/matching/form
 * @description Create a new matching form with user preferences
 * @param {number} req.body.user_id - ID of the user creating the form
 * @param {string} req.body.type - Type of match (e.g., "giver" or "receiver")
 * @param {number} req.body.num_rooms - Number of rooms available/needed
 * @param {number} req.body.num_people - Number of people in the household
 * @param {boolean} req.body.young_children - Presence of young children
 * @param {boolean} req.body.adolescent_children - Presence of adolescent children
 * @param {boolean} req.body.teenage_children - Presence of teenage children
 * @param {boolean} req.body.elderly - Presence of elderly members
 * @param {boolean} req.body.small_dog - Has/accepts small dogs
 * @param {boolean} req.body.large_dog - Has/accepts large dogs
 * @param {boolean} req.body.cat - Has/accepts cats
 * @param {boolean} req.body.other_pets - Has/accepts other pets
 * @returns {Object} 201 - Created form ID
 * @returns {Object} 406 - Unable to create form
 */
router.post('/create/matching/form', async(req, res) => {
  const {user_id, type, num_rooms, num_people, young_children, adolescent_children, 
         teenage_children, elderly, small_dog, large_dog, cat, other_pets} = req.body;
  
  const id = await Matching.createForm(user_id, type, num_rooms, num_people, young_children, adolescent_children, 
                                       teenage_children, elderly, small_dog, large_dog, cat, other_pets);

  if(!id) return res.status(406).json({ error: "unable to create form"});

  res.status(201).json({ id:id });

})

/**
 * @route GET /get/match/:id/:type
 * @description Retrieve match results for a user form
 * @param {number} req.params.id - ID of the form to match against
 * @param {string} req.params.type - Type of form ("giver" or "receiver")
 * @returns {Object} 200 - Array of matched forms
 * @returns {Object} 204 - No matches found
 * @returns {Object} 400 - Missing parameters
 */
router.get('/get/match/:id/:type', async(req, res) => {
  const {id, type} = req.params;

  if(!id || !type) return res.status(400).json({ error: "missing paramters"});

  const matches = await Matching.match(id, type);

  if(!matches) return res.status(204).json({ msg: "there were no matches found"});

  return res.status(200).json({ matches: matches })
})

/**
 * @route DELETE /delete/single/form/:id
 * @description Delete a single matching form by ID
 * @param {number} req.params.id - ID of the form to delete
 * @returns {Object} 200 - Success message
 * @returns {Object} 400 - Missing ID
 * @returns {Object} 406 - Deletion failed
 */
router.delete('/delete/single/form/:id', async(req, res) => {
  const {id} = req.params;

  if(!id) return res.status(400).json({ error: "missing id"});

  const deleted = await Matching.deleteForm(id);

  if(!deleted) return res.status(406).json({ errror: "Unable to delete form"});

  return res.status(200).json({ msg: "form succesfully deleted" })
})

/**
 * @route DELETE /delete/multiple/forms
 * @description Delete multiple matching forms (e.g., after matching)
 * @param {Array<number>} req.body.ids - Array of form IDs to delete
 * @returns {Object} 200 - Success message
 * @returns {Object} 400 - Missing IDs
 * @returns {Object} 406 - Deletion failed
 */
router.delete('/delete/multiple/forms', async(req, res) => {  // for when forms are matched
  const {ids} = req.body;

  if(!ids) return res.status(400).json({ error: "missing ids"});

  const deleted = await Matching.deleteForms(ids);

  if(!deleted) return res.status(406).json({ errror: "Unable to delete fors"});

  return res.status(200).json({ msg: "forms succesfully deleted" })
})

export default router;