import { motion } from 'framer-motion';

import { letterContent } from '../data/content.js';

function LetterSection() {
  return (
    <section id="letter" className="letter" aria-labelledby="letter-title">
      <motion.div
        className="letter__card"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <h2 id="letter-title" className="letter__heading">
          {letterContent.heading}
        </h2>
        {letterContent.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <p className="letter__signature">
          {letterContent.signature.closing}
          <br />
          {letterContent.signature.name}
          <br />
          <span>{letterContent.signature.nickname}</span>
        </p>
        <div className="letter__timeline">
          <h3>Our journey</h3>
          <dl>
            {letterContent.timeline.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="letter__highlights">
          <h3>How we make miles feel small</h3>
          <ul>
            {letterContent.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}

export default LetterSection;

