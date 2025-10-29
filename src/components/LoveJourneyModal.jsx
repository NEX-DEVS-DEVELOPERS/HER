import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import ModalShell from './ModalShell.jsx';
import { loveJourneyStages } from '../data/loveJourney.js';

const stageVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.98 }
};

function LoveJourneyModal({ isOpen, onDismiss, onComplete, onStageChange }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalStages = loveJourneyStages.length;

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      onStageChange?.(0);
    }
  }, [isOpen, onStageChange]);

  useEffect(() => {
    if (!isOpen) return;
    onStageChange?.(currentIndex);
  }, [currentIndex, isOpen, onStageChange]);

  const currentStage = loveJourneyStages[currentIndex] ?? loveJourneyStages[0];
  const progressValue = ((currentIndex + 1) / totalStages) * 100;

  const handleClose = () => {
    onDismiss?.();
  };

  const handleBack = () => {
    setCurrentIndex((previous) => Math.max(previous - 1, 0));
  };

  const handleNext = () => {
    if (currentIndex >= totalStages - 1) {
      onComplete?.();
      onDismiss?.();
      return;
    }
    setCurrentIndex((previous) => Math.min(previous + 1, totalStages - 1));
  };

  const nextLabel = currentIndex === totalStages - 1 ? 'Start our song' : 'Next chapter';

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={handleClose}
      size="lg"
      title="Our 10 stages of forever"
      subtitle="Tap through each chapter we survived, celebrated, and promised."
    >
      <div className="love-journey">
        <div className="love-journey__stage-wrapper">
          {currentIndex > 0 && (
            <button
              type="button"
              className="love-journey__arrow love-journey__arrow--left"
              onClick={handleBack}
              aria-label="Go to previous stage"
            >
              ←
            </button>
          )}

          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={currentStage.title}
              className="love-journey__stage"
              variants={stageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <motion.span
                className="love-journey__stage-count"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                Stage {currentIndex + 1} of {totalStages}
              </motion.span>
              <motion.h3
                className="love-journey__stage-title"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.3 }}
              >
                {currentStage.title}
              </motion.h3>
              <motion.div
                className="love-journey__lines"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      staggerChildren: 0.08,
                      delayChildren: 0.18
                    }
                  }
                }}
              >
                {currentStage.lines.map((line, lineIndex) => (
                  <motion.p
                    key={`${currentStage.title}-${lineIndex}`}
                    className="love-journey__line"
                    variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
                  >
                    {line}
                  </motion.p>
                ))}
              </motion.div>
            </motion.article>
          </AnimatePresence>

          <button
            type="button"
            className="love-journey__arrow love-journey__arrow--right"
            onClick={handleNext}
            aria-label={currentIndex === totalStages - 1 ? 'Start our song' : 'Go to next stage'}
          >
            →
          </button>
        </div>

        <button type="button" className="love-journey__skip" onClick={handleClose}>
          Skip for now
        </button>
      </div>
    </ModalShell>
  );
}

export default LoveJourneyModal;


