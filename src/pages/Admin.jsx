import { useState, useEffect } from 'react';
import {
  HeartSVG,
  RingSVG,
  SparkleSVG,
  RomanticIconSet,
  RomanticBorder,
  RomanticCameraSVG,
  RomanticMusicNoteSVG,
  RomanticGiftSVG
} from '../components/RomanticSVGs';
import { useNavigate } from 'react-router-dom';
import ModalShell from '../components/ModalShell.jsx';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [movies, setMovies] = useState([]);
  const [tvSeries, setTvSeries] = useState([]);
  const [songs, setSongs] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if already authenticated on mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('adminToken', data.token);
        setIsAuthenticated(true);
        fetchData();
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [moviesRes, tvRes, songsRes, eventsRes] = await Promise.all([
        fetch('/api/v1/movies', { headers }),
        fetch('/api/v1/tv-series', { headers }),
        fetch('/api/v1/songs', { headers }),
        fetch('/api/v1/calendar-events', { headers })
      ]);
      
      if (moviesRes.ok) setMovies(await moviesRes.json());
      if (tvRes.ok) setTvSeries(await tvRes.json());
      if (songsRes.ok) setSongs(await songsRes.json());
      if (eventsRes.ok) setCalendarEvents(await eventsRes.json());
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    navigate('/admin');
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="admin-login__card">
          <h1>Admin Login</h1>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard romantic-dashboard">
      <header className="admin-header romantic-header">
        <h1>
          <HeartSVG size={24} color="#ff69b4" className="inline mr-2" />
          Admin Dashboard
          <SparkleSVG size={24} color="#ffd700" className="inline ml-2" />
        </h1>
        <button onClick={handleLogout} className="logout-btn romantic-btn">
          <RingSVG size={16} color="#ff69b4" className="inline mr-1" />
          Logout
        </button>
      </header>
      
      <nav className="admin-tabs romantic-tabs">
        <button
          className={activeTab === 'dashboard' ? 'active romantic-active' : 'romantic-tab'}
          onClick={() => setActiveTab('dashboard')}
        >
          <SparkleSVG size={16} color="#ffd700" className="inline mr-1" />
          Dashboard
        </button>
        <button
          className={activeTab === 'movies' ? 'active romantic-active' : 'romantic-tab'}
          onClick={() => setActiveTab('movies')}
        >
          <RomanticCameraSVG size={16} color="#ff69b4" className="inline mr-1" />
          Movies
        </button>
        <button
          className={activeTab === 'series' ? 'active romantic-active' : 'romantic-tab'}
          onClick={() => setActiveTab('series')}
        >
          <RomanticMusicNoteSVG size={16} color="#87ceeb" className="inline mr-1" />
          TV Series
        </button>
        <button
          className={activeTab === 'music' ? 'active romantic-active' : 'romantic-tab'}
          onClick={() => setActiveTab('music')}
        >
          <RomanticMusicNoteSVG size={16} color="#ff69b4" className="inline mr-1" />
          Music
        </button>
        <button
          className={activeTab === 'calendar' ? 'active romantic-active' : 'romantic-tab'}
          onClick={() => setActiveTab('calendar')}
        >
          <HeartSVG size={16} color="#ff69b4" className="inline mr-1" />
          Calendar Events
        </button>
      </nav>

      <main className="admin-content">
        {activeTab === 'dashboard' && (
          <div className="dashboard-overview romantic-dashboard">
            <div className="stats-grid romantic-stats">
              <div className="stat-card romantic-stat-card">
                <h3>
                  <RomanticCameraSVG size={20} color="#ff69b4" className="inline mr-2" />
                  Movies
                </h3>
                <p className="stat-number">{movies.length}</p>
              </div>
              <div className="stat-card romantic-stat-card">
                <h3>
                  <RomanticMusicNoteSVG size={20} color="#87ceeb" className="inline mr-2" />
                  TV Series
                </h3>
                <p className="stat-number">{tvSeries.length}</p>
              </div>
              <div className="stat-card romantic-stat-card">
                <h3>
                  <RomanticMusicNoteSVG size={20} color="#ff69b4" className="inline mr-2" />
                  Songs
                </h3>
                <p className="stat-number">{songs.length}</p>
              </div>
              <div className="stat-card romantic-stat-card">
                <h3>
                  <HeartSVG size={20} color="#ff69b4" className="inline mr-2" />
                  Events
                </h3>
                <p className="stat-number">{calendarEvents.length}</p>
              </div>
            </div>
            
            <div className="recent-activity romantic-activity">
              <h2>
                <SparkleSVG size={20} color="#ffd700" className="inline mr-2" />
                Recent Activity
                <SparkleSVG size={20} color="#ffd700" className="inline ml-2" />
              </h2>
              <div className="activity-list romantic-activity-list">
                <div className="activity-item romantic-activity-item">
                  <span className="activity-time">2 hours ago</span>
                  <span className="activity-text">
                    <RomanticCameraSVG size={14} color="#ff69b4" className="inline mr-1" />
                    New movie added
                  </span>
                </div>
                <div className="activity-item romantic-activity-item">
                  <span className="activity-time">5 hours ago</span>
                  <span className="activity-text">
                    <HeartSVG size={14} color="#ff69b4" className="inline mr-1" />
                    Calendar event updated
                  </span>
                </div>
                <div className="activity-item romantic-activity-item">
                  <span className="activity-time">1 day ago</span>
                  <span className="activity-text">
                    <RomanticMusicNoteSVG size={14} color="#ff69b4" className="inline mr-1" />
                    New song added to playlist
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'movies' && (
          <MovieManager movies={movies} setMovies={setMovies} />
        )}

        {activeTab === 'series' && (
          <SeriesManager tvSeries={tvSeries} setTvSeries={setTvSeries} />
        )}

        {activeTab === 'music' && (
          <MusicManager songs={songs} setSongs={setSongs} />
        )}

        {activeTab === 'calendar' && (
          <CalendarManager events={calendarEvents} setEvents={setCalendarEvents} />
        )}
      </main>
    </div>
  );
}

