import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

import { useCalendar } from '../hooks/useCalendar.js';
import useSharedTasks from '../hooks/useSharedTasks.js';
import CalendarClipboard from '../components/CalendarClipboard.jsx';
import ClipboardTaskBoard from '../components/ClipboardTaskBoard.jsx';
import ClipboardTaskModal from '../components/ClipboardTaskModal.jsx';

const highlights = [
  {
    title: 'Story nights 🎬',
    description: 'All the movies and series we promised to binge are logged and ready.'
  },
  {
    title: 'Moments that matter 🗓️',
    description: 'Birthdays, reunions, and rituals stay synced so neither of us forgets.'
  },
  {
    title: 'Actionable plans ✍️',
    description: 'Quick notes on what to prep, who to call, or what to bring along.'
  }
];

function Clipboard() {
  const { events } = useCalendar();
  const taskState = useSharedTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState('movies');

  const openModal = (category = 'movies') => {
    setModalCategory(category);
    setIsModalOpen(true);
  };

  const nextTasks = useMemo(() => {
    const allTasks = Object.values(taskState.tasks).flat();
    return allTasks
      .filter((task) => !task.completed)
      .sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0))
      .slice(0, 3);
  }, [taskState.tasks]);

  return (
    <div className="clipboard-page">
      <motion.section
        className="clipboard-hero glass"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <p className="eyebrow">Shared clipboard</p>
          <h1>Everything we’re planning, captured in one calm space</h1>
          <p className="subtitle">
            I’ll keep this board updated so you always know what’s next—whether it’s a quick check-in, a movie night, or
            the next trip we promised each other.
          </p>
        </div>
        <div className="clipboard-quick-actions">
          <button type="button" className="task-button task-button--primary" onClick={() => openModal()}>
            ➕ New plan
          </button>
          <div className="next-card-group">
            {nextTasks.length === 0 ? (
              <p className="next-card__empty">No pending plans—maybe it’s time to add one?</p>
            ) : (
              nextTasks.map((task) => (
                <article key={task.id} className="next-card">
                  <h3>{task.title}</h3>
                  {task.note && <p>{task.note}</p>}
                  <span className="next-card__meta">Added {new Date(task.createdAt).toLocaleDateString()}</span>
                </article>
              ))
            )}
          </div>
        </div>
      </motion.section>

      <section className="clipboard-highlights">
        {highlights.map((item) => (
          <article key={item.title} className="clipboard-highlights__card">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </section>

      <ClipboardTaskBoard
        events={events}
        tasks={taskState.tasks}
        toggleTask={taskState.toggleTask}
        deleteTask={taskState.deleteTask}
        importFromCalendar={taskState.importFromCalendar}
        sharedStats={taskState.sharedStats}
        onAddRequested={openModal}
      />

      <CalendarClipboard />

      <ClipboardTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultCategory={modalCategory}
        onSubmit={(category, task) => taskState.addTask(category, task)}
      />
    </div>
  );
}

export default Clipboard;

