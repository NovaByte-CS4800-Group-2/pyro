import OpenAI from "openai"
import getResponse from '../functions/chat_functions.js';
import dotenv from 'dotenv'
import { jest, expect } from '@jest/globals';

// Create the connection with openai to be able to use the api calls 
beforeAll(async () => {
    dotenv.config() // get api key from env file
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_KEY})
})

// Override automatic timeout setup by jest
jest.setTimeout(10000)

// Ensure OpenAI can produce a response
test ("Get a response from OpenAI", async () => {
    let result = await getResponse("Tell me the most important fire safety tip.")
    // Responses may not always be the same so check whether it is non empty instead 
    if (!result){
        result = false
    } else{
        result = true
    }
    const expected = true

    // Assert that the result from getResponse matches the expected value 
    expect(result).toEqual(expected)
})

// Ensure only questions relating to fire disaster, preparedness and response are answered
test ("Only get fire related responses", async() => {
    const result = await getResponse("How many states are in the US?")

    // Predefined output for answering unrelated questions
    const expected = "I'm NovaBot, your Pyro Web Application assistant!"

    // Assert that the result from getResponse matches the expected value
    expect(result).toContain(expected)
})