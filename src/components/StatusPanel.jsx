import { motion } from 'framer-motion';

import { useState } from 'react';

import { statusHighlights } from '../data/content.js';

function StatusPanel() {
  const [locationStatus, setLocationStatus] = useState({
    label: statusHighlights.location.label,
    headline: statusHighlights.location.value,
    note: statusHighlights.location.note,
  });
  const [isRequesting, setIsRequesting] = useState(false);

  const handleLocationUpdate = async () => {
    if (!navigator.geolocation) {
      setLocationStatus((prev) => ({
        ...prev,
        headline: 'Location access is not supported on this device.',
        note: 'Try typing it manually in the admin panel later.',
      }));
      return;
    }

    setIsRequesting(true);
    setLocationStatus((prev) => ({
      ...prev,
      note: 'Hold on, grabbing my coordinates for you…',
    }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocationStatus({
          label: statusHighlights.location.label,
          headline: `I’m here right now: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          note: 'Share this to get a map pin if you need it. I’ll update again soon.',
        });
        setIsRequesting(false);
      },
      (error) => {
        let message = 'Could not fetch location. Please allow access and try again.';
        if (error.code === error.PERMISSION_DENIED) {
          message = 'I need permission to show where I am. Please allow location access above.';
        }
        setLocationStatus((prev) => ({
          ...prev,
          note: message,
        }));
        setIsRequesting(false);
      }
    );
  };

  return (
    <section className="status-panel" aria-labelledby="status-heading">
      <motion.div
        className="status-card"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.35 }}
      >
        <div className="status-card__header">
          <h2 id="status-heading">This moment in my day</h2>
          <p>Quick placeholders to keep you updated before I automate it for real.</p>
        </div>
        <div className="status-card__grid">
          <article>
            <h3>{locationStatus.label}</h3>
            <p className="status-card__headline">{locationStatus.headline}</p>
            <p className="status-card__note">{locationStatus.note}</p>
            <button
              type="button"
              className="status-card__button"
              onClick={handleLocationUpdate}
              disabled={isRequesting}
            >
              {isRequesting ? 'Updating…' : 'Update location'}
            </button>
          </article>
          <article>
            <h3>{statusHighlights.listening.label}</h3>
            <p className="status-card__headline">{statusHighlights.listening.value}</p>
            <p className="status-card__note">{statusHighlights.listening.note}</p>
          </article>
        </div>
      </motion.div>
    </section>
  );
}

export default StatusPanel;

