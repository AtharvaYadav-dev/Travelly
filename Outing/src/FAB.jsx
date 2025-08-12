import React from "react";
import { motion, AnimatePresence } from "framer-motion";


/**
 * Floating Action Button (FAB) - Scroll to Top, glassmorphic, animated, dark mode.
 * @param {boolean} show - Whether to show the FAB
 * @param {function} onClick - Callback for FAB click
 * @param {string} label - Optional label for tooltip
 */
const FAB = ({ show = true, onClick, label = "Scroll to Top" }) => (
  <AnimatePresence>
    {show && (
      <motion.button
        initial={{ opacity: 0, scale: 0.7, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.7, y: 40 }}
        transition={{ type: "spring", stiffness: 340, damping: 18 }}
        onClick={onClick}
        className="fixed bottom-7 right-6 z-50 rounded-full p-4 shadow-xl bg-white/70 dark:bg-dark-glass backdrop-blur border border-indigo-200 dark:border-dark-border text-indigo-600 dark:text-indigo-200 hover:bg-indigo-100/80 dark:hover:bg-indigo-900/70 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none group"
        aria-label={label}
      >
        <span className="sr-only">{label}</span>
        {/* Inline up arrow SVG icon */}
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
        <span className="absolute opacity-0 group-hover:opacity-100 pointer-events-none bottom-14 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg text-xs font-medium shadow-lg border border-indigo-100 dark:border-dark-border bg-white/90 dark:bg-dark-glass text-gray-800 dark:text-gray-100 transition-all duration-200">
          {label}
        </span>
      </motion.button>
    )}
  </AnimatePresence>
);

export default FAB;
