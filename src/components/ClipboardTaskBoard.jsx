import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORY_DEFINITIONS = [
  {
    id: 'movies',
    label: 'Movie nights',
    helper: 'Keep our theatre picks queued and ready.',
    emoji: '🎬'
  },
  {
    id: 'series',
    label: 'Series queue',
    helper: 'We binge together, episode by episode.',
    emoji: '📺'
  },
  {
    id: 'songs',
    label: 'Songs to share',
    helper: 'Tracks we want each other to hear first.',
    emoji: '🎧'
  },
  {
    id: 'shows',
    label: 'Live shows & dates',
    helper: 'Concerts, stand-up, or anything we book.',
    emoji: '🎟️'
  }
];

const ITEMS_PER_PAGE = 3;

function TaskList({ items, onToggle, onDelete }) {
  if (items.length === 0) {
    return <p className="task-empty">Nothing here yet—leave the first surprise?</p>;
  }

  return (
    <AnimatePresence>
      {items.map((task) => (
        <motion.article
          key={task.id}
          layout
          className={`task-card ${task.completed ? 'is-complete' : ''}`}
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.96 }}
          transition={{ duration: 0.22 }}
        >
          <div className="task-card__body">
            <h4>{task.title}</h4>
            {task.note && <p>{task.note}</p>}
            {task.link && (
              <a className="task-card__link" href={task.link} target="_blank" rel="noreferrer">
                Open link ↗
              </a>
            )}
          </div>
          <div className="task-card__footer">
            <button type="button" className="task-chip" onClick={() => onToggle(task.id)}>
              {task.completed ? 'Mark pending' : 'Mark as done'}
            </button>
            <button type="button" className="task-icon-button" onClick={() => onDelete(task.id)} aria-label="Delete">
              ×
            </button>
          </div>
        </motion.article>
      ))}
    </AnimatePresence>
  );
}

function PaginationControls({ totalPages, currentPage, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="task-pagination" role="navigation" aria-label="Task pagination">
      <button
        type="button"
        className="task-button"
        onClick={() => onPageChange(Math.max(currentPage - 1, 0))}
        disabled={currentPage === 0}
      >
        ←
      </button>
      <span>
        Page {currentPage + 1} of {totalPages}
      </span>
      <button
        type="button"
        className="task-button"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages - 1))}
        disabled={currentPage === totalPages - 1}
      >
        →
      </button>
    </div>
  );
}

function CalendarSuggestions({ events, onImport, categories }) {
  const filtered = useMemo(() => {
    if (!events || events.length === 0) return [];
    return events
      .filter((event) => categories.includes(event.category))
      .slice(0, 6);
  }, [events, categories]);

  if (filtered.length === 0) return null;

  return (
    <div className="calendar-suggestions">
      <h4>Events pulled from our calendar</h4>
      <p>Tap add to drop them into the clipboard lists below.</p>
      <ul>
        {filtered.map((event) => (
          <li key={event.id}>
            <div>
              <span className="calendar-suggestions__emoji">📌</span>
              <div>
                <p className="calendar-suggestions__title">{event.title}</p>
                <p className="calendar-suggestions__meta">
                  {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(event.date))}
                  · {event.category}
                </p>
              </div>
            </div>
            <button type="button" className="task-button" onClick={() => onImport(event.category, event)}>
              Add
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ClipboardTaskBoard({
  tasks,
  toggleTask,
  deleteTask,
  importFromCalendar,
  sharedStats,
  events,
  onAddRequested
}) {
  const categoriesWithData = CATEGORY_DEFINITIONS.map((definition) => ({
    ...definition,
    items: tasks[definition.id] ?? []
  }));

  const [pageMap, setPageMap] = useState(() =>
    Object.fromEntries(CATEGORY_DEFINITIONS.map((category) => [category.id, 0]))
  );

  useEffect(() => {
    setPageMap((prev) => {
      const next = { ...prev };
      categoriesWithData.forEach(({ id, items }) => {
        const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));
        if ((next[id] ?? 0) > totalPages - 1) {
          next[id] = totalPages - 1;
        }
      });
      return next;
    });
  }, [categoriesWithData]);

  return (
    <section className="task-board">
      <header className="task-board__header">
        <h2>Our watchlist & wish-board</h2>
        <p>Tick things off together, and add anything new that one of us should line up next.</p>
        <div className="task-board__stats">
          <span>{sharedStats.completed} complete</span>
          <span>·</span>
          <span>{sharedStats.total - sharedStats.completed} waiting</span>
        </div>
      </header>

      <CalendarSuggestions
        events={events}
        onImport={importFromCalendar}
        categories={CATEGORY_DEFINITIONS.map((category) => category.id)}
      />

      <div className="task-columns">
        {categoriesWithData.map((category) => {
          const currentPage = pageMap[category.id] ?? 0;
          const totalPages = Math.max(1, Math.ceil(category.items.length / ITEMS_PER_PAGE));
          const pagedItems = category.items.slice(
            currentPage * ITEMS_PER_PAGE,
            currentPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE
          );

          return (
            <article key={category.id} className="task-column">
              <div className="task-column__header">
                <h3>
                  <span aria-hidden="true">{category.emoji}</span> {category.label}
                </h3>
                <p>{category.helper}</p>
                <div className="task-column__actions">
                  <button
                    type="button"
                    className="task-button task-button--ghost"
                    onClick={() => onAddRequested(category.id)}
                  >
                    + Add plan
                  </button>
                </div>
              </div>

              <TaskList
                items={pagedItems}
                onToggle={(id) => toggleTask(category.id, id)}
                onDelete={(id) => deleteTask(category.id, id)}
              />

              <PaginationControls
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={(nextPage) =>
                  setPageMap((prev) => ({
                    ...prev,
                    [category.id]: nextPage
                  }))
                }
              />
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default ClipboardTaskBoard;

