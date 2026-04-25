
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../backend/.env') });

async function testHF() {
    const message = "Hello, who are you?";
    try {
        console.log("Testing with key:", process.env.HUGGINGFACE_API_KEY ? "EXISTS" : "MISSING");
        const hfResponse = await axios.post(
            "https://api-inference.huggingface.co/models/google/gemma-2b-it",
            {
                inputs: message,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                    "Content-Type": "application/json",
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
