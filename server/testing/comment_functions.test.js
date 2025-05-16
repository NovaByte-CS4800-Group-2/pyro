import Comment from "../functions/comment_functions"
import pool from '../functions/pool.js'

/** This jest file is used to test all the functions defined in comment_functions.js which allows us to
get various information about comments posted on any part of the website. */

// Make sure to close the pool after all the database calls have been made
afterAll(async() => {
    await pool.end(); 
})

// Test whether the createComment function works
test("Create a new comment", async () => {
    const result = await Comment.createComment("JestTestSF", "jesser", "unit testing comment!", 18)
    // If the comment has been successfully created, return its new comment_id
    const expected = 69

    // Assert that the the result from the createComment matches the expected value 
    expect(result).toEqual(expected)
})

// Test whether the editComment function works
test("Edit an existing comment", async() => {
    const result = await Comment.editComment(64, "Edit unit testing comment 1!")
    // If the comment has been edited successfully, return true
    const expected = true

    // Assert that the result from editComment matches the expected value
    expect(result).toEqual(expected)
})

// Test that a non-existing comment should not be editable
test("Try editing a non-existent comment", async() => {
    const result = await Comment.editComment(-2, "Edit unit testing comment!")
    // Since the comment does not exist, expect a return of false
    const expected = false

    // Assert that the result from editComment matches the expected value
    expect(result).toEqual(expected)
})

// Test whether the deleteComment function works 
test("Delete an existing comment", async() => {
    const result = await Comment.deleteComment(67)
    // If the comment was successfully found and deleted, return true 
    const expected = true

    // Assert that the result from deleteComment matches the expected value
    expect(result).toEqual(expected)
})

// Test whether it is possible to delete a non-existing comment 
test("Try deleting a non-existent comment", async() => {
    const result = await Comment.editComment(-2)
    // Since the comment does not exist, expect a return of false 
    const expected = false

    // Assert that the result from deleteComment matches the expected value
    expect(result).toEqual(expected)
})

// Test whether the deleteComments function works 
test("Delete all comments for a post", async() => {
    const result = await Comment.deleteComments(23)
    // If all the comments are successfully deleted, expected a result of true
    const expected = true

    // Assert that the result from deleteComments matches the expected value
    expect(result).toEqual(expected)
})

