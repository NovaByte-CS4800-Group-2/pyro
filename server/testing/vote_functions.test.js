import Vote from "../functions/vote_functions.js"
import pool from '../functions/pool.js'

/** This jest file is used to test all the functions defined in vote_functions.js which allows us to
upvote, downvote and get various information about votes in the system */

// Make sure the pool closes after using await and grabbing from the database
afterAll (async () => {
    await pool.end();
})

// Test whether the vote function works 
test("Add a vote to content ", async () => {
    const result = await Vote.vote(62, 1, 1)
    // If the vote has been successfully added, return true 
    const expected = true 

    // Assert that the result from vote matches the expected result
    expect(result).toEqual(expected)
})

// Test the getVote function 
test("Get a user's vote on content", async () => {
    const result = await Vote.getVote(63, 1)
    // Returns the vote type for a user and the content 
    const expected = 1
    
    // Assert that the result from getVote matches the expected result
    expect(result).toEqual(expected)
})

// Test the getUpVotes function 
test("Get a content's upvotes", async () => {
    const result = await Vote.getUpVotes(63)
    // Retrieves the number of upvotes for piece of content
    const expected = 4
    
    // Assert that the result from getUpVotes matches the expected result
    expect(result).toEqual(expected)
})

// Test the getDownvotes function 
test("Get a content's downvotes", async () => {
    const result = await Vote.getDownVotes(63)
    // Retrieves the number of downvotes for a piece of content 
    const expected = 0

    // Assert that the result from getDownVotes matches the expected result
    expect(result).toEqual(expected)
})

// Test the getTotalVotes function 
test("Get the total content votes", async () => {
    const result = await Vote.getTotalVotes(63)
    // Gets the calculated upVotes and downVotes for the total votes of a post
    const expected = 4
    
    // Assert that the result from getTotalVotes matches the expected result
    expect(result).toEqual(expected)
})

// Test the removeVote function 
test("Remove vote", async() => {
    await Vote.vote(52, 1, 1) 
    const result = await Vote.removeVote(52, 1)
    // If the vote has been successfully removed, return true 
    const expected = true

    // Assert that the result from removeVotes matches the expected result
    expect(result).toEqual(expected)

})

// Test the removeVotes function 
test("Remove votes for a piece of content", async() => {
    await Vote.vote(52, '3', 0) 
    const result = await Vote.removeVotes(52)
    // If all the votes for a piece of content have been removed, return true 
    const expected = true

    // Assert that the result from removeVotes matches the expected result
    expect(result).toEqual(expected)

})

// Test whether the getUserVotes function works 
test("Get all of a user's votes", async () => {
    const result = await Vote.getUserVotes(1)
    const resultValues = []

    // Convert the non-numeric data into strings for comparison 
    for (let i = 0; i < result.length; i++) {
        result[i].value = result[i].value.toJSON()
        resultValues.push(result[i].value.toJSON())
    }

    // Retrieves all the user's vote information 
    const expected = 
    [
        { "content_id": 62, "user_id": '1', "value": resultValues[0] },
        { "content_id": 63, "user_id": '1', "value": resultValues[1] }
    ]

    // Assert that the result from getUserVotes matches the expected result
    expect(result).toEqual(expected)
})

// Test the getVotes function 
test("Get all the votes for a piece of content", async() => {
    const result = await Vote.getVotes(63)

    // Get the information about all votes for a piece of content 
    const expected = 
    [
        {
          "content_id": 63,
          "user_id": "1",
          "value": {
            "type": "Buffer",
            "data": [
              1
            ]
          }
        },
        {
          "content_id": 63,
          "user_id": "xByyjxajyxcV0g2p0du1kDsbTIJ3",
          "value": {
            "type": "Buffer",
            "data": [
              1
            ]
          }
        }
    ]

    // Assert that the result from getVotes matches the expected result
    expect(result).toEqual(expected.arrayContaining(expected));
})