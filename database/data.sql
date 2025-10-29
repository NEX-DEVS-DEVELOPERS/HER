-- Insert genres for movies and TV series
INSERT INTO genres (name, description) VALUES
('Action', 'High-energy films with physical stunts, chases, and fights'),
('Comedy', 'Films designed to make the audience laugh and be entertained'),
('Drama', 'Serious presentations with realistic settings and life situations'),
('Horror', 'Films designed to frighten and scare the audience'),
('Sci-Fi', 'Fiction dealing with imaginative concepts like futuristic science'),
('Romance', 'Stories centered on romantic relationships'),
('Thriller', 'Suspenseful stories that stimulate excitement and anticipation'),
('Documentary', 'Non-fictional films intended to document reality'),
('Animation', 'Films created using animation techniques'),
('Fantasy', 'Films with magical and supernatural elements');

-- Insert genres for songs
INSERT INTO genres (name, description) VALUES
('Rock', 'Music characterized by strong rhythms and electric guitars'),
('Pop', 'Popular music with mainstream appeal'),
('Hip-Hop', 'Music genre consisting of stylized rhythmic music'),
('Jazz', 'Music genre originating in African-American communities'),
('Classical', 'Traditional Western art music'),
('Electronic', 'Music produced using electronic devices'),
('Country', 'Music genre originating in the southern United States'),
('R&B', 'Rhythm and blues music genre'),
('Indie', 'Independent music produced outside commercial mainstream'),
('Metal', 'Heavy music with strong guitar riffs and powerful vocals');

-- Insert event types
INSERT INTO genres (name, description) VALUES
('Movie Night', 'Scheduled movie viewing events'),
('Series Night', 'TV series marathon events'),
('Concert', 'Live music performance events'),
('Birthday', 'Birthday celebration events'),
('Anniversary', 'Anniversary celebration events'),
('Meeting', 'Scheduled meetings and appointments'),
('Other', 'Miscellaneous events');

-- Insert admin users (passwords are bcrypt hashes - these are examples)
INSERT INTO users (username, email, password_hash, role, is_active) VALUES
('admin', 'admin@entertainment.com', '$2b$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQ', 'super_admin', true),
('editor', 'editor@entertainment.com', '$2b$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQ', 'admin', true);

