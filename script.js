'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = Array.from(document.querySelectorAll('[data-animate]'));
  const backToTopButton = document.querySelector('.promise__cta');
  const sections = Array.from(document.querySelectorAll('main.birthday-page > section'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = Number(el.dataset.delay || 0);
        setTimeout(() => {
          el.classList.add('is-visible');
        }, delay);
        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.3
  });

  animatedElements.forEach((el) => observer.observe(el));

  initHeroParticles();
  const scrollLock = initScrollLock(sections);

  if (backToTopButton && scrollLock) {
    backToTopButton.addEventListener('click', () => {
      scrollLock.goToIndex(0);
    });
  }
});

function initScrollLock(sections) {
  if (sections.length === 0) return null;

  let currentIndex = 0;
  let isAnimating = false;
  const TRANSITION_MS = 780;

  document.body.classList.add('scroll-lock');
  sections.forEach((section) => {
    section.setAttribute('tabindex', '-1');
  });
  updateSectionTransforms();

  window.addEventListener('wheel', (event) => {
    const activeSection = sections[currentIndex];

    const canScrollDown = activeSection.scrollTop + activeSection.clientHeight < activeSection.scrollHeight - 1;
    const canScrollUp = activeSection.scrollTop > 0;

    if ((event.deltaY > 0 && canScrollDown) || (event.deltaY < 0 && canScrollUp)) {
      return;
    }

    if (isAnimating) {
      event.preventDefault();
      return;
    }

    if (event.deltaY > 0 && currentIndex < sections.length - 1) {
      event.preventDefault();
      goToIndex(currentIndex + 1);
    } else if (event.deltaY < 0 && currentIndex > 0) {
      event.preventDefault();
      goToIndex(currentIndex - 1);
    }
  }, { passive: false });

  window.addEventListener('keydown', (event) => {
    if (isAnimating) return;

    if (event.key === 'ArrowDown' || event.key === 'PageDown') {
      if (currentIndex < sections.length - 1) {
        event.preventDefault();
        goToIndex(currentIndex + 1);
      }
    } else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
      if (currentIndex > 0) {
        event.preventDefault();
        goToIndex(currentIndex - 1);
      }
    }
  });

  function goToIndex(targetIndex) {
    if (targetIndex === currentIndex || targetIndex < 0 || targetIndex >= sections.length) return;
    currentIndex = targetIndex;
    animateToIndex();
  }

  function animateToIndex() {
    isAnimating = true;
    window.requestAnimationFrame(updateSectionTransforms);
    setTimeout(() => {
      isAnimating = false;
      sections[currentIndex].focus({ preventScroll: true });
    }, TRANSITION_MS + 40);
  }

  function updateSectionTransforms() {
    sections.forEach((section, index) => {
      const offset = 100 * (index - currentIndex);
      section.style.transform = `translate3d(0, ${offset}%, 0)`;
      section.style.pointerEvents = index === currentIndex ? 'auto' : 'none';
      section.style.visibility = Math.abs(offset) <= 150 ? 'visible' : 'hidden';
    });
  }

  return {
    goToIndex
  };
}

function initHeroParticles() {
  const canvas = document.querySelector('.hero__particles');
  if (!canvas) return;

  const context = canvas.getContext('2d');
  const particles = createParticles(36);

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function resizeCanvas() {
    const dpi = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpi;
    canvas.height = canvas.offsetHeight * dpi;
    context.setTransform(dpi, 0, 0, dpi, 0, 0);
  }

  function createParticles(count) {
    const colors = ['rgba(255, 214, 224, 0.38)', 'rgba(194, 242, 237, 0.35)', 'rgba(216, 204, 255, 0.32)'];
    return Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      radius: 12 + Math.random() * 18,
      speed: 0.0008 + Math.random() * 0.0014,
      direction: Math.random() * Math.PI * 2,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
  }

  function render(time) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    particles.forEach((particle) => {
      const driftX = Math.cos(particle.direction + time * particle.speed) * 18;
      const driftY = Math.sin(particle.direction + time * particle.speed) * 18;

      const px = (particle.x * width + driftX);
      const py = (particle.y * height + driftY);

      context.beginPath();
      context.fillStyle = particle.color;
      context.globalAlpha = 0.85;
      context.ellipse(px, py, particle.radius, particle.radius * 0.72, particle.direction, 0, Math.PI * 2);
      context.fill();
      context.globalAlpha = 1;
    });

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}
