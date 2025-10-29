import { useState, useEffect } from 'react';

import ModalShell from './ModalShell.jsx';

const CATEGORY_OPTIONS = [
  { id: 'movies', label: 'Movie night 🎬' },
  { id: 'series', label: 'Series episode 📺' },
  { id: 'songs', label: 'Song to share 🎧' },
  { id: 'shows', label: 'Live show 🎟️' }
];

function ClipboardTaskModal({ isOpen, onClose, onSubmit, defaultCategory = 'movies' }) {
  const [category, setCategory] = useState(defaultCategory);
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCategory(defaultCategory);
      setTitle('');
      setNote('');
      setLink('');
    }
  }, [isOpen, defaultCategory]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title.trim()) return;

    onSubmit(category, {
      title,
      note,
      link
    });
    onClose();
  };

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} title="Add something to our clipboard" size="sm">
      <form className="task-modal__form" onSubmit={handleSubmit}>
        <div className="task-modal__field">
          <label htmlFor="task-category">Category</label>
          <select id="task-category" value={category} onChange={(event) => setCategory(event.target.value)}>
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="task-modal__field">
          <label htmlFor="task-title">Title</label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Movie night with..."
            required
          />
        </div>

        <div className="task-modal__field">
          <label htmlFor="task-note">Notes</label>
          <textarea
            id="task-note"
            rows={3}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Add a vibe, snacks to prep, or why it matters"
          />
        </div>

        <div className="task-modal__field">
          <label htmlFor="task-link">Link (optional)</label>
          <input
            id="task-link"
            type="url"
            value={link}
            onChange={(event) => setLink(event.target.value)}
            placeholder="Streaming link or playlist"
            pattern="https?://.+"
          />
        </div>

        <div className="modal-shell__footer">
          <button type="button" className="task-button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="task-button task-button--primary">
            Save to clipboard
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

export default ClipboardTaskModal;