-- Insert 10 diverse movies
INSERT INTO movies (title, release_date, duration, director, description, rating, poster_url, status) VALUES
('Inception', '2010-07-16', 148, 'Christopher Nolan', 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.', 8.8, 'https://example.com/inception.jpg', 'active'),
('The Shawshank Redemption', '1994-09-23', 142, 'Frank Darabont', 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', 9.3, 'https://example.com/shawshank.jpg', 'active'),
('Parasite', '2019-05-30', 132, 'Bong Joon Ho', 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.', 8.6, 'https://example.com/parasite.jpg', 'active'),
('The Dark Knight', '2008-07-18', 152, 'Christopher Nolan', 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.', 9.0, 'https://example.com/darkknight.jpg', 'active'),
('Pulp Fiction', '1994-10-14', 154, 'Quentin Tarantino', 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.', 8.9, 'https://example.com/pulpfiction.jpg', 'active'),
('Forrest Gump', '1994-07-06', 142, 'Robert Zemeckis', 'The presidencies of Kennedy and Johnson, the Vietnam War, and the Watergate scandal unfold from the perspective of an Alabama man.', 8.8, 'https://example.com/forrestgump.jpg', 'active'),
('The Matrix', '1999-03-31', 136, 'Lana Wachowski, Lilly Wachowski', 'A computer programmer discovers that reality as he knows it is a simulation created by machines.', 8.7, 'https://example.com/matrix.jpg', 'active'),
('Interstellar', '2014-11-07', 169, 'Christopher Nolan', 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity''s survival.', 8.6, 'https://example.com/interstellar.jpg', 'active'),
('Spirited Away', '2001-07-20', 125, 'Hayao Miyazaki', 'During her family''s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits.', 8.6, 'https://example.com/spirited.jpg', 'active'),
('The Grand Budapest Hotel', '2014-03-28', 99, 'Wes Anderson', 'A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy.', 8.1, 'https://example.com/budapest.jpg', 'active');

-- Link movies to genres
INSERT INTO movie_genres (movie_id, genre_id) VALUES
-- Inception
((SELECT id FROM movies WHERE title = 'Inception'), (SELECT id FROM genres WHERE name = 'Sci-Fi')),
((SELECT id FROM movies WHERE title = 'Inception'), (SELECT id FROM genres WHERE name = 'Thriller')),
-- The Shawshank Redemption
((SELECT id FROM movies WHERE title = 'The Shawshank Redemption'), (SELECT id FROM genres WHERE name = 'Drama')),
-- Parasite
((SELECT id FROM movies WHERE title = 'Parasite'), (SELECT id FROM genres WHERE name = 'Thriller')),
((SELECT id FROM movies WHERE title = 'Parasite'), (SELECT id FROM genres WHERE name = 'Drama')),
-- The Dark Knight
((SELECT id FROM movies WHERE title = 'The Dark Knight'), (SELECT id FROM genres WHERE name = 'Action')),
((SELECT id FROM movies WHERE title = 'The Dark Knight'), (SELECT id FROM genres WHERE name = 'Thriller')),
-- Pulp Fiction
((SELECT id FROM movies WHERE title = 'Pulp Fiction'), (SELECT id FROM genres WHERE name = 'Drama')),
((SELECT id FROM movies WHERE title = 'Pulp Fiction'), (SELECT id FROM genres WHERE name = 'Thriller')),
-- Forrest Gump
((SELECT id FROM movies WHERE title = 'Forrest Gump'), (SELECT id FROM genres WHERE name = 'Drama')),
((SELECT id FROM movies WHERE title = 'Forrest Gump'), (SELECT id FROM genres WHERE name = 'Romance')),
-- The Matrix
((SELECT id FROM movies WHERE title = 'The Matrix'), (SELECT id FROM genres WHERE name = 'Sci-Fi')),
((SELECT id FROM movies WHERE title = 'The Matrix'), (SELECT id FROM genres WHERE name = 'Action')),
-- Interstellar
((SELECT id FROM movies WHERE title = 'Interstellar'), (SELECT id FROM genres WHERE name = 'Sci-Fi')),
((SELECT id FROM movies WHERE title = 'Interstellar'), (SELECT id FROM genres WHERE name = 'Drama')),
-- Spirited Away
((SELECT id FROM movies WHERE title = 'Spirited Away'), (SELECT id FROM genres WHERE name = 'Animation')),
((SELECT id FROM movies WHERE title = 'Spirited Away'), (SELECT id FROM genres WHERE name = 'Fantasy')),
-- The Grand Budapest Hotel
((SELECT id FROM movies WHERE title = 'The Grand Budapest Hotel'), (SELECT id FROM genres WHERE name = 'Comedy')),
((SELECT id FROM movies WHERE title = 'The Grand Budapest Hotel'), (SELECT id FROM genres WHERE name = 'Drama'));

-- Insert 5 TV series
INSERT INTO tv_series (title, total_seasons, total_episodes, first_air_date, last_air_date, description, rating, poster_url, status) VALUES
('Breaking Bad', 5, 62, '2008-01-20', '2013-09-29', 'A high school chemistry teacher turned methamphetamine cook partners with a former student to secure his family''s future.', 9.5, 'https://example.com/breakingbad.jpg', 'ended'),
('Stranger Things', 4, 42, '2016-07-15', NULL, 'When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces.', 8.7, 'https://example.com/strangerthings.jpg', 'active'),
('The Crown', 6, 60, '2016-11-04', NULL, 'Follows the political rivalries and romance of Queen Elizabeth II''s reign and the events that shaped the second half of the 20th century.', 8.6, 'https://example.com/crown.jpg', 'active'),
('The Mandalorian', 3, 24, '2019-11-12', NULL, 'The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic.', 8.7, 'https://example.com/mandalorian.jpg', 'active'),
('Friends', 10, 236, '1994-09-22', '2004-05-06', 'Follows the personal and professional lives of six twenty to thirty-something-year-old friends living in Manhattan.', 8.9, 'https://example.com/friends.jpg', 'ended');

-- Link TV series to genres
INSERT INTO tv_series_genres (series_id, genre_id) VALUES
-- Breaking Bad
((SELECT id FROM tv_series WHERE title = 'Breaking Bad'), (SELECT id FROM genres WHERE name = 'Drama')),
((SELECT id FROM tv_series WHERE title = 'Breaking Bad'), (SELECT id FROM genres WHERE name = 'Thriller')),
-- Stranger Things
((SELECT id FROM tv_series WHERE title = 'Stranger Things'), (SELECT id FROM genres WHERE name = 'Drama')),
((SELECT id FROM tv_series WHERE title = 'Stranger Things'), (SELECT id FROM genres WHERE name = 'Horror')),
((SELECT id FROM tv_series WHERE title = 'Stranger Things'), (SELECT id FROM genres WHERE name = 'Sci-Fi')),
-- The Crown
((SELECT id FROM tv_series WHERE title = 'The Crown'), (SELECT id FROM genres WHERE name = 'Drama')),
((SELECT id FROM tv_series WHERE title = 'The Crown'), (SELECT id FROM genres WHERE name = 'Documentary')),
-- The Mandalorian
((SELECT id FROM tv_series WHERE title = 'The Mandalorian'), (SELECT id FROM genres WHERE name = 'Sci-Fi')),
((SELECT id FROM tv_series WHERE title = 'The Mandalorian'), (SELECT id FROM genres WHERE name = 'Action')),
-- Friends
((SELECT id FROM tv_series WHERE title = 'Friends'), (SELECT id FROM genres WHERE name = 'Comedy')),
((SELECT id FROM tv_series WHERE title = 'Friends'), (SELECT id FROM genres WHERE name = 'Romance'));

-- Insert sample seasons for Breaking Bad
INSERT INTO seasons (series_id, season_number, title, episode_count, release_date, description) VALUES
((SELECT id FROM tv_series WHERE title = 'Breaking Bad'), 1, 'Season 1', 7, '2008-01-20', 'Walter White begins his transformation from chemistry teacher to methamphetamine cook.'),
((SELECT id FROM tv_series WHERE title = 'Breaking Bad'), 2, 'Season 2', 13, '2009-03-08', 'Walter and Jesse''s operation expands as they face new challenges and threats.'),
((SELECT id FROM tv_series WHERE title = 'Breaking Bad'), 3, 'Season 3', 13, '2010-03-21', 'The consequences of their actions come back to haunt Walter and Jesse.');

-- Insert sample episodes for Breaking Bad Season 1
INSERT INTO episodes (season_id, episode_number, title, duration, air_date, description) VALUES
((SELECT id FROM seasons WHERE series_id = (SELECT id FROM tv_series WHERE title = 'Breaking Bad') AND season_number = 1), 1, 'Pilot', 58, '2008-01-20', 'Diagnosed with terminal lung cancer, chemistry teacher Walter White teams up with former student Jesse Pinkman to cook and sell crystal meth.'),
((SELECT id FROM seasons WHERE series_id = (SELECT id FROM tv_series WHERE title = 'Breaking Bad') AND season_number = 1), 2, 'Cat''s in the Bag...', 48, '2008-01-27', 'Walter and Jesse attempt to dispose of the evidence from their first cook, but complications arise.'),
((SELECT id FROM seasons WHERE series_id = (SELECT id FROM tv_series WHERE title = 'Breaking Bad') AND season_number = 1), 3, '...And the Bag''s in the River', 48, '2008-02-10', 'Walter struggles with the moral implications of his actions while Jesse deals with the aftermath of their first cook.');

-- Insert sample seasons for Stranger Things
INSERT INTO seasons (series_id, season_number, title, episode_count, release_date, description) VALUES
((SELECT id FROM tv_series WHERE title = 'Stranger Things'), 1, 'Season 1', 8, '2016-07-15', 'When a young boy disappears, his mother, a police chief, and his friends must confront terrifying supernatural forces.'),
((SELECT id FROM tv_series WHERE title = 'Stranger Things'), 2, 'Season 2', 9, '2017-10-27', 'The kids face new threats as a mysterious new girl arrives in Hawkins with psychic powers.');

-- Insert 15 diverse songs
INSERT INTO songs (title, artist, album, duration, release_date, lyrics, cover_art_url, audio_url, status) VALUES
('Bohemian Rhapsody', 'Queen', 'A Night at the Opera', 354, '1975-10-31', 'Is this the real life? Is this just fantasy? Caught in a landslide, no escape from reality...', 'https://example.com/bohemian.jpg', 'https://example.com/bohemian.mp3', 'active'),
('Imagine', 'John Lennon', 'Imagine', 183, '1971-10-11', 'Imagine there''s no heaven, it''s easy if you try. No hell below us, above us, only sky...', 'https://example.com/imagine.jpg', 'https://example.com/imagine.mp3', 'active'),
('Hotel California', 'Eagles', 'Hotel California', 391, '1976-12-08', 'Welcome to the Hotel California. Such a lovely place. Such a lovely face...', 'https://example.com/hotel.jpg', 'https://example.com/hotel.mp3', 'active'),
('Stairway to Heaven', 'Led Zeppelin', 'Led Zeppelin IV', 482, '1971-11-08', 'There''s a lady who''s sure all that glitters is gold, and she''s buying a stairway to heaven...', 'https://example.com/stairway.jpg', 'https://example.com/stairway.mp3', 'active'),
('Sweet Child O'' Mine', 'Guns N'' Roses', 'Appetite for Destruction', 356, '1988-08-18', 'She''s got a smile that it seems to me, reminds me of childhood memories...', 'https://example.com/sweetchild.jpg', 'https://example.com/sweetchild.mp3', 'active'),
('Smells Like Teen Spirit', 'Nirvana', 'Nevermind', 302, '1991-09-10', 'Load up on guns, bring your friends. It''s fun to lose and to pretend...', 'https://example.com/teen.jpg', 'https://example.com/teen.mp3', 'active'),
('Billie Jean', 'Michael Jackson', 'Thriller', 294, '1983-01-02', 'She was more like a beauty queen from a movie scene. I said don''t mind, but what do you mean, I am the one...', 'https://example.com/billie.jpg', 'https://example.com/billie.mp3', 'active'),
('Like a Rolling Stone', 'Bob Dylan', 'Highway 61 Revisited', 370, '1965-07-20', 'Once upon a time you dressed so fine, threw the bums a dime in your prime, didn''t you?', 'https://example.com/rolling.jpg', 'https://example.com/rolling.mp3', 'active'),
('Purple Rain', 'Prince', 'Purple Rain', 476, '1984-06-25', 'I never meant to cause you any sorrow. I never meant to cause you any pain...', 'https://example.com/purple.jpg', 'https://example.com/purple.mp3', 'active'),
('Good Vibrations', 'The Beach Boys', 'Smiley Smile', 221, '1966-10-10', 'I, I love the colorful clothes she wears, and the way the sunlight plays upon her hair...', 'https://example.com/vibrations.jpg', 'https://example.com/vibrations.mp3', 'active'),
('Hey Jude', 'The Beatles', 'Hey Jude', 431, '1968-08-26', 'Hey Jude, don''t make it bad. Take a sad song and make it better...', 'https://example.com/jude.jpg', 'https://example.com/jude.mp3', 'active'),
('Respect', 'Aretha Franklin', 'I Never Loved a Man the Way I Love You', 144, '1967-04-29', 'What you want, baby I got it. What you need, do you know I got it?', 'https://example.com/respect.jpg', 'https://example.com/respect.mp3', 'active'),
('What''s Going On', 'Marvin Gaye', 'What''s Going On', 221, '1971-01-20', 'Mother, mother, there''s too many of you crying. Brother, brother, brother, there''s far too many of you dying...', 'https://example.com/whats.jpg', 'https://example.com/whats.mp3', 'active'),
('Born to Run', 'Bruce Springsteen', 'Born to Run', 270, '1975-08-25', 'In the day we sweat it out on the streets of a runaway American dream...', 'https://example.com/born.jpg', 'https://example.com/born.mp3', 'active'),
('London Calling', 'The Clash', 'London Calling', 201, '1979-12-14', 'London calling to the faraway towns. Now war is declared and battle come down...', 'https://example.com/london.jpg', 'https://example.com/london.mp3', 'active');

-- Link songs to genres
INSERT INTO song_genres (song_id, genre_id) VALUES
-- Bohemian Rhapsody
((SELECT id FROM songs WHERE title = 'Bohemian Rhapsody'), (SELECT id FROM genres WHERE name = 'Rock')),
-- Imagine
((SELECT id FROM songs WHERE title = 'Imagine'), (SELECT id FROM genres WHERE name = 'Rock')),
-- Hotel California
((SELECT id FROM songs WHERE title = 'Hotel California'), (SELECT id FROM genres WHERE name = 'Rock')),
-- Stairway to Heaven
((SELECT id FROM songs WHERE title = 'Stairway to Heaven'), (SELECT id FROM genres WHERE name = 'Rock')),
-- Sweet Child O' Mine
((SELECT id FROM songs WHERE title = 'Sweet Child O'' Mine'), (SELECT id FROM genres WHERE name = 'Rock')),
((SELECT id FROM songs WHERE title = 'Sweet Child O'' Mine'), (SELECT id FROM genres WHERE name = 'Metal')),
-- Smells Like Teen Spirit
((SELECT id FROM songs WHERE title = 'Smells Like Teen Spirit'), (SELECT id FROM genres WHERE name = 'Rock')),
((SELECT id FROM songs WHERE title = 'Smells Like Teen Spirit'), (SELECT id FROM genres WHERE name = 'Alternative')),
-- Billie Jean
((SELECT id FROM songs WHERE title = 'Billie Jean'), (SELECT id FROM genres WHERE name = 'Pop')),
((SELECT id FROM songs WHERE title = 'Billie Jean'), (SELECT id FROM genres WHERE name = 'R&B')),
-- Like a Rolling Stone
((SELECT id FROM songs WHERE title = 'Like a Rolling Stone'), (SELECT id FROM genres WHERE name = 'Rock')),
-- Purple Rain
((SELECT id FROM songs WHERE title = 'Purple Rain'), (SELECT id FROM genres WHERE name = 'Pop')),
((SELECT id FROM songs WHERE title = 'Purple Rain'), (SELECT id FROM genres WHERE name = 'Rock')),
-- Good Vibrations
((SELECT id FROM songs WHERE title = 'Good Vibrations'), (SELECT id FROM genres WHERE name = 'Pop')),
-- Hey Jude
((SELECT id FROM songs WHERE title = 'Hey Jude'), (SELECT id FROM genres WHERE name = 'Pop')),
-- Respect
((SELECT id FROM songs WHERE title = 'Respect'), (SELECT id FROM genres WHERE name = 'R&B')),
-- What's Going On
((SELECT id FROM songs WHERE title = 'What''s Going On'), (SELECT id FROM genres WHERE name = 'R&B')),
-- Born to Run
((SELECT id FROM songs WHERE title = 'Born to Run'), (SELECT id FROM genres WHERE name = 'Rock')),
-- London Calling
((SELECT id FROM songs WHERE title = 'London Calling'), (SELECT id FROM genres WHERE name = 'Rock'));

-- Insert 8 calendar events scheduled over the next six months
INSERT INTO calendar_events (title, description, event_date, location, event_type, status) VALUES
('Movie Night: Inception', 'Join us for a mind-bending evening with Christopher Nolan''s masterpiece. Discussion to follow!', '2025-11-15 19:00:00+00', 'Home Theater', 'Movie Night', 'scheduled'),
('Series Marathon: Breaking Bad Season 1', 'Binge-watch the first season of Breaking Bad. Popcorn and drinks provided!', '2025-11-22 18:00:00+00', 'Living Room', 'Series Night', 'scheduled'),
('Birthday Celebration', 'Special birthday celebration with friends and family. Cake and gifts!', '2025-12-05 19:30:00+00', 'Community Center', 'Birthday', 'scheduled'),
('Concert: Local Jazz Band', 'Enjoy an evening of smooth jazz with local musicians. Tickets required.', '2025-12-12 20:00:00+00', 'Blue Note Jazz Club', 'Concert', 'scheduled'),
('Anniversary Dinner', 'Romantic dinner celebration for our special anniversary. Reservation confirmed.', '2025-12-20 19:00:00+00', 'Fancy Restaurant', 'Anniversary', 'scheduled'),
('New Year''s Movie Marathon', 'Ring in the new year with back-to-back movies. Starting with comedies!', '2025-12-31 21:00:00+00', 'Home Theater', 'Movie Night', 'scheduled'),
('Winter Series Premiere Party', 'Watch the premiere of new winter series together. Hot chocolate and snacks!', '2026-01-10 18:30:00+00', 'Living Room', 'Series Night', 'scheduled'),
('Valentine''s Day Special Movie', 'Romantic movie night for Valentine''s Day. Special dinner and movie combo!', '2026-02-14 19:00:00+00', 'Home Theater', 'Movie Night', 'scheduled');