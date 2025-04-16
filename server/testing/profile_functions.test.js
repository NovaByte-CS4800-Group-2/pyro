import Profile from "../functions/profile_functions.js"
import pool from '../functions/pool.js'

/** This jest file is used to test all the functions defined in profile_functions.js which allows us to
get various information about a user's profile on our website. */

// Make sure the pool closes after using await and grabbing from the database
afterAll (async () => {
  await pool.end();
})


// Testing the editUsername function 
//test ("Edits user's username")

// Testing the getUsername function
test ("Gets user's usernam", async () => {
  const result = await Profile.getUsername(16)
  
  const expected = "sample"

  expect(result).toEqual(expected)
})


// Testing the createProfile function 
test ("Creates a new profile", async () => {
    const result = await Profile.getProfile("sample")
    
    const expected = {
        "user_id": 16,
        "username": "sample",
        "name": "NewCustomer",
        "email": "new1@gmail.com",
        "password": "1d707811988069ca760826861d6d63a10e8c3b7f171c4441a6472ea58c11711b",
        "zip_code": 39201,
        "profile_picture": null,
        "business_account": 0
      
    }
    expect(result).toEqual(expected)
})

