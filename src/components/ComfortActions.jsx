import { motion } from 'framer-motion';

const actions = [
  {
    title: 'Send me a "drop everything" ping',
    note: 'Use this when you need me right away — no explanations required.',
    actionLabel: 'Ping me now',
    link: 'https://www.instagram.com/direct/inbox/',
  },
  {
    title: 'Schedule a comfort call',
    note: 'Pick a slot and I’ll clear my calendar so you have my full attention.',
    actionLabel: 'Open call planner',
    link: 'mailto:ali@example.com?subject=Comfort%20call&body=Let%E2%80%99s%20book%20a%20time',
  },
  {
    title: 'Leave me a note to wake up to',
    note: 'Drop a thought, a worry, or a wish — I’ll answer it first thing.',
    actionLabel: 'Write me a note',
    link: 'https://wa.me/00000000000',
  },
];

function ComfortActions() {
  return (
    <motion.section
      className="comfort-actions"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <h2>Im still right here</h2>
      <div className="comfort-actions__grid">
        {actions.map((item) => (
          <article key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.note}</p>
            <a className="comfort-actions__button" href={item.link} target="_blank" rel="noreferrer">
              {item.actionLabel}
            </a>
          </article>
        ))}
      </div>
    </motion.section>
  );
}

export default ComfortActions;


