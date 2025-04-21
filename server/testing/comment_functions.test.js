import Comment from "../functions/comment_functions"
import pool from '../functions/pool.js'

afterAll(async() => {
    await pool.end(); 
})


test("Create a new comment", async () => {
    const result = await Comment.createComment("JestTestSF", "jesser", "unit testing comment!", 18)
    const expected = // 69 for monday test
    expect(result).toEqual(expected)
})

test("Edit an existing comment", async() => {
    const result = await Comment.editComment(64, "Edit unit testing comment 1!")
    const expected = true

    expect(result).toEqual(expected)
})

test("Try editing a non-existent comment", async() => {
    const result = await Comment.editComment(-2, "Edit unit testing comment!")
    const expected = false

    expect(result).toEqual(expected)
})

test("Delete an existing comment", async() => {
    const result = await Comment.deleteComment(67)

    const expected = true

    expect(result).toEqual(expected)
})

test("Try deleting a non-existent comment", async() => {
    const result = await Comment.editComment(-2)
    const expected = false

    expect(result).toEqual(expected)
})

test("Delete all comments for a post", async() => {
    const result = await Comment.deleteComments(23)
    const expected = true

    expect(result).toEqual(expected)
})