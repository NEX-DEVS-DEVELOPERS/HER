import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import {
  HeartSVG,
  RomanticDateSVG,
  RomanticIconSet,
  SparkleSVG,
  RomanticBorder,
  RomanticCameraSVG,
  RomanticMusicNoteSVG,
  RomanticGiftSVG,
  RingSVG
} from '../components/RomanticSVGs';
import { LocationIcon } from '../components/Icons';
import LoadingSpinner from '../components/LoadingSpinner';
import SkeletonLoader from '../components/SkeletonLoader';
import ModalShell from '../components/ModalShell.jsx';

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    event_type: 'movie_night'
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/calendar-events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/v1/calendar-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newEvent,
          event_date: new Date(newEvent.event_date).toISOString()
        })
      });
      
      if (response.ok) {
        const addedEvent = await response.json();
        setEvents([...events, addedEvent]);
        setNewEvent({ title: '', description: '', event_date: '', location: '', event_type: 'movie_night' });
        setShowEventForm(false);
      }
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const getEventsForDate = (date) => {
    return events.filter(event => 
      isSameDay(new Date(event.event_date), date)
    );
  };

  const renderCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return calendarDays.map(day => {
      const dayEvents = getEventsForDate(day);
      const isSelected = isSameDay(day, selectedDate);
      const isToday = isSameDay(day, new Date());

      return (
        <div
          key={day.toString()}
          className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
          onClick={() => setSelectedDate(day)}
        >
          <div className="day-number">{format(day, 'd')}</div>
          <div className="day-events">
            {dayEvents.slice(0, 3).map((event, index) => (
              <div 
                key={index} 
                className={`event-indicator event-type--${event.event_type}`}
                title={event.title}
              />
            ))}
            {dayEvents.length > 3 && (
              <div className="more-events">+{dayEvents.length - 3}</div>
            )}
          </div>
        </div>
      );
    });
  };

  const getEventTypeColor = (type) => {
    const colors = {
      movie_night: '#ff69b4',
      series_night: '#87ceeb',
      concert: '#ffd700',
      birthday: '#ff6b6b',
      anniversary: '#ff1493',
      meeting: '#98fb98',
      other: '#dda0dd'
    };
    return colors[type] || colors.other;
  };

  const selectedDateEvents = getEventsForDate(selectedDate);

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <h1 className="romantic-header">
          <RomanticDateSVG size={28} color="#ff1493" className="inline mr-2" />
          Our Love Calendar
          <HeartSVG size={24} color="#ff69b4" className="inline ml-2" />
        </h1>
        <div className="calendar-navigation">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
            <HeartSVG size={16} color="#ff69b4" className="inline mr-1" />
            Previous
          </button>
          <h2>
            <SparkleSVG size={20} color="#ffd700" className="inline mr-1" />
            {format(currentMonth, 'MMMM yyyy')}
            <SparkleSVG size={20} color="#ffd700" className="inline ml-1" />
          </h2>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
            Next
            <HeartSVG size={16} color="#ff69b4" className="inline ml-1" />
          </button>
        </div>
        <button
          onClick={() => setShowEventForm(true)}
          className="add-event-btn romantic-btn"
        >
          <HeartSVG size={16} color="#ff69b4" className="inline mr-1" />
          Add Special Date
          <SparkleSVG size={16} color="#ffd700" className="inline ml-1" />
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="large" text="Loading events..." />
        </div>
      ) : (
        <div className="calendar-container">
        <div className="calendar-grid romantic-card">
          <div className="calendar-weekdays">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
              <div key={day} className="weekday">
                {index === 0 && <HeartSVG size={12} color="#ff69b4" className="inline mr-1" />}
                {day}
                {index === 6 && <HeartSVG size={12} color="#ff69b4" className="inline ml-1" />}
              </div>
            ))}
          </div>
          <div className="calendar-days">
            {renderCalendarDays()}
          </div>
        </div>

        <div className="calendar-sidebar">
          <div className="selected-date-info romantic-card">
            <h3>
              <RomanticDateSVG size={20} color="#ff1493" className="inline mr-2" />
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h3>
            {selectedDateEvents.length > 0 ? (
              <div className="events-list">
                {selectedDateEvents.map(event => (
                  <div key={event.id} className="event-card">
                    <div 
                      className="event-type-indicator"
                      style={{ backgroundColor: getEventTypeColor(event.event_type) }}
                    />
                    <div className="event-content">
                      <h4>{event.title}</h4>
                      <p className="event-time">
                        {format(new Date(event.event_date), 'h:mm a')}
                      </p>
                      {event.location && (
                        <p className="event-location">
                          <LocationIcon size={14} color="#e74c3c" className="inline mr-1" />
                          {event.location}
                        </p>
                      )}
                      {event.description && (
                        <p className="event-description">{event.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-events">No events scheduled for this day</p>
            )}
          </div>

          <div className="event-types-legend romantic-card">
            <h4>
              <HeartSVG size={16} color="#ff69b4" className="inline mr-1" />
              Event Types
            </h4>
            <div className="legend-items">
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#ff69b4' }} />
                <span>Movie Night <RomanticCameraSVG size={14} color="#ff69b4" className="inline ml-1" /></span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#87ceeb' }} />
                <span>Series Night <RomanticMusicNoteSVG size={14} color="#87ceeb" className="inline ml-1" /></span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#ffd700' }} />
                <span>Concert <RomanticMusicNoteSVG size={14} color="#ffd700" className="inline ml-1" /></span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#ff6b6b' }} />
                <span>Birthday <RomanticGiftSVG size={14} color="#ff6b6b" className="inline ml-1" /></span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#ff1493' }} />
                <span>Anniversary <RingSVG size={14} color="#ff1493" className="inline ml-1" /></span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#98fb98' }} />
                <span>Virtual Meeting <HeartSVG size={14} color="#98fb98" className="inline ml-1" /></span>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}

      <ModalShell
        isOpen={showEventForm}
        onClose={() => setShowEventForm(false)}
        title="Add Special Event"
        size="sm"
      >
        <form className="calendar-modal-form" onSubmit={handleAddEvent}>
          <div className="task-modal__field">
            <label>Event Title</label>
            <input
              type="text"
              value={newEvent.title}
              onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
              required
            />
          </div>

          <div className="task-modal__field">
            <label>Date & Time</label>
            <input
              type="datetime-local"
              value={newEvent.event_date}
              onChange={(e) => setNewEvent({...newEvent, event_date: e.target.value})}
              required
            />
          </div>

          <div className="task-modal__field">
            <label>Event Type</label>
            <select
              value={newEvent.event_type}
              onChange={(e) => setNewEvent({...newEvent, event_type: e.target.value})}
            >
              <option value="movie_night">Movie Night</option>
              <option value="series_night">Series Night</option>
              <option value="concert">Concert</option>
              <option value="birthday">Birthday</option>
              <option value="anniversary">Anniversary</option>
              <option value="meeting">Virtual Meeting</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="task-modal__field">
            <label>Location</label>
            <input
              type="text"
              value={newEvent.location}
              onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
              placeholder="e.g., Home, Cinema, Restaurant"
            />
          </div>

          <div className="task-modal__field">
            <label>Description</label>
            <textarea
              value={newEvent.description}
              onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
              placeholder="Add any additional details..."
            />
          </div>

          <div className="modal-shell__footer">
            <button type="button" className="task-button" onClick={() => setShowEventForm(false)}>
              Cancel
            </button>
            <button type="submit" className="task-button task-button--primary">
              <HeartSVG size={16} color="#fff" className="inline mr-1" />
              Add Event
            </button>
          </div>
        </form>
      </ModalShell>
    </div>
  );
}