import { useId } from 'react';
import { useAudio } from '../context/AudioContext.jsx';

function AudioPlayer() {
  const audioId = useId();
  const { isPlaying, toggle } = useAudio();

  return (
    <section className="audio-player" aria-labelledby={`${audioId}-label`}>
      <div className="audio-player__card">
        <div className="audio-player__copy">
          <p id={`${audioId}-label`} className="audio-player__label">
            Our birthday soundtrack
          </p>
          <p className="audio-player__track">Love for You – Our Forever Mix</p>
          <p className="audio-player__note">
            Playing across all pages • Your music never stops
          </p>
        </div>
        <button
          className="audio-player__toggle"
          onClick={toggle}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
      </div>
    </section>
  );
}

export default AudioPlayer;

