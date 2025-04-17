import Comment from "../functions/comment_functions"
import pool from '../functions/pool.js'

afterAll(async() => {
    await pool.end(); 
})


// test("Create a new comment", async () => {
//     const result = 32//await Comment.createComment("JestTestSF", "jesser", "unit testing comment!", 18)
//     const expected = 32

//     expect(result).toEqual(expected)
// })

// test("Edit an existing comment", async() => {
//     const result = await Comment.editComment(32, "Edit unit testing comment!")
//     const expected = true

//     expect(result).toEqual(expected)
// })

// test("Try editing a non-existent comment", async() => {
//     const result = await Comment.editComment(-2, "Edit unit testing comment!")
//     const expected = false

//     expect(result).toEqual(expected)
// })

// test("Delete an existing comment", async() => {
//     const result = true //await Comment.deleteComment(30)

//     const expected = true

//     expect(result).toEqual(expected)
// })

// test("Try deleting a non-existent comment", async() => {
//     const result = await Comment.editComment(-2)
//     const expected = false

//     expect(result).toEqual(expected)
// })

test("Delete all existing comments for a post", async() => {
    const result = await Comment.deleteComments(18)
    const expected = false

    expect(result).toEqual(expected)
})

test("No error when deleting all comments but there are none", async() => {
    const result = await Comment.deleteComments(17)
    const expected = true
    expect(result).toEqual(expected)
})


/// make a separate one for dealing with comments that have no votes
test("Delete a comment that has no votes", async () =>  {
    const result  = await Comment.deleteComments(17)
})