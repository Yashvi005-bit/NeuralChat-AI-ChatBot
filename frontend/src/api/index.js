import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:5000/api/v1",
  baseURL:"https://neuralchat-ai-chatbot-2.onrender.com/api/v1",
  withCredentials: true
});

export default api;