import { useEffect } from 'react';
import Lenis from 'lenis';

function SmoothScroller() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      lerp: 0.08,
      smoothWheel: true,
      smoothTouch: false,
      syncTouch: true
    });

    let frame;

    window.__lenis = lenis;
    window.__modalCount = window.__modalCount || 0;
    document.documentElement.classList.add('lenis');

    const onRaf = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(onRaf);
    };

    frame = requestAnimationFrame(onRaf);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      if (window.__lenis === lenis) {
        delete window.__lenis;
      }
      lenis.destroy();
      document.documentElement.classList.remove('lenis');
    };
  }, []);

  return null;
}

export default SmoothScroller;

