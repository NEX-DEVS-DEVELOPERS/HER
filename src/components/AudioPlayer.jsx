import { forwardRef, useId, useImperativeHandle, useRef } from 'react';

const DEFAULT_SRC = '/audio/love-for-you.mp3';

const AudioPlayer = forwardRef(function AudioPlayer(
  {
    trackTitle = 'Love for You – Our Forever Mix',
    note = 'Hit play whenever you want to replay the promise we made in those 10 stages.',
    src = DEFAULT_SRC
  },
  ref
) {
  const audioId = useId();
  const audioRef = useRef(null);
  const resolvedSrc = src || DEFAULT_SRC;

  useImperativeHandle(
    ref,
    () => ({
      play: async () => {
        if (!audioRef.current) return;
        try {
          await audioRef.current.play();
        } catch (error) {
          console.warn('Audio playback could not start automatically.', error);
        }
      },
      pause: () => {
        audioRef.current?.pause?.();
      },
      element: audioRef
    }),
    []
  );

  return (
    <section className="audio-player" aria-labelledby={`${audioId}-label`}>
      <div className="audio-player__card">
        <div className="audio-player__copy">
          <p id={`${audioId}-label`} className="audio-player__label">
            Our birthday soundtrack
          </p>
          <p className="audio-player__track">{trackTitle}</p>
          <p className="audio-player__note">{note}</p>
        </div>
        <audio ref={audioRef} controls preload="auto">
          <source src={resolvedSrc} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    </section>
  );
});

export default AudioPlayer;

