import express from "express";
import cors from "cors";
import morgan from "morgan";
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
  // origin: "http://localhost:5173", 
  // // frontend URL , allow request from 5173
  origin: "https://neural-chat-ai-chat-bot-4vpy.vercel.app",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(morgan("dev"));

app.use("/api/v1", appRouter);

// Health check route
app.get("/", (req, res) => {
  res.send("NeuralChat API is running... 🚀");
});

export default app; 