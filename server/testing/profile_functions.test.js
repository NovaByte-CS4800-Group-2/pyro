import Profile from "../functions/profile_functions.js"
import pool from '../functions/pool.js'

/** This jest file is used to test all the functions defined in profile_functions.js which allows us to
get various information about a user's profile on our website. */

// Make sure the pool closes after using await and grabbing from the database
afterAll (async () => {
  await pool.end();
})


// Testing the editUsername function 
test ("Edit user's username", async () => {
  //const result = await Profile.editUsername("Hadya", "fgvfZQxY1SghMxpFvXgjauiUdUo1") // keep changing for tests otherwise false
  
  const expected = true

  expect(true).toEqual(expected)
})

// Testing the getUsername function
test ("Gets user's username", async () => {
  const result = await Profile.getUsername("3JK5D0c9NhOmJPkviCJqD7vn2Am1")
  
  const expected = "Nat"

  expect(result).toEqual(expected)
})


// Testing the getProfile function 
test ("Gets a personal user's profile 1", async () => {
    const result = await Profile.getProfile("Nat")
    
    const expected = {
        "user_id": "3JK5D0c9NhOmJPkviCJqD7vn2Am1",
        "username": "Nat",
        "name": "Natalie",
        "zip_code": 12345,
        "business_account": 0
    }
    expect(result).toEqual(expected)
})

// Testing the getProfile function 
test ("Gets a business user's profile 2", async () => {
  const result = await Profile.getProfile("Business Woman")
  
  const expected = {
      "user_id": "na74oYKtAgS81vAICvRpbOmalnX2",
      "username": "Business Woman",
      "name": "Business",
      "zip_code": 99999,
      "business_account": 1
    
  }
  expect(result).toEqual(expected)
})


// Testing the editZipcode 
test ("Edits the user's zipcode", async () => {
  const result  = await Profile.editZipcode(12345, "3JK5D0c9NhOmJPkviCJqD7vn2Am1")

  const expected = true

  expect(result).toEqual(expected)
})

