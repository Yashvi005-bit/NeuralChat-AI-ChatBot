
const OpenAI = require('openai');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, './.env') });

const openai = new OpenAI({
  apiKey: process.env.HUGGINGFACE_API_KEY,
  baseURL: "https://api-inference.huggingface.co/v1",
});

async function testHF() {
    const message = "Hello";
    try {
        console.log("Testing GPT2 with key:", process.env.HUGGINGFACE_API_KEY ? "EXISTS" : "MISSING");
        const response = await openai.chat.completions.create({
            model: "openai-community/gpt2",
            messages: [{ role: "user", content: message }],
            max_tokens: 10
        });
        console.log("Response:", response.choices[0].message.content);
    } catch (error) {
        console.error("Error Status:", error.status);
        console.error("Error Message:", error.message);
        if (error.response) {
            console.error("Data:", error.response.data);
        }
    }
}

testHF();
