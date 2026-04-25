import { Router } from 'express'
import { verifyToken } from '../utils/token-manager.js';
import { chatCompletionValidator, validate } from '../utils/validators.js';
import { generatechatcompletion, getAllSessions, getSessionMessages, deleteSession } from '../controllers/chat-controllers.js';

const chatRoutes = Router();
chatRoutes.post("/new", validate(chatCompletionValidator), verifyToken, generatechatcompletion);
chatRoutes.get("/all-sessions", verifyToken, getAllSessions);
chatRoutes.get("/session/:id", verifyToken, getSessionMessages);
chatRoutes.delete("/session/:id", verifyToken, deleteSession);

export default chatRoutes;
