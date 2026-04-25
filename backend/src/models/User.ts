import mongoose from "mongoose";
import { randomUUID } from "crypto";

const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
});

const sessionSchema = new mongoose.Schema({
    id: {
        type: String,
        default: () => randomUUID(),
    },
    title: {
        type: String,
        required: true,
    },
    messages: [messageSchema],
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    sessions: [sessionSchema],
});

export default mongoose.model("User", userSchema);
        