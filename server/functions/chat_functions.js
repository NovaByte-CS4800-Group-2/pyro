import OpenAI from "openai";
import dotenv from 'dotenv'

dotenv.config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY
});

export async function getResponse(userInput){
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            store: true, 
            messages: [
                {"role": "user", "content": userInput},
            ]
        });
        return completion.choices[0].message.content;
    } catch (e){
        console.log("Error generating response:", error);
    }
}

console.log(await getResponse("Please give me four important steps for fire disaster preparation"))