import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { sendMessage, getAllSessions, getSessionMessages, deleteSession } from '../api/chat';
import Sidebar from '../components/chat/Sidebar';
import ChatWindow from '../components/chat/ChatWindow';
import '../styles/globals.css';
import './ChatPage.css';

/* ---- Unique ID generator for temporary local sessions ---- */
let _id = 0;
const uid = () => `local-${Date.now()}-${++_id}`;

/* ---- Derive a title from first user message ---- */
function deriveTitle(content) {
  return content.length > 42 ? content.slice(0, 42) + '…' : content;
}

/* ---- Default local session factory ---- */
function newLocalSession() {
  return { id: uid(), title: 'New Chat', messages: [] };
}

export default function ChatPage() {
  const { user } = useAuth();

  /* ── State ── */
  const [sessions, setSessions] = useState([newLocalSession()]);
  const [activeId, setActiveId] = useState(sessions[0].id);
  const [isThinking, setIsThinking] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* Active session derived */
  const activeSession = sessions.find(s => s.id === activeId) || sessions[0];
  const messages = activeSession?.messages ?? [];

  /* ── Responsive: collapse sidebar on mobile ── */
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handle = (e) => {
      if (e.matches) { setSidebarCollapsed(true); setMobileOpen(false); }
      else { setSidebarCollapsed(false); }
    };
    handle(mq);
    mq.addEventListener('change', handle);
    return () => mq.removeEventListener('change', handle);
  }, []);

  /* ── Load session list on mount ── */
  useEffect(() => {
    async function loadSessions() {
      try {
        const fetched = await getAllSessions();
        if (fetched && fetched.length > 0) {
          // Map fetched sessions, set messages to null to indicate they need loading
          const mapped = fetched.map(s => ({ ...s, messages: null }));
          setSessions(mapped);
          setActiveId(mapped[0].id);
        }
      } catch (err) {
        console.error('Failed to load sessions:', err);
      }
    }
    loadSessions();
  }, []);

  /* ── Load messages when activeId changes if they are missing ── */
  useEffect(() => {
    if (!activeId || activeId.startsWith('local-')) return;
    
    const active = sessions.find(s => s.id === activeId);
    if (active && active.messages === null) {
      async function fetchMsgs() {
        try {
          const msgs = await getSessionMessages(activeId);
          setSessions(prev => prev.map(s => 
            s.id === activeId ? { ...s, messages: msgs } : s
          ));
        } catch (err) {
          console.error('Failed to fetch messages:', err);
        }
      }
      fetchMsgs();
    }
  }, [activeId, sessions]);

  /* ── Helpers ── */
  const updateSessionMessages = useCallback((id, updater) => {
    setSessions(prev =>
      prev.map(s => s.id === id ? { ...s, messages: updater(s.messages || []) } : s)
    );
  }, []);

  /* ── Send message ── */
  const handleSend = useCallback(async (content) => {
    if (!content.trim() || isThinking) return;

    const currentActiveId = activeId;
    const isLocal = currentActiveId.startsWith('local-');
    
    // Create user message object
    const userMsg = { role: 'user', content, timestamp: new Date().toISOString() };

    // Optimistically add user message to local state
    updateSessionMessages(currentActiveId, msgs => [...msgs, userMsg]);
    setIsThinking(true);

    try {
      // Send message to backend (pass null if it's a new local session)
      const sessionData = await sendMessage(content, isLocal ? null : currentActiveId);
      
      const aiReply = sessionData.messages[sessionData.messages.length - 1];
      const aiMsg = {
        role: 'assistant',
        content: aiReply?.content || 'No response received.',
        timestamp: new Date().toISOString(),
      };

      if (isLocal) {
        // Replace temporary local session with the real one from backend
        setSessions(prev => {
          const filtered = prev.filter(s => s.id !== currentActiveId);
          const newSession = {
            id: sessionData.id,
            title: sessionData.title,
            messages: sessionData.messages
          };
          return [newSession, ...filtered];
        });
        setActiveId(sessionData.id);
      } else {
        // Just append AI message to existing session
        updateSessionMessages(currentActiveId, msgs => [...msgs, aiMsg]);
      }
    } catch (err) {
      const errMsg = {
        role: 'assistant',
        content: `⚠️ ${err.message || 'Something went wrong. Please try again.'}`,
        timestamp: new Date().toISOString(),
      };
      updateSessionMessages(currentActiveId, msgs => [...msgs, errMsg]);
    } finally {
      setIsThinking(false);
    }
  }, [activeId, isThinking, updateSessionMessages]);

  /* ── New chat ── */
  const handleNewChat = useCallback(() => {
    // Check if we already have an empty local session to avoid duplicates
    const hasEmptyLocal = sessions.some(s => s.id.startsWith('local-') && (s.messages?.length || 0) === 0);
    if (hasEmptyLocal) {
        const emptyLocal = sessions.find(s => s.id.startsWith('local-') && (s.messages?.length || 0) === 0);
        setActiveId(emptyLocal.id);
    } else {
        const session = newLocalSession();
        setSessions(prev => [session, ...prev]);
        setActiveId(session.id);
    }
    if (window.innerWidth <= 768) setMobileOpen(false);
  }, [sessions]);

  /* ── Select session ── */
  const handleSelectSession = useCallback((id) => {
    setActiveId(id);
    if (window.innerWidth <= 768) setMobileOpen(false);
  }, []);

  /* ── Delete session ── */
  const handleDeleteSession = useCallback(async (id) => {
    try {
      if (!id.startsWith('local-')) {
        await deleteSession(id);
      }
      setSessions(prev => {
        const filtered = prev.filter(s => s.id !== id);
        if (filtered.length === 0) {
          const fresh = newLocalSession();
          setActiveId(fresh.id);
          return [fresh];
        }
        if (id === activeId) setActiveId(filtered[0].id);
        return filtered;
      });
    } catch (err) {
      console.error('Failed to delete session:', err);
    }
  }, [activeId]);

  /* ── Clear active chat (same as delete for specific session) ── */
  const handleClearChat = useCallback(() => {
    handleDeleteSession(activeId);
  }, [activeId, handleDeleteSession]);

  /* ── Sidebar toggle ── */
  const handleToggleSidebar = useCallback(() => {
    if (window.innerWidth <= 768) {
      setMobileOpen(prev => !prev);
    } else {
      setSidebarCollapsed(prev => !prev);
    }
  }, []);

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const sidebarVisible = isMobile ? mobileOpen : !sidebarCollapsed;

  return (
    <div className="chat-page" id="chat-page">
      {isMobile && mobileOpen && (
        <div
          className="chat-page__overlay"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar
        sessions={sessions}
        activeId={activeId}
        onSelect={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        collapsed={!sidebarVisible}
        onToggleCollapse={handleToggleSidebar}
      />

      <ChatWindow
        messages={messages}
        isThinking={isThinking}
        onSendMessage={handleSend}
        onClearChat={handleClearChat}
        chatTitle={activeSession?.title}
        userName={user?.name}
        sidebarCollapsed={!sidebarVisible}
        onToggleSidebar={handleToggleSidebar}
      />
    </div>
  );
}

