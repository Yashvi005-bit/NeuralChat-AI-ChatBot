import { useScrollAnimation, staggerDelay } from '../hooks/useScrollAnimation';
import './Features.css';

const FEATURES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: 'Instant responses',
    description: 'Sub-100ms replies powered by our optimized inference pipeline. No waiting, no spinners.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: 'Private by default',
    description: 'End-to-end encrypted conversations. Your data is yours — it never trains our models.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    title: 'Multilingual support',
    description: 'Communicate naturally in 140+ languages. Native-level fluency with cultural nuance built in.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" />
      </svg>
    ),
    title: 'API-ready integration',
    description: 'Drop our REST or WebSocket API into any stack in minutes. SDKs for Python, Node, Go, and more.',
  },
];

export default function Features() {
  const sectionRef = useScrollAnimation();

  return (
    <section className="features section" id="features" ref={sectionRef} aria-label="Features section">
      <div className="container">
        <div className="features__header reveal">
          <span className="section-label">Why NeuralChat</span>
          <h2 className="section-title">Built for the way<br />you actually work</h2>
          <p className="section-subtitle">
            No fluff, no gimmicks — just a reliable assistant that does what you need.
          </p>
        </div>

        <div className="features__grid">
          {FEATURES.map((feat, i) => (
            <div
              key={feat.title}
              className="feature-card reveal"
              style={staggerDelay(i, 80)}
            >
              <div className="feature-card__icon-wrap" aria-hidden="true">
                {feat.icon}
              </div>
              <h3 className="feature-card__title">{feat.title}</h3>
              <p className="feature-card__desc">{feat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
