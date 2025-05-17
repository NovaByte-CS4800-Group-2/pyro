import Post from "../functions/post_functions.js"
import pool from '../functions/pool.js'

/** This jest file is used to test all the functions defined in post_functions.js which allows us to
get various information about a user's posts on our website. */

// Make sure the pool closes after using await and grabbing from the database
afterAll (async () => {
  await pool.end();
})


// Test whether createPost function works
test ("Create new post.", async () => {
  const result = await Post.createPost("General", "Ananas", "Unit test post!", 0)
  // If a new post has been successfully created, return the new post_id
  const expected = 12 
  
  // Assert that the result from createPost matches the expected result
  expect(result).toEqual(expected)
})

// Test whether the edit post function works
test("Edit post", async () => {
    const result = await Post.editPost(4, "New unit test INFO!!")
    // If a post has been successfully edited, return true 
    const expected = true

    // Assert that the result from editPost matches the expected result
    expect(result).toEqual(expected)
})

// Test whether the deletePost function works
test ("Delete post", async() => {
    const result = await Post.deletePost(10) 
    // If a post has been successfully deleted, return true 
    const expected = true

    // Assert that the result from createNotif matches the expected result
    expect(result).toEqual(expected)
})

// Test whether the getSuborumPosts function works
test ("Get subforum posts", async () => {
    const result = await Post.getSubforumPosts(3)
    // Since the date from the database returns as an object, convert into string before comparing
    for (let i = 0; i < result.length; i++){
        result[i].post_date = result[i].post_date.toISOString()
        // Last edit date can be null, do not convert into string then
        if (result[i].last_edit_date){
            result[i].last_edit_date = result[i].last_edit_date.toISOString()
        }
    }
    // Get all the posts for a particular subforum
    const expected = [
        {
          "content_id": 15,
          "subforum_id": 3,
          "user_id": "k7KWqmBB6UhpYDHiMyMArmGUoqj2",
          "post_date": "2025-04-15T07:00:00.000Z",
          "last_edit_date": null, // compares null directly without string conversion
          "body": "i need a post for unit testing"
        },
        {
          "content_id": 16,
          "subforum_id": 3,
          "user_id": "k7KWqmBB6UhpYDHiMyMArmGUoqj2",
          "post_date": "2025-04-15T07:00:00.000Z",
          "last_edit_date": null, // compares null directly without string conversion
          "body": "here's another post i would like to use for unit testing"
        },
        {
          "content_id": 18,
          "subforum_id": 3,
          "user_id": "xByyjxajyxcV0g2p0du1kDsbTIJ3",
          "post_date": "2025-04-15T07:00:00.000Z",
          "last_edit_date": "2025-04-15T07:00:00.000Z",
          "body": "perhaps a third one too? (i've edited it)"
        }
      ]
    // Assert that the result from getSubforumPosts matches the expected result
    expect(result).toEqual(expected) 
})

// Test whether the getUserPosts function works 
test ("Get all of a user's posts", async () => {
    const result = await Post.getUserPosts("k7KWqmBB6UhpYDHiMyMArmGUoqj2")

    // Since the date from the database returns as an object, convert into string before comparing
    for (let i = 0; i < result.length; i++){
        result[i].post_date = result[i].post_date.toISOString()
        // Last edit date can be null, do not convert into string then
        if (result[i].last_edit_date){
            result[i].last_edit_date = result[i].last_edit_date.toISOString()
        }
    }
    // Returns the content for all posts of a user
    const expected = [
        {
          "content_id": 1,
          "subforum_id": 1,
          "user_id": "k7KWqmBB6UhpYDHiMyMArmGUoqj2",
          "post_date": "2025-03-19T07:00:00.000Z",
          "last_edit_date": null,
          "body": "You know my dog can be such a menace. She's a border collie so she's got a lot of energy, but even for a border collie she's a little bit odd. It takes all five of us just to keep her entertained and not throwing a fit. Also she can scream like a child. Literally. She hasn't done it in a while, but sometimes I worry she'll start screaming in the middle of the night..."
        },
        {
          "content_id": 10,
          "subforum_id": 1,
          "user_id": "k7KWqmBB6UhpYDHiMyMArmGUoqj2",
          "post_date": "2025-04-15T07:00:00.000Z",
          "last_edit_date": null,
          "body": "Unit test post!"
        },
        {
          "content_id": 14,
          "subforum_id": 2,
          "user_id": "k7KWqmBB6UhpYDHiMyMArmGUoqj2",
          "post_date": "2025-04-15T07:00:00.000Z",
          "last_edit_date": null,
          "body": "This is a post on the pomona forum for the Jest Test lol\n"
        },
        {
          "content_id": 15,
          "subforum_id": 3,
          "user_id": "k7KWqmBB6UhpYDHiMyMArmGUoqj2",
          "post_date": "2025-04-15T07:00:00.000Z",
          "last_edit_date": null,
          "body": "i need a post for unit testing"
        },
        {
          "content_id": 16,
          "subforum_id": 3,
          "user_id": "k7KWqmBB6UhpYDHiMyMArmGUoqj2",
          "post_date": "2025-04-15T07:00:00.000Z",
          "last_edit_date": null,
          "body": "here's another post i would like to use for unit testing"
        }
      ]
      
      // Assert that the result from getUserPosts matches the expected result
      expect(result).toEqual(expected)
})

// Test whether the getUserPost works 
test ("Get one of a user's posts", async () => {

    const result = await Post.getUserPost(2)

    // Convert all dates to string for comaprison
    result.post_date = result.post_date.toISOString()
    // Last edit date can be null, do not convert into string then
    if (result.last_edit_date){
        result.last_edit_date = result.last_edit_date.toISOString()
    }
    // Gets the content for a specific user's post
    const expected = 
        {
          "content_id": 2,
          "subforum_id": 1,
          "user_id": "fgvfZQxY1SghMxpFvXgjauiUdUo1",
          "post_date": "2025-03-18T07:00:00.000Z",
          "last_edit_date": "2025-03-18T07:00:00.000Z",
          "body": "What is this app even for?"
        }
      
    // Assert that the result from getUserPost matches the expected result
    expect(result).toEqual(expected)
})

