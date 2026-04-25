import { useEffect, useRef, useState } from 'react';
import './Preloader.css';

/*
  Timings (ms)
  The CSS animation drives the bar visually.
  JS drives the counter number and the exit trigger.
*/
const FILL_MS = 2800;  // how long bar takes to reach 100%
const HOLD_MS = 350;   // pause at 100% before fading
const FADE_MS = 650;   // duration of CSS opacity fade

export default function Preloader({ onDone }) {
  const [pct,  setPct]  = useState(0);
  const wrapRef         = useRef(null);

  /* ── Counter (setInterval — StrictMode safe) ── */
  useEffect(() => {
    const origin = Date.now();
    const id = setInterval(() => {
      const p = Math.min(Math.round(((Date.now() - origin) / FILL_MS) * 100), 100);
      setPct(p);
      if (p >= 100) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, []);

  /* ── Exit trigger (setTimeout — StrictMode safe) ── */
  useEffect(() => {
    const total = FILL_MS + HOLD_MS;
    const t1 = setTimeout(() => {
      wrapRef.current?.classList.add('preloader--exit');
    }, total);
    const t2 = setTimeout(() => {
      onDone?.();
    }, total + FADE_MS);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div className="preloader" ref={wrapRef} role="status" aria-label="Loading NeuralChat">
      <div className="preloader__bg" aria-hidden="true" />

      <div className="preloader__center">
        {/* Wordmark */}
        <div className="preloader__logo">
          <span className="preloader__logo-dot" aria-hidden="true" />
          NeuralChat
        </div>

        {/* Bar — driven entirely by CSS animation, no JS width manipulation */}
        <div className="preloader__track" aria-hidden="true">
          <div className="preloader__fill" />
        </div>

        {/* Label + counter */}
        <div className="preloader__footer">
          <span className="preloader__label">Loading experience…</span>
          <span
            className="preloader__counter"
            aria-live="polite"
            aria-atomic="true"
          >
            {pct}%
          </span>
        </div>
      </div>
    </div>
  );
}
