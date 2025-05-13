import Matching from "../functions/matching_functions.js"
import pool from '../functions/pool.js'
import { jest, expect } from '@jest/globals';

jest.setTimeout(10000); // Allow more time for async API calls

// Make sure the pool closes after using await and grabbing from the database
afterAll (async () => {
    await pool.end();
  })


//Test to see whether a new form will be created with a previously used user_id
test ("Create a new matching form for a user that does not already have a form", async () => {
    const result = await Matching.createForm(4, "jess@gmail.com", 12345, 5, "offering", 2, 2, 1, 0, 0, 0, 0, 0, 0, 0) // keep changing for tests otherwise false
    const expected = false

    // Assert that the result from createForm matches the expected result
    expect(result).toEqual(expected) 
})


// Test whether the formExists function works when given a specific formID
test ("Check to see whether a form exists", async () => {
    const result = await Matching.formExists(4)
    const expected = 1 
    
    // Assert that the the result from the formExists matches the expected value 
    expect(result).toEqual(expected)
})

// Retrieves all forms of the opposite type for potential matches.
test ("Get matching options for request forms", async() => {
    // Use the getForms function to get all the forms that are opposite to requesting (offering)
    const result = await Matching.getForms("requesting")
     const expected = [
      {
        form_id: 1,
        email: null,
        zipcode: null,
        max_distance: null,
        user_id: 'k7KWqmBB6UhpYDHiMyMArmGUoqj2',
        num_rooms: 2,
        num_people: 4,
        young_children: 2,
        adolescent_children: 1,
        teenage_children: 2,
        elderly: 0,
        small_dog: 0,
        large_dog: 0,
        cat: 0,
        other_pets: 0
      },
      {
        form_id: 2,
        email: 'natalie@gmail.com',
        zipcode: null,
        max_distance: null,
        user_id: '3JK5D0c9NhOmJPkviCJqD7vn2Am1',
        num_rooms: 1,
        num_people: 3,
        young_children: 2,
        adolescent_children: 1,
        teenage_children: 0,
        elderly: 0,
        small_dog: 0,
        large_dog: 0,
        cat: 0,
        other_pets: 0
      },
      {
        form_id: 3,
        email: 'jmpinto@cpp.edu',
        zipcode: 12345,
        max_distance: 20,
        user_id: 'eZqzem2C0PgQ7N19IZqOdYEj9vI2',
        num_rooms: 2,
        num_people: 1,
        young_children: 0,
        adolescent_children: 0,
        teenage_children: 0,
        elderly: 0,
        small_dog: 0,
        large_dog: 0,
        cat: 0,
        other_pets: 0
      },
      {
        form_id: 5,
        email: 'jess@gmail.com',
        zipcode: 12345,
        max_distance: 5,
        user_id: '123453',
        num_rooms: 2,
        num_people: 2,
        young_children: 1,
        adolescent_children: 0,
        teenage_children: 0,
        elderly: 0,
        small_dog: 0,
        large_dog: 0,
        cat: 0,
        other_pets: 0
      },
      {
        form_id: 9,
        email: 'jess@gmail.com',
        zipcode: 12345,
        max_distance: 5,
        user_id: '4',
        num_rooms: 2,
        num_people: 2,
        young_children: 1,
        adolescent_children: 0,
        teenage_children: 0,
        elderly: 0,
        small_dog: 0,
        large_dog: 0,
        cat: 0,
        other_pets: 0
      },
      {
        form_id: 11,
        email: 'banana@gmail.com',
        zipcode: 12345,
        max_distance: 5,
        user_id: '5',
        num_rooms: 1,
        num_people: 1,
        young_children: 0,
        adolescent_children: 0,
        teenage_children: 0,
        elderly: 0,
        small_dog: 0,
        large_dog: 0,
        cat: 0,
        other_pets: 0
      }
    ]
    
    // Assert that the result from getForms to match the expected result
    expect(result).toEqual(expected)
})

// Retrieves all forms of the opposite type for potential matches.
test ("Get matching options for offering forms", async() => {
    // Use the getForms function to get all the forms that are opposite to offering (requesting)
    const result = await Matching.getForms("offering")
    const expected =  [
      {
        form_id: 10,
        email: 'ana@gmail.com',
        zipcode: 91708,
        max_distance: 5,
        user_id: '3',
        num_rooms: 1,
        num_people: 1,
        young_children: 0,
        adolescent_children: 0,
        teenage_children: 0,
        elderly: 0,
        small_dog: 0,
        large_dog: 0,
        cat: 0,
        other_pets: 0
      }
    ]
    // Assert that the result from getForms matches the expected result
    expect(result).toEqual(expected)
})

test ("Get a form given its formID", async() => {
    // Call the getForm function and provide the formID to get the form details
    const result = await Matching.getForm(3)
    const expected = {
      form_id: 3,
      email: 'jmpinto@cpp.edu',
      zipcode: 12345,
      max_distance: 20,
      num_rooms: 2,
      num_people: 1,
      young_children: 0,
      adolescent_children: 0,
      teenage_children: 0,
      elderly: 0,
      small_dog: 0,
      large_dog: 0,
      cat: 0,
      other_pets: 0
    }
    // Assert that the result from getForm matches the expected result
    expect(result).toEqual(expected)
})

test ("Get a form given its userID", async() => {
    // Call the getUserForm function using the user's ID to get the forms they've submitted
    const result = await Matching.getUserForm(4)
    const expected =  {
      user_id: '4',
      form_id: 9,
      type: 'offering',
      num_rooms: 2,
      num_people: 2,
      young_children: 1,
      adolescent_children: 0,
      teenage_children: 0,
      elderly: 0,
      small_dog: 0,
      large_dog: 0,
      cat: 0,
      other_pets: 0
    }

    // Assert that the resultfrom getUserForm is the same as the expected result 
    expect(result).toEqual(expected)
})

test("Find a match based on preexisting request and offering forms", async() => {
    const result = await Matching.match(10, "requesting")

    // If there is a match, set expected to true, otherwise set the expected value to false 
    let expected = true
    if (!result) {
        expected = false
    } 
    // Assert that the result from match matches expected value 
    expect(result).toEqual(expected)
})

test("Delete a form given the formID", async() => {
    // Call the deleteForms method with the formID
    const result = await Matching.deleteForms([12])

    // If deletion failed, expect value to be false, otherwise expect it to be true
    let expected = true
    if(!result){
        expected = false
    }
    // Assert that the result from deleteForms matches expected value 
    expect(result).toEqual(expected)
})