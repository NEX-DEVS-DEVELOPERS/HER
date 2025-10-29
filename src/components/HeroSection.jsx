import { useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

import HeroParticles from './HeroParticles.jsx';
import { heroContent } from '../data/content.js';

function HeroSection({ onReveal }) {
  const heroRef = useRef(null);

  const handleReveal = () => {
    if (onReveal) onReveal();
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.2 },
      colors: ['#ffd6e0', '#d8ccff', '#c2f2ed', '#ffb2c8'],
    });
    const nextSection = document.querySelector('#letter');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section ref={heroRef} className="hero" aria-labelledby="hero-heading">
      <HeroParticles />
      <div className="floating-decor" aria-hidden="true">
        <span className="floating-heart floating-heart--left" />
        <span className="floating-heart floating-heart--center" />
        <span className="floating-heart floating-heart--right" />
        <span className="floating-sparkle floating-sparkle--one" />
        <span className="floating-sparkle floating-sparkle--two" />
        <span className="floating-sparkle floating-sparkle--three" />
        <span className="floating-orb floating-orb--one" />
        <span className="floating-orb floating-orb--two" />
        <span className="floating-orb floating-orb--three" />
        <span className="floating-ribbon floating-ribbon--one" />
        <span className="floating-ribbon floating-ribbon--two" />
      </div>
      <div className="hero__content">
        <motion.p
          className="hero__eyebrow"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {heroContent.eyebrow}
        </motion.p>

        <motion.h1
          id="hero-heading"
          className="hero__headline"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          {heroContent.headline}
        </motion.h1>

        <motion.p
          className="hero__subtext"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {heroContent.subtext}
        </motion.p>

        {heroContent.supportLines?.length > 0 && (
          <motion.div
            className="hero__support"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {heroContent.supportLines.map((line, index) => (
              <motion.p
                key={line}
                className="hero__support-line"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.15 }}
              >
                {line}
              </motion.p>
            ))}
          </motion.div>
        )}

        <motion.button
          className="hero__cta"
          type="button"
          onClick={handleReveal}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          {heroContent.ctaLabel}
        </motion.button>

        {heroContent.workInProgressNote && (
          <motion.p
            className="hero__wip-note"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.7 }}
          >
            {heroContent.workInProgressNote}
          </motion.p>
        )}

        <motion.p
          className="hero__signature"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.9 }}
        >
          {heroContent.signature}
        </motion.p>
      </div>
    </section>
  );
}

export default HeroSection;

