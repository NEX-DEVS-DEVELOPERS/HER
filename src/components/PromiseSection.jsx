import { motion } from 'framer-motion';

import { promiseContent } from '../data/content.js';

function PromiseSection() {
  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="promise" className="promise" aria-labelledby="promise-title">
      <motion.div
        className="promise__content"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <h2 id="promise-title">{promiseContent.heading}</h2>
        <p>{promiseContent.body}</p>
        <ul className="promise__list">
          {promiseContent.promises.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="promise__footer">
          <p>{promiseContent.footer}</p>
          <button className="promise__cta" type="button" onClick={handleBackToTop}>
            Back to the top
          </button>
        </div>
      </motion.div>
    </section>
  );
}

export default PromiseSection;

