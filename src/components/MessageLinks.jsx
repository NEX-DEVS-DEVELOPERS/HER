import { motion } from 'framer-motion';

import { contactLinks } from '../data/content.js';

function MessageLinks() {
  return (
    <section className="message-links" aria-labelledby="message-links-heading">
      <motion.div
        className="message-links__inner"
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.4 }}
      >
        <h2 id="message-links-heading">Need me? Tap any of these.</h2>
        <div className="message-links__grid">
          {contactLinks.map((link) => (
            <a key={link.href} className="message-links__card" href={link.href} target="_blank" rel="noreferrer">
              <span className="message-links__label">{link.label}</span>
              <span className="message-links__description">{link.description}</span>
            </a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default MessageLinks;

