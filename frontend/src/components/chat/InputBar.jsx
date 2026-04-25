import { useState, useRef, useCallback, useEffect } from 'react';
import { SendHorizontal } from 'lucide-react';
import './InputBar.css';

export default function InputBar({ onSend, disabled, isLoading }) {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  /* Auto-resize textarea height */
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 200) + 'px';
  }, [value]);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    // Reset height
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  }, [value, disabled, onSend]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="input-bar">
      <div className="input-bar__inner">
        <div className="input-bar__wrap">
          <textarea
            ref={textareaRef}
            id="chat-input"
            className="input-bar__textarea"
            placeholder="Ask anything…"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={disabled}
            aria-label="Message input"
            aria-multiline="true"
          />
          <button
            className="input-bar__send"
            onClick={handleSend}
            disabled={!canSend}
            aria-label="Send message"
            title="Send message (Enter)"
            id="chat-send-btn"
          >
            {isLoading
              ? <span className="input-bar__spinner" aria-hidden="true" />
              : <SendHorizontal size={16} />
            }
          </button>
        </div>
        <p className="input-bar__hint">
          Press <kbd>Enter</kbd> to send · <kbd>Shift+Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
}
