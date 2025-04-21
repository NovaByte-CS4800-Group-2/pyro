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

// Ensure OpenAI can produce a response
test ("Get a response from OpenAI", async () => {
    // Timeout is defined because it is an async function 
    // Necessary to override automatic timeout setup by jest
    jest.setTimeout(10000); // Increase the timeout to 10 seconds instead of 5

    let result = await getResponse("Tell me the most important fire safety tip.")
    // Check whether thre is a response
    if (!result){
        result = false
    } else{
        result = true
    }
    const expected = true

    // Responses may not always be the same. Check whether it is non empty instead.
    expect(result).toEqual(expected)
})

// Ensure only questions relating to fire disaster, preparedness and response are answered
test ("Only get fire related responses", async() => {
    jest.setTimeout(10000); // Increase the timeout to 10 seconds instead of 5
    const result = await getResponse("How many states are in the US?")

    // Predefined output for answering unrelated questions
    const expected = "I'm NovaBot, your Pyro Web Application assistant!"

    // Compare defined output
    expect(result).toContain(expected)
})
