
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, './.env') });

async function testHF() {
    const message = "Hello, who are you?";
    const model = "mistralai/Mistral-7B-Instruct-v0.2";
    try {
        console.log("Testing with key:", process.env.HUGGINGFACE_API_KEY ? "EXISTS" : "MISSING");
        const hfResponse = await axios.post(
            `https://api-inference.huggingface.co/models/${model}`,
            {
                inputs: `<s>[INST] ${message} [/INST]`,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                    "Content-Type": "application/json",
                    "x-wait-for-model": "true"
                },
            }
        );
        console.log("Response:", JSON.stringify(hfResponse.data, null, 2));
    } catch (error) {
        console.error("Error:", error.response ? error.response.status : error.message);
        if (error.response) {
            console.error("Data:", error.response.data);
        }
    }
}

testHF();
