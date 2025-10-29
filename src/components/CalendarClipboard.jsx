import { useMemo } from 'react';
import { motion } from 'framer-motion';

import { useCalendar } from '../hooks/useCalendar.js';

const monthNames = new Intl.DateTimeFormat('en-US', { month: 'long' });

function groupEventsByMonth(events) {
  return events.reduce((acc, event) => {
    const date = new Date(event.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    if (!acc[key]) {
      acc[key] = {
        label: `${monthNames.format(date)} ${date.getFullYear()}`,
        items: [],
      };
    }
    acc[key].items.push({
      ...event,
      dateObject: date,
    });
    return acc;
  }, {});
}

function CalendarClipboard() {
  const { events, isLoading, error } = useCalendar();

  const grouped = useMemo(() => {
    const map = groupEventsByMonth(events);
    return Object.entries(map)
      .map(([key, value]) => ({ key, ...value }))
      .sort((a, b) => new Date(a.items[0].date) - new Date(b.items[0].date))
      .map((group) => ({
        ...group,
        items: group.items.sort((a, b) => new Date(a.date) - new Date(b.date)),
      }));
  }, [events]);

  return (
    <motion.section className="clipboard" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
      <div className="clipboard__header">
        <h1>Our shared clipboard</h1>
        <p>
          A living calendar of the moments, movies, and rituals we promised each other. Anything here can move or grow —
          what matters is that we plan it together.
        </p>
      </div>
      {isLoading ? (
        <div className="clipboard__state">Loading our plans…</div>
      ) : error ? (
        <div className="clipboard__state">Couldn&apos;t load our plans right now. Try refreshing.</div>
      ) : (
        <div className="clipboard__months">
        {grouped.map((month) => (
          <article key={month.key} className="clipboard__month">
            <header>
              <h2>{month.label}</h2>
              <span>{month.items.length} plans</span>
            </header>
            <ol>
              {month.items.map((event) => (
                <li key={event.id} className={`clipboard__item clipboard__item--${event.category}`}>
                  <time dateTime={event.date}>{new Intl.DateTimeFormat('en-US', { day: 'numeric', weekday: 'short' }).format(event.dateObject)}</time>
                  <div>
                    <h3>{event.title}</h3>
                    <p>{event.details}</p>
                  </div>
                  <span className="clipboard__category">{event.category}</span>
                </li>
              ))}
            </ol>
          </article>
        ))}
        </div>
      )}
    </motion.section>
  );
}

export default CalendarClipboard;


