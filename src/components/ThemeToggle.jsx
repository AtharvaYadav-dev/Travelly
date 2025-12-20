import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="relative w-16 h-8 rounded-full bg-white/10 border border-white/20 flex items-center px-1 cursor-pointer"
    >
      <motion.div
        animate={{
          x: theme === 'dark' ? 0 : 32
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center"
      >
        {theme === 'dark' ? (
          <Moon className="w-4 h-4 text-white" />
        ) : (
          <Sun className="w-4 h-4 text-white" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
