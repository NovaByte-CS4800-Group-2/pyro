import Register from "../functions/register_functions"
import pool from "../functions/pool.js"

afterAll(async () => {
    await pool.end(); 
})

test("Create a new user profile", async () => {
    const result = await Register.createProfile(32342342, "unitTestName11", "TNAM10", 12345, 0)
    const expected = true 
    expect(result).toEqual(expected)
})

test("Create a new user profile with duplicate infomation", async () => {
    try
        {   const result = await Register.createProfile(5, "unitTestName", "TNAME", 12345, 0)
            const expected = false 
            expect(result).toEqual(expected)
        }
     catch (errors){  
    }
})

test("Get all the user profiles in the system", async() => {
    let result = await Register.getProfiles()
    if(result){
        result = true
    }
    console.log(result)
    const expected = true
    expect(result).toEqual(expected)
})


test("Get an inidividual's profile", async() => {
    let result = await Register.getProfile("unitTestName2")
    const expected = 
    {
        "user_id": "2",
        "username": "unitTestName2",
        "name": "TNAME2",
        "zip_code": 12345,
        "business_account": 0
      }
    expect(result).toEqual(expected)
})

test("Get validation errors during registration", async () => {
    const result = await Register.getErrors("unitTestName3", "noPass", 123, "pas1")
    const expected = ["Username already exisits", "Zipcode must be a valid five digit number", "Passwords do not match"]
    expect(result).toEqual(expected)
})

test("Check if the username is valid", async() => {
    const result = await Register.validateUsername("unitTestName3")
    const expected = true
    expect(result).toEqual(expected)
})