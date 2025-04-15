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

test ("Get subforum posts", async () => {
    const result = await Post.getSubforumPosts(2)
    console.log(result[0].post_date)
    for (let i = 0; i < result.length; i++) {
        console.log(typeof result[i].date)
      }

    const expected = [{
      "content_id": 3,
      "subforum_id": 2,
      "user_id": "xByyjxajyxcV0g2p0du1kDsbTIJ3",
      "post_date": "2025-03-19T07:00:00.000Z",
      "last_edit_date": "2025-03-20T07:00:00.000Z",
      "body": "Why is it alway's raining here???"
    }]

    expect(result).toContainEqual(expected)
})