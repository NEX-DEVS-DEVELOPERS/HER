# React Frontend Integration

This document provides comprehensive examples for integrating the entertainment content management system API with your existing React application.

## 1. API Client Setup

### Create API Service (src/services/api.js)

```javascript
// src/services/api.js - API service for backend communication
import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
};

// Movies API
export const moviesAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/movies', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/movies/${id}`);
    return response.data;
  },
  
  create: async (movieData) => {
    const response = await api.post('/movies', movieData);
    return response.data;
  },
  
  update: async (id, movieData) => {
    const response = await api.put(`/movies/${id}`, movieData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/movies/${id}`);
    return response.data;
  },
};

// TV Series API
export const tvSeriesAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/tv-series', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/tv-series/${id}`);
    return response.data;
  },
  
  create: async (seriesData) => {
    const response = await api.post('/tv-series', seriesData);
    return response.data;
  },
  
  update: async (id, seriesData) => {
    const response = await api.put(`/tv-series/${id}`, seriesData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/tv-series/${id}`);
    return response.data;
  },
  
  getSeasons: async (seriesId) => {
    const response = await api.get(`/tv-series/${seriesId}/seasons`);
    return response.data;
  },
  
  addSeason: async (seriesId, seasonData) => {
    const response = await api.post(`/tv-series/${seriesId}/seasons`, seasonData);
    return response.data;
  },
};

// Songs API
export const songsAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/songs', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/songs/${id}`);
    return response.data;
  },
  
  create: async (songData) => {
    const response = await api.post('/songs', songData);
    return response.data;
  },
  
  update: async (id, songData) => {
    const response = await api.put(`/songs/${id}`, songData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/songs/${id}`);
    return response.data;
  },
};

// Calendar Events API
export const calendarEventsAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/calendar-events', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/calendar-events/${id}`);
    return response.data;
  },
  
  create: async (eventData) => {
    const response = await api.post('/calendar-events', eventData);
    return response.data;
  },
  
  update: async (id, eventData) => {
    const response = await api.put(`/calendar-events/${id}`, eventData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/calendar-events/${id}`);
    return response.data;
  },
};

// Genres API
export const genresAPI = {
  getAll: async () => {
    const response = await api.get('/genres');
    return response.data;
  },
  
  create: async (genreData) => {
    const response = await api.post('/genres', genreData);
    return response.data;
  },
};

// File Upload API
export const uploadAPI = {
  uploadPoster: async (file) => {
    const formData = new FormData();
    formData.append('poster', file);
    
    const response = await api.post('/upload/poster', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  uploadCoverArt: async (file) => {
    const formData = new FormData();
    formData.append('cover', file);
    
    const response = await api.post('/upload/cover-art', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  uploadAudio: async (file) => {
    const formData = new FormData();
    formData.append('audio', file);
    
    const response = await api.post('/upload/audio', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default api;
```

## 2. Authentication Context

### Create Auth Context (src/context/AuthContext.jsx)

```jsx
// src/context/AuthContext.jsx - Authentication context
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

// Auth state reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const initialState = {
  isAuthenticated: false,
  user: null,
  token: localStorage.getItem('authToken'),
  loading: false,
  error: null,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          token,
          user: JSON.parse(user),
        },
      });
    }
  }, []);

  // Login function
  const login = async (username, password) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await authAPI.login(username, password);
      
      if (response.success) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: response,
        });
        
        return { success: true };
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error.message,
      });
      
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    login,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
```

## 3. Custom Hooks for Data Management

### Movies Hook (src/hooks/useMovies.js)

```javascript
// src/hooks/useMovies.js - Custom hook for movies data
import { useState, useEffect } from 'react';
import { moviesAPI } from '../services/api';

export const useMovies = (initialParams = {}) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchMovies = async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await moviesAPI.getAll({ ...initialParams, ...params });
      
      if (response.success) {
        setMovies(response.data);
        setPagination(response.pagination);
      } else {
        throw new Error(response.error || 'Failed to fetch movies');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createMovie = async (movieData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await moviesAPI.create(movieData);
      
      if (response.success) {
        await fetchMovies(); // Refresh the list
        return { success: true, data: response.data };
      } else {
        throw new Error(response.error || 'Failed to create movie');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateMovie = async (id, movieData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await moviesAPI.update(id, movieData);
      
      if (response.success) {
        await fetchMovies(); // Refresh the list
        return { success: true, data: response.data };
      } else {
        throw new Error(response.error || 'Failed to update movie');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteMovie = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await moviesAPI.delete(id);
      
      if (response.success) {
        await fetchMovies(); // Refresh the list
        return { success: true };
      } else {
        throw new Error(response.error || 'Failed to delete movie');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return {
    movies,
    loading,
    error,
    pagination,
    fetchMovies,
    createMovie,
    updateMovie,
    deleteMovie,
  };
};
```

### Calendar Events Hook (src/hooks/useCalendarEvents.js)

```javascript
// src/hooks/useCalendarEvents.js - Custom hook for calendar events
import { useState, useEffect } from 'react';
import { calendarEventsAPI } from '../services/api';

export const useCalendarEvents = (initialParams = {}) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvents = async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await calendarEventsAPI.getAll({ ...initialParams, ...params });
      
      if (response.success) {
        setEvents(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch events');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await calendarEventsAPI.create(eventData);
      
      if (response.success) {
        await fetchEvents(); // Refresh the list
        return { success: true, data: response.data };
      } else {
        throw new Error(response.error || 'Failed to create event');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (id, eventData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await calendarEventsAPI.update(id, eventData);
      
      if (response.success) {
        await fetchEvents(); // Refresh the list
        return { success: true, data: response.data };
      } else {
        throw new Error(response.error || 'Failed to update event');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await calendarEventsAPI.delete(id);
      
      if (response.success) {
        await fetchEvents(); // Refresh the list
        return { success: true };
      } else {
        throw new Error(response.error || 'Failed to delete event');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };
};
```

## 4. React Components

### Movies Management Component (src/components/admin/MoviesManager.jsx)

```jsx
// src/components/admin/MoviesManager.jsx - Movies management interface
import React, { useState } from 'react';
import { useMovies } from '../../hooks/useMovies';
import { genresAPI } from '../../services/api';

const MoviesManager = () => {
  const { movies, loading, error, pagination, fetchMovies, createMovie, updateMovie, deleteMovie } = useMovies();
  const [genres, setGenres] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    releaseDate: '',
    duration: '',
    director: '',
    description: '',
    rating: '',
    posterUrl: '',
    status: 'active',
    genres: [],
  });

  // Load genres on component mount
  React.useEffect(() => {
    const loadGenres = async () => {
      try {
        const response = await genresAPI.getAll();
        if (response.success) {
          setGenres(response.data);
        }
      } catch (err) {
        console.error('Failed to load genres:', err);
      }
    };
    loadGenres();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = editingMovie 
      ? await updateMovie(editingMovie.id, formData)
      : await createMovie(formData);
    
    if (result.success) {
      resetForm();
    }
  };

  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title,
      releaseDate: movie.releaseDate,
      duration: movie.duration,
      director: movie.director,
      description: movie.description,
      rating: movie.rating,
      posterUrl: movie.posterUrl,
      status: movie.status,
      genres: movie.genres,
    });
    setShowForm(true);
  };

  const handleDelete = async (movieId) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      await deleteMovie(movieId);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      releaseDate: '',
      duration: '',
      director: '',
      description: '',
      rating: '',
      posterUrl: '',
      status: 'active',
      genres: [],
    });
    setEditingMovie(null);
    setShowForm(false);
  };

  if (loading && movies.length === 0) {
    return <div className="loading">Loading movies...</div>;
  }

  return (
    <div className="movies-manager">
      <div className="header">
        <h2>Movies Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Add New Movie
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingMovie ? 'Edit Movie' : 'Add New Movie'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Release Date:</label>
                <input
                  type="date"
                  value={formData.releaseDate}
                  onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Duration (minutes):</label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label>Director:</label>
                <input
                  type="text"
                  value={formData.director}
                  onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Rating (0-10):</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label>Poster URL:</label>
                <input
                  type="url"
                  value={formData.posterUrl}
                  onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Status:</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="coming_soon">Coming Soon</option>
                </select>
              </div>

              <div className="form-group">
                <label>Genres:</label>
                <select
                  multiple
                  value={formData.genres}
                  onChange={(e) => {
                    const selectedGenres = Array.from(e.target.selectedOptions, option => option.value);
                    setFormData({ ...formData, genres: selectedGenres });
                  }}
                >
                  {genres.map((genre) => (
                    <option key={genre.id} value={genre.name}>
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingMovie ? 'Update' : 'Create'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="movies-list">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <div className="movie-poster">
              {movie.posterUrl ? (
                <img src={movie.posterUrl} alt={movie.title} />
              ) : (
                <div className="no-poster">No Poster</div>
              )}
            </div>
            <div className="movie-info">
              <h3>{movie.title}</h3>
              <p><strong>Director:</strong> {movie.director}</p>
              <p><strong>Release Date:</strong> {movie.releaseDate}</p>
              <p><strong>Duration:</strong> {movie.duration} minutes</p>
              <p><strong>Rating:</strong> {movie.rating}/10</p>
              <p><strong>Status:</strong> {movie.status}</p>
              <div className="genres">
                {movie.genres.map((genre, index) => (
                  <span key={index} className="genre-tag">{genre}</span>
                ))}
              </div>
              <div className="actions">
                <button 
                  className="btn btn-edit"
                  onClick={() => handleEdit(movie)}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-delete"
                  onClick={() => handleDelete(movie.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button 
            disabled={pagination.page === 1}
            onClick={() => fetchMovies({ page: pagination.page - 1 })}
          >
            Previous
          </button>
          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button 
            disabled={pagination.page === pagination.totalPages}
            onClick={() => fetchMovies({ page: pagination.page + 1 })}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MoviesManager;
```

### Enhanced Calendar Component (src/components/EnhancedCalendar.jsx)

```jsx
// src/components/EnhancedCalendar.jsx - Enhanced calendar with backend integration
import React, { useState, useEffect } from 'react';
import { useCalendarEvents } from '../hooks/useCalendarEvents';
import { useAuth } from '../context/AuthContext';

const EnhancedCalendar = () => {
  const { events, loading, error, createEvent, updateEvent, deleteEvent } = useCalendarEvents();
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [view, setView] = useState('month'); // month, week, day

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: '',
    location: '',
    eventType: 'Movie Night',
    status: 'scheduled',
  });

  const eventTypes = [
    'Movie Night',
    'Series Night',
    'Concert',
    'Birthday',
    'Anniversary',
    'Meeting',
    'Other',
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    
    return events.filter(event => {
      const eventDate = new Date(event.eventDate);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setFormData({
      ...formData,
      eventDate: date.toISOString().slice(0, 16),
    });
    setShowEventForm(true);
  };

  const handleEventClick = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      eventDate: new Date(event.eventDate).toISOString().slice(0, 16),
      location: event.location,
      eventType: event.eventType,
      status: event.status,
    });
    setShowEventForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = editingEvent 
      ? await updateEvent(editingEvent.id, formData)
      : await createEvent(formData);
    
    if (result.success) {
      resetForm();
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      await deleteEvent(eventId);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      eventDate: '',
      location: '',
      eventType: 'Movie Night',
      status: 'scheduled',
    });
    setEditingEvent(null);
    setShowEventForm(false);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const days = getDaysInMonth(currentDate);

  if (loading) {
    return <div className="loading">Loading calendar...</div>;
  }

  return (
    <div className="enhanced-calendar">
      <div className="calendar-header">
        <div className="navigation">
          <button onClick={() => navigateMonth('prev')}><</button>
          <h2>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button onClick={() => navigateMonth('next')}>></button>
        </div>
        
        <div className="actions">
          <button 
            className="btn btn-primary"
            onClick={() => {
              setSelectedDate(new Date());
              setFormData({
                ...formData,
                eventDate: new Date().toISOString().slice(0, 16),
              });
              setShowEventForm(true);
            }}
          >
            Add Event
          </button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="calendar-grid">
        <div className="day-header">Sun</div>
        <div className="day-header">Mon</div>
        <div className="day-header">Tue</div>
        <div className="day-header">Wed</div>
        <div className="day-header">Thu</div>
        <div className="day-header">Fri</div>
        <div className="day-header">Sat</div>

        {days.map((day, index) => {
          const dayEvents = day ? getEventsForDate(day) : [];
          const isToday = day && day.toDateString() === new Date().toDateString();

          return (
            <div
              key={index}
              className={`calendar-day ${day ? 'active' : 'empty'} ${isToday ? 'today' : ''}`}
              onClick={() => day && handleDateClick(day)}
            >
              {day && (
                <>
                  <div className="day-number">{day.getDate()}</div>
                  <div className="day-events">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className={`event-item ${event.eventType.toLowerCase().replace(' ', '-')}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEventClick(event);
                        }}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="more-events">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {showEventForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingEvent ? 'Edit Event' : 'Add New Event'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Date & Time:</label>
                <input
                  type="datetime-local"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Location:</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Event Type:</label>
                <select
                  value={formData.eventType}
                  onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                >
                  {eventTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Status:</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                  <option value="postponed">Postponed</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingEvent ? 'Update' : 'Create'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                {editingEvent && (
                  <button 
                    type="button" 
                    className="btn btn-danger"
                    onClick={() => handleDeleteEvent(editingEvent.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedCalendar;
```

## 5. Integration with Existing App

### Update App.jsx to include AuthProvider

```jsx
// src/App.jsx - Updated with authentication
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Clipboard from './pages/Clipboard';
import ComfortSpace from './pages/ComfortSpace';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/Dashboard';
import MoviesManager from './components/admin/MoviesManager';
import EnhancedCalendar from './components/EnhancedCalendar';

// Protected route component
const ProtectedRoute = ({ children, requiredRole = 'admin' }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && user?.role !== requiredRole && user?.role !== 'super_admin') {
    return <Navigate to="/" />;
  }
  
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="clipboard" element={<Clipboard />} />
        <Route path="comfort" element={<ComfortSpace />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="calendar" element={<EnhancedCalendar />} />
        
        {/* Admin routes */}
        <Route 
          path="admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="admin/movies" 
          element={
            <ProtectedRoute>
              <MoviesManager />
            </ProtectedRoute>
          } 
        />
      </Route>
      
      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
```

## 6. Environment Configuration

### Create .env file for React

```env
# React app environment variables
REACT_APP_API_URL=http://localhost:3001/api/v1
REACT_APP_APP_NAME=Entertainment CMS
REACT_APP_VERSION=1.0.0
```

## 7. Styling

### Add CSS for admin components (src/styles/admin.css)

```css
/* src/styles/admin.css - Admin interface styles */
.movies-manager {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.movies-manager .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.movies-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.movie-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.movie-poster {
  height: 200px;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.movie-poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-poster {
  color: #666;
  font-style: italic;
}

.movie-info {
  padding: 15px;
}

.movie-info h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.movie-info p {
  margin: 5px 0;
  font-size: 14px;
  color: #666;
}

.genres {
  margin: 10px 0;
}

.genre-tag {
  display: inline-block;
  background: #e0e0e0;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  margin-right: 5px;
  margin-bottom: 5px;
}

.actions {
  margin-top: 15px;
  display: flex;
  gap: 10px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #545b62;
}

.btn-edit {
  background: #28a745;
  color: white;
}

.btn-edit:hover {
  background: #1e7e34;
}

.btn-delete {
  background: #dc3545;
  color: white;
}

.btn-delete:hover {
  background: #c82333;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

.pagination button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error {
  background: #f8d7da;
  color: #721c24;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}

/* Enhanced Calendar Styles */
.enhanced-calendar {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.navigation {
  display: flex;
  align-items: center;
  gap: 15px;
}

.navigation button {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: #ddd;
  border: 1px solid #ddd;
}

.day-header {
  background: #f8f9fa;
  padding: 10px;
  text-align: center;
  font-weight: bold;
  font-size: 14px;
}

.calendar-day {
  background: white;
  min-height: 100px;
  padding: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.calendar-day:hover {
  background: #f8f9fa;
}

.calendar-day.empty {
  background: #f8f9fa;
  cursor: default;
}

.calendar-day.today {
  background: #e3f2fd;
}

.day-number {
  font-weight: bold;
  margin-bottom: 5px;
}

.day-events {
  font-size: 12px;
}

.event-item {
  background: #007bff;
  color: white;
  padding: 2px 4px;
  margin-bottom: 2px;
  border-radius: 2px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.event-item.movie-night {
  background: #28a745;
}

.event-item.series-night {
  background: #ffc107;
  color: #000;
}

.event-item.concert {
  background: #dc3545;
}

.event-item.birthday {
  background: #e83e8c;
}

.event-item.anniversary {
  background: #6f42c1;
}

.more-events {
  color: #666;
  font-style: italic;
}
```

This comprehensive React integration provides everything needed to connect your frontend to the entertainment content management system API, including authentication, data management hooks, and admin interfaces.