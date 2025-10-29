import { motion } from 'framer-motion';

import { gratitudeContent } from '../data/content.js';

function GratitudeSection() {
  return (
    <section id="gratitude" className="gratitude" aria-labelledby="gratitude-title">
      <motion.div
        className="gratitude__card"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65 }}
        viewport={{ once: true, amount: 0.25 }}
      >
        <h2 id="gratitude-title">What your love feels like</h2>
        <div className="gratitude__grid">
          {gratitudeContent.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default GratitudeSection;

