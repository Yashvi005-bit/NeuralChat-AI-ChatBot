import { useRef, useEffect, useCallback } from 'react';
import { Trash2, Cpu, PanelLeftOpen } from 'lucide-react';
import MessageBubble from './MessageBubble';
import InputBar from './InputBar';
import './ChatWindow.css';

/* ---- Typing indicator when AI is thinking ---- */
function ThinkingIndicator() {
  return (
    <div className="thinking-indicator" aria-label="NeuralChat is thinking" aria-live="polite">
      <div className="thinking-indicator__avatar">
        <Cpu size={14} />
      </div>
      <div className="thinking-indicator__bubble">
        <span className="thinking-indicator__dot" />
        <span className="thinking-indicator__dot" />
        <span className="thinking-indicator__dot" />
      </div>
    </div>
  );
}

/* ---- Empty / welcome state ---- */
const SUGGESTIONS = [
  'Explain quantum computing',
  'Write a React hook',
  'Debug my Python code',
  'Summarize a concept',
];

function EmptyState({ onSuggestion }) {
  return (
    <div className="chat-window__empty">
      <div className="chat-window__empty-icon">
        <Cpu size={26} />
      </div>
      <h2>Start a conversation with NeuralChat</h2>
      <p>Ask me anything — code, concepts, writing, analysis. I'm ready when you are.</p>
      <div className="chat-window__suggestions">
        {SUGGESTIONS.map(s => (
          <button
            key={s}
            className="chat-window__suggestion-chip"
            onClick={() => onSuggestion(s)}
            aria-label={`Try: ${s}`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ============================================
   ChatWindow — main export
   ============================================ */
export default function ChatWindow({
  messages,
  isThinking,
  onSendMessage,
  onClearChat,
  chatTitle,
  userName,
  sidebarCollapsed,
  onToggleSidebar,
}) {
  const bottomRef = useRef(null);

  /* Auto-scroll to bottom on new messages */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSuggestion = useCallback((text) => {
    onSendMessage(text);
  }, [onSendMessage]);

  const hasMessages = messages.length > 0;

  return (
    <div className="chat-window" role="main" aria-label="Chat area">

      {/* ── Header ── */}
      <header className="chat-window__header">
        <div className="chat-window__header-left">
          {sidebarCollapsed && (
            <button
              className="chat-window__menu-btn"
              onClick={onToggleSidebar}
              aria-label="Open sidebar"
              title="Open sidebar"
            >
              <PanelLeftOpen size={15} />
            </button>
          )}
          <span className="chat-window__title">
            {chatTitle || 'New Chat'}
          </span>
          <div className="chat-window__model-badge">
            <span className="chat-window__model-dot" aria-label="Active model"></span>
            <span className="chat-window__model-name">NeuralChat AI</span>
          </div>
        </div>

        <div className="chat-window__header-actions">
          {hasMessages && (
            <button
              className="chat-window__action-btn"
              onClick={onClearChat}
              aria-label="Clear chat"
              title="Clear chat"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </header>

      {/* ── Messages ── */}
      {hasMessages ? (
        <div className="chat-window__messages" role="log" aria-live="polite" aria-label="Messages">
          <div className="chat-window__messages-inner">
            {messages.map((msg, i) => (
              <MessageBubble
                key={`${msg.role}-${i}`}
                message={msg}
                userName={userName}
              />
            ))}
            {isThinking && <ThinkingIndicator />}
            <div ref={bottomRef} aria-hidden="true" />
          </div>
        </div>
      ) : (
        <EmptyState onSuggestion={handleSuggestion} />
      )}

      {/* ── Input Bar ── */}
      <InputBar
        onSend={onSendMessage}
        disabled={isThinking}
        isLoading={isThinking}
      />
    </div>
  );
}
