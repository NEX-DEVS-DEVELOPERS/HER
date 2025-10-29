import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HeartSVG,
  RomanticMusicNoteSVG,
  SparkleSVG,
  RomanticIconSet,
  RomanticBorder
} from '../components/RomanticSVGs';
import {
  RomanticIcon,
  ChillIcon,
  DanceIcon,
  ClassicalIcon,
  MusicIcon
} from '../components/Icons';
import LoadingSpinner from '../components/LoadingSpinner';
import SkeletonLoader from '../components/SkeletonLoader';
import ModalShell from '../components/ModalShell.jsx';

export default function Music() {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newSong, setNewSong] = useState({
    title: '',
    artist: '',
    album: '',
    duration: '',
    release_date: ''
  });

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/songs');
      if (response.ok) {
        const data = await response.json();
        setSongs(data);
      }
    } catch (error) {
      console.error('Error fetching songs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSong = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/v1/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newSong,
          duration: parseInt(newSong.duration) || 0
        })
      });
      
      if (response.ok) {
        const addedSong = await response.json();
        setSongs([...songs, addedSong]);
        setNewSong({ title: '', artist: '', album: '', duration: '', release_date: '' });
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Error adding song:', error);
    }
  };

  const filteredSongs = songs.filter(song => {
    const matchesSearch = song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         song.album?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Show a subtle notification
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.innerHTML = 'Copied to clipboard!';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
  };

  const playSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const pauseSong = () => {
    setIsPlaying(false);
  };

  const playlists = [
    { id: 'all', name: 'All Songs', icon: <MusicIcon size={16} color="#ff69b4" /> },
    { id: 'favorites', name: 'Our Favorites', icon: <RomanticIcon size={16} color="#ff1493" /> },
    { id: 'romantic', name: 'Romantic Vibes', icon: <RomanticIcon size={16} color="#ff69b4" /> },
    { id: 'chill', name: 'Chill Together', icon: <ChillIcon size={16} color="#87ceeb" /> },
    { id: 'energetic', name: 'Dance Party', icon: <DanceIcon size={16} color="#ffd700" /> }
  ];

  return (
    <div className="modern-music-page">
      <motion.div 
        className="music-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>Our Music Collection</h1>
        <div className="music-controls">
          <div className="search-section">
            <input
              type="text"
              placeholder="Search songs, artists, albums..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="add-song-button"
          >
            Add New Song
          </button>
        </div>
      </motion.div>

      <div className="music-container">
        <aside className="music-sidebar">
          <motion.div 
            className="playlists-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3>Playlists</h3>
            <div className="playlist-list">
              {playlists.map(playlist => (
                <button
                  key={playlist.id}
                  className={`playlist-item ${selectedPlaylist === playlist.id ? 'active' : ''}`}
                  onClick={() => setSelectedPlaylist(playlist.id)}
                >
                  <span className="playlist-icon">
                    {playlist.icon}
                  </span>
                  <span className="playlist-name">{playlist.name}</span>
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="now-playing-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3>Now Playing</h3>
            {currentSong ? (
              <div className="current-track">
                <div className="track-artwork">
                  <div className="artwork-placeholder">
                    <RomanticMusicNoteSVG size={40} color="#ff69b4" />
                  </div>
                </div>
                <div className="track-info">
                  <h4>{currentSong.title}</h4>
                  <p>{currentSong.artist}</p>
                  <p>{currentSong.album}</p>
                </div>
                <div className="track-controls">
                  <button
                    onClick={isPlaying ? pauseSong : () => playSong(currentSong)}
                    className="play-pause-button"
                  >
                    {isPlaying ? 'Pause' : 'Play'}
                  </button>
                </div>
              </div>
            ) : (
              <p className="no-track">No song playing</p>
            )}
          </motion.div>
        </aside>

        <main className="music-main">
          {isLoading ? (
            <SkeletonLoader type="card" count={6} />
          ) : (
            <motion.div 
              className="songs-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {filteredSongs.map((song, index) => (
                <motion.div 
                  key={song.id} 
                  className="song-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="song-artwork">
                    <div className="artwork-placeholder">
                      <RomanticMusicNoteSVG size={30} color="#ff69b4" />
                    </div>
                    <button 
                      className="play-overlay"
                      onClick={() => playSong(song)}
                    >
                      Play
                    </button>
                  </div>
                  <div className="song-info">
                    <h4>{song.title}</h4>
                    <p className="song-artist">{song.artist}</p>
                    <p className="song-album">{song.album}</p>
                    <p className="song-duration">{formatDuration(song.duration)}</p>
                  </div>
                  <div className="song-actions">
                    <button 
                      onClick={() => copyToClipboard(`${song.title} - ${song.artist}`)}
                      className="action-button copy-button"
                      title="Copy song name"
                    >
                      Copy
                    </button>
                    <button 
                      onClick={() => copyToClipboard(`https://open.spotify.com/search/${encodeURIComponent(`${song.title} ${song.artist}`)}`)}
                      className="action-button spotify-button"
                      title="Search on Spotify"
                    >
                      Spotify
                    </button>
                    <button 
                      onClick={() => copyToClipboard(`https://music.youtube.com/search?q=${encodeURIComponent(`${song.title} ${song.artist}`)}`)}
                      className="action-button youtube-button"
                      title="Search on YouTube Music"
                    >
                      YouTube
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {filteredSongs.length === 0 && !isLoading && (
            <motion.div 
              className="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="empty-icon">
                <RomanticMusicNoteSVG size={48} color="#ff69b4" />
              </div>
              <h3>No songs found</h3>
              <p>Try adjusting your search or add some new songs!</p>
            </motion.div>
          )}
        </main>
      </div>

      <ModalShell isOpen={showAddForm} onClose={() => setShowAddForm(false)} title="Add New Song">
        <form onSubmit={handleAddSong} className="modal-song-form">
          <div className="task-modal__field">
            <label>Song Title</label>
            <input
              type="text"
              value={newSong.title}
              onChange={(e) => setNewSong({...newSong, title: e.target.value})}
              required
            />
          </div>

          <div className="task-modal__field">
            <label>Artist</label>
            <input
              type="text"
              value={newSong.artist}
              onChange={(e) => setNewSong({...newSong, artist: e.target.value})}
              required
            />
          </div>

          <div className="task-modal__field">
            <label>Album</label>
            <input
              type="text"
              value={newSong.album}
              onChange={(e) => setNewSong({...newSong, album: e.target.value})}
            />
          </div>

          <div className="modal-song-form__row">
            <div className="task-modal__field">
              <label>Duration (seconds)</label>
              <input
                type="number"
                value={newSong.duration}
                onChange={(e) => setNewSong({...newSong, duration: e.target.value})}
                placeholder="e.g., 210 for 3:30"
              />
            </div>

            <div className="task-modal__field">
              <label>Release Date</label>
              <input
                type="date"
                value={newSong.release_date}
                onChange={(e) => setNewSong({...newSong, release_date: e.target.value})}
              />
            </div>
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
    </div>
  );
}