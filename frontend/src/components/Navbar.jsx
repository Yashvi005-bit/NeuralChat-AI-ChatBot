import { useState, useEffect } from 'react';
import './Navbar.css';

export default function Navbar({ onLogin, onSignup }) {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href) => {
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="navbar__inner container">
        {/* Logo */}
        <a href="#" className="navbar__logo" aria-label="NeuralChat home">
          <span className="navbar__logo-dot" aria-hidden="true" />
          NeuralChat
        </a>

        {/* Desktop Nav Links */}
        <ul className="navbar__links" role="list">
          {[
            ['#features',    'Features'],
            ['#how-it-works','How it works'],
            ['#pricing',     'Pricing'],
          ].map(([href, label]) => (
            <li key={href}>
              <button
                className="navbar__link"
                onClick={() => handleNavClick(href)}
                aria-label={`Navigate to ${label}`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        {/* CTA Buttons */}
        <div className="navbar__ctas">
          <button className="navbar__link" onClick={onLogin} id="navbar-login-btn">
            Log in
          </button>
          <button className="btn btn-primary btn-sm" onClick={onSignup} id="navbar-signup-btn">
            Get started
          </button>
        </div>

        {/* Hamburger */}
        <button
          className={`navbar__hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle mobile menu"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="navbar__mobile" role="dialog" aria-label="Mobile navigation">
          <ul role="list">
            {[
              ['#features',    'Features'],
              ['#how-it-works','How it works'],
              ['#pricing',     'Pricing'],
            ].map(([href, label]) => (
              <li key={href}>
                <button className="navbar__mobile-link" onClick={() => handleNavClick(href)}>
                  {label}
                </button>
              </li>
            ))}
          </ul>
          <div className="navbar__mobile-ctas">
            <button className="btn btn-ghost" onClick={() => { setMenuOpen(false); onLogin(); }}>Log in</button>
            <button className="btn btn-primary" onClick={() => { setMenuOpen(false); onSignup(); }}>Get started</button>
          </div>
        </div>
      )}
    </nav>
  );
}
