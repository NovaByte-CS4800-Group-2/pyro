import Register from "../functions/register_functions"
import pool from "../functions/pool.js"

/** This jest file is used to test all the functions defined in register_functions.js which allows us to
create and register a new user in the system */

// Make sure the pool closes after using await and grabbing from the database
afterAll(async () => {
    await pool.end(); 
})

// Test the createProfile function 
test("Create a new user profile", async () => {
    const result = await Register.createProfile(32342342, "unitTestName11", "TNAM10", 12345, 0)
    // If the profile has been successfully created, return true 
    const expected = true 

    // Assert that the result from createProfile matches the expected result
    expect(result).toEqual(expected)
})

// Test whether the createProfile function works for a duplicate user
test("Create a new user profile with duplicate infomation", async () => {
    const result = await Register.createProfile(5, "unitTestName", "TNAME", 12345, 0)
    // Since a user cannot register twice with the same information, return false 
    const expected = false 

    // Assert that the result from createProfile matches the expected result
    expect(result).toEqual(expected)
})

// Test whether the getProfiles function works
test("Get all the user profiles in the system", async() => {
    let result = await Register.getProfiles()
    // Since there are many users, check whether users are being returned
    if(result){
        result = true
    }
    const expected = true

    // Assert that the result from getProfiles matches the expected result
    expect(result).toEqual(expected)
})

// Test whether the getProfile function works
test("Get an inidividual's profile", async() => {
    const result = await Register.getProfile("unitTestName2")
    // Retrieve a user's profile information 
    const expected = 
    {
        "user_id": "2",
        "username": "unitTestName2",
        "name": "TNAME2",
        "zip_code": 12345,
        "business_account": 0
    }
    // Assert that the result from getProfile matches the expected result
    expect(result).toEqual(expected)
})


// Test whether the getErrors function works 
test("Get validation errors during registration", async () => {
    const result = await Register.getErrors("unitTestName3", "noPass", 123, "pas1")
    // Get all the errors for creating a profile with the given information 
    const expected = ["Username already exisits", "Zipcode must be a valid five digit number", "Passwords do not match"]

    // Assert that the result from getErrors matches the expected result
    expect(result).toEqual(expected)
})

// Test whether the validateUsername function works 
test("Check if the username is valid", async() => {
    const result = await Register.validateUsername("unitTestName3")
    // If the username can be used and is valid (not duplicated in the table), return true 
    const expected = true

    // Assert that the result from validateUsername matches the expected result
    expect(result).toEqual(expected)
})