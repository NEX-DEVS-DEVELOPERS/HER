import { useCallback, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'shared-clipboard-tasks';

const DEFAULT_TASKS = {
  movies: [],
  series: [],
  songs: [],
  shows: []
};

const createId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `task-${Math.random().toString(36).slice(2)}-${Date.now()}`;
};

function useSharedTasks() {
  const [tasks, setTasks] = useState(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_TASKS, ...parsed };
      }
    } catch (error) {
      console.warn('Unable to load clipboard tasks from storage', error);
    }
    return DEFAULT_TASKS;
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = useCallback((category, task) => {
    setTasks((prev) => ({
      ...prev,
      [category]: [
        {
          id: createId(),
          title: task.title.trim(),
          note: task.note?.trim() || '',
          link: task.link?.trim() || '',
          createdAt: new Date().toISOString(),
          completed: false
        },
        ...prev[category]
      ]
    }));
  }, []);

  const toggleTask = useCallback((category, id) => {
    setTasks((prev) => ({
      ...prev,
      [category]: prev[category].map((task) =>
        task.id === id ? { ...task, completed: !task.completed, completedAt: !task.completed ? new Date().toISOString() : null } : task
      )
    }));
  }, []);

  const deleteTask = useCallback((category, id) => {
    setTasks((prev) => ({
      ...prev,
      [category]: prev[category].filter((task) => task.id !== id)
    }));
  }, []);

  const importFromCalendar = useCallback((category, calendarEvent) => {
    setTasks((prev) => {
      const alreadyExists = prev[category].some((task) => task.sourceId === calendarEvent.id);
      if (alreadyExists) return prev;

      return {
        ...prev,
        [category]: [
          {
            id: createId(),
            sourceId: calendarEvent.id,
            title: calendarEvent.title,
            note: calendarEvent.details || '',
            createdAt: new Date().toISOString(),
            link: '',
            completed: false
          },
          ...prev[category]
        ]
      };
    });
  }, []);

  const sharedStats = useMemo(() => {
    const categories = Object.keys(tasks);
    const total = categories.reduce((sum, key) => sum + tasks[key].length, 0);
    const completed = categories.reduce((sum, key) => sum + tasks[key].filter((task) => task.completed).length, 0);
    return { total, completed };
  }, [tasks]);

  return {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    importFromCalendar,
    sharedStats
  };
}

export default useSharedTasks;

