import { useEffect, useRef } from 'react';

/**
 * Attaches IntersectionObserver to a container ref.
 * Children with class `reveal`, `reveal-left`, or `reveal-right`
 * get the `visible` class added when they enter the viewport.
 *
 * @param {object} options - IntersectionObserver options
 * @returns {React.RefObject} ref to attach to the section container
 */
export function useScrollAnimation(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = el.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // animate only once
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
        ...options,
      }
    );

    targets.forEach((t) => observer.observe(t));

    return () => observer.disconnect();
  }, []);

  return ref;
}

/**
 * Stagger delay helper — returns inline style with animation-delay.
 * @param {number} index - item index in list
 * @param {number} [base=100] - base delay in ms
 */
export function staggerDelay(index, base = 100) {
  return { transitionDelay: `${index * base}ms` };
}
