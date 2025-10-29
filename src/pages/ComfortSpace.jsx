import { motion } from 'framer-motion';

import BreathingGuide from '../components/BreathingGuide.jsx';
import MessageLinks from '../components/MessageLinks.jsx';
import ComfortActions from '../components/ComfortActions.jsx';

function ComfortSpace() {
  return (
    <div className="comfort-page">
      <motion.section
        className="comfort-hero"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1>I built this corner for the harder days</h1>
        <p>
          When the miles feel sharp or my replies are slow, I want you to land somewhere that feels soft and
          certain. Take a breath, remind yourself you&apos;re adored, and tap me whenever you need me.
        </p>
      </motion.section>
      <motion.section
        className="comfort-affirmations"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <h2>Hold these truths close</h2>
        <ul>
          <li>None of the distance changes the way I love you. It only stretches the timeline before I prove it daily.</li>
          <li>
            If the wait ever feels heavy, that&apos;s my cue to pause the grind and come back to you. Please tell me, and I
            will listen.
          </li>
          <li>Every October 30 we spend apart is one I owe you back in double. I&apos;m already planning them.</li>
        </ul>
      </motion.section>
      <motion.section
        className="comfort-breathe"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <h2>Take a gentle breath with me</h2>
        <BreathingGuide />
      </motion.section>
      <motion.section
        className="comfort-reminders"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <h2>When I&apos;m away, remember</h2>
        <div className="comfort-reminders__grid">
          <article>
            <h3>My day starts with you</h3>
            <p>Before the stand-ups and sprint plans, you&apos;re the first push notification in my head.</p>
          </article>
          <article>
            <h3>My night ends with you</h3>
            <p>Even if I pass out mid-text, I wake up feeling guilty and equally obsessed. I will always double back.</p>
          </article>
          <article>
            <h3>Ask for anything</h3>
            <p>If you need reassurance, a voice note, or my face on a call, say it. I&apos;ll drop what I can and show up.</p>
          </article>
        </div>
      </motion.section>
      <ComfortActions />
      <MessageLinks />
    </div>
  );
}

export default ComfortSpace;

