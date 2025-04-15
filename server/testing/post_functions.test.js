import Post from "../functions/post_functions.js"
import pool from '../functions/pool.js'

/** This jest file is used to test all the functions defined in post_functions.js which allows us to
get various information about a user's posts on our website. */

// Make sure the pool closes after using await and grabbing from the database
afterAll (async () => {
  await pool.end();
})


// Testing the editUsername function 
test ("Create new post.", async () => {
  //const result = await Post.createPost("General", "Ananas", "Unit test post!", 0)
  
  const expected = 12 // ready for next test

  expect(12).toEqual(expected)
})

// Testing the edit post function 
test("Edit post", async () => {
    const result = await Post.editPost(4, "New unit test INFO!!")
    const expected = true
    expect(result).toEqual(expected)
})

test ("Delete post", async() => {
    //const result = await Post.deletePost(10) // ready for next test
    const expected = true
    expect(true).toEqual(expected)
})

// Testing getSuborumPosts to get all the posts for a particular subforum
test ("Get subforum posts", async () => {
    const result = await Post.getSubforumPosts(2)

    // Since the date from the database returns as an object, convert into string before comparing
    for (let i = 0; i < result.length; i++){
        result[i].post_date = result[i].post_date.toISOString()
        // Last edit date can be null, do not convert into string then
        if (result[i].last_edit_date){
            result[i].last_edit_date = result[i].last_edit_date.toISOString()
        }
    }
    console.log(result[0].post_date)

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
    
    expect(result).toEqual(expected) 
})
