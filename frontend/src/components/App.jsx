import { useState, useCallback } from 'react';
import '../styles/globals.css';
import { useAuth } from '../context/AuthContext';

import Preloader  from './Preloader';
import Navbar     from './Navbar';
import Hero       from './Hero';
import Features   from './Features';
import HowItWorks from './HowItWorks';
import Testimonials from './Testimonials';
import Pricing    from './Pricing';
import Footer     from './Footer';
import Modal      from './Modal';
import LoginForm  from './LoginForm';
import SignupForm from './SignupForm';
import ChatPage   from '../pages/ChatPage';

export default function App() {
  const { isAuth, loading } = useAuth();

  /* Preloader */
  const [preloaderDone, setPreloaderDone] = useState(false);

  /* Auth modal state */
  const [showLogin,  setShowLogin]  = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const openLogin  = useCallback(() => { setShowSignup(false); setShowLogin(true);  }, []);
  const openSignup = useCallback(() => { setShowLogin(false);  setShowSignup(true); }, []);
  const closeAll   = useCallback(() => { setShowLogin(false);  setShowSignup(false); }, []);

  /* ── While checking auth on first load ── */
  if (loading) {
    return (
      <div style={{
        height: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#000', color: '#3f3f46',
        fontSize: '0.85rem', fontFamily: 'Inter, sans-serif', letterSpacing: '-0.01em',
      }}>
        Loading…
      </div>
    );
  }

  /* ── Authenticated → show Chat UI ── */
  if (isAuth) {
    return <ChatPage />;
  }

  /* ── Not authenticated → Landing Page ── */
  return (
    <>
      {!preloaderDone && (
        <Preloader onDone={() => setPreloaderDone(true)} />
      )}

      <Navbar onLogin={openLogin} onSignup={openSignup} />

      <main>
        <Hero       onSignup={openSignup} onLogin={openLogin} />
        <Features   />
        <HowItWorks />
        <Testimonials />
        <Pricing    onSignup={openSignup} />
      </main>

      <Footer />

      <Modal isOpen={showLogin}  onClose={closeAll} title="Log in to NeuralChat">
        <LoginForm  onSwitchToSignup={openSignup} onClose={closeAll} />
      </Modal>

      <Modal isOpen={showSignup} onClose={closeAll} title="Create a NeuralChat account">
        <SignupForm onSwitchToLogin={openLogin} onClose={closeAll} />
      </Modal>
    </>
  );
}
