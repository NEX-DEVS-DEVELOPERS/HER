import { motion } from 'framer-motion';

import { favoriteThings, playlistDemo, movieNights } from '../data/favorites.js';

function Favorites() {
  return (
    <div className="modern-favorites-page">
      <motion.section
        className="page-hero"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1>Our Favorites Collection</h1>
        <p>
          A curated collection of things we love, playlists we're building, and movies we plan to watch together.
        </p>
      </motion.section>
      
      <motion.section
        className="favorites-section"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="section-header">
          <h2>Things I Love About You</h2>
        </div>
        <div className="favorites-grid">
          {favoriteThings.highlights.map((item, index) => (
            <motion.div
              key={item}
              className="favorite-item"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <p>{item}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
      
      <motion.section
        className="favorites-section"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="section-header">
          <h2>Our Playlists</h2>
        </div>
        <div className="playlists-grid">
          {playlistDemo.map((playlist, index) => (
            <motion.article
              key={playlist.title}
              className="playlist-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="card-header">
                <h3>{playlist.title}</h3>
              </div>
              <div className="card-content">
                <p className="playlist-description">{playlist.description}</p>
                <div className="track-list">
                  <h4>Tracks</h4>
                  <ol>
                    {playlist.tracks.map((track) => (
                      <li key={track}>{track}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.section>
      
      <motion.section
        className="favorites-section"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="section-header">
          <h2>Movie & Series Nights</h2>
        </div>
        <div className="media-grid">
          <motion.div
            className="media-category"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="category-header">
              <h3>Movies</h3>
            </div>
            <div className="media-list">
              {movieNights.movies.map((movie, index) => (
                <motion.div
                  key={movie.title}
                  className="media-item"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <div className="item-content">
                    <h4 className="item-title">{movie.title}</h4>
                    <p className="item-note">{movie.note}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            className="media-category"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="category-header">
              <h3>Series</h3>
            </div>
            <div className="media-list">
              {movieNights.series.map((series, index) => (
                <motion.div
                  key={series.title}
                  className="media-item"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <div className="item-content">
                    <h4 className="item-title">{series.title}</h4>
                    <p className="item-note">{series.note}</p>
                    {series.nextUp && (
                      <div className="item-plan">
                        <span className="plan-label">Next:</span>
                        <span className="plan-value">{series.nextUp}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        <div className="section-note">
          <p>We can update these selections as we discover new favorites together.</p>
        </div>
      </motion.section>
    </div>
  );
}

export default Favorites;
