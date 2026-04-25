import { useScrollAnimation, staggerDelay } from '../hooks/useScrollAnimation';
import './HowItWorks.css';

const STEPS = [
  {
    number: '01',
    title: 'Create your account',
    description: 'Sign up with just an email. No credit card required. You\'re up in under a minute.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Connect your context',
    description: 'Upload documents, link APIs, or use our knowledge base. Ready right out of the box.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Start chatting',
    description: 'Your assistant is ready. Ask questions, automate tasks, or build on top of our API.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  const sectionRef = useScrollAnimation();

  return (
    <section className="how section" id="how-it-works" ref={sectionRef} aria-label="How it works section">
      <div className="container">
        <div className="how__header reveal">
          <span className="section-label">The process</span>
          <h2 className="section-title">Up and running<br />in three steps</h2>
          <p className="section-subtitle">
            No complex setup. No long onboarding docs. Just results.
          </p>
        </div>

        <div className="how__steps">
          {STEPS.map((step, i) => (
            <div key={step.number} className="how__step-wrapper reveal" style={staggerDelay(i, 100)}>
              <div className="how__step">
                <div className="how__step-top">
                  <div className="how__step-icon">{step.icon}</div>
                  <span className="how__step-number">{step.number}</span>
                </div>
                <h3 className="how__step-title">{step.title}</h3>
                <p className="how__step-desc">{step.description}</p>
              </div>
              {i < STEPS.length - 1 && (
                <div className="how__connector" aria-hidden="true">
                  <div className="how__connector-line" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
