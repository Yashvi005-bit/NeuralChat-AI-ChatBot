import { useRef, useState, useEffect } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import './Testimonials.css';

const TESTIMONIALS = [
  {
    name: 'Sarah Chen',
    role: 'Head of Product, Veritas AI',
    quote: 'NeuralChat cut our internal support tickets by 60% in the first month. The API integration was seamless — we were live in a single afternoon.',
    initials: 'SC',
  },
  {
    name: 'Marcus Webb',
    role: 'Lead Developer, Nexus Labs',
    quote: "I've tried every AI tool out there. Nothing comes close to NeuralChat's accuracy — and the privacy guarantees are exactly what our clients demand.",
    initials: 'MW',
  },
  {
    name: 'Priya Nair',
    role: 'Founder, Stackly',
    quote: 'Multilingual support was the deal-breaker for us. Our global users now get the same quality experience in 12 languages. Absolutely remarkable.',
    initials: 'PN',
  },
];

function StarRating() {
  return (
    <div className="testimonial__stars" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const sectionRef = useScrollAnimation();

  return (
    <section className="testimonials section" id="testimonials" ref={sectionRef} aria-label="Testimonials section">
      <div className="container">
        <div className="testimonials__header reveal">
          <span className="section-label">What people say</span>
          <h2 className="section-title">Trusted by builders<br />around the world</h2>
          <p className="section-subtitle">
            Join thousands of developers and teams already shipping with NeuralChat.
          </p>
        </div>

        <div className="testimonials__grid">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              className="testimonial-card reveal"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <StarRating />
              <blockquote className="testimonial-card__quote">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="testimonial-card__author">
                <div className="testimonial-card__avatar" aria-hidden="true">
                  {t.initials}
                </div>
                <div>
                  <div className="testimonial-card__name">{t.name}</div>
                  <div className="testimonial-card__role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social proof bar */}
        <div className="testimonials__social reveal">
          <div className="testimonials__avatars" aria-hidden="true">
            {['A', 'B', 'C', 'D', 'E'].map((l, i) => (
              <div
                key={l}
                className="testimonials__avatar-bubble"
                style={{ marginLeft: i === 0 ? 0 : '-10px', zIndex: 5 - i }}
              >
                {l}
              </div>
            ))}
          </div>
          <span className="testimonials__social-text">
            <strong>50,000+</strong> teams and developers trust NeuralChat
          </span>
        </div>
      </div>
    </section>
  );
}
