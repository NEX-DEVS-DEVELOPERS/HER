import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const dotVariants = {
    initial: { scale: 0.8, opacity: 0.5 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.3 }
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center gap-4 p-8"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="flex gap-2">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-pink-300 to-pink-500`}
            variants={dotVariants}
            initial="initial"
            animate="animate"
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: index * 0.2,
              repeatType: 'reverse'
            }}
          />
        ))}
      </div>
      {text && (
        <motion.p
          className="text-gray-600 font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {text}
        </motion.p>
      )}
    </motion.div>
  );
};

export default LoadingSpinner;