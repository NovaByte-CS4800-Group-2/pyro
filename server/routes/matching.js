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
 * @param {number} req.body.young_children - Number of young children
 * @param {number} req.body.adolescent_children - Number of adolescent children
 * @param {number} req.body.teenage_children - Number of teenage children
 * @param {number} req.body.elderly - Number of elderly members
 * @param {number} req.body.small_dog - Number of  small dogs
 * @param {number} req.body.large_dog - Number of  large dogs
 * @param {number} req.body.cat - Number of cats
 * @param {number} req.body.other_pets - Number of other pets
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
 * @route GET /get/form/:id
 * @description Return a single matching form by ID
 * @param {number} req.params.id - ID of the form to delete
 * @returns {Object} 200 - Success message
 * @returns {Object} 204 - No form with ID
 * @returns {Object} 400 - Missing ID
 */
router.get('/geet/form/:id', async(req, res) => {
  const {id} = req.params;

  if(!id) return res.status(400).json({ error: "missing id"});

  const form = await Matching.getForm(id);

  if(!form) return res.status(204).json({ msg: "No from matching the id"});

  return res.status(200).json({ form: form })
})

/**
 * @route DELETE /delete/multiple/forms
 * @description Delete multiple matching forms (e.g., after matching)
 * @param {number} req.parm.id1 - the form IDs to delete
 * @param {number} req.parm.id2 - the form IDs to delete
 * @returns {Object} 200 - Success message
 * @returns {Object} 400 - Missing IDs
 * @returns {Object} 406 - Deletion failed
 */
router.delete('/delete/matched/forms/:id1/:id2', async(req, res) => {  // for when forms are matched
  const {id1, id2} = req.params;

  if(!id1 || !id2) return res.status(400).json({ error: "missing ids"});

  const deleted = await Matching.deleteForms(id1, id2);

  if(!deleted) return res.status(406).json({ errror: "Unable to delete fors"});

  return res.status(200).json({ msg: "forms succesfully deleted" })
})

export default router;