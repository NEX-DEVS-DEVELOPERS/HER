import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EnhancedRomanticBackground from './EnhancedRomanticBackground.jsx';

const CORRECT_USERNAME = 'Meri Emaan';
const CORRECT_PASSWORD = 'Hussain';

function LoginScreen({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate a brief delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (username === CORRECT_USERNAME && password === CORRECT_PASSWORD) {
      // Store auth token in sessionStorage
      sessionStorage.setItem('auth_token', btoa(`${username}:${password}`));
      sessionStorage.setItem('auth_timestamp', Date.now().toString());
      onLoginSuccess();
    } else {
      setError('Invalid username or password. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <EnhancedRomanticBackground />
      
      <motion.div
        className="login-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <motion.div
          className="login-card"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            className="login-header"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Enter your credentials to continue to our special place</p>
          </motion.div>

          <form className="login-form" onSubmit={handleSubmit}>
            <motion.div
              className="login-field"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label htmlFor="username" className="login-label">
                Username
              </label>
              <input
                id="username"
                type="text"
                className="login-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                autoComplete="username"
                disabled={isLoading}
              />
            </motion.div>

            <motion.div
              className="login-field"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label htmlFor="password" className="login-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                disabled={isLoading}
              />
            </motion.div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  className="login-error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              className="login-button"
              disabled={isLoading}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <span className="login-button-loading">
                  <span className="login-spinner" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          <motion.div
            className="login-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="login-footer-text">Made with love for Eman by Ali Hasnaat</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default LoginScreen;

