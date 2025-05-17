import Content from "../functions/content_functions"
import pool from '../functions/pool.js'

/** This jest file is used to test all the functions defined in content_functions.js which allows us to
get various information about a user's content, including posts and comments. */

// Make sure the pool closes after using await and grabbing from the database
afterAll (async () => {
    await pool.end();
})
  
// Test whether the createContent function works
test("Create new content", async () => {
    const result = await Content.createContent("JestTestSF", "UnitTestName2", "This is a unit test comment...")
    // If the content was successfully created, return its new content_id
    const expected = 71

    // Assert that the result from createContent matches the expected value
    expect(result).toEqual(expected)
})

// Test whether the editContent function works
test("Edit existing content", async () => {
    const result = await Content.editContent(68, "new unit comment body.")
    // If the content was successfully edited, return true
    const expected = true

    // Assert that the result from editContent matches the expected value
    expect(result).toEqual(expected)
})

// Test whether it is possible to edit a non-existing piece of content 
test("Edit non-existing content", async () => {
    const result = await Content.editContent(0, "new unit comment body.")
    // Since the content doesn't exist, expect a result of false 
    const expected = false

    // Assert that the result from editContent matches the expected value
    expect(result).toEqual(expected)
})

// Test whether the deleteContent function works 
test("Delete content", async () => {
    const result = await Content.deleteContent(71)
    // If the content was successfully deleted, return true
    const expected = true

    // Assert that the result from deleteContent matches the expected value
    expect(result).toEqual(expected)
})

// Test whether the getContent function works 
test("Get content", async () => {
    const result = await Content.getContent(63)
    // Since the returned DATETIME type from SQL is not a string, convert it to a string for comparison
    result.post_date = result.post_date.toISOString()

    // If the content exists, return all the corresponding information for it 
    const expected = 
    {
        "content_id": 63,
        "subforum_id": 0,
        "user_id": 'mT0F42pzwXZ0s04lA1SOU0OYeuB3',
        "post_date": "2025-04-20T07:00:00.000Z",
        "last_edit_date": null,
        "body": 'Fundraiser @ 12pm!'
    }

    // Assert that the result from getContent matches the expected value
    expect(result).toEqual(expected)
})

// Test whether the getIds function works 
test("Get content IDs", async () => {
    const result = await Content.getIds([{ comment_id: 5 }, {comment_id: 4}])
    // Return the user_ids of the users that made the comments in the array 
    const expected = [5,4] 
    
    // Assert that the result from getIds matches the expected value
    expect(result).toEqual(expected)
})