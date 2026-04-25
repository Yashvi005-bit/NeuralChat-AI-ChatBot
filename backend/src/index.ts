import "dotenv/config";
import app from "./app.js"
import { connectToDatabase } from "./db/connection.js";

// Connections and listeners
const PORT = process.env.PORT || 5000;

// Validate essential environment variables
const requiredEnv = ["MONGODB_URL", "JWT_SECRET", "COOKIE_SECRET"];
const missingEnv = requiredEnv.filter(env => !process.env[env]);

if (missingEnv.length > 0) {
    console.error(`FATAL ERROR: Missing environment variables: ${missingEnv.join(", ")}`);
    console.error("Please set these in your Render dashboard under 'Environment'.");
    process.exit(1);
}

console.log("Attempting to connect to database...");
connectToDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT} 🚀`);
            console.log("Connected to MongoDB successfully.");
        });
    })
    .catch((err) => {
        console.error("Database connection failed! Error:");
        console.error(err);
        process.exit(1);
    });
