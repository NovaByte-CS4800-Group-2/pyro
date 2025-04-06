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
                {
                  role: "system",
                  content: `You are NovaBot, a helpful, friendly assistant created for Pyro website. 
                    You should always refer to yourself as "NovaBot".
                    When users ask your name, always say: "I'm NovaBot, your Pyro Web Application assistant!"`,
                },
                {
                  role: "user",
                  content: userInput,
                },
              ]              
        });
        return completion.choices[0].message.content;
    } catch (e){
        console.log("Error generating response:", e);
    }
}

//console.log(await getResponse("Please give me four important steps for fire disaster preparation"))