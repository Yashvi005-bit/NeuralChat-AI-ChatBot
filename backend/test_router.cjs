
const OpenAI = require('openai');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, './.env') });

const openai = new OpenAI({
  apiKey: process.env.HUGGINGFACE_API_KEY,
  baseURL: "https://router.huggingface.co/v1",
});

async function testHF() {
    const message = "Hello, who are you?";
    try {
        console.log("Testing with router and Zephyr...");
        const response = await openai.chat.completions.create({
            model: "HuggingFaceH4/zephyr-7b-beta",
            messages: [{ role: "user", content: message }],
            max_tokens: 50
        });
        console.log("Response:", response.choices[0].message.content);
    } catch (error) {
        console.error("Error Status:", error.status);
        console.error("Error Message:", error.message);
    }
}

testHF();
