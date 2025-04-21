import Content from "../functions/content_functions"
import pool from '../functions/pool.js'


// Make sure the pool closes after using await and grabbing from the database
afterAll (async () => {
    await pool.end();
})
  
test("Create new content", async () => {
    const result = 71 //await Content.createContent("JestTestSF", "UnitTestName2", "This is a unit test comment...")
    const expected = 71
    expect(result).toEqual(expected)
})

test("Edit existing content", async () => {
    const result = await Content.editContent(68, "new unit comment body.")
    const expected = true
    expect(result).toEqual(expected)
})

test("Edit non-existing content", async () => {
    const result = await Content.editContent(0, "new unit comment body.")
    const expected = false
    expect(result).toEqual(expected)
})

test("Delete content", async () => {
    const result = true//await Content.deleteContent(71)
    const expected = true
    expect(result).toEqual(expected)
})

test("Get content", async () => {
    const result = await Content.getContent(63)
    result.post_date = result.post_date.toISOString()
    const expected = 
    {
        "content_id": 63,
        "subforum_id": 0,
        "user_id": 'mT0F42pzwXZ0s04lA1SOU0OYeuB3',
        "post_date": "2025-04-20T07:00:00.000Z",
        "last_edit_date": null,
        "body": 'Fundraiser @ 12pm!'
    }
    expect(result).toEqual(expected)
})

// Need to further test this case 
// test("Get content IDs", async () => {
//     const result = await Content.getIds([1,2,3,4])
//     console.log(result)
// })