import { useEffect, useRef } from 'react';

function createParticles(count) {
  const colors = ['rgba(255, 214, 224, 0.38)', 'rgba(194, 242, 237, 0.35)', 'rgba(216, 204, 255, 0.32)'];
  return Array.from({ length: count }, () => ({
    x: Math.random(),
    y: Math.random(),
    radius: 12 + Math.random() * 18,
    speed: 0.0008 + Math.random() * 0.0014,
    direction: Math.random() * Math.PI * 2,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));
}

function HeroParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    const particles = createParticles(36);

    const resizeCanvas = () => {
      const dpi = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpi;
      canvas.height = canvas.offsetHeight * dpi;
      context.setTransform(dpi, 0, 0, dpi, 0, 0);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let animationId;
    const render = (time) => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      particles.forEach((particle) => {
        const driftX = Math.cos(particle.direction + time * particle.speed) * 18;
        const driftY = Math.sin(particle.direction + time * particle.speed) * 18;

        const px = particle.x * width + driftX;
        const py = particle.y * height + driftY;

        context.beginPath();
        context.fillStyle = particle.color;
        context.globalAlpha = 0.85;
        context.ellipse(px, py, particle.radius, particle.radius * 0.72, particle.direction, 0, Math.PI * 2);
        context.fill();
        context.globalAlpha = 1;
      });

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero__particles" aria-hidden="true" />;
}

export default HeroParticles;

