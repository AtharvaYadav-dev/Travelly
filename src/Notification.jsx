import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Notification Banner
 * @param {string} type - 'success' | 'error' | 'info'
 * @param {string} message - The message to display
 * @param {function} onClose - Optional close handler
 */
const iconMap = {
  success: (
    <motion.span
      className="text-2xl"
      initial={{ scale: 0.8 }}
      animate={{ scale: [1.1, 1, 1.1], rotate: [0, 8, -8, 0] }}
      transition={{ repeat: Infinity, duration: 1.2, repeatType: 'loop' }}
    >✅</motion.span>
  ),
  error: (
    <motion.span
      className="text-2xl"
      initial={{ scale: 0.8 }}
      animate={{ scale: [1.1, 1, 1.1], rotate: [0, 8, -8, 0] }}
      transition={{ repeat: Infinity, duration: 1.2, repeatType: 'loop' }}
    >❌</motion.span>
  ),
  info: (
    <motion.span
      className="text-2xl"
      initial={{ scale: 0.8 }}
      animate={{ scale: [1.1, 1, 1.1], rotate: [0, 8, -8, 0] }}
      transition={{ repeat: Infinity, duration: 1.2, repeatType: 'loop' }}
    >ℹ️</motion.span>
  )
};

const Notification = ({ type = 'info', message, onClose }) => {
  if (!message) return null;
  let bg = 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-dark-glass dark:text-blue-200 dark:border-blue-500';
  if (type === 'success') bg = 'bg-green-100 text-green-800 border-green-300 dark:bg-dark-glass dark:text-green-300 dark:border-green-500';
  if (type === 'error') bg = 'bg-red-100 text-red-800 border-red-300 dark:bg-dark-glass dark:text-red-300 dark:border-red-500';

  // Auto-dismiss after 3.5s if onClose provided
  useEffect(() => {
    if (!onClose) return;
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        key={message}
        initial={{ opacity: 0, y: -30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -30, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 340, damping: 24 }}
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 border px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[260px] max-w-[90vw] transition-all duration-300 transform ${bg}`}
        role="alert"
        style={{
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        {/* Animated Icon */}
        {iconMap[type]}
        <span className="font-medium text-base break-words flex-1">{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-2 text-2xl font-bold text-gray-400 hover:text-red-500 transition-colors rounded-full w-8 h-8 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-400"
            aria-label="Close notification"
          >
            &times;
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Notification;