// Movie Manager Component
function MovieManager({ movies, setMovies }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMovie, setNewMovie] = useState({
    title: '',
    description: '',
    director: '',
    release_date: '',
    duration: '',
    rating: ''
  });

  const handleAddMovie = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/v1/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newMovie)
      });
      
      if (response.ok) {
        const addedMovie = await response.json();
        setMovies([...movies, addedMovie]);
        setNewMovie({ title: '', description: '', director: '', release_date: '', duration: '', rating: '' });
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Error adding movie:', error);
    }
  };

  return (
    <div className="content-manager">
      <div className="manager-header">
        <h2>Movies</h2>
        <button onClick={() => setShowAddForm(true)} className="add-btn">
          + Add Movie
        </button>
      </div>

      <ModalShell
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        title="Add New Movie"
      >
        <form onSubmit={handleAddMovie} className="admin-modal-form">
          <div className="task-modal__field">
            <label>Title</label>
            <input
              type="text"
              placeholder="Enter movie title"
              value={newMovie.title}
              onChange={(e) => setNewMovie({...newMovie, title: e.target.value})}
              required
            />
          </div>

          <div className="task-modal__field">
            <label>Director</label>
            <input
              type="text"
              placeholder="Enter director name"
              value={newMovie.director}
              onChange={(e) => setNewMovie({...newMovie, director: e.target.value})}
            />
          </div>

          <div className="task-modal__field">
            <label>Genre</label>
            <select
              value={newMovie.genre || ''}
              onChange={(e) => setNewMovie({...newMovie, genre: e.target.value})}
            >
              <option value="">Select Genre</option>
              <option value="Romance">Romance</option>
              <option value="Comedy">Comedy</option>
              <option value="Drama">Drama</option>
              <option value="Action">Action</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Horror">Horror</option>
              <option value="Animation">Animation</option>
            </select>
          </div>

          <div className="admin-modal-form__row">
            <div className="task-modal__field">
              <label>Release Date</label>
              <input
                type="date"
                value={newMovie.release_date}
                onChange={(e) => setNewMovie({...newMovie, release_date: e.target.value})}
              />
            </div>

            <div className="task-modal__field">
              <label>Duration (minutes)</label>
              <input
                type="number"
                placeholder="Enter duration"
                value={newMovie.duration}
                onChange={(e) => setNewMovie({...newMovie, duration: e.target.value})}
                min="1"
              />
            </div>

            <div className="task-modal__field">
              <label>Rating (0-10)</label>
              <input
                type="number"
                step="0.1"
                placeholder="Enter rating"
                value={newMovie.rating}
                onChange={(e) => setNewMovie({...newMovie, rating: e.target.value})}
                min="0"
                max="10"
              />
            </div>
          </div>

          <div className="task-modal__field">
            <label>Description</label>
            <textarea
              placeholder="Add a brief description..."
              value={newMovie.description}
              onChange={(e) => setNewMovie({...newMovie, description: e.target.value})}
              rows="3"
            />
          </div>

          <div className="modal-shell__footer">
            <button type="button" className="task-button" onClick={() => setShowAddForm(false)}>
              Cancel
            </button>
            <button type="submit" className="task-button task-button--primary">
              Add Movie
            </button>
          </div>
        </form>
      </ModalShell>

      <div className="items-grid romantic-grid">
        {movies.map(movie => (
          <div key={movie.id} className="item-card romantic-card">
            <div className="card-header">
              <h3>
                <RomanticCameraSVG size={16} color="#ff69b4" className="inline mr-2" />
                {movie.title}
              </h3>
              <div className="card-actions">
                <button className="edit-btn">
                  <SparkleSVG size={14} color="#ffd700" />
                </button>
                <button className="delete-btn">
                  <HeartSVG size={14} color="#ff6b6b" />
                </button>
              </div>
            </div>
            <div className="card-content">
              {movie.director && <p><strong>Director:</strong> {movie.director}</p>}
              {movie.genre && (
                <p>
                  <strong>Genre:</strong> {movie.genre}
                  {movie.genre === 'Romance' && <HeartSVG size={14} color="#ff69b4" className="inline ml-1" />}
                  {movie.genre === 'Comedy' && <SparkleSVG size={14} color="#ffd700" className="inline ml-1" />}
                  {movie.genre === 'Drama' && <RingSVG size={14} color="#ffd700" className="inline ml-1" />}
                </p>
              )}
              {movie.release_date && <p><strong>Release:</strong> {new Date(movie.release_date).getFullYear()}</p>}
              {movie.duration && <p><strong>Duration:</strong> {movie.duration} min</p>}
              {movie.rating && <p><strong>Rating:</strong> {movie.rating}/10</p>}
              {movie.description && <p className="description">{movie.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Series Manager Component
function SeriesManager({ tvSeries, setTvSeries }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSeries, setNewSeries] = useState({
    title: '',
    description: '',
    genre: '',
    total_seasons: '',
    episodes_per_season: '',
    status: 'ongoing',
    rating: ''
  });

  const handleAddSeries = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/v1/tv-series', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newSeries)
      });
      
      if (response.ok) {
        const addedSeries = await response.json();
        setTvSeries([...tvSeries, addedSeries]);
        setNewSeries({ title: '', description: '', genre: '', total_seasons: '', episodes_per_season: '', status: 'ongoing', rating: '' });
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Error adding series:', error);
    }
  };

  return (
    <div className="content-manager">
      <div className="manager-header">
        <h2>
          <RomanticMusicNoteSVG size={20} color="#87ceeb" className="inline mr-2" />
          TV Series
          <SparkleSVG size={20} color="#ffd700" className="inline ml-2" />
        </h2>
        <button onClick={() => setShowAddForm(true)} className="add-btn romantic-btn">
          <RomanticMusicNoteSVG size={16} color="#ff69b4" className="inline mr-1" />
          + Add Series
        </button>
      </div>

      <ModalShell
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        title="Add New TV Series"
      >
        <form onSubmit={handleAddSeries} className="admin-modal-form">
          <div className="task-modal__field">
            <label>Title</label>
            <input
              type="text"
              placeholder="Enter series title"
              value={newSeries.title}
              onChange={(e) => setNewSeries({...newSeries, title: e.target.value})}
              required
            />
          </div>

          <div className="task-modal__field">
            <label>Genre</label>
            <select
              value={newSeries.genre}
              onChange={(e) => setNewSeries({...newSeries, genre: e.target.value})}
              required
            >
              <option value="">Select Genre</option>
              <option value="Drama">Drama</option>
              <option value="Comedy">Comedy</option>
              <option value="Romance">Romance</option>
              <option value="Thriller">Thriller</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Documentary">Documentary</option>
            </select>
          </div>

          <div className="admin-modal-form__row">
            <div className="task-modal__field">
              <label>Total Seasons</label>
              <input
                type="number"
                placeholder="Enter total seasons"
                value={newSeries.total_seasons}
                onChange={(e) => setNewSeries({...newSeries, total_seasons: e.target.value})}
                min="1"
                required
              />
            </div>

            <div className="task-modal__field">
              <label>Episodes per Season</label>
              <input
                type="number"
                placeholder="Enter episodes per season"
                value={newSeries.episodes_per_season}
                onChange={(e) => setNewSeries({...newSeries, episodes_per_season: e.target.value})}
                min="1"
              />
            </div>

            <div className="task-modal__field">
              <label>Status</label>
              <select
                value={newSeries.status}
                onChange={(e) => setNewSeries({...newSeries, status: e.target.value})}
                required
              >
                <option value="">Select Status</option>
                <option value="planning">Planning</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="hiatus">On Hiatus</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="task-modal__field">
            <label>Rating (0-10)</label>
            <input
              type="number"
              step="0.1"
              placeholder="Enter rating"
              value={newSeries.rating}
              onChange={(e) => setNewSeries({...newSeries, rating: e.target.value})}
              min="0"
              max="10"
            />
          </div>

          <div className="task-modal__field">
            <label>Description</label>
            <textarea
              placeholder="Add a brief description..."
              value={newSeries.description}
              onChange={(e) => setNewSeries({...newSeries, description: e.target.value})}
              rows="3"
            />
          </div>

          <div className="modal-shell__footer">
            <button type="button" className="task-button" onClick={() => setShowAddForm(false)}>
              Cancel
            </button>
            <button type="submit" className="task-button task-button--primary">
              Add Series
            </button>
          </div>
        </form>
      </ModalShell>

      <div className="items-grid romantic-grid">
        {tvSeries.map(series => (
          <div key={series.id} className="item-card romantic-card">
            <div className="card-header">
              <h3>
                <RomanticMusicNoteSVG size={16} color="#87ceeb" className="inline mr-2" />
                {series.title}
              </h3>
              <div className="card-actions">
                <button className="edit-btn">
                  <SparkleSVG size={14} color="#ffd700" />
                </button>
                <button className="delete-btn">
                  <HeartSVG size={14} color="#ff6b6b" />
                </button>
              </div>
            </div>
            <div className="card-content">
              {series.genre && (
                <p>
                  <strong>Genre:</strong> {series.genre}
                  {series.genre === 'Romance' && <HeartSVG size={14} color="#ff69b4" className="inline ml-1" />}
                  {series.genre === 'Comedy' && <SparkleSVG size={14} color="#ffd700" className="inline ml-1" />}
                  {series.genre === 'Drama' && <RingSVG size={14} color="#ffd700" className="inline ml-1" />}
                </p>
              )}
              {series.total_seasons && <p><strong>Seasons:</strong> {series.total_seasons}</p>}
              {series.episodes_per_season && <p><strong>Episodes/Season:</strong> {series.episodes_per_season}</p>}
              {series.status && (
                <p>
                  <strong>Status:</strong> {series.status}
                  {series.status === 'ongoing' && <SparkleSVG size={14} color="#ffd700" className="inline ml-1" />}
                  {series.status === 'completed' && <RingSVG size={14} color="#6bcf7f" className="inline ml-1" />}
                  {series.status === 'planning' && <HeartSVG size={14} color="#ff69b4" className="inline ml-1" />}
                </p>
              )}
              {series.rating && <p><strong>Rating:</strong> {series.rating}/10</p>}
              {series.description && <p className="description">{series.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Music Manager Component
function MusicManager({ songs, setSongs }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSong, setNewSong] = useState({
    title: '',
    artist: '',
    album: '',
    duration: '',
    genre: '',
    release_date: '',
    special_for: ''
  });

  const handleAddSong = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/v1/songs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newSong)
      });
      
      if (response.ok) {
        const addedSong = await response.json();
        setSongs([...songs, addedSong]);
        setNewSong({ title: '', artist: '', album: '', duration: '', genre: '', release_date: '', special_for: '' });
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Error adding song:', error);
    }
  };

  return (
    <div className="content-manager">
      <div className="manager-header">
        <h2>
          <RomanticMusicNoteSVG size={20} color="#ff69b4" className="inline mr-2" />
          Love Songs
          <SparkleSVG size={20} color="#ffd700" className="inline ml-2" />
        </h2>
        <button onClick={() => setShowAddForm(true)} className="add-btn romantic-btn">
          <RomanticMusicNoteSVG size={16} color="#ff69b4" className="inline mr-1" />
          + Add Song
        </button>
      </div>

      <ModalShell
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        title="Add Love Song"
      >
        <form onSubmit={handleAddSong} className="admin-modal-form">
          <div className="task-modal__field">
            <label>Title</label>
            <input
              type="text"
              placeholder="Enter song title"
              value={newSong.title}
              onChange={(e) => setNewSong({...newSong, title: e.target.value})}
              required
            />
          </div>

          <div className="task-modal__field">
            <label>Artist</label>
            <input
              type="text"
              placeholder="Enter artist name"
              value={newSong.artist}
              onChange={(e) => setNewSong({...newSong, artist: e.target.value})}
              required
            />
          </div>

          <div className="task-modal__field">
            <label>Album</label>
            <input
              type="text"
              placeholder="Enter album name"
              value={newSong.album}
              onChange={(e) => setNewSong({...newSong, album: e.target.value})}
            />
          </div>

          <div className="admin-modal-form__row">
            <div className="task-modal__field">
              <label>Duration</label>
              <input
                type="text"
                placeholder="e.g., 3:45"
                value={newSong.duration}
                onChange={(e) => setNewSong({...newSong, duration: e.target.value})}
              />
            </div>

            <div className="task-modal__field">
              <label>Genre</label>
              <select
                value={newSong.genre || ''}
                onChange={(e) => setNewSong({...newSong, genre: e.target.value})}
              >
                <option value="">Select Genre</option>
                <option value="Pop">Pop</option>
                <option value="Rock">Rock</option>
                <option value="R&B">R&B</option>
                <option value="Jazz">Jazz</option>
                <option value="Classical">Classical</option>
                <option value="Electronic">Electronic</option>
              </select>
            </div>

            <div className="task-modal__field">
              <label>Release Date</label>
              <input
                type="date"
                value={newSong.release_date || ''}
                onChange={(e) => setNewSong({...newSong, release_date: e.target.value})}
              />
            </div>
          </div>

          <div className="task-modal__field">
            <label>Special For</label>
            <textarea
              value={newSong.special_for || ''}
              onChange={(e) => setNewSong({...newSong, special_for: e.target.value})}
              placeholder="Who is this song special for?"
              rows="2"
            />
          </div>

          <div className="modal-shell__footer">
            <button type="button" className="task-button" onClick={() => setShowAddForm(false)}>
              Cancel
            </button>
            <button type="submit" className="task-button task-button--primary">
              Add Song
            </button>
          </div>
        </form>
      </ModalShell>

      <div className="items-grid romantic-grid">
        {songs.map(song => (
          <div key={song.id} className="item-card romantic-card">
            <div className="card-header">
              <h3>
                <RomanticMusicNoteSVG size={16} color="#ff69b4" className="inline mr-2" />
                {song.title}
              </h3>
              <div className="card-actions">
                <button className="edit-btn">
                  <SparkleSVG size={14} color="#ffd700" />
                </button>
                <button className="delete-btn">
                  <HeartSVG size={14} color="#ff6b6b" />
                </button>
              </div>
            </div>
            <div className="card-content">
              {song.artist && <p><strong>Artist:</strong> {song.artist}</p>}
              {song.album && <p><strong>Album:</strong> {song.album}</p>}
              {song.duration && <p><strong>Duration:</strong> {song.duration}</p>}
              {song.genre && (
                <p>
                  <strong>Genre:</strong> {song.genre}
                  {song.genre === 'Pop' && <HeartSVG size={14} color="#ff69b4" className="inline ml-1" />}
                  {song.genre === 'Rock' && <RomanticCameraSVG size={14} color="#ff6b6b" className="inline ml-1" />}
                  {song.genre === 'R&B' && <SparkleSVG size={14} color="#87ceeb" className="inline ml-1" />}
                </p>
              )}
              {song.release_date && <p><strong>Released:</strong> {new Date(song.release_date).getFullYear()}</p>}
              {song.special_for && <p className="special-for"><strong>Special For:</strong> {song.special_for}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Calendar Manager Component
function CalendarManager({ events, setEvents }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    event_date: '',
    event_type: 'date_night',
    location: '',
    time: '',
    special_notes: ''
  });

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/v1/calendar-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newEvent)
      });
      
      if (response.ok) {
        const addedEvent = await response.json();
        setEvents([...events, addedEvent]);
        setNewEvent({ title: '', description: '', event_date: '', event_type: 'date_night', location: '', time: '', special_notes: '' });
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  return (
    <div className="content-manager">
      <div className="manager-header">
        <h2>
          <HeartSVG size={20} color="#ff69b4" className="inline mr-2" />
          Romantic Events
          <SparkleSVG size={20} color="#ffd700" className="inline ml-2" />
        </h2>
        <button onClick={() => setShowAddForm(true)} className="add-btn romantic-btn">
          <HeartSVG size={16} color="#ff69b4" className="inline mr-1" />
          + Add Event
        </button>
      </div>

      <ModalShell
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        title="Add Romantic Event"
      >
        <form onSubmit={handleAddEvent} className="admin-modal-form">
          <div className="task-modal__field">
            <label>Event Title</label>
            <input
              type="text"
              placeholder="Enter event title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
              required
            />
          </div>

          <div className="task-modal__field">
            <label>Event Type</label>
            <select
              value={newEvent.event_type}
              onChange={(e) => setNewEvent({...newEvent, event_type: e.target.value})}
              required
            >
              <option value="">Select Event Type</option>
              <option value="date_night">Date Night</option>
              <option value="anniversary">Anniversary</option>
              <option value="movie_night">Movie Night</option>
              <option value="dinner">Romantic Dinner</option>
              <option value="special_occasion">Special Occasion</option>
              <option value="weekend_getaway">Weekend Getaway</option>
            </select>
          </div>

          <div className="admin-modal-form__row">
            <div className="task-modal__field">
              <label>Date</label>
              <input
                type="date"
                value={newEvent.event_date}
                onChange={(e) => setNewEvent({...newEvent, event_date: e.target.value})}
                required
              />
            </div>

            <div className="task-modal__field">
              <label>Time</label>
              <input
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
              />
            </div>
          </div>

          <div className="task-modal__field">
            <label>Location</label>
            <input
              type="text"
              placeholder="Enter location"
              value={newEvent.location}
              onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
            />
          </div>

          <div className="task-modal__field">
            <label>Description</label>
            <textarea
              placeholder="Add event description..."
              value={newEvent.description}
              onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
              rows="3"
            />
          </div>

          <div className="task-modal__field">
            <label>Special Notes</label>
            <textarea
              placeholder="Any special notes or surprises?"
              value={newEvent.special_notes}
              onChange={(e) => setNewEvent({...newEvent, special_notes: e.target.value})}
              rows="2"
            />
          </div>

          <div className="modal-shell__footer">
            <button type="button" className="task-button" onClick={() => setShowAddForm(false)}>
              Cancel
            </button>
            <button type="submit" className="task-button task-button--primary">
              Add Event
            </button>
          </div>
        </form>
      </ModalShell>

      <div className="items-grid romantic-grid">
        {events.map(event => (
          <div key={event.id} className="item-card romantic-card">
            <div className="card-header">
              <h3>
                <HeartSVG size={16} color="#ff69b4" className="inline mr-2" />
                {event.title}
              </h3>
              <div className="card-actions">
                <button className="edit-btn">
                  <SparkleSVG size={14} color="#ffd700" />
                </button>
                <button className="delete-btn">
                  <HeartSVG size={14} color="#ff6b6b" />
                </button>
              </div>
            </div>
            <div className="card-content">
              {event.event_type && (
                <p>
                  <strong>Type:</strong> {event.event_type.replace('_', ' ')}
                  {event.event_type === 'date_night' && <HeartSVG size={14} color="#ff69b4" className="inline ml-1" />}
                  {event.event_type === 'anniversary' && <RingSVG size={14} color="#ffd700" className="inline ml-1" />}
                  {event.event_type === 'movie_night' && <RomanticCameraSVG size={14} color="#ff6b6b" className="inline ml-1" />}
                  {event.event_type === 'dinner' && <RomanticGiftSVG size={14} color="#ff69b4" className="inline ml-1" />}
                  {event.event_type === 'special_occasion' && <SparkleSVG size={14} color="#ffd700" className="inline ml-1" />}
                  {event.event_type === 'weekend_getaway' && <RomanticMusicNoteSVG size={14} color="#87ceeb" className="inline ml-1" />}
                </p>
              )}
              {event.event_date && <p><strong>Date:</strong> {new Date(event.event_date).toLocaleDateString()}</p>}
              {event.time && <p><strong>Time:</strong> {event.time}</p>}
              {event.location && <p><strong>Location:</strong> {event.location}</p>}
              {event.description && <p className="description">{event.description}</p>}
              {event.special_notes && <p className="special-notes"><strong>Special Notes:</strong> {event.special_notes}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}