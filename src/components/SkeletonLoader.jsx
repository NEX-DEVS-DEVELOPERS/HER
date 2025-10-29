import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader = ({ 
  type = 'card', 
  count = 1, 
  className = '' 
}) => {
  const skeletonVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const shimmerVariants = {
    initial: { x: '-100%' },
    animate: { 
      x: '100%',
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear'
      }
    }
  };

  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <motion.div
            className={`bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10 ${className}`}
            variants={skeletonVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="space-y-4">
              <div className="h-4 bg-white/30 rounded-full w-3/4 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                />
              </div>
              <div className="h-3 bg-white/20 rounded-full w-1/2 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                />
              </div>
              <div className="h-3 bg-white/20 rounded-full w-5/6 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                />
              </div>
            </div>
          </motion.div>
        );

      case 'list':
        return (
          <motion.div
            className={`space-y-3 ${className}`}
            variants={skeletonVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center gap-4 p-3 bg-white/10 rounded-xl">
                <div className="w-12 h-12 bg-white/20 rounded-full relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    variants={shimmerVariants}
                    initial="initial"
                    animate="animate"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-white/20 rounded-full w-2/3 relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      variants={shimmerVariants}
                      initial="initial"
                      animate="animate"
                    />
                  </div>
                  <div className="h-3 bg-white/15 rounded-full w-1/2 relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      variants={shimmerVariants}
                      initial="initial"
                      animate="animate"
                    />
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        );

      case 'text':
        return (
          <motion.div
            className={`space-y-2 ${className}`}
            variants={skeletonVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="h-4 bg-white/20 rounded-full w-full relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
              />
            </div>
            <div className="h-4 bg-white/20 rounded-full w-5/6 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
              />
            </div>
            <div className="h-4 bg-white/20 rounded-full w-4/6 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
              />
            </div>
          </motion.div>
        );

      case 'avatar':
        return (
          <motion.div
            className={`w-16 h-16 bg-white/20 rounded-full relative overflow-hidden ${className}`}
            variants={skeletonVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
            />
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, index) => (
        <div key={index}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;