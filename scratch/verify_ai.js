
const OpenAI = require('openai');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../backend/.env') });

const openai = new OpenAI({
  apiKey: process.env.HUGGINGFACE_API_KEY,
  baseURL: "https://api-inference.huggingface.co/v1/",
});

async function testHF() {
    const message = "Hello, who are you?";
    try {
        console.log("Testing with key:", process.env.HUGGINGFACE_API_KEY ? "EXISTS" : "MISSING");
        const response = await openai.chat.completions.create({
            model: "google/gemma-7b-it",
            messages: [{ role: "user", content: message }],
        });
        console.log("Response:", response.choices[0].message.content);
    } catch (error) {
        console.error("Error:", error.message);
        if (error.response) {
            console.error("Data:", error.response.data);
        }
    }
}

testHF();
