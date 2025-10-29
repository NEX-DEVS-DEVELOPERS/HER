import { useEffect, useRef } from 'react';

const PHASES = [
  { label: 'Breathe in', duration: 4 },
  { label: 'Hold', duration: 4 },
  { label: 'Breathe out', duration: 6 },
];

function BreathingGuide() {
  const circleRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    let phaseIndex = 0;
    let timeoutId;

    const runPhase = () => {
      const circle = circleRef.current;
      const text = textRef.current;
      const phase = PHASES[phaseIndex];
      if (!circle || !text) return;

      text.textContent = phase.label;
      circle.style.setProperty('--breath-duration', `${phase.duration}s`);
      circle.setAttribute('data-phase', phase.label.toLowerCase().replace(' ', '-'));

      timeoutId = window.setTimeout(() => {
        phaseIndex = (phaseIndex + 1) % PHASES.length;
        runPhase();
      }, phase.duration * 1000);
    };

    runPhase();

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="breathing-guide" aria-live="polite">
      <div ref={circleRef} className="breathing-guide__circle">
        <div ref={textRef} className="breathing-guide__text">
          Breathe in
        </div>
      </div>
      <p className="breathing-guide__caption">Follow the circle—inhale, hold, exhale.</p>
    </div>
  );
}

export default BreathingGuide;

