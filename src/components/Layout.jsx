import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from './Navigation.jsx';
import EnhancedRomanticBackground from './EnhancedRomanticBackground.jsx';
import SmoothScroller from './SmoothScroller.jsx';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.02
  }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4
};

function Layout() {
  return (
    <div className="app-shell">
      <SmoothScroller />
      <EnhancedRomanticBackground />
      <Navigation />
      
      <main className="page-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={window.location.pathname}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="page-transition-container"
          >
            <div className="glass glass--light content-wrapper">
              <Outlet />
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
      
      <footer className="app-footer glass">
        <p>Made with love for Eman by Ali Hasnaat</p>
      </footer>
    </div>
  );
}

export default Layout;

