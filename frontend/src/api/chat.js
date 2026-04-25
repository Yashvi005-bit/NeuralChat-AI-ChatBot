import api from "./index";

/**
 * Send a message and get back the session data.
 * @param {string} message
 * @param {string} sessionId
 * @returns {Promise<{session: any}>}
 */
export async function sendMessage(message, sessionId) {
  try {
    const res = await api.post("chats/new", { message, sessionId });
    return res.data.session;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to send message. Please try again.");
  }
}

/**
 * Fetch all session titles and IDs.
 */
export async function getAllSessions() {
  try {
    const res = await api.get("chats/all-sessions");
    return res.data.sessions;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to load sessions.");
  }
}

/**
 * Fetch messages for a specific session.
 */
export async function getSessionMessages(id) {
  try {
    const res = await api.get(`chats/session/${id}`);
    return res.data.messages;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to load session messages.");
  }
}

/**
 * Delete a specific session.
 */
export async function deleteSession(id) {
  try {
    await api.delete(`chats/session/${id}`);
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to delete session.");
  }
}

