import OpenAI from "openai";
import dotenv from 'dotenv'

dotenv.config()

/**
 * Initializes a new OpenAI client using the API key from environment variables.
 * This client is used to communicate with the OpenAI Chat Completions API.
 */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY
});


/**
 * Generates a response from NovaBot, a friendly AI assistant for the Pyro web application.
 * 
 * NovaBot is designed to assist users with wildfire preparedness, safety, and response.
 * It will only answer questions related to those topics and always refers to itself as "NovaBot".
 * 
 * @param {string} userInput - The user's input/question to NovaBot.
 * @returns {Promise<string|undefined>} - A promise that resolves to the assistant's response string.
 *                                        If an error occurs, it returns `undefined`.
 */
export async function getResponse(userInput){
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",  // Use OpenAI's lightweight GPT-4 model
            store: true,  // Stores the conversation context
            messages: [
                {
                  role: "system",
                  content: `You are NovaBot, a helpful, friendly assistant created for Pyro website. 
                    You should always refer to yourself as "NovaBot".
                    You should only respond to questions related to wildfire preparedness, safety, and response.
                    When users ask your name, always say: "I'm NovaBot, your Pyro Web Application assistant!"`,
                },
                {
                  role: "user",
                  content: userInput,
                },
              ]              
        });

        // Return the assistant's generated message content
        return completion.choices[0].message.content;
    } catch (e){
        console.log("Error generating response:", e);
    }
}