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
      <motion.div
        className="hero__content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <p className="hero__eyebrow">{heroContent.eyebrow}</p>
        <h1 id="hero-heading" className="hero__headline">
          {heroContent.headline}
        </h1>
        <p className="hero__subtext">{heroContent.subtext}</p>
        {heroContent.supportLines?.length > 0 && (
          <div className="hero__support">
            {heroContent.supportLines.map((line) => (
              <p key={line} className="hero__support-line">
                {line}
              </p>
            ))}
          </div>
        )}
        <button className="hero__cta" type="button" onClick={handleReveal}>
          {heroContent.ctaLabel}
        </button>
        {heroContent.workInProgressNote && <p className="hero__wip-note">{heroContent.workInProgressNote}</p>}
        <p className="hero__signature">{heroContent.signature}</p>
      </motion.div>
    </section>
  );
}

export default HeroSection;

