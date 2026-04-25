import { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import './MessageBubble.css';

/* ---- Code block with copy button ---- */
function CodeBlock({ language, children }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(String(children)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [children]);

  return (
    <div className="code-block">
      <div className="code-block__header">
        <span className="code-block__lang">{language || 'code'}</span>
        <button
          className={`code-block__copy ${copied ? 'code-block__copy--copied' : ''}`}
          onClick={handleCopy}
          aria-label="Copy code"
        >
          {copied ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Copy</>}
        </button>
      </div>
      <SyntaxHighlighter
        style={oneDark}
        language={language || 'text'}
        PreTag="div"
        customStyle={{
          margin: 0,
          background: 'transparent',
          fontSize: '0.82rem',
          lineHeight: '1.65',
        }}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  );
}

/* ---- Markdown renderer ---- */
const markdownComponents = {
  code({ inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    if (!inline && match) {
      return <CodeBlock language={match[1]}>{children}</CodeBlock>;
    }
    return <code className={className} {...props}>{children}</code>;
  },
  // Prevent wrapping in extra divs
  p({ children }) { return <p>{children}</p>; },
};

/* ---- Timestamp formatter ---- */
function formatTime(iso) {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

/* ---- User initials for avatar ---- */
function UserAvatar({ name }) {
  const initials = name
    ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U';
  return (
    <div className="message__avatar message__avatar--user" aria-hidden="true">
      {initials}
    </div>
  );
}

/* ---- AI logo avatar ---- */
function AiAvatar() {
  return (
    <div className="message__avatar message__avatar--ai" aria-hidden="true">
      N
    </div>
  );
}

/* ============================================
   MessageBubble — main export
   ============================================ */
export default function MessageBubble({ message, userName }) {
  const isUser = message.role === 'user';

  return (
    <div
      className={`message ${isUser ? 'message--user' : 'message--ai'}`}
      aria-label={`${isUser ? 'Your' : 'NeuralChat'} message`}
    >
      {isUser ? <UserAvatar name={userName} /> : <AiAvatar />}

      <div className="message__body">
        <div className={`message__bubble ${isUser ? 'message__bubble--user' : 'message__bubble--ai'}`}>
          {isUser ? (
            /* User messages: plain pre-wrap text */
            <div className="message__content" style={{ whiteSpace: 'pre-wrap' }}>
              {message.content}
            </div>
          ) : (
            /* AI messages: full markdown */
            <div className="message__content">
              <ReactMarkdown components={markdownComponents}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
        {message.timestamp && (
          <span className="message__timestamp" aria-label="Message time">
            {formatTime(message.timestamp)}
          </span>
        )}
      </div>
    </div>
  );
}
