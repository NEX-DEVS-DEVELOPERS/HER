import React from 'react';

// Heart SVG Component
export const HeartSVG = ({ size = 24, color = '#ff69b4', className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill={color} 
    className={`romantic-svg ${className}`}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 7.78-7.78l-1.06-1.06z" />
  </svg>
);

// Floating Hearts Animation Component
export const FloatingHearts = ({ count = 5 }) => {
  const hearts = Array.from({ length: count }, (_, i) => i);
  
  return (
    <div className="floating-hearts-container">
      {hearts.map((i) => (
        <div
          key={i}
          className="floating-heart"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${6 + Math.random() * 4}s`,
            animationDelay: `${Math.random() * 5}s`,
            fontSize: `${20 + Math.random() * 20}px`,
          }}
        >
          <HeartSVG size={30} color="#ff69b4" />
        </div>
      ))}
    </div>
  );
};

// Infinity Symbol Component
export const InfinitySVG = ({ size = 24, color = '#ff1493', className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    className={`romantic-svg ${className}`}
  >
    <path d="M5.5 12c0-2.21 1.79-4 4-4s4 1.79 4 4c0 2.21-1.79 4-4 4-4-1.79-4-4-4-4zm8 0C0-2.21 1.79-4 4-4s4 1.79 4 4c0 2.21-1.79 4-4 4-4-1.79-4-4-4z" />
  </svg>
);

// Couple Silhouette Component
export const CoupleSVG = ({ size = 24, color = '#5c4166', className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill={color} 
    className={`romantic-svg ${className}`}
  >
    <path d="M8 3c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm8 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-8 8c-2.7 0-5.8 1.29-6 2v1h12v-1c-.2-.71-3.3-2-6-2zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45v1h3v-1c-.2-.71-2.3-2-4-2z" />
  </svg>
);

// Rose Flower Component
export const RoseSVG = ({ size = 24, color = '#ff1493', className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill={color} 
    className={`romantic-svg ${className}`}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
    <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
  </svg>
);

// Love Letter Component
export const LoveLetterSVG = ({ size = 24, color = '#ff69b4', className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill={color} 
    className={`romantic-svg ${className}`}
  >
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

// Wedding Ring Component
export const RingSVG = ({ size = 24, color = '#ffd700', className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    className={`romantic-svg ${className}`}
  >
    <circle cx="12" cy="12" r="8" />
    <path d="M12 2v6m0 4v6m0 4v-6m0-4V2" />
    <circle cx="12" cy="12" r="3" fill={color} />
  </svg>
);

// Sparkle Star Component
export const SparkleSVG = ({ size = 24, color = '#ffd700', className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill={color} 
    className={`romantic-svg sparkle ${className}`}
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 2.18 6.88L12 22l-2.18-6.88L5 14.14l5-4.87L8.91 8.26 12 2z" />
  </svg>
);

// Romantic Border Component
export const RomanticBorder = ({ children, className = '' }) => (
  <div className={`romantic-border ${className}`}>
    <svg 
      className="absolute inset-0 w-full h-full" 
      viewBox="0 0 100 100" 
      preserveAspectRatio="none"
    >
      <path 
        d="M5,5 Q50,15 95,5 Q95,50 85,95 Q50,85 5,95 Q5,50 15,5 Q50,15 5,5" 
        fill="none" 
        stroke="url(#romanticGradient)" 
        strokeWidth="0.5"
      />
      <defs>
        <linearGradient id="romanticGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff69b4" />
          <stop offset="50%" stopColor="#ff1493" />
          <stop offset="100%" stopColor="#ffb6c1" />
        </linearGradient>
      </defs>
    </svg>
    {children}
  </div>
);

// Romantic Icon Set Component
export const RomanticIconSet = ({ className = '' }) => (
  <div className={`romantic-icon-set ${className}`}>
    <div className="romantic-icon-wrapper">
      <HeartSVG size={24} color="#ff69b4" />
    </div>
    <div className="romantic-icon-wrapper">
      <InfinitySVG size={24} color="#ff1493" />
    </div>
    <div className="romantic-icon-wrapper">
      <RoseSVG size={24} color="#ff1493" />
    </div>
    <div className="romantic-icon-wrapper">
      <RingSVG size={24} color="#ffd700" />
    </div>
    <div className="romantic-icon-wrapper">
      <SparkleSVG size={24} color="#ffd700" />
    </div>
  </div>
);

// Heart Trail Component
export const HeartTrail = ({ count = 3, className = '' }) => (
  <div className={`heart-trail ${className}`}>
    {Array.from({ length: count }, (_, i) => (
      <div
        key={i}
        className="heart-trail-item"
        style={{
          '--trail-delay': `${i * 0.2}s`,
          '--trail-size': `${20 - i * 4}px`,
        }}
      >
        <HeartSVG size={20 - i * 4} color="#ff69b4" />
      </div>
    ))}
  </div>
);

// Love Knot Component
export const LoveKnotSVG = ({ size = 24, color = '#ff69b4', className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    className={`romantic-svg ${className}`}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.19 0 2.34-.21 3.41-.6.3-.11.49-.4.49-.72 0-.43-.35-.78-.78-.78-.17 0-.33.06-.46.11-.91.33-1.78.49-2.66.49-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7c0 .88-.16 1.75-.49 2.66-.05.13-.11.29-.11.46 0 .43.35.78.78.78.32 0 .61-.19.72-.49.39-1.07.6-2.22.6-3.41 0-5.52-4.48-10-10-10z" />
    <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
  </svg>
);

// Cupid Arrow Component
export const CupidArrowSVG = ({ size = 24, color = '#ff69b4', className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill={color} 
    className={`romantic-svg ${className}`}
  >
    <path d="M12 2l-2 7h4l-2-7zm0 20l2-7h-4l2 7z" />
    <path d="M7 7h10v2H7V7zm0 8h10v2H7v-2z" />
    <HeartSVG size={8} color="#ff1493" className="absolute top-0 left-0" />
    <HeartSVG size={8} color="#ff1493" className="absolute bottom-0 right-0" />
  </svg>
);

// Romantic Date Component
export const RomanticDateSVG = ({ size = 24, color = '#ff1493', className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill={color} 
    className={`romantic-svg ${className}`}
  >
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
    <HeartSVG size={6} color="#ff69b4" className="absolute top-2 right-2" />
  </svg>
);

// Romantic Music Note Component
export const RomanticMusicNoteSVG = ({ size = 24, color = '#ff69b4', className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill={color} 
    className={`romantic-svg ${className}`}
  >
    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
    <HeartSVG size={4} color="#ff1493" className="absolute top-1 right-1" />
  </svg>
);

// Romantic Camera Component
export const RomanticCameraSVG = ({ size = 24, color = '#ff69b4', className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill={color} 
    className={`romantic-svg ${className}`}
  >
    <path d="M12 15c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z" />
    <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
    <HeartSVG size={4} color="#ff1493" className="absolute top-2 right-2" />
  </svg>
);

// Romantic Gift Component
export const RomanticGiftSVG = ({ size = 24, color = '#ff69b4', className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill={color} 
    className={`romantic-svg ${className}`}
  >
    <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z" />
    <HeartSVG size={4} color="#ff1493" className="absolute top-1 left-1" />
  </svg>
);

export default {
  HeartSVG,
  FloatingHearts,
  InfinitySVG,
  CoupleSVG,
  RoseSVG,
  LoveLetterSVG,
  RingSVG,
  SparkleSVG,
  RomanticBorder,
  RomanticIconSet,
  HeartTrail,
  LoveKnotSVG,
  CupidArrowSVG,
  RomanticDateSVG,
  RomanticMusicNoteSVG,
  RomanticCameraSVG,
  RomanticGiftSVG,
};