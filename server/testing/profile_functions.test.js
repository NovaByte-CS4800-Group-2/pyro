import Profile from "../functions/profile_functions.js"
import pool from '../functions/pool.js'

/** This jest file is used to test all the functions defined in profile_functions.js which allows us to
get various information about a user's profile on our website. */

// Make sure the pool closes after using await and grabbing from the database
afterAll (async () => {
  await pool.end();
})


// Test whether the editUsername function works 
test ("Edit user's username", async () => {
  const result = await Profile.editUsername("Hadya", "fgvfZQxY1SghMxpFvXgjauiUdUo1") 
  // If the username has been successfully edited, return true 
  const expected = true

  // Assert that the result from editUsername matches the expected result
  expect(result).toEqual(expected)
})

// Test whether the getUsername function works
test ("Gets user's username", async () => {
  const result = await Profile.getUsername("3JK5D0c9NhOmJPkviCJqD7vn2Am1")
  // Return the username of the user given their user_id
  const expected = "Nat"

  // Assert that the result from getUsername matches the expected result
  expect(result).toEqual(expected)
})


// Test whether the getProfile function works for a personal account
test ("Gets a personal user's profile 1", async () => {
    const result = await Profile.getProfile("Nat")
    // Retrieve the information of a personal user's profile
    const expected = {
        "user_id": "3JK5D0c9NhOmJPkviCJqD7vn2Am1",
        "username": "Nat",
        "name": "Natalie",
        "zip_code": 12345,
        "business_account": 0
    }

    // Assert that the result from getProfile matches the expected result
    expect(result).toEqual(expected)
})

// Test whether the getProfile function works for a business account
test ("Gets a business user's profile 2", async () => {
  const result = await Profile.getProfile("Business Woman")
  // Retrieve the information of a business user's profile
  const expected = {
      "user_id": "na74oYKtAgS81vAICvRpbOmalnX2",
      "username": "Business Woman",
      "name": "Business",
      "zip_code": 99999,
      "business_account": 1
    
  }

  // Assert that the result from getProfile matches the expected result
  expect(result).toEqual(expected)
})


// Test whether the editZipcode function works
test ("Edits the user's zipcode", async () => {
  const result  = await Profile.editZipcode(12345, "3JK5D0c9NhOmJPkviCJqD7vn2Am1")
  // If the zipcode has been successfully edited, return true
  const expected = true

  // Assert that the result from editZipcode matches the expected result
  expect(result).toEqual(expected)
})

