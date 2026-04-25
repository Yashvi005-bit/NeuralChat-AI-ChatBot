import { NextFunction, Request, Response } from "express"
import User from "../models/User.js"
import { randomUUID } from "crypto";

export const generatechatcompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message, sessionId } = req.body;
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user)
      return res
        .status(401)
        .json({ message: "User not registered OR Token malfunctioned" });

    let session: any;
    if (sessionId) {
      session = (user as any).sessions.find((s: any) => s.id === sessionId);
    }

    if (!session) {
      // Create new session if none found or provided
      session = {
        id: randomUUID(),
        title: message.substring(0, 40), // Simple title from first message
        messages: []
      };
      (user as any).sessions.push(session);
      // Need to get the actual pushed object to maintain reference if needed, 
      // but Mongoose usually handles this. Re-finding to be sure.
      session = (user as any).sessions[(user as any).sessions.length - 1];
    }

    // Prepare message history for AI
    const history = session.messages.map(({ role, content }: any) => ({
      role,
      content,
    }));

    history.push({
      role: "user",
      content: message,
    });

    // Try primary model
    let responseText = "";
    try {
      const hfResponse = await fetch(
        "https://router.huggingface.co/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "meta-llama/Meta-Llama-3-8B-Instruct",
            messages: history,
            max_tokens: 500,
            temperature: 0.7,
          }),
        }
      );

      if (!hfResponse.ok) {
        const errorText = await hfResponse.text();
        throw new Error(`HF API Error (${hfResponse.status}): ${errorText.substring(0, 200)}`);
      }

      const data: any = await hfResponse.json();
      responseText = data?.choices?.[0]?.message?.content || "";
    } catch (err) {
      console.error("Model inference failed:", err);
    }

    if (!responseText) {
      throw new Error("AI failed to generate a response. Please check your API key or model availability.");
    }

    // Save messages to session
    session.messages.push({
      role: "user",
      content: message,
    });

    session.messages.push({
      role: "assistant",
      content: responseText.trim(),
    });

    await user.save();
    return res.status(200).json({ session });
  } catch (error: any) {
    console.error("AI Error:", error.message);
    return res.status(500).json({
      message: error.message || "Something went wrong",
    });
  }
};

export const getAllSessions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).json({ message: "User not registered OR Token malfunctioned" });
    }
    // Return only titles and IDs for the sidebar
    const sessions = (user as any).sessions.map((s: any) => ({
      id: s.id,
      title: s.title
    }));
    return res.status(200).json({ message: "OK", sessions });
  } catch (error: any) {
    console.error("Error:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const getSessionMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).json({ message: "User not registered OR Token malfunctioned" });
    }
    const session = (user as any).sessions.find((s: any) => s.id === req.params.id);
    if (!session) {
        return res.status(404).json({ message: "Session not found" });
    }
    return res.status(200).json({ message: "OK", messages: session.messages });
  } catch (error: any) {
    console.error("Error:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).json({ message: "User not registered OR Token malfunctioned" });
    }
    (user as any).sessions = (user as any).sessions.filter((s: any) => s.id !== req.params.id);
    await user.save();
    return res.status(200).json({ message: "OK" });
  } catch (error: any) {
    console.error("Error:", error.message);
    return res.status(500).json({ message: error.message });
  }
};
