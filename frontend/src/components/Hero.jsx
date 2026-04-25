import './Hero.css';

/* ─── Mock Chat UI ─────────────────────────────────── */
function ChatPreview() {
  return (
    <div className="chat-preview" aria-hidden="true">
      {/* Header bar */}
      <div className="chat-preview__header">
        <div className="chat-preview__header-dot chat-preview__header-dot--green" />
        <div className="chat-preview__header-dot chat-preview__header-dot--yellow" />
        <div className="chat-preview__header-dot chat-preview__header-dot--red" />
        <span className="chat-preview__header-title">NeuralChat</span>
        <div className="chat-preview__header-badge">● Online</div>
      </div>

      {/* Messages */}
      <div className="chat-preview__body">
        <div className="chat-msg chat-msg--ai">
          <div className="chat-msg__avatar">NC</div>
          <div className="chat-msg__bubble">
            Hi there! How can I help you today?
          </div>
        </div>

        <div className="chat-msg chat-msg--user">
          <div className="chat-msg__bubble">
            Can you summarize this document for me?
          </div>
        </div>

        <div className="chat-msg chat-msg--ai">
          <div className="chat-msg__avatar">NC</div>
          <div className="chat-msg__bubble">
            Sure. Here's a concise summary of the key points…
            <div className="chat-msg__typing">
              <span /><span /><span />
            </div>
          </div>
        </div>
      </div>

      {/* Input bar */}
      <div className="chat-preview__input-bar">
        <div className="chat-preview__input">
          Ask anything…
        </div>
        <button className="chat-preview__send">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function Hero({ onSignup, onLogin }) {
  return (
    <section className="hero" id="hero" aria-label="Hero section">
      {/* Subtle radial backdrop */}
      <div className="hero__backdrop" aria-hidden="true" />

      <div className="hero__inner container">
        {/* ── Left: Copy ── */}
        <div className="hero__copy">
          <div className="hero__badge">
            <span className="hero__badge-pulse" aria-hidden="true" />
            Now in public beta
          </div>

          <h1 className="hero__headline">
            A smarter way to<br />
            <span className="gradient-text">have a conversation.</span>
          </h1>

          <p className="hero__sub">
            NeuralChat is a fast, private AI assistant built for real work —
            not demos. Ask questions, summarize content, or connect your tools.
          </p>

          <div className="hero__ctas">
            <button
              className="btn btn-primary hero__cta-primary"
              onClick={onSignup}
              id="hero-signup-btn"
            >
              Get started free
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
            <button
              className="btn btn-ghost"
              onClick={onLogin}
              id="hero-login-btn"
            >
              Log in
            </button>
          </div>

          <div className="hero__stats">
            {[
              ['50K+', 'Active users'],
              ['99.9%', 'Uptime SLA'],
              ['140+', 'Languages'],
            ].map(([val, label]) => (
              <div className="hero__stat" key={label}>
                <span className="hero__stat-value">{val}</span>
                <span className="hero__stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Chat UI ── */}
        <div className="hero__visual">
          <ChatPreview />
        </div>
      </div>
    </section>
  );
}
