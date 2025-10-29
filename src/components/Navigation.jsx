import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/comfort', label: 'Comfort Space' },
    { path: '/favorites', label: 'Favorites' },
    { path: '/clipboard', label: 'Clipboard' },
    { path: '/calendar', label: 'Calendar' },
    { path: '/music', label: 'Music' },
    { path: '/invitations', label: 'Invitations' }
  ];

  return (
    <>
      <nav className={`navigation ${isScrolled ? 'navigation--scrolled' : ''}`}>
        <div className="navigation__container">
          <div className="navigation__brand">
            <span className="navigation__tagline">with love</span>
            <span className="navigation__title">Ali → Eman</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="navigation__desktop">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `navigation__link ${isActive ? 'navigation__link--active' : ''}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="navigation__logout"
              aria-label="Logout"
              title="Logout"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="navigation__mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className="navigation__hamburger"></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="navigation__mobile-menu"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {navItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `navigation__mobile-link ${isActive ? 'navigation__mobile-link--active' : ''}`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;