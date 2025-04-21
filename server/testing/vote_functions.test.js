import Vote from "../functions/vote_functions.js"
import pool from '../functions/pool.js'


afterAll (async () => {
    await pool.end();
})
    
test("Add a vote to content ", async () => {
    const result = await Vote.vote(62, 1, 1)
    const expected = true 
    expect(result).toEqual(expected)
})

test("Get a user's vote on content", async () => {
    const result = await Vote.getVote(63, 1)
    const expected = 1
    expect(result).toEqual(expected)
})

test("Get a content's upvotes", async () => {
    const result = await Vote.getUpVotes(63)
    const expected = 4
    expect(result).toEqual(expected)
})

test("Get a content's downvotes", async () => {
    const result = await Vote.getDownVotes(63)
    const expected = 0
    expect(result).toEqual(expected)
})

test("Get the total content votes", async () => {
    const result = await Vote.getTotalVotes(63)
    const expected = 4
    expect(result).toEqual(expected)
})


test("Remove vote", async() => {
    await Vote.vote(52, 1, 1) // add a sample vote to delete 
    const result = await Vote.removeVote(52, 1)
    const expected = true
    expect(result).toEqual(expected)

})

test("Remove votes for a piece of content", async() => {
    await Vote.vote(52, '3', 0) // add a sample vote to delete 
    const result = await Vote.removeVotes(52)
    const expected = true
    console.log(result)
    expect(result).toEqual(expected)

})

// !! bUffer
// test("Get all of a user's votes", async () => {
//     const result = await Vote.getUserVotes(1)
//     const resultValues = []
//     for (let i = 0; i < result.length; i++) {
//         result[i].value = result[i].value.toJSON()
//         resultValues.push(result[i].value.toJSON())
//     }
//     console.log(result.value)
//     const expected = 
//     [
//         { "content_id": 62, "user_id": '1', "value": resultValues[0] },
//         { "content_id": 63, "user_id": '1', "value": resultValues[1] }
//     ]
//     expect(result).toEqual(expected)
// })

// Test for object equality
// test("Get all the votes for a piece of content", async() => {
//     const result = await Vote.getVotes(63)
//     console.log(result)
    
//     const expected = 
//     [
//         {
//           "content_id": 63,
//           "user_id": "1",
//           "value": {
//             "type": "Buffer",
//             "data": [
//               1
//             ]
//           }
//         },
//         {
//           "content_id": 63,
//           "user_id": "xByyjxajyxcV0g2p0du1kDsbTIJ3",
//           "value": {
//             "type": "Buffer",
//             "data": [
//               1
//             ]
//           }
//         }
//     ]
//     expect(result).toEqual(expect.arrayContaining(expected));
// })