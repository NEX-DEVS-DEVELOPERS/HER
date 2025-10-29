import { createContext, useContext, useMemo } from 'react';

import useCalendarData from '../hooks/useCalendarData.js';

const CalendarContext = createContext(null);

function CalendarProvider({ children }) {
  const calendar = useCalendarData();

  const value = useMemo(() => calendar, [calendar]);

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;
}

function useCalendar() {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
}

export { CalendarProvider, useCalendar };


